export type SoundscapeKind = 'brown' | 'rain' | 'tone432';
export interface SoundscapeOptions { durationSeconds?: number; sampleRate?: number; seed?: number; }
export function createSoundscapeWavBase64(kind: SoundscapeKind, options?: SoundscapeOptions): string;
