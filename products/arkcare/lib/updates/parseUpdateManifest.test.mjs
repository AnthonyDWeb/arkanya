import assert from "node:assert/strict";
import test from "node:test";
import { parseUpdateManifest } from "./parseUpdateManifest.ts";

test("accepte une mise a jour APK HTTPS valide", () => {
  assert.deepEqual(
    parseUpdateManifest({
      version: "1.1.0",
      versionCode: 11,
      apkUrl: "https://arkcare.arkanya.fr/downloads/arkcare.apk",
      message: "Mise a jour",
    }),
    {
      version: "1.1.0",
      versionCode: 11,
      apkUrl: "https://arkcare.arkanya.fr/downloads/arkcare.apk",
      message: "Mise a jour",
    },
  );
});

test("accepte une URL APK relative", () => {
  assert.equal(
    parseUpdateManifest({ version: "1.1.0", versionCode: 11, apkUrl: "/arkcare.apk" }).apkUrl,
    "/arkcare.apk",
  );
});

test("refuse protocoles, extensions et versions invalides", () => {
  assert.throws(() =>
    parseUpdateManifest({ version: "1.1", versionCode: 11, apkUrl: "/arkcare.apk" }),
  );
  assert.throws(() =>
    parseUpdateManifest({ version: "1.1.0", versionCode: 11, apkUrl: "http://site/app.apk" }),
  );
  assert.throws(() =>
    parseUpdateManifest({ version: "1.1.0", versionCode: 11, apkUrl: "/index.html" }),
  );
});
