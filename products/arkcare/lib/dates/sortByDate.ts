export function sortByDate<T>(items: T[], getValue: (item: T) => string) {
  return [...items].sort(
    (a, b) => new Date(getValue(a)).getTime() - new Date(getValue(b)).getTime(),
  );
}
