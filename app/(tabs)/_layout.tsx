import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Colors } from '../../src/theme/colors';
import { Home, ShieldAlert, BarChart3, BookOpen, Settings } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: Colors.emerald, tabBarInactiveTintColor: Colors.tabInactive, tabBarStyle: { backgroundColor: Colors.tabBar, borderTopColor: Colors.surfaceBorder, borderTopWidth: 1, height: Platform.OS === 'ios' ? 84 : 68, paddingBottom: Platform.OS === 'ios' ? 24 : 10, paddingTop: 8, elevation: 12 }, tabBarLabelStyle: { fontSize: 11, fontWeight: '600', letterSpacing: 0.2 } }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => <Home size={22} color={color} /> }} />
      <Tabs.Screen name="sos" options={{ title: 'SOS', tabBarIcon: () => <View style={styles.sosTabBadge}><ShieldAlert size={22} color="#FFF" /></View>, tabBarLabelStyle: { fontSize: 11, fontWeight: '700', color: Colors.sosRed } }} />
      <Tabs.Screen name="progress" options={{ title: 'Progress', tabBarIcon: ({ color }) => <BarChart3 size={22} color={color} /> }} />
      <Tabs.Screen name="journal" options={{ title: 'Journal', tabBarIcon: ({ color }) => <BookOpen size={22} color={color} /> }} />
      <Tabs.Screen name="more" options={{ title: 'More', tabBarIcon: ({ color }) => <Settings size={22} color={color} /> }} />
    </Tabs>
  );
}
const styles = StyleSheet.create({ sosTabBadge: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.sosRed, justifyContent: 'center', alignItems: 'center', marginTop: -6, shadowColor: Colors.sosRed, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.45, shadowRadius: 8, elevation: 8 } });
