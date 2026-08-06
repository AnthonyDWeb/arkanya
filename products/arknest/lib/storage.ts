"use client";

import { defaultData } from "../data/default.ts";
import type { AppData } from "../types/index.ts";
import { recordCurrentSnapshot } from "./analytics.ts";
import { validateAppData } from "./dataValidation.ts";

const STORAGE_KEY = "arknest-storage";
const LEGACY_STORAGE_KEYS = ["arknest-app"];
const CORRUPT_STORAGE_KEY = "arknest-storage-corrupt-backup";

type LegacyIncome = Omit<AppData["incomes"][number], "memberId"> & {
  memberId?: string;
  userId?: string;
};

type LegacyExpense = Omit<AppData["expenses"][number], "memberId"> & {
  memberId?: string;
  userId?: string;
  groupId?: string;
};

type LegacyAppData = Omit<Partial<AppData>, "incomes" | "expenses"> & {
  users?: AppData["members"];
  groups?: unknown[];
  incomes?: LegacyIncome[];
  expenses?: LegacyExpense[];
};

export function normalizeAppData(data: LegacyAppData | null | undefined): AppData {
  const members = data?.members ?? data?.users ?? defaultData.members;

  return {
    ...defaultData,
    ...data,
    settings: {
      ...defaultData.settings,
      ...data?.settings,
    },
    categories: data?.categories ?? defaultData.categories,
    expenseTypes: data?.expenseTypes ?? defaultData.expenseTypes,
    schemaVersion: 2,
    snapshots: Array.isArray(data?.snapshots) ? data.snapshots : [],
    goals: Array.isArray(data?.goals) ? data.goals : [],
    goalContributions: Array.isArray(data?.goalContributions) ? data.goalContributions : [],
    members,
    incomes: ((data?.incomes ?? defaultData.incomes) as LegacyIncome[]).map((income) => ({
      id: income.id,
      memberId: income.memberId ?? income.userId ?? "",
      amount: income.amount,
      categoryId: income.categoryId,
      frequency: income.frequency === "weekly" ? "weekly" : "monthly",
    })),
    expenses: ((data?.expenses ?? defaultData.expenses) as LegacyExpense[]).map((expense) => {
      const { groupId, userId, ...rest } = expense;
      void groupId;

      return {
        ...rest,
        memberId: expense.memberId ?? userId,
      };
    }),
  };
}

function readStoredData(key: string): AppData | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    const validation = validateAppData(parsed);
    if (!validation.valid) throw new Error(validation.error);
    return normalizeAppData(parsed as LegacyAppData);
  } catch {
    localStorage.setItem(CORRUPT_STORAGE_KEY, raw);
    return null;
  }
}

export function getStorage(): AppData {
  const currentData = readStoredData(STORAGE_KEY);
  if (currentData) return setStorage(currentData);

  for (const legacyKey of LEGACY_STORAGE_KEYS) {
    const legacyData = readStoredData(legacyKey);
    if (legacyData) {
      const migratedData = setStorage(legacyData);
      localStorage.removeItem(legacyKey);
      return migratedData;
    }
  }

  return setStorage(defaultData);
}

export function setStorage(data: AppData): AppData {
  const normalizedData = recordCurrentSnapshot(normalizeAppData(data));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedData));
  return normalizedData;
}

export function resetStorage(): AppData {
  return setStorage(defaultData);
}
