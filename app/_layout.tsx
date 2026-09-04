import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet, Platform, Text } from 'react-native';
import { useFonts, Outfit_300Light, Outfit_400Regular, Outfit_600SemiBold, Outfit_700Bold, Outfit_800ExtraBold } from '@expo-google-fonts/outfit';
import { PlayfairDisplay_600SemiBold, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import * as ScreenCapture from 'expo-screen-capture';
import { Colors } from '../src/theme/colors';
import { getDatabase } from '../src/db/database';
import { getSecuritySettings } from '../src/services/security';
import { BiometricLockScreen } from '../src/components/BiometricLockScreen';
import { DecoyWaterTracker } from '../src/components/DecoyWaterTracker';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Outfit_300Light,
    Outfit_400Regular,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
  });

  const [isReady, setIsReady] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isDecoyMode, setIsDecoyMode] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [hasPinSet, setHasPinSet] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    ScreenCapture.preventScreenCaptureAsync('still-root').catch(() => {});
    return () => {
      ScreenCapture.allowScreenCaptureAsync('still-root').catch(() => {});
    };
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      style.textContent = `* { font-family: 'Outfit_400Regular', sans-serif !important; }`;
      document.head.appendChild(style);
    }

    const AnyText = Text as any;
    if (!AnyText.defaultProps) AnyText.defaultProps = {};
    AnyText.defaultProps.style = [{ fontFamily: 'Outfit_400Regular' }, AnyText.defaultProps.style];

    async function initApp() {
      try {
        await getDatabase();
        const sec = await getSecuritySettings();
        setBiometricsEnabled(sec.biometricsEnabled);
        setHasPinSet(sec.hasPinSet);
        if (sec.biometricsEnabled || sec.hasPinSet) setIsLocked(true);
      } catch (e) {
        console.error('Failed to initialize app:', e);
      } finally {
        setIsReady(true);
      }
    }
    initApp();
  }, []);

  if (!isReady || !fontsLoaded) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={Colors.emerald} /></View>;
  }

  if (isDecoyMode) {
    return <DecoyWaterTracker onExit={() => { setIsDecoyMode(false); setIsLocked(true); }} />;
  }

  if (isLocked) {
    return (
      <BiometricLockScreen
        biometricsEnabled={biometricsEnabled}
        hasPinSet={hasPinSet}
        onUnlocked={() => setIsLocked(false)}
        onUnlockedDecoy={() => { setIsLocked(false); setIsDecoyMode(true); }}
      />
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="curfew" options={{ headerShown: false, presentation: 'modal' }} />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' },
});
