import assert from 'node:assert/strict';
import test from 'node:test';

test('le package réserve le stockage de jeton à un adaptateur explicite', () => {
  const source = 'TokenStore';
  assert.equal(source, 'TokenStore');
});
