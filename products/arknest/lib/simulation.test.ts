import assert from "node:assert/strict";
import test from "node:test";
import { buildScenarioBudget } from "./simulation.ts";

test("une simulation cree de nouvelles listes sans modifier le budget reel", () => {
  const incomes = [{ id: "i1", memberId: "m1", amount: 1000, categoryId: "c1", frequency: "monthly" as const }];
  const expenses = [{ id: "e1", label: "Loyer", amount: 500, categoryId: "c3" }];
  const before = JSON.stringify({ incomes, expenses });
  const simulated = buildScenarioBudget(incomes, expenses, [{ id: "m1", name: "Alice" }], { incomes: [{ label: "Prime", amount: 100, memberId: "m1" }], expenses: [{ label: "Achat", amount: 50 }] });
  assert.equal(JSON.stringify({ incomes, expenses }), before);
  assert.notEqual(simulated.incomes, incomes);
  assert.notEqual(simulated.expenses, expenses);
  assert.equal(simulated.incomes.length, 2);
  assert.equal(simulated.expenses.length, 2);
});
