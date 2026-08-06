import { Button, Card, Select } from "@arkanya/ui/core";
import type { AppData } from "@/types";

export type StatisticsPeriod = "3" | "6" | "12" | "year";

type Props = {
  period: StatisticsPeriod;
  scope: string;
  members: Array<{ id: string; name: string }>;
  hasDemoHistory: boolean;
  onPeriodChange: (period: StatisticsPeriod) => void;
  onScopeChange: (scope: string) => void;
  onLoadDemo: () => void;
  onRemoveDemo: () => void;
};

export default function StatisticsControls(props: Props) {
  return <>
    <div className="arknest-stat-controls">
      <label><span>Période</span><Select value={props.period} onChange={(event) => props.onPeriodChange(event.target.value as StatisticsPeriod)}><option value="3">3 mois</option><option value="6">6 mois</option><option value="12">12 mois</option><option value="year">Année en cours</option></Select></label>
      <label><span>Budget affiché</span><Select value={props.scope} onChange={(event) => props.onScopeChange(event.target.value)}><option value="global">Foyer</option>{props.members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</Select></label>
    </div>
    <Card padding="sm" className="arknest-demo-controls">
      <div><strong>Prévisualisation</strong><p className="text-xs arknest-muted">Ajoute localement 11 mois simulés pour tester les courbes. Ces points restent identifiables et supprimables séparément.</p></div>
      <Button variant="secondary" size="sm" onClick={props.hasDemoHistory ? props.onRemoveDemo : props.onLoadDemo}>{props.hasDemoHistory ? "Retirer les données de démonstration" : "Charger 12 mois de démonstration"}</Button>
    </Card>
  </>;
}

export function historicalMembers(data: AppData) {
  return Array.from(new Map([...data.members, ...data.snapshots.flatMap((snapshot) => snapshot.members.map((member) => ({ id: member.memberId, name: member.memberName })))].map((member) => [member.id, member])).values());
}
