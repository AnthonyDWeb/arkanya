export function monthKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function nextMonth(month: string): string {
  const [year, monthNumber] = month.split("-").map(Number);
  return monthKey(new Date(year, monthNumber, 1, 12));
}
