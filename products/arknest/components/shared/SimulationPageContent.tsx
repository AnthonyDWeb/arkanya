"use client";

import { Card } from "@arkanya/ui/core";
import SimulationForm from "@/components/simulation/SimulationForm";
import SimulationResults from "@/components/simulation/SimulationResults";
import { useSimulationScenario } from "@/components/simulation/useSimulationScenario";

export default function SimulationPageContent() {
  const model = useSimulationScenario();
  if (!model.data) return <Card padding="md"><p className="text-sm arknest-muted">Les données du budget ne sont pas encore disponibles.</p></Card>;
  return <div className="space-y-4"><SimulationForm model={model} /><SimulationResults model={model} /></div>;
}
