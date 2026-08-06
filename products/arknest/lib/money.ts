export function toCents(value: number) {
  return Number.isFinite(value) ? Math.round(value * 100) : 0;
}

export function fromCents(value: number) {
  return Number((value / 100).toFixed(2));
}

export function monthlyIncomeAmount(amount: number, frequency: "monthly" | "weekly") {
  return fromCents(toCents(frequency === "weekly" ? amount * 52 / 12 : amount));
}

export function allocateCents(total: number, weights: number[]) {
  const safeWeights = weights.map((weight) => Math.max(0, Number.isFinite(weight) ? weight : 0));
  const sum = safeWeights.reduce((value, weight) => value + weight, 0);
  if (!weights.length || sum <= 0) return weights.map(() => 0);
  const exact = safeWeights.map((weight) => total * weight / sum);
  const result = exact.map(Math.floor);
  const remaining = total - result.reduce((value, amount) => value + amount, 0);
  const order = exact.map((amount, index) => ({ index, fraction: amount - Math.floor(amount) }))
    .sort((a, b) => b.fraction - a.fraction || a.index - b.index);
  for (let index = 0; index < remaining; index += 1) result[order[index % order.length].index] += 1;
  return result;
}
