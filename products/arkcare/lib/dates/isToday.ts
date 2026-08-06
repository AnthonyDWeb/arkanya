export function isToday(value: string) {
  const date = new Date(value);
  const today = new Date();
  return date.toDateString() === today.toDateString();
}
