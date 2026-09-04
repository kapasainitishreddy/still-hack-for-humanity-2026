import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { CloudRain, Disc, Lock, Play, Sparkles, Square, Volume2, type LucideIcon } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { createSoundscapeWavBase64, SoundscapeKind } from '../utils/soundscape-wav';

interface Track {
  id: string;
  title: string;
  detail: string;
  kind: SoundscapeKind;
  icon: LucideIcon;
  isPro?: boolean;
  seed: number;
}

const SOUND_DIR = FileSystem.documentDirectory ? `${FileSystem.documentDirectory}soundscapes/` : null;

const TRACKS: Track[] = [
  { id: 'rain-v1', title: 'Soft Rain', detail: '8-sec local loop', kind: 'rain', icon: CloudRain, seed: 101 },
  { id: 'brown-v1', title: 'Brown Noise', detail: '8-sec local loop', kind: 'brown', icon: Sparkles, seed: 202 },
  { id: 'tone432-v1', title: '432 Hz Tone', detail: 'Offline tone • Still Pro preview', kind: 'tone432', icon: Disc, seed: 303, isPro: true },
];

async function ensureTrackFile(track: Track): Promise<string> {
  if (!SOUND_DIR) throw new Error('local_audio_storage_unavailable');
  await FileSystem.makeDirectoryAsync(SOUND_DIR, { intermediates: true });
  const uri = `${SOUND_DIR}${track.id}.wav`;
  const existing = await FileSystem.getInfoAsync(uri);
  if (existing.exists) return uri;
  const base64 = createSoundscapeWavBase64(track.kind, { durationSeconds: 8, sampleRate: 16000, seed: track.seed });
  await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
  return uri;
}

interface Props { onUnlockPro: () => void; }

export const SoundscapesPlayer: React.FC<Props> = ({ onUnlockPro }) => {
  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [loadingTrackId, setLoadingTrackId] = useState<string | null>(null);

  const handleTrackPress = async (track: Track) => {
    if (track.isPro) { onUnlockPro(); return; }
    if (Platform.OS === 'web') { Alert.alert('Install Still', 'Offline soundscapes are available in the installed mobile app.'); return; }
    if (activeTrackId === track.id && status.playing) { player.pause(); return; }
    if (activeTrackId === track.id) { player.play(); return; }
    try {
      setLoadingTrackId(track.id);
      const uri = await ensureTrackFile(track);
      await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: false });
      player.replace({ uri });
      player.loop = true;
      player.volume = 0.45;
      setActiveTrackId(track.id);
      player.play();
    } catch {
      Alert.alert('Soundscape Unavailable', 'Still could not prepare this offline soundscape on your device.');
    } finally {
      setLoadingTrackId(null);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerIcon}><Volume2 size={18} color={Colors.emerald} /></View>
        <View style={styles.headerCopy}><Text style={styles.eyebrow}>OFFLINE AUDIO</Text><Text style={styles.title}>Soundscapes</Text></View>
        <View style={styles.localBadge}><View style={styles.localDot} /><Text style={styles.localText}>ON DEVICE</Text></View>
      </View>
      <Text style={styles.sub}>Generated locally the first time you play. No streaming, account, analytics, or network request.</Text>
      <View style={styles.trackList}>
        {TRACKS.map((track) => {
          const Icon = track.icon;
          const isActive = activeTrackId === track.id;
          const isPlaying = isActive && status.playing;
          const isLoading = loadingTrackId === track.id;
          return (
            <TouchableOpacity key={track.id} style={[styles.trackRow, isActive && styles.trackRowActive]} onPress={() => handleTrackPress(track)} activeOpacity={0.82} accessibilityRole="button" accessibilityLabel={`${track.title}${track.isPro ? ', Still Pro preview' : isPlaying ? ', pause' : ', play'}`}>
              <View style={styles.trackLeft}>
                <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}><Icon size={18} color={isActive ? Colors.emerald : Colors.textSecondary} /></View>
                <View style={styles.trackCopy}><Text style={styles.trackTitle}>{track.title}</Text><Text style={styles.trackDetail}>{track.detail}</Text></View>
              </View>
              {track.isPro ? (
                <View style={styles.proTag}><Lock size={12} color={Colors.emerald} /><Text style={styles.proTagText}>PRO</Text></View>
              ) : isLoading ? (
                <ActivityIndicator size="small" color={Colors.emerald} />
              ) : (
                <View style={[styles.playButton, isActive && styles.playButtonActive]}>{isPlaying ? <Square size={13} color={Colors.textPrimary} fill={Colors.textPrimary} /> : <Play size={15} color={Colors.textPrimary} fill={Colors.textPrimary} />}</View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
      {activeTrackId ? <View style={styles.nowPlayingRow}><View style={[styles.nowPlayingDot, status.playing && styles.nowPlayingDotLive]} /><Text style={styles.nowPlayingText}>{status.playing ? 'Looping locally' : 'Paused'} • {TRACKS.find((track) => track.id === activeTrackId)?.title}</Text></View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card:{backgroundColor:Colors.surface,borderColor:Colors.surfaceBorder,borderWidth:1,borderRadius:24,padding:16,marginBottom:16},headerRow:{flexDirection:'row',alignItems:'center',gap:10},headerIcon:{width:38,height:38,borderRadius:19,backgroundColor:Colors.emeraldGlow,borderColor:Colors.emeraldBorder,borderWidth:1,alignItems:'center',justifyContent:'center'},headerCopy:{flex:1},eyebrow:{color:Colors.emerald,fontSize:9,fontWeight:'800',letterSpacing:1.4},title:{color:Colors.textPrimary,fontSize:18,fontWeight:'800',marginTop:1},localBadge:{flexDirection:'row',alignItems:'center',gap:5,borderColor:Colors.surfaceBorder,borderWidth:1,borderRadius:999,paddingHorizontal:8,paddingVertical:5,backgroundColor:Colors.card},localDot:{width:5,height:5,borderRadius:3,backgroundColor:Colors.emerald},localText:{color:Colors.textSecondary,fontSize:8,fontWeight:'800',letterSpacing:.8},sub:{color:Colors.textSecondary,fontSize:12,lineHeight:18,marginTop:12,marginBottom:14},trackList:{gap:8},trackRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:10,backgroundColor:Colors.card,borderColor:Colors.surfaceBorder,borderWidth:1,borderRadius:18,padding:12},trackRowActive:{borderColor:Colors.emeraldBorder,backgroundColor:Colors.raisedSurface},trackLeft:{flex:1,flexDirection:'row',alignItems:'center',gap:11},iconWrap:{width:38,height:38,borderRadius:19,backgroundColor:Colors.surface,borderColor:Colors.surfaceBorder,borderWidth:1,justifyContent:'center',alignItems:'center'},iconWrapActive:{backgroundColor:Colors.emeraldGlow,borderColor:Colors.emeraldBorder},trackCopy:{flex:1},trackTitle:{color:Colors.textPrimary,fontSize:14,fontWeight:'700'},trackDetail:{color:Colors.textMuted,fontSize:10,lineHeight:15,marginTop:2},playButton:{width:34,height:34,borderRadius:17,alignItems:'center',justifyContent:'center',backgroundColor:Colors.raisedSurface,borderColor:Colors.surfaceBorder,borderWidth:1},playButtonActive:{backgroundColor:Colors.emeraldGlow,borderColor:Colors.emeraldBorder},proTag:{flexDirection:'row',alignItems:'center',gap:4,backgroundColor:Colors.emeraldGlow,borderColor:Colors.emeraldBorder,borderWidth:1,paddingHorizontal:8,paddingVertical:5,borderRadius:10},proTagText:{color:Colors.emerald,fontSize:9,fontWeight:'900',letterSpacing:.8},nowPlayingRow:{flexDirection:'row',alignItems:'center',gap:7,marginTop:12,paddingTop:12,borderTopWidth:1,borderTopColor:Colors.surfaceBorder},nowPlayingDot:{width:6,height:6,borderRadius:3,backgroundColor:Colors.textMuted},nowPlayingDotLive:{backgroundColor:Colors.emerald},nowPlayingText:{color:Colors.textSecondary,fontSize:11,fontWeight:'600'}
});
