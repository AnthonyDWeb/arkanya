import { DoseList } from "@/components/doses";
import type { Dose, DoseStatus, Treatment } from "@/types";

export function TodayDoses({
  doses,
  treatments,
  onTaken,
  onMissed,
  onPostpone,
  onNote,
  onStatus,
  onDelete,
}: {
  doses: Dose[];
  treatments: Treatment[];
  onTaken: (dose: Dose) => void;
  onMissed: (dose: Dose) => void;
  onPostpone: (dose: Dose, date: string) => void;
  onNote: (dose: Dose, note: string) => void;
  onStatus: (
    dose: Dose,
    status: DoseStatus,
    postponedTo?: string,
    shiftFollowing?: boolean,
  ) => void;
  onDelete?: (dose: Dose) => void;
}) {
  return (
    <section className="grid gap-3">
      <h2 className="text-lg font-semibold text-slate-950">Prises du jour</h2>
      <DoseList
        doses={doses}
        onDelete={onDelete}
        onMissed={onMissed}
        onNote={onNote}
        onPostpone={onPostpone}
        onStatus={onStatus}
        onTaken={onTaken}
        treatments={treatments}
      />
    </section>
  );
}
