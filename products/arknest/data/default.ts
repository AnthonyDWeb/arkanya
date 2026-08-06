import type { AppData } from "../types/index.ts";

export const defaultData: AppData = {
  schemaVersion: 2,
  members: [],
  incomes: [],
  expenses: [],
  categories: [
    { id: "c1", name: "Salaire", type: "income" },
    { id: "c2", name: "Prestation", type: "income" },
    { id: "c3", name: "Global", type: "expense" },
    { id: "c4", name: "Individuel", type: "expense" },
  ],
  expenseTypes: [
    { id: "t1", name: "Vital" },
    { id: "t2", name: "Travail" },
    { id: "t3", name: "Confort" },
    { id: "t4", name: "Plaisir" },
  ],
  settings: {
    repartitionMode: "proportional",
    isSetupComplete: false,
  },
  snapshots: [],
  goals: [],
  goalContributions: [],
};
