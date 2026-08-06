import { Suspense } from "react";
import { TreatmentEditPageClient } from "@/components/treatments";

export default function TreatmentEditPage() {
  return (
    <Suspense>
      <TreatmentEditPageClient />
    </Suspense>
  );
}
