import assert from "node:assert/strict";
import test from "node:test";
import {
  applyAutomaticSavingsTransfers,
  buildTrend,
  backfillMissingMonths,
  buildGoalTrend,
  createDemoHistory,
  createMonthlySnapshot,
  goalProgress,
  recordCurrentSnapshot,
} from "./analytics.ts";
import type { AppData } from "../types/index.ts";

const data: AppData = {
  schemaVersion: 2,
  members: [
    { id: "m1", name: "Alice" },
    { id: "m2", name: "Bob" },
  ],
  incomes: [
    { id: "i1", memberId: "m1", amount: 2000, categoryId: "income", frequency: "monthly" },
    { id: "i2", memberId: "m2", amount: 1000, categoryId: "income", frequency: "monthly" },
  ],
  expenses: [
    { id: "e1", label: "Loyer", amount: 900, categoryId: "home" },
    { id: "e2", label: "Transport", amount: 100, categoryId: "transport", memberId: "m2" },
  ],
  categories: [],
  expenseTypes: [],
  settings: { repartitionMode: "proportional", isSetupComplete: true },
  snapshots: [],
  goals: [],
  goalContributions: [],
};

test("cree un instantane mensuel global et par membre", () => {
  const snapshot = createMonthlySnapshot(data, new Date("2026-07-10T12:00:00Z"));
  assert.equal(snapshot.month, "2026-07");
  assert.equal(snapshot.totalIncome, 3000);
  assert.equal(snapshot.totalExpenses, 1000);
  assert.equal(snapshot.members[1].expenses, 400);
});

test("remplace uniquement le mois courant et preserve le passe", () => {
  const june = createMonthlySnapshot(data, new Date("2026-06-10T12:00:00Z"));
  const withJune = { ...data, snapshots: [june] };
  const firstJuly = recordCurrentSnapshot(withJune, new Date("2026-07-01T12:00:00Z"));
  const secondJuly = recordCurrentSnapshot(firstJuly, new Date("2026-07-20T12:00:00Z"));
  assert.deepEqual(
    secondJuly.snapshots.map((item) => item.month),
    ["2026-06", "2026-07"],
  );
});

test("construit une tendance avec des mois manquants explicites", () => {
  const july = createMonthlySnapshot(data, new Date("2026-07-10T12:00:00Z"));
  const trend = buildTrend([july], "expenses", 3, undefined, new Date("2026-07-20T12:00:00Z"));
  assert.deepEqual(
    trend.map((point) => point.value),
    [null, null, 1000],
  );
});

test("calcule la progression des objectifs", () => {
  const progress = goalProgress(
    {
      id: "g1",
      name: "Vacances",
      type: "savings",
      targetAmount: 2000,
      savedAmount: 500,
      createdAt: "2026-07-01",
    },
    data,
  );
  assert.equal(progress.progress, 25);
  assert.equal(progress.remaining, 1500);
});

test("integre les ajouts et retraits dans la progression d'une epargne", () => {
  const goal = {
    id: "g1",
    name: "Vacances",
    type: "savings" as const,
    targetAmount: 2000,
    savedAmount: 500,
    createdAt: "2026-07-01",
  };
  const progress = goalProgress(goal, {
    ...data,
    goalContributions: [
      { id: "c1", goalId: "g1", amount: 250, date: "2026-07-02", month: "2026-07", source: "manual" },
      { id: "c2", goalId: "g1", amount: -100, date: "2026-07-03", month: "2026-07", source: "withdrawal" },
    ],
  });
  assert.equal(progress.current, 650);
  assert.equal(progress.remaining, 1350);
});

test("cree une seule depense pour un virement automatique mensuel", () => {
  const june = createMonthlySnapshot(data, new Date("2026-06-10T12:00:00Z"));
  const configured: AppData = {
    ...data,
    snapshots: [june],
    goals: [{
      id: "g1",
      name: "Vacances",
      type: "savings",
      targetAmount: 2000,
      savedAmount: 0,
      createdAt: "2026-05-01",
      transferRule: { enabled: true, type: "fixed", value: 500 },
    }],
  };
  const first = applyAutomaticSavingsTransfers(configured, new Date("2026-07-01T12:00:00Z"));
  const second = applyAutomaticSavingsTransfers(first, new Date("2026-07-20T12:00:00Z"));

  assert.equal(second.goalContributions.length, 1);
  assert.equal(second.goalContributions[0].amount, 500);
  assert.equal(second.expenses.filter((expense) => expense.isSavingsTransfer).length, 1);
  assert.equal(second.snapshots[0].totalExpenses, 1500);
  assert.equal(second.snapshots[0].remaining, 1500);
});

test("partage le reste entre plusieurs virements sans depasser le disponible", () => {
  const june = createMonthlySnapshot(data, new Date("2026-06-10T12:00:00Z"));
  const configured: AppData = {
    ...data,
    snapshots: [june],
    goals: [
      { id: "g1", name: "Vacances", type: "savings", targetAmount: 5000, createdAt: "2026-05-01", transferRule: { enabled: true, type: "percentage", value: 50, startMonth: "2026-06" } },
      { id: "g2", name: "Sécurité", type: "savings", targetAmount: 5000, createdAt: "2026-05-01", transferRule: { enabled: true, type: "fixed", value: 100, startMonth: "2026-06" } },
    ],
  };
  const result = applyAutomaticSavingsTransfers(configured, new Date("2026-07-01T12:00:00Z"));
  assert.deepEqual(result.goalContributions.map((item) => item.amount), [1000, 100]);
  assert.equal(result.snapshots[0].remaining, 900);
  assert.ok(result.snapshots[0].remaining >= 0);
});

test("ne cloture jamais automatiquement le mois courant", () => {
  const june = createMonthlySnapshot(data, new Date("2026-06-10T12:00:00Z"));
  const result = applyAutomaticSavingsTransfers({ ...data, snapshots: [june], goals: [{ id: "g1", name: "Vacances", type: "savings", targetAmount: 5000, createdAt: "2026-06-01", transferRule: { enabled: true, type: "all", startMonth: "2026-06" } }] }, new Date("2026-06-20T12:00:00Z"));
  assert.equal(result.goalContributions.length, 0);
  assert.equal(result.expenses.length, data.expenses.length);
});

test("construit l'evolution cumulee d'un objectif d'epargne", () => {
  const trend = buildGoalTrend(
    { id: "g1", name: "Vacances", type: "savings", targetAmount: 1000, savedAmount: 100, createdAt: "2026-05-01" },
    {
      ...data,
      snapshots: [createMonthlySnapshot(data, new Date("2026-05-10T12:00:00Z")), createMonthlySnapshot(data, new Date("2026-06-10T12:00:00Z"))],
      goalContributions: [
        { id: "c1", goalId: "g1", amount: 200, date: "2026-05-12", month: "2026-05", source: "manual" },
        { id: "c2", goalId: "g1", amount: -50, date: "2026-06-12", month: "2026-06", source: "withdrawal" },
      ],
    },
  );
  assert.equal(trend.find((point) => point.month === "2026-05")?.value, 300);
  assert.equal(trend.find((point) => point.month === "2026-06")?.value, 250);
});

test("genere onze mois de demonstration sans remplacer le mois courant", () => {
  const history = createDemoHistory(data, 12, new Date("2026-07-20T12:00:00Z"));
  assert.equal(history.length, 11);
  assert.equal(history[0].month, "2025-08");
  assert.equal(history.at(-1)?.month, "2026-06");
  assert.ok(history.every((snapshot) => snapshot.source === "demo"));
});

test("genere une demonstration lisible meme pour un budget encore vide", () => {
  const empty = { ...data, members: [], incomes: [], expenses: [] };
  const history = createDemoHistory(empty, 12, new Date("2026-07-20T12:00:00Z"));
  assert.equal(history[0].members.length, 2);
  assert.ok(history[0].totalIncome > 0);
  assert.ok(history[0].totalExpenses > 0);
});

test("complete les mois sans ouverture avec le dernier budget connu", () => {
  const july = createMonthlySnapshot(data, new Date("2026-07-10T12:00:00Z"));
  const completed = backfillMissingMonths(
    { ...data, snapshots: [july] },
    new Date("2026-10-05T12:00:00Z"),
  );
  assert.deepEqual(
    completed.snapshots.map((snapshot) => snapshot.month),
    ["2026-07", "2026-08", "2026-09"],
  );
  assert.equal(completed.snapshots[1].source, "carried-forward");
  assert.equal(completed.snapshots[1].copiedFromMonth, "2026-07");
});

test("ne remplace pas un mois reel pendant le rattrapage", () => {
  const july = createMonthlySnapshot(data, new Date("2026-07-10T12:00:00Z"));
  const september = createMonthlySnapshot(data, new Date("2026-09-10T12:00:00Z"));
  const completed = backfillMissingMonths(
    { ...data, snapshots: [july, september] },
    new Date("2026-11-05T12:00:00Z"),
  );
  assert.equal(
    completed.snapshots.find((snapshot) => snapshot.month === "2026-09")?.source,
    "recorded",
  );
});
