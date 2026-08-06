import type { Option, TreatmentType } from "@/types";

export const treatmentTypes: Option<TreatmentType>[] = [
  { value: "injection", label: "Injection" },
  { value: "comprime", label: "Comprimé" },
  { value: "gelule", label: "Gélule" },
  { value: "perfusion", label: "Perfusion" },
  { value: "autre", label: "Autre" },
];
