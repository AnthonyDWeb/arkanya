import { Input } from "@arkanya/ui/core";

export default function TimeRange({
  startName = "heureDebut",
  endName = "heureFin",
}: {
  startName?: string;
  endName?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium text-[#444444]">Plage horaire souhaitée</label>

      <div className="flex gap-3">
        <Input
          type="time"
          name={startName}
          className="
                        w-1/2 p-3 rounded-xl bg-[#F9F9F9]
                        border border-[#E2E2E2] text-[#444444]
                    "
        />

        <Input
          type="time"
          name={endName}
          className="
                        w-1/2 p-3 rounded-xl bg-[#F9F9F9]
                        border border-[#E2E2E2] text-[#444444]
                    "
        />
      </div>
    </div>
  );
}
