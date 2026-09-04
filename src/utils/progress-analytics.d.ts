export interface ProgressDay { start: number; label: string; successes: number; relapses: number; total: number; }
export interface TriggerSummary { trigger: string; count: number; share: number; }
export interface ProgressAnalytics {
  totalLogs: number;
  resistedCount: number;
  relapsedCount: number;
  successRate: number;
  topTriggers: TriggerSummary[];
  lastSevenDays: ProgressDay[];
  lastSevenDayTotal: number;
  peakWindow: { label: string; count: number } | null;
}
export function buildProgressAnalytics(urges: Array<{ timestamp: number; trigger_type?: string; resolution: string }>, now?: number): ProgressAnalytics;
export function isSuccess(resolution: string): boolean;
