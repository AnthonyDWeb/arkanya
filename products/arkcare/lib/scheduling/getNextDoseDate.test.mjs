import assert from "node:assert/strict";
import test from "node:test";
import { buildDoseDates, buildDoseSchedule, getReminderSchedules } from "./getNextDoseDate.ts";

function treatment(overrides = {}) {
  return {
    id: "treatment-1",
    name: "Test",
    type: "comprime",
    dosage: "1 comprime",
    frequencyType: "daily",
    frequencyValue: 1,
    startDate: "2026-07-01",
    reminderTime: "08:00",
    reminderTimes: ["08:00"],
    createdAt: "2026-07-01T00:00:00.000Z",
    updatedAt: "2026-07-01T00:00:00.000Z",
    ...overrides,
  };
}

test("associe un dosage distinct a chaque prise quotidienne", () => {
  const value = treatment({
    endDate: "2026-07-01",
    reminderTimes: ["08:00", "20:00"],
    reminderDosages: { "08:00": "1 comprime", "20:00": "2 comprimes" },
  });

  const doses = buildDoseSchedule(value, new Date("2026-07-01T00:00:00"), 1);

  assert.deepEqual(
    doses.map((dose) => dose.dosage),
    ["1 comprime", "2 comprimes"],
  );
});

test("utilise le dosage general pour les anciens traitements", () => {
  const schedules = getReminderSchedules(
    treatment({ reminderTimes: ["08:00", "20:00"], reminderDosages: undefined }),
  );

  assert.deepEqual(
    schedules.map((schedule) => schedule.dosage),
    ["1 comprime", "1 comprime"],
  );
});

test("ne genere rien apres la date de fin", () => {
  const dates = buildDoseDates(
    treatment({ endDate: "2026-07-02" }),
    new Date("2026-07-01T00:00:00"),
    5,
  );

  assert.equal(dates.length, 2);
  assert.equal(dates.at(-1)?.getDate(), 2);
});

test("respecte les jours actifs et de repos d'un cycle", () => {
  const dates = buildDoseDates(
    treatment({ frequencyType: "cycle", cycleActiveDays: 2, cycleRestDays: 1 }),
    new Date("2026-07-01T00:00:00"),
    5,
  );

  assert.deepEqual(
    dates.map((date) => date.getDate()),
    [1, 2, 4, 5],
  );
});

test("elimine les heures dupliquees et les trie", () => {
  const schedules = getReminderSchedules(treatment({ reminderTimes: ["20:00", "08:00", "20:00"] }));

  assert.deepEqual(
    schedules.map((schedule) => schedule.time),
    ["08:00", "20:00"],
  );
});

test("conserve le jour mensuel ou utilise le dernier jour du mois", () => {
  const dates = buildDoseDates(
    treatment({ frequencyType: "monthly", startDate: "2026-01-31" }),
    new Date("2026-01-01T00:00:00"),
    125,
  );

  assert.deepEqual(
    dates.map((date) => [date.getMonth() + 1, date.getDate()]),
    [
      [1, 31],
      [2, 28],
      [3, 31],
      [4, 30],
    ],
  );
});

test("applique les frequences exprimees en jours et en semaines", () => {
  const everyThreeDays = buildDoseDates(
    treatment({ frequencyType: "every_x_days", frequencyValue: 3 }),
    new Date("2026-07-01T00:00:00"),
    8,
  );
  const everyTwoWeeks = buildDoseDates(
    treatment({ frequencyType: "every_x_weeks", frequencyValue: 2 }),
    new Date("2026-07-01T00:00:00"),
    30,
  );

  assert.deepEqual(everyThreeDays.map((date) => date.getDate()), [1, 4, 7]);
  assert.deepEqual(everyTwoWeeks.map((date) => date.getDate()), [1, 15, 29]);
});

test("decale uniquement les prises posterieures a la prise reportee", () => {
  const dates = buildDoseDates(
    treatment({
      reminderTimes: ["08:00", "20:00"],
      scheduleAdjustments: [
        {
          fromScheduledAt: "2026-07-01T08:00:00.000Z",
          shiftedScheduledAt: "2026-07-02T08:00:00.000Z",
          shiftMs: 86_400_000,
        },
      ],
    }),
    new Date("2026-07-01T00:00:00"),
    2,
  );

  assert.deepEqual(
    dates.map((date) => [date.getDate(), date.getHours()]),
    [
      [1, 8],
      [2, 20],
      [3, 8],
      [3, 20],
    ],
  );
});

test("conserve l'heure locale lors du passage a l'heure d'ete", () => {
  const dates = buildDoseDates(
    treatment({ startDate: "2026-03-28" }),
    new Date("2026-03-28T00:00:00"),
    3,
  );

  assert.deepEqual(dates.map((date) => date.getHours()), [8, 8, 8]);
});
