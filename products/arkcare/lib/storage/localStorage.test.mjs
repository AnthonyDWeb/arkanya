import assert from "node:assert/strict";
import test from "node:test";
import { resetApplicationData } from "./localStorage.ts";

test("reinitialise uniquement les donnees ArkCare", () => {
  const values = new Map([
    ["arkcare:treatments", "[]"],
    ["arkcare:doses", "[]"],
    ["arkcare:nativeReminderIds", "[1]"],
    ["autre-application:preference", "a-conserver"],
  ]);
  const localStorage = {
    get length() {
      return values.size;
    },
    key(index) {
      return [...values.keys()][index] ?? null;
    },
    removeItem(key) {
      values.delete(key);
    },
  };
  const previousWindow = globalThis.window;
  globalThis.window = { localStorage, dispatchEvent() {} };

  try {
    resetApplicationData();
    assert.deepEqual([...values.entries()], [["autre-application:preference", "a-conserver"]]);
  } finally {
    globalThis.window = previousWindow;
  }
});
