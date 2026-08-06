import assert from "node:assert/strict";
import test from "node:test";
import { normalizeAppData } from "./storage.ts";

test("migre les anciennes donnees sans historique ni objectifs vers le schema 2", () => {
  const migrated = normalizeAppData({
    members: [{ id: "m1", name: "Alice" }],
    incomes: [{ id: "i1", memberId: "m1", amount: 1200, categoryId: "c1", frequency: "monthly" }],
    expenses: [{ id: "e1", label: "Loyer", amount: 500, categoryId: "c3" }],
    settings: { repartitionMode: "proportional", isSetupComplete: true },
  });

  assert.equal(migrated.schemaVersion, 2);
  assert.equal(migrated.members[0].name, "Alice");
  assert.equal(migrated.expenses[0].amount, 500);
  assert.deepEqual(migrated.snapshots, []);
  assert.deepEqual(migrated.goals, []);
  assert.deepEqual(migrated.goalContributions, []);
});

test("migre les anciens identifiants userId", () => {
  const migrated = normalizeAppData({
    users: [{ id: "legacy", name: "Bob" }],
    incomes: [{ id: "i1", userId: "legacy", amount: 800, categoryId: "c1", frequency: "monthly" }],
  });
  assert.equal(migrated.members[0].id, "legacy");
  assert.equal(migrated.incomes[0].memberId, "legacy");
  assert.equal(migrated.incomes[0].frequency, "monthly");
});

test("preserve une repartition personnalisee pendant la normalisation", () => {
  const migrated = normalizeAppData({
    members: [{ id: "m1", name: "Alice" }, { id: "m2", name: "Bob" }],
    settings: { repartitionMode: "custom", isSetupComplete: true, customShares: { m1: 70, m2: 30 } },
  });
  assert.equal(migrated.settings.repartitionMode, "custom");
  assert.deepEqual(migrated.settings.customShares, { m1: 70, m2: 30 });
});
