import assert from "node:assert/strict";
import test from "node:test";
import { calculateFull, calculateSummary } from "./calculate.ts";

const members = [{ id: "m1", name: "Alice" }, { id: "m2", name: "Bob" }];
const incomes = [
  { id: "i1", memberId: "m1", amount: 3000, categoryId: "c1", frequency: "monthly" as const },
  { id: "i2", memberId: "m2", amount: 2000, categoryId: "c1", frequency: "monthly" as const },
];

test("calcule les totaux et le pourcentage utilise", () => {
  const summary = calculateSummary(members, incomes, [{ id: "e1", label: "Loyer", amount: 1000, categoryId: "c3" }, { id: "e2", label: "Courses", amount: 400, categoryId: "c3" }], "proportional");
  assert.deepEqual(summary, { totalIncome: 5000, totalExpenses: 1400, remaining: 3600, percentUsed: 28 });
});

test("mensualise un revenu hebdomadaire avec 52 semaines sur 12 mois", () => {
  const result = calculateFull([{ id: "m1", name: "Alice" }], [{ id: "i1", memberId: "m1", amount: 100, categoryId: "c1", frequency: "weekly" }], [], "equal");
  assert.equal(result.members[0].income, 433.33);
});

test("repartit chaque centime en mode egalitaire", () => {
  const result = calculateFull([...members, { id: "m3", name: "Chloé" }], [], [{ id: "e1", label: "Test", amount: 100, categoryId: "c3" }], "equal");
  assert.deepEqual(result.members.map((member) => member.toPay), [33.34, 33.33, 33.33]);
  assert.equal(result.members.reduce((sum, member) => sum + member.toPay, 0), 100);
});

test("utilise une repartition personnalisee totalisant 100 pour cent", () => {
  const result = calculateFull(members, incomes, [{ id: "e1", label: "Loyer", amount: 1000, categoryId: "c3" }], "custom", undefined, { m1: 70, m2: 30 });
  assert.deepEqual(result.members.map((member) => member.toPay), [700, 300]);
});

test("revient a l'egalitaire si la repartition personnalisee est invalide", () => {
  const result = calculateFull(members, incomes, [{ id: "e1", label: "Loyer", amount: 1000, categoryId: "c3" }], "custom", undefined, { m1: 70, m2: 20 });
  assert.deepEqual(result.members.map((member) => member.toPay), [500, 500]);
});

test("revient a l'egalitaire en proportionnel si aucun revenu n'existe", () => {
  const result = calculateFull(members, [], [{ id: "e1", label: "Loyer", amount: 101, categoryId: "c3" }], "proportional");
  assert.deepEqual(result.members.map((member) => member.toPay), [50.5, 50.5]);
});

test("affecte une depense individuelle uniquement au membre concerne", () => {
  const result = calculateFull(members, incomes, [{ id: "e1", label: "Train", amount: 75.25, categoryId: "c3", memberId: "m2" }], "equal");
  assert.deepEqual(result.members.map((member) => member.toPay), [0, 75.25]);
});

test("compte une depense ponctuelle uniquement dans son mois", () => {
  const expenses = [{ id: "e1", label: "Épargne", amount: 200, categoryId: "c3", recurrence: "one-time" as const, month: "2026-06" }];
  assert.equal(calculateSummary(members, incomes, expenses, "equal", "2026-06").totalExpenses, 200);
  assert.equal(calculateSummary(members, incomes, expenses, "equal", "2026-07").totalExpenses, 0);
});

test("conserve les depenses dans le total meme sans membre", () => {
  const summary = calculateSummary([], [], [{ id: "e1", label: "Loyer", amount: 500, categoryId: "c3" }], "equal");
  assert.equal(summary.totalExpenses, 500);
  assert.equal(summary.remaining, -500);
});
