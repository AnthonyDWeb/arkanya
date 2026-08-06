import { getTreatmentColor } from "@/data";
import type { CalendarDose } from "./calendarTypes";

export function TreatmentDots({ entries }: { entries: CalendarDose[] }) {
  const visibleEntries = uniqueTreatments(entries).filter(
    (entry) => entry.effectiveStatus !== "taken",
  );

  return (
    <span className="absolute bottom-[8%] left-[8%] right-[8%] flex justify-center gap-[3%]">
      {visibleEntries.slice(0, 5).map((entry) => (
        <span
          className="aspect-square w-[13%] rounded-full"
          key={entry.treatment.id}
          style={dotStyle(entry)}
        />
      ))}
    </span>
  );
}

export function TreatmentBlocks({ entries }: { entries: CalendarDose[] }) {
  const uniqueEntries = uniqueTreatments(entries);
  if (uniqueEntries.length === 1) {
    return <span className="absolute inset-0" style={blockStyle(uniqueEntries[0])} />;
  }
  const topCount = Math.ceil(uniqueEntries.length / 2);
  const rows = [uniqueEntries.slice(0, topCount), uniqueEntries.slice(topCount)];

  return (
    <span className="absolute inset-0 grid grid-rows-2">
      {rows.map((row, index) => (
        <span
          className="grid"
          key={index}
          style={{ gridTemplateColumns: `repeat(${row.length}, 1fr)` }}
        >
          {row.map((entry) => (
            <span key={entry.treatment.id} style={blockStyle(entry)} />
          ))}
        </span>
      ))}
    </span>
  );
}

function uniqueTreatments(entries: CalendarDose[]) {
  return entries.filter((entry, index) => {
    return entries.findIndex((item) => item.treatment.id === entry.treatment.id) === index;
  });
}

function blockStyle(entry: CalendarDose) {
  return { background: `${getTreatmentColor(entry.treatment.color).hex}99` };
}

function dotStyle(entry: CalendarDose) {
  return { background: getTreatmentColor(entry.treatment.color).hex };
}
