import type { BuilderState, BuilderStep } from "@/types/builder"

export const INITIAL_STATE: BuilderState = {
  kind: "client",
  name: "",
  slug: "",
  clientId: "",
  description: "",
  objective: "",
  template: "",
  templateData: null,
  pages: [],
  config: {},
  features: [],
  delivery: { targets: ["github", "vercel", "database"] },
}

export const BUILDER_STEPS: Array<{ id: BuilderStep; label: string }> = [
  { id: "project", label: "Projet" },
  { id: "template", label: "Modèle" },
  { id: "pages", label: "Pages" },
  { id: "config", label: "Config" },
  { id: "features", label: "Fonct." },
  { id: "delivery", label: "Livraison" },
  { id: "summary", label: "Résumé" },
  { id: "execution", label: "Lancement" },
]
