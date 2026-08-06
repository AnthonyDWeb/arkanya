type RecordValue = Record<string, unknown>;
export type ValidationResult = { valid: true } | { valid: false; error: string };

export function validateAppData(value: unknown): ValidationResult {
  if (!isRecord(value)) return invalid("Le contenu JSON doit être un objet.");
  if (typeof value.schemaVersion === "number" && value.schemaVersion > 2) return invalid("Cette sauvegarde provient d’une version plus récente de ArkNest.");
  const members = array(value.members ?? value.users);
  if (!members || !members.every((member) => entity(member, true))) return invalid("La liste des membres est absente ou invalide.");
  const memberIds = new Set(members.map((member) => String((member as RecordValue).id)));
  if (memberIds.size !== members.length) return invalid("Deux membres utilisent le même identifiant.");
  const categories = optionalArray(value.categories);
  if (!categories.valid || !categories.value.every((category) => categoryValue(category))) return invalid("Les catégories sont invalides.");
  const categoryIds = new Set(categories.value.map((category) => String((category as RecordValue).id)));
  const incomes = optionalArray(value.incomes);
  if (!incomes.valid || !incomes.value.every((income) => incomeValue(income, memberIds, categoryIds))) return invalid("Un revenu contient un montant, un membre, une catégorie ou une fréquence invalide.");
  const expenses = optionalArray(value.expenses);
  if (!expenses.valid || !expenses.value.every((expense) => expenseValue(expense, memberIds, categoryIds))) return invalid("Une dépense contient des données invalides.");
  if (!settingsValue(value.settings)) return invalid("Les paramètres de répartition sont invalides.");
  const snapshots = optionalArray(value.snapshots);
  if (!snapshots.valid || !snapshots.value.every(snapshotValue)) return invalid("L’historique mensuel est invalide.");
  const goals = optionalArray(value.goals);
  if (!goals.valid || !goals.value.every(goalValue)) return invalid("Un objectif est invalide.");
  const goalIds = new Set(goals.value.map((goal) => String((goal as RecordValue).id)));
  const contributions = optionalArray(value.goalContributions);
  if (!contributions.valid || !contributions.value.every((item) => contributionValue(item, goalIds))) return invalid("L’historique des objectifs est invalide.");
  return { valid: true };
}

function incomeValue(value: unknown, members: Set<string>, categories: Set<string>) {
  if (!isRecord(value) || !entity(value) || !money(value.amount)) return false;
  const memberId = value.memberId ?? value.userId;
  return typeof memberId === "string" && members.has(memberId) && reference(value.categoryId, categories) && (value.frequency === undefined || value.frequency === "monthly" || value.frequency === "weekly");
}
function expenseValue(value: unknown, members: Set<string>, categories: Set<string>) {
  if (!isRecord(value) || !entity(value) || typeof value.label !== "string" || !money(value.amount) || !reference(value.categoryId, categories)) return false;
  if (value.memberId !== undefined && (typeof value.memberId !== "string" || !members.has(value.memberId))) return false;
  return value.recurrence === undefined || value.recurrence === "monthly" || (value.recurrence === "one-time" && month(value.month));
}
function categoryValue(value: unknown) { return isRecord(value) && entity(value, true) && (value.type === "income" || value.type === "expense"); }
function settingsValue(value: unknown) {
  if (!isRecord(value) || !["equal", "proportional", "custom"].includes(String(value.repartitionMode))) return false;
  if (value.customShares === undefined) return true;
  return isRecord(value.customShares) && Object.values(value.customShares).every((share) => number(share) && share >= 0 && share <= 100);
}
function snapshotValue(value: unknown) { return isRecord(value) && month(value.month) && money(value.totalIncome) && money(value.totalExpenses) && number(value.remaining) && Array.isArray(value.members); }
function goalValue(value: unknown) { return isRecord(value) && entity(value, true) && ["savings", "expense-limit", "monthly-remaining"].includes(String(value.type)) && money(value.targetAmount) && typeof value.createdAt === "string"; }
function contributionValue(value: unknown, goals: Set<string>) { return isRecord(value) && entity(value) && typeof value.goalId === "string" && goals.has(value.goalId) && number(value.amount) && typeof value.date === "string" && month(value.month) && ["manual", "automatic", "withdrawal"].includes(String(value.source)); }
function entity(value: unknown, name = false): value is RecordValue { return isRecord(value) && text(value.id) && (!name || text(value.name)); }
function reference(value: unknown, known: Set<string>) { return typeof value === "string" && (!known.size || known.has(value)); }
function optionalArray(value: unknown) { return value === undefined ? { valid: true, value: [] as unknown[] } : { valid: Array.isArray(value), value: array(value) ?? [] }; }
function array(value: unknown) { return Array.isArray(value) && value.length <= 10_000 ? value : null; }
function isRecord(value: unknown): value is RecordValue { return Boolean(value && typeof value === "object" && !Array.isArray(value)); }
function text(value: unknown) { return typeof value === "string" && value.trim().length > 0 && value.length <= 250; }
function number(value: unknown): value is number { return typeof value === "number" && Number.isFinite(value); }
function money(value: unknown) { return number(value) && value >= 0 && value <= 1_000_000_000; }
function month(value: unknown) { return typeof value === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(value); }
function invalid(error: string): ValidationResult { return { valid: false, error }; }
