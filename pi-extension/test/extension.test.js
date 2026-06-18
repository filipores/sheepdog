import assert from 'node:assert/strict';
import test from 'node:test';
import { parseSheepdogCommand, resolveSessionMode } from '../index.js';

test('parse sheepdog commands', () => {
  assert.deepEqual(parseSheepdogCommand(''), { type: 'set-mode', mode: 'on' });
  assert.deepEqual(parseSheepdogCommand('', 'off'), { type: 'set-mode', mode: 'on' });
  assert.deepEqual(parseSheepdogCommand('off'), { type: 'set-mode', mode: 'off' });
  assert.deepEqual(parseSheepdogCommand('status'), { type: 'status' });
  assert.deepEqual(parseSheepdogCommand('default off'), { type: 'set-default', mode: 'off' });
  assert.equal(parseSheepdogCommand('maybe').type, 'invalid');
});

test('resolve session mode from latest entry', () => {
  const entries = [
    { type: 'custom', customType: 'sheepdog-mode', data: { mode: 'on' } },
    { type: 'custom', customType: 'sheepdog-mode', data: { mode: 'off' } },
  ];
  assert.equal(resolveSessionMode(entries), 'off');
  assert.equal(resolveSessionMode([], 'on'), 'on');
});
