import assert from "node:assert/strict";
import test from "node:test";
import { archiveTreatmentData } from "./archiveTreatment.ts";

const archivedAt = "2026-07-22T12:00:00.000Z";
const treatment = {
  id: "treatment-1",
  name: "Traitement",
  type: "comprime",
  frequencyType: "daily",
  frequencyValue: 1,
  startDate: "2026-07-01",
  createdAt: "2026-07-01T00:00:00.000Z",
  updatedAt: "2026-07-01T00:00:00.000Z",
};

function dose(id, status, scheduledAt, treatmentId = treatment.id) {
  return {
    id,
    status,
    scheduledAt,
    treatmentId,
    createdAt: scheduledAt,
    updatedAt: scheduledAt,
  };
}

test("archive le traitement sans effacer son historique", () => {
  const history = dose("history", "taken", "2026-07-21T08:00:00.000Z");
  const futurePending = dose("future", "pending", "2026-07-23T08:00:00.000Z");
  const other = dose("other", "pending", "2026-07-23T08:00:00.000Z", "treatment-2");
  const result = archiveTreatmentData([treatment], [history, futurePending, other], treatment.id, archivedAt);

  assert.equal(result.treatments[0].deletedAt, archivedAt);
  assert.deepEqual(result.doses, [history, other]);
});

test("conserve une prise future deja validee", () => {
  const validated = dose("validated", "taken", "2026-07-23T08:00:00.000Z");
  const result = archiveTreatmentData([treatment], [validated], treatment.id, archivedAt);
  assert.deepEqual(result.doses, [validated]);
});
