import assert from "node:assert/strict";
import test from "node:test";
import { validateAppData } from "./dataValidation.ts";

const valid = {
  schemaVersion: 2,
  members: [{ id: "m1", name: "Alice" }],
  incomes: [{ id: "i1", memberId: "m1", amount: 1200, categoryId: "c1", frequency: "monthly" }],
  expenses: [{ id: "e1", label: "Loyer", amount: 500, categoryId: "c3" }],
  categories: [{ id: "c1", name: "Salaire", type: "income" }, { id: "c3", name: "Logement", type: "expense" }],
  settings: { repartitionMode: "equal", isSetupComplete: true },
  goals: [], snapshots: [], goalContributions: [],
};

test("accepte une sauvegarde ArkNest valide", () => assert.deepEqual(validateAppData(valid), { valid: true }));
test("refuse les montants non finis ou negatifs", () => {
  assert.equal(validateAppData({ ...valid, expenses: [{ ...valid.expenses[0], amount: -1 }] }).valid, false);
  assert.equal(validateAppData({ ...valid, incomes: [{ ...valid.incomes[0], amount: Infinity }] }).valid, false);
});
test("refuse les references vers un membre inconnu", () => assert.equal(validateAppData({ ...valid, incomes: [{ ...valid.incomes[0], memberId: "missing" }] }).valid, false));
test("refuse les schemas provenant d'une version future", () => assert.equal(validateAppData({ ...valid, schemaVersion: 99 }).valid, false));
