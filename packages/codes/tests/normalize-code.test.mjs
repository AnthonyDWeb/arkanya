import test from 'node:test';
import assert from 'node:assert/strict';
import { isCodeFormatValid, normalizeCode } from '../src/normalize-code.mjs';

test('normalise les espaces, tirets bas et minuscules', () => {
  assert.equal(normalizeCode('  ark_nest premium  '), 'ARK-NEST-PREMIUM');
});

test('accepte uniquement un code exploitable', () => {
  assert.equal(isCodeFormatValid('ARK-2026'), true);
  assert.equal(isCodeFormatValid('a'), false);
  assert.equal(isCodeFormatValid('ARK@2026'), false);
});
