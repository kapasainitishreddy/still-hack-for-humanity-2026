const test = require('node:test');
const assert = require('node:assert/strict');
const { buildProgressAnalytics } = require('../src/utils/progress-analytics');
const { DEFAULT_BREATHING_RESET_SECONDS, shouldCompleteBreathingSession } = require('../src/utils/breathing-session');
const { calculateCurrentStreakDays, calculatePledgeStreak } = require('../src/utils/streak-metrics');
const { createSoundscapeWavBase64 } = require('../src/utils/soundscape-wav');

test('recovery analytics summarize logged history without forecasting', () => {
  const now = new Date(2026, 8, 4, 21, 0, 0).getTime();
  const urges = [
    { timestamp: new Date(2026, 8, 4, 20, 0).getTime(), trigger_type: 'Stress', resolution: 'resisted' },
    { timestamp: new Date(2026, 8, 4, 21, 0).getTime(), trigger_type: 'Stress', resolution: 'interrupted' },
    { timestamp: new Date(2026, 8, 3, 10, 0).getTime(), trigger_type: 'Fatigue', resolution: 'relapsed' },
  ];
  const result = buildProgressAnalytics(urges, now);
  assert.equal(result.totalLogs, 3);
  assert.equal(result.resistedCount, 2);
  assert.equal(result.relapsedCount, 1);
  assert.equal(result.successRate, 67);
  assert.equal(result.topTriggers[0].trigger, 'Stress');
  assert.equal(result.peakWindow.label, 'Evening');
});

test('breathing reset completes at sixty seconds, not before', () => {
  assert.equal(DEFAULT_BREATHING_RESET_SECONDS, 60);
  assert.equal(shouldCompleteBreathingSession(59), false);
  assert.equal(shouldCompleteBreathingSession(60), true);
});

test('streak metrics use elapsed time and local calendar pledge days', () => {
  const now = new Date(2026, 8, 4, 12, 0).getTime();
  const start = now - 3 * 24 * 60 * 60 * 1000;
  assert.equal(calculateCurrentStreakDays(start, null, now), 3);
  const today = new Date(2026, 8, 4, 8, 0).getTime();
  const yesterday = new Date(2026, 8, 3, 22, 0).getTime();
  assert.equal(calculatePledgeStreak([today, yesterday], now), 2);
});

test('offline soundscape generator emits a real PCM WAV payload', () => {
  const base64 = createSoundscapeWavBase64('rain', { durationSeconds: 0.2, sampleRate: 8000, seed: 42 });
  const bytes = Buffer.from(base64, 'base64');
  assert.equal(bytes.subarray(0, 4).toString('ascii'), 'RIFF');
  assert.equal(bytes.subarray(8, 12).toString('ascii'), 'WAVE');
  assert.ok(bytes.length > 44);
});
