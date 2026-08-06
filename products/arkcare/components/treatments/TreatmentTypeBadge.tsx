import { treatmentTypes } from "@/data";
import type { TreatmentType } from "@/types";
import { Badge } from "@/components/ui";

export function TreatmentTypeBadge({ type }: { type: TreatmentType }) {
  const label = treatmentTypes.find((item) => item.value === type)?.label || type;
  return <Badge tone="sky">{label}</Badge>;
}
