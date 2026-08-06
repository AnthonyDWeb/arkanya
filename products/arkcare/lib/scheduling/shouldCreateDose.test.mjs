import assert from "node:assert/strict";
import test from "node:test";
import { hasDoseAtSchedule, shouldCreateDose } from "./shouldCreateDose.ts";

const scheduledAt = "2026-07-22T08:00:00.000Z";

function dose(overrides = {}) {
  return {
    id: "dose-1",
    treatmentId: "treatment-1",
    scheduledAt,
    status: "pending",
    createdAt: scheduledAt,
    updatedAt: scheduledAt,
    ...overrides,
  };
}

test("refuse un doublon quel que soit son statut", () => {
  for (const status of ["pending", "taken", "missed", "postponed", "deleted"]) {
    assert.equal(shouldCreateDose([dose({ status })], "treatment-1", scheduledAt), false);
  }
});

test("autorise une autre prise ou un autre traitement", () => {
  assert.equal(shouldCreateDose([dose()], "treatment-1", "2026-07-22T20:00:00.000Z"), true);
  assert.equal(shouldCreateDose([dose()], "treatment-2", scheduledAt), true);
});

test("distingue deux horaires du meme jour", () => {
  assert.equal(hasDoseAtSchedule([dose()], "treatment-1", scheduledAt), true);
  assert.equal(
    hasDoseAtSchedule([dose()], "treatment-1", "2026-07-22T20:00:00.000Z"),
    false,
  );
});
