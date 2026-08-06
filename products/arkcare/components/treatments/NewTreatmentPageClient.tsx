"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout";
import { createTreatment } from "@/lib/storage";
import type { TreatmentInput } from "@/types";
import { TreatmentForm } from "./TreatmentForm";

export function NewTreatmentPageClient() {
  const router = useRouter();

  function handleSubmit(input: TreatmentInput) {
    createTreatment(input);
    router.push("/treatments");
  }

  return (
    <>
      <PageHeader
        title="Nouveau traitement"
        description="Les prises des 30 prochains jours seront générées automatiquement."
      />
      <TreatmentForm onSubmit={handleSubmit} submitLabel="Créer" />
    </>
  );
}
