export { monthKey } from "./analytics/months.ts";
export { createMonthlySnapshot, backfillMissingMonths } from "./analytics/snapshots.ts";
export { createDemoHistory, recordCurrentSnapshot } from "./analytics/history.ts";
export { applyAutomaticSavingsTransfers } from "./analytics/savingsTransfers.ts";
export { buildTrend, type TrendMetric, type TrendPoint } from "./analytics/trends.ts";
export { buildGoalTrend, goalProgress } from "./analytics/goals.ts";
