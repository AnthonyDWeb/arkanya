import assert from "node:assert/strict";
import test from "node:test";
import { dosesKeptDuringRegeneration } from "./regeneration.ts";

const now = new Date("2026-07-22T12:00:00.000Z").getTime();

function dose(status, scheduledAt, treatmentId = "treatment-1") {
  return {
    id: `${status}-${scheduledAt}`,
    treatmentId,
    scheduledAt,
    status,
    createdAt: "2026-07-01T00:00:00.000Z",
    updatedAt: "2026-07-01T00:00:00.000Z",
  };
}

test("conserve historique et autres traitements lors d'une regeneration", () => {
  const taken = dose("taken", "2026-07-23T08:00:00.000Z");
  const missed = dose("missed", "2026-07-21T08:00:00.000Z");
  const pastPending = dose("pending", "2026-07-21T20:00:00.000Z");
  const other = dose("pending", "2026-07-23T08:00:00.000Z", "treatment-2");
  const futurePending = dose("pending", "2026-07-23T20:00:00.000Z");

  assert.deepEqual(
    dosesKeptDuringRegeneration(
      [taken, missed, pastPending, other, futurePending],
      "treatment-1",
      now,
    ),
    [taken, missed, pastPending, other],
  );
});
