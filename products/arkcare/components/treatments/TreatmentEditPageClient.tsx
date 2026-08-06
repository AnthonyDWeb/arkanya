"use client";

import { useSearchParams } from "next/navigation";
import { EmptyState } from "@/components/ui";
import { TreatmentDetailPageClient } from "./TreatmentDetailPageClient";

export function TreatmentEditPageClient() {
  const params = useSearchParams();
  const id = params.get("id");

  if (!id) {
    return (
      <EmptyState
        title="Traitement introuvable"
        description="Aucun traitement n'a ete selectionne."
        actionHref="/treatments"
        actionLabel="Retour"
      />
    );
  }

  return <TreatmentDetailPageClient id={id} />;
}
