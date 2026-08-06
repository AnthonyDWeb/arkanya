import assert from "node:assert/strict";
import test from "node:test";
import { createBackup, parseBackup } from "./backup.ts";

const treatment = {
  id: "treatment-1",
  name: "Traitement",
  type: "comprime",
  frequencyType: "daily",
  frequencyValue: 1,
  startDate: "2026-07-22",
  reminderTimes: ["08:00", "20:00"],
  reminderDosages: { "08:00": "1 comprime", "20:00": "2 comprimes" },
  createdAt: "2026-07-22T00:00:00.000Z",
  updatedAt: "2026-07-22T00:00:00.000Z",
};
const dose = {
  id: "dose-1",
  treatmentId: treatment.id,
  scheduledAt: "2026-07-22T08:00:00.000Z",
  status: "taken",
  createdAt: "2026-07-22T00:00:00.000Z",
  updatedAt: "2026-07-22T08:01:00.000Z",
};

test("exporte puis valide une sauvegarde versionnee", () => {
  const parsed = parseBackup(JSON.stringify(createBackup([treatment], [dose])));
  assert.equal(parsed.schemaVersion, 1);
  assert.deepEqual(parsed.treatments, [treatment]);
  assert.deepEqual(parsed.doses, [dose]);
});

test("refuse un JSON invalide sans toucher au stockage", () => {
  assert.throws(() => parseBackup("{"), /JSON valide/);
});

test("refuse les prises orphelines", () => {
  assert.throws(
    () => parseBackup(JSON.stringify(createBackup([], [dose]))),
    /traitement absent/,
  );
});

test("accepte l'ancien format sans enveloppe applicative", () => {
  const parsed = parseBackup(JSON.stringify({ treatments: [treatment], doses: [dose] }));
  assert.equal(parsed.app, "arkcare");
  assert.equal(parsed.schemaVersion, 1);
});
