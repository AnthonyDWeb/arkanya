"use client";

import { useState } from "react";
import { Button, Card, Field, Select } from "@/components/ui";
import { frequencyTypes, treatmentTypes } from "@/data";
import {
  initialReminderDosages,
  keepReminderDosages,
  moveReminderDosage,
  parseRequiredInteger,
  resizeReminderTimes,
} from "@/lib/scheduling";
import type {
  FrequencyType,
  Treatment,
  TreatmentColor,
  TreatmentInput,
  TreatmentType,
} from "@/types";
import { TreatmentColorSelect } from "./TreatmentColorSelect";

type Props = {
  initialTreatment?: Treatment;
  onSubmit: (input: TreatmentInput) => void;
  submitLabel: string;
};

export function TreatmentForm({ initialTreatment, onSubmit, submitLabel }: Props) {
  const [hasNoEndDate, setHasNoEndDate] = useState(!initialTreatment?.endDate);
  const [form, setForm] = useState<TreatmentInput>(initialForm(initialTreatment));

  function update<K extends keyof TreatmentInput>(key: K, value: TreatmentInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const times = normalizedTimes(form);
    onSubmit({
      ...form,
      cycleActiveDays:
        form.frequencyType === "cycle" ? Math.max(1, Number(form.cycleActiveDays)) : undefined,
      cycleRestDays:
        form.frequencyType === "cycle" ? Math.max(1, Number(form.cycleRestDays)) : undefined,
      dosage: undefined,
      reminderDosages: normalizedDosages(form, times),
      endDate: form.endDate || undefined,
      frequencyValue: Math.max(1, Number(form.frequencyValue)),
      reminderTime: times[0],
      reminderTimes: times,
    });
  }

  return (
    <Card>
      <form className="grid gap-4" onSubmit={submit}>
        <Field
          label="Nom"
          required
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TreatmentColorSelect
            value={form.color}
            onChange={(value) => update("color", value as TreatmentColor)}
          />
          <Select
            label="Type"
            options={treatmentTypes}
            value={form.type}
            onChange={(e) => update("type", e.target.value as TreatmentType)}
          />
          <Select
            label="Frequence"
            options={frequencyTypes}
            value={form.frequencyType}
            onChange={(e) => update("frequencyType", e.target.value as FrequencyType)}
          />
          <PosologyFields form={form} update={update} />
          <Field
            label="Date de debut"
            required
            type="date"
            value={form.startDate}
            onChange={(e) => update("startDate", e.target.value)}
          />
          <EndDateField
            checked={hasNoEndDate}
            value={form.endDate || ""}
            onCheck={(checked) => {
              setHasNoEndDate(checked);
              if (checked) update("endDate", "");
            }}
            onChange={(value) => update("endDate", value)}
          />
        </div>
        <ReminderTimesFields
          dosages={form.reminderDosages || {}}
          times={form.reminderTimes || ["09:00"]}
          onDosagesChange={(dosages) => update("reminderDosages", dosages)}
          onChange={(times) => update("reminderTimes", times)}
        />
        <p className="rounded-lg bg-teal-50 px-3 py-2 text-sm font-medium text-teal-900">
          {scheduleSummary(form)}
        </p>
        <div className="flex gap-2">
          <Button type="submit">{submitLabel}</Button>
          <Button href="/treatments" variant="secondary">
            Annuler
          </Button>
        </div>
      </form>
    </Card>
  );
}

function initialForm(treatment?: Treatment): TreatmentInput {
  const reminderTimes = [...new Set(
    treatment?.reminderTimes?.length
      ? treatment.reminderTimes
      : [treatment?.reminderTime || "09:00"],
  )];
  return {
    name: treatment?.name || "",
    color: treatment?.color || "teal",
    type: treatment?.type || "injection",
    dosage: undefined,
    frequencyType: normalizedFrequencyType(treatment?.frequencyType),
    frequencyValue:
      treatment?.frequencyType === "daily" || treatment?.frequencyType === "weekly"
        ? 1
        : treatment?.frequencyValue || 1,
    cycleActiveDays: treatment?.cycleActiveDays || 21,
    cycleRestDays: treatment?.cycleRestDays || 7,
    startDate: treatment?.startDate || new Date().toISOString().slice(0, 10),
    endDate: treatment?.endDate || "",
    reminderTime: treatment?.reminderTime || "09:00",
    reminderTimes,
    reminderDosages: initialReminderDosages(
      reminderTimes,
      treatment?.reminderDosages,
      treatment?.dosage,
    ),
  };
}

function PosologyFields({
  form,
  update,
}: {
  form: TreatmentInput;
  update: <K extends keyof TreatmentInput>(key: K, value: TreatmentInput[K]) => void;
}) {
  if (form.frequencyType === "cycle") {
    return (
      <>
        <ValidatedNumberField
          errorId="cycle-active-days-error"
          errorMessage="Ajoutez un nombre de jours de prise valide."
          key="cycle-active-days"
          label="Jours de prise"
          min={1}
          value={form.cycleActiveDays}
          onValidValue={(value) => update("cycleActiveDays", value)}
        />
        <ValidatedNumberField
          errorId="cycle-rest-days-error"
          errorMessage="Ajoutez un nombre de jours sans prise valide."
          key="cycle-rest-days"
          label="Jours sans prise"
          min={1}
          value={form.cycleRestDays}
          onValidValue={(value) => update("cycleRestDays", value)}
        />
      </>
    );
  }
  return (
    <ValidatedNumberField
      errorId="frequency-value-error"
      errorMessage="Ajoutez un nombre valide supérieur ou égal à 1."
      key="frequency-interval"
      label="Nombre"
      min={1}
      value={form.frequencyValue}
      onValidValue={(value) => update("frequencyValue", value)}
    />
  );
}

function EndDateField({
  checked,
  value,
  onCheck,
  onChange,
}: {
  checked: boolean;
  value: string;
  onCheck: (checked: boolean) => void;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-2">
      {!checked ? (
        <Field
          label="Date de fin"
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : null}
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input
          checked={checked}
          className="h-4 w-4 rounded border-slate-300 accent-teal-700"
          onChange={(e) => onCheck(e.target.checked)}
          type="checkbox"
        />
        Aucune date de fin
      </label>
    </div>
  );
}

function ReminderTimesFields({
  dosages,
  times,
  onDosagesChange,
  onChange,
}: {
  dosages: Record<string, string>;
  times: string[];
  onDosagesChange: (dosages: Record<string, string>) => void;
  onChange: (times: string[]) => void;
}) {
  function resize(count: number) {
    const nextTimes = resizeReminderTimes(times, count);
    onDosagesChange(keepReminderDosages(dosages, nextTimes));
    onChange(nextTimes);
  }

  return (
    <div className="grid gap-3 rounded-lg border border-slate-200 p-3">
      <ValidatedNumberField
        errorId="reminder-count-error"
        errorMessage="Ajoutez un nombre de prises valide entre 1 et 24."
        label="Nombre de prises"
        max={24}
        min={1}
        onValidValue={resize}
        value={times.length}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {times.map((time, index) => (
          <div className="grid gap-2" key={index}>
            <Field
              label={`Heure prise ${index + 1}`}
              required
              type="time"
              value={time}
              onChange={(e) => {
                const nextTime = e.target.value;
                if (times.some((item, itemIndex) => itemIndex !== index && item === nextTime)) {
                  e.currentTarget.setCustomValidity("Chaque prise doit avoir une heure distincte.");
                  e.currentTarget.reportValidity();
                  return;
                }
                e.currentTarget.setCustomValidity("");
                onDosagesChange(moveReminderDosage(dosages, time, nextTime));
                onChange(times.map((item, itemIndex) => (itemIndex === index ? nextTime : item)));
              }}
            />
            <Field
              label={`Dosage prise ${index + 1} (optionnel)`}
              placeholder="Ex. 1 comprime"
              value={dosages[time] || ""}
              onChange={(e) => onDosagesChange({ ...dosages, [time]: e.target.value })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ValidatedNumberField({
  errorId,
  errorMessage,
  label,
  max,
  min,
  onValidValue,
  value,
}: {
  errorId: string;
  errorMessage: string;
  label: string;
  max?: number;
  min: number;
  onValidValue: (value: number) => void;
  value?: number;
}) {
  const [draft, setDraft] = useState(value === undefined ? "" : String(value));
  const [error, setError] = useState("");

  function isValid(input: HTMLInputElement) {
    return input.validity.valid && parseRequiredInteger(input.value, min, max) !== undefined;
  }

  return (
    <div className="grid gap-1.5">
      <Field
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        label={label}
        max={max}
        min={min}
        onBlur={(event) => setError(isValid(event.currentTarget) ? "" : errorMessage)}
        onChange={(event) => {
          setDraft(event.target.value);
          setError("");
          const parsed = parseRequiredInteger(event.currentTarget.value, min, max);
          if (parsed !== undefined) onValidValue(parsed);
        }}
        onFocus={() => setError("")}
        onInvalid={() => setError(errorMessage)}
        required
        step={1}
        type="number"
        value={draft}
      />
      {error ? (
        <p className="text-xs font-medium text-rose-700" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function scheduleSummary(form: TreatmentInput) {
  const times = normalizedTimes(form);
  const prefix = `${times.length} prise(s) par jour prevu a ${times.join(", ")}`;
  if (form.frequencyType === "cycle")
    return `${prefix}, pendant ${form.cycleActiveDays} jour(s), puis pause ${form.cycleRestDays} jour(s).`;
  if (form.frequencyType === "daily") return `${prefix}, chaque jour.`;
  if (form.frequencyType === "weekly") return `${prefix}, chaque semaine.`;
  if (form.frequencyType === "monthly") return `${prefix}, tous les ${form.frequencyValue} mois.`;
  if (form.frequencyType === "every_x_weeks")
    return `${prefix}, toutes les ${form.frequencyValue} semaines.`;
  return `${prefix}, tous les ${form.frequencyValue} jours.`;
}

function normalizedFrequencyType(type?: FrequencyType): FrequencyType {
  if (type === "daily") return "every_x_days";
  if (type === "weekly") return "every_x_weeks";
  return type || "every_x_days";
}

function normalizedTimes(form: TreatmentInput) {
  const times = form.reminderTimes?.length ? form.reminderTimes : [form.reminderTime || "09:00"];
  return [...new Set(times.filter(Boolean))].sort();
}

function normalizedDosages(form: TreatmentInput, times: string[]) {
  const entries = times
    .map((time) => [time, form.reminderDosages?.[time]?.trim()] as const)
    .filter((entry): entry is readonly [string, string] => Boolean(entry[1]));
  return entries.length ? Object.fromEntries(entries) : undefined;
}
