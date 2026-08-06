export function resizeReminderTimes(times: string[], count: number) {
  const next = times.slice(0, count);
  while (next.length < count) next.push(nextAvailableTime(next));
  return next;
}

export function keepReminderDosages(
  dosages: Record<string, string>,
  times: string[],
) {
  return Object.fromEntries(
    times.flatMap((time) => (dosages[time] === undefined ? [] : [[time, dosages[time]]])),
  );
}

export function moveReminderDosage(
  dosages: Record<string, string>,
  previousTime: string,
  nextTime: string,
) {
  const next = { ...dosages };
  if (next[previousTime] !== undefined) next[nextTime] = next[previousTime];
  delete next[previousTime];
  return next;
}

export function initialReminderDosages(
  times: string[],
  dosages?: Record<string, string>,
  legacyDosage?: string,
) {
  if (dosages && Object.keys(dosages).length > 0) return keepReminderDosages(dosages, times);
  if (!legacyDosage) return {};
  return Object.fromEntries(times.map((time) => [time, legacyDosage]));
}

export function parseRequiredInteger(value: string, min: number, max?: number) {
  if (value.trim() === "") return undefined;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < min || (max !== undefined && parsed > max)) {
    return undefined;
  }
  return parsed;
}

function nextAvailableTime(times: string[]) {
  const used = new Set(times);
  for (let offset = 0; offset < 24 * 60; offset += 30) {
    const minutes = (9 * 60 + offset) % (24 * 60);
    const candidate = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
    if (!used.has(candidate)) return candidate;
  }
  throw new Error("Impossible d'ajouter davantage de prises distinctes.");
}
