"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout";
import { EmptyState } from "@/components/ui";
import { getTreatments, updateTreatment } from "@/lib/storage";
import type { Treatment, TreatmentInput } from "@/types";
import { TreatmentForm } from "./TreatmentForm";

export function TreatmentDetailPageClient({ id }: { id: string }) {
  const router = useRouter();
  const [treatment, setTreatment] = useState<Treatment>();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setTreatment(getTreatments().find((item) => item.id === id));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [id]);

  function handleSubmit(input: TreatmentInput) {
    updateTreatment(id, input);
    router.push("/treatments");
  }

  if (!treatment) {
    return (
      <EmptyState
        title="Traitement introuvable"
        description="Ce traitement n’existe plus dans le stockage local."
        actionHref="/treatments"
        actionLabel="Retour"
      />
    );
  }

  return (
    <>
      <PageHeader
        title={treatment.name}
        description="Modifiez le traitement et régénérez ses prises futures."
      />
      <TreatmentForm
        initialTreatment={treatment}
        onSubmit={handleSubmit}
        submitLabel="Enregistrer"
      />
    </>
  );
}
