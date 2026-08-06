"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppData } from "@/lib/useAppData";
import { Member } from "@/types";
import { buildExpenses, buildIncomes } from "@/components/setup/setupBuilders";
import { SetupExpenseDraft, SetupIncomeDraft, SetupMemberDraft } from "./setupTypes";

const emptyExpense = { label: "", amount: "", categoryId: "" };

export function useSetupForm() {
  const { data, update } = useAppData();
  const router = useRouter();
  const [members, setMembers] = useState<SetupMemberDraft[]>([]);
  const [globalExpenses, setGlobalExpenses] = useState<SetupExpenseDraft[]>([]);
  const [individualExpenses, setIndividualExpenses] = useState<SetupExpenseDraft[]>([]);

  const addMember = () => setMembers((current) => [...current, { name: "", incomes: [] }]);
  const removeMember = (index: number) =>
    setMembers((current) => current.filter((_, i) => i !== index));
  const updateMemberName = (index: number, name: string) => {
    setMembers((current) =>
      current.map((member, i) => (i === index ? { ...member, name } : member)),
    );
  };

  const addIncome = (memberIndex: number) => {
    setMembers((current) =>
      current.map((member, i) =>
        i === memberIndex
          ? { ...member, incomes: [...member.incomes, { amount: "", categoryId: "", frequency: "monthly" }] }
          : member,
      ),
    );
  };

  const removeIncome = (memberIndex: number, incomeIndex: number) => {
    setMembers((current) =>
      current.map((member, i) =>
        i === memberIndex
          ? { ...member, incomes: member.incomes.filter((_, j) => j !== incomeIndex) }
          : member,
      ),
    );
  };

  const updateIncome = (
    memberIndex: number,
    incomeIndex: number,
    field: keyof SetupIncomeDraft,
    value: string,
  ) => {
    setMembers((current) =>
      current.map((member, i) =>
        i === memberIndex
          ? {
              ...member,
              incomes: member.incomes.map((income, j) =>
                j === incomeIndex ? { ...income, [field]: value } : income,
              ),
            }
          : member,
      ),
    );
  };

  const addGlobalExpense = () => setGlobalExpenses((current) => [...current, emptyExpense]);
  const addIndividualExpense = () =>
    setIndividualExpenses((current) => [...current, { ...emptyExpense, memberId: "" }]);
  const removeGlobalExpense = (index: number) =>
    setGlobalExpenses((current) => current.filter((_, i) => i !== index));
  const removeIndividualExpense = (index: number) =>
    setIndividualExpenses((current) => current.filter((_, i) => i !== index));

  const updateExpense = (
    setter: typeof setGlobalExpenses,
    index: number,
    field: keyof SetupExpenseDraft,
    value: string,
  ) =>
    setter((current) =>
      current.map((expense, i) => (i === index ? { ...expense, [field]: value } : expense)),
    );

  const submit = () => {
    const savedMembers: Member[] = members.map((member, index) => ({
      id: `u${index}`,
      name: member.name,
    }));
    const incomes = buildIncomes(members, savedMembers);
    const expenses = buildExpenses(globalExpenses, individualExpenses);

    update((appData) => ({
      ...appData,
      members: savedMembers,
      incomes,
      expenses,
      settings: { repartitionMode: "proportional", isSetupComplete: true },
    }));
    router.push("/");
  };

  return {
    data,
    members,
    globalExpenses,
    individualExpenses,
    addMember,
    removeMember,
    updateMemberName,
    addIncome,
    removeIncome,
    updateIncome,
    addGlobalExpense,
    addIndividualExpense,
    removeGlobalExpense,
    removeIndividualExpense,
    updateGlobalExpense: (index: number, field: keyof SetupExpenseDraft, value: string) =>
      updateExpense(setGlobalExpenses, index, field, value),
    updateIndividualExpense: (index: number, field: keyof SetupExpenseDraft, value: string) =>
      updateExpense(setIndividualExpenses, index, field, value),
    submit,
  };
}
