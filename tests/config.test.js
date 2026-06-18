const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { getDefaultMode } = require('../lib/sheepdog-config');

function withConfigHome(fn) {
  const previousXdg = process.env.XDG_CONFIG_HOME;
  const previousDefault = process.env.SHEEPDOG_DEFAULT_MODE;
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sheepdog-config-'));

  delete process.env.SHEEPDOG_DEFAULT_MODE;
  process.env.XDG_CONFIG_HOME = dir;

  try {
    fn(dir);
  } finally {
    if (previousXdg === undefined) delete process.env.XDG_CONFIG_HOME;
    else process.env.XDG_CONFIG_HOME = previousXdg;

    if (previousDefault === undefined) delete process.env.SHEEPDOG_DEFAULT_MODE;
    else process.env.SHEEPDOG_DEFAULT_MODE = previousDefault;

    fs.rmSync(dir, { recursive: true, force: true });
  }
}

test('missing config uses default mode', () => {
  withConfigHome(() => {
    assert.equal(getDefaultMode(), 'on');
  });
});

test('corrupt config is not swallowed', () => {
  withConfigHome((dir) => {
    fs.mkdirSync(path.join(dir, 'sheepdog'));
    fs.writeFileSync(path.join(dir, 'sheepdog', 'config.json'), '{ nope', 'utf8');
    assert.throws(() => getDefaultMode(), SyntaxError);
  });
});
