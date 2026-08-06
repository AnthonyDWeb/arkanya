import assert from "node:assert/strict";
import test from "node:test";
import {
  initialReminderDosages,
  keepReminderDosages,
  moveReminderDosage,
  parseRequiredInteger,
  resizeReminderTimes,
} from "./reminderFields.ts";

test("cree une heure distincte pour chaque nouvelle prise", () => {
  const times = resizeReminderTimes(["09:00"], 3);
  assert.equal(times.length, 3);
  assert.equal(new Set(times).size, 3);
  assert.deepEqual(times, ["09:00", "09:30", "10:00"]);
});

test("retire les dosages des prises supprimees", () => {
  assert.deepEqual(
    keepReminderDosages(
      { "09:00": "1 comprime", "20:00": "2 comprimes" },
      ["09:00"],
    ),
    { "09:00": "1 comprime" },
  );
});

test("deplace uniquement le dosage de la prise dont l'heure change", () => {
  assert.deepEqual(
    moveReminderDosage(
      { "09:00": "1 comprime", "20:00": "2 comprimes" },
      "09:00",
      "10:00",
    ),
    { "10:00": "1 comprime", "20:00": "2 comprimes" },
  );
});

test("convertit le dosage general historique en dosage par prise", () => {
  assert.deepEqual(initialReminderDosages(["09:00", "20:00"], undefined, "1 comprime"), {
    "09:00": "1 comprime",
    "20:00": "1 comprime",
  });
});

test("valide les champs numeriques obligatoires sans forcer une valeur pendant la saisie", () => {
  assert.equal(parseRequiredInteger("", 1), undefined);
  assert.equal(parseRequiredInteger("0", 1), undefined);
  assert.equal(parseRequiredInteger("1.5", 1), undefined);
  assert.equal(parseRequiredInteger("25", 1, 24), undefined);
  assert.equal(parseRequiredInteger("12", 1, 24), 12);
});
