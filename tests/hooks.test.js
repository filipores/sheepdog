const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const root = path.join(__dirname, '..');

function hookEnv(extra = {}) {
  const env = { ...process.env, ...extra };
  delete env.PLUGIN_DATA;
  delete env.COPILOT_PLUGIN_DATA;
  return env;
}

function runHook(script, { input = '', env = {} } = {}) {
  return spawnSync(process.execPath, [path.join(root, script)], {
    input,
    env: hookEnv(env),
    encoding: 'utf8',
  });
}

test('session hook is quiet when sheepdog is off', () => {
  const result = runHook('hooks/sheepdog-activate.js', { env: { SHEEPDOG_DEFAULT_MODE: 'off' } });
  assert.equal(result.status, 0);
  assert.equal(result.stdout, '');
  assert.equal(result.stderr, '');
});

test('session hook emits instructions when sheepdog is on', () => {
  const result = runHook('hooks/sheepdog-activate.js', { env: { SHEEPDOG_DEFAULT_MODE: 'on' } });
  assert.equal(result.status, 0);
  assert.match(result.stdout, /^SHEEPDOG MODE ACTIVE/);
  assert.match(result.stdout, /Entrypoint Law/);
});

test('prompt hook parses sheepdog commands', () => {
  const on = runHook('hooks/sheepdog-mode-tracker.js', {
    input: JSON.stringify({ prompt: '/sheepdog' }),
    env: { SHEEPDOG_DEFAULT_MODE: 'off' },
  });
  assert.equal(on.status, 0);
  assert.equal(on.stdout, 'SHEEPDOG MODE ON');

  const status = runHook('hooks/sheepdog-mode-tracker.js', {
    input: JSON.stringify({ prompt: '/sheepdog status' }),
    env: { SHEEPDOG_DEFAULT_MODE: 'on' },
  });
  assert.equal(status.status, 0);
  assert.equal(status.stdout, '');

  const invalid = runHook('hooks/sheepdog-mode-tracker.js', {
    input: JSON.stringify({ prompt: '/sheepdog maybe' }),
    env: { SHEEPDOG_DEFAULT_MODE: 'on' },
  });
  assert.equal(invalid.status, 0);
  assert.equal(invalid.stdout, '');

  const configHome = fs.mkdtempSync(path.join(os.tmpdir(), 'sheepdog-hook-'));
  fs.mkdirSync(path.join(configHome, 'sheepdog'));
  fs.writeFileSync(path.join(configHome, 'sheepdog', 'config.json'), '{ nope', 'utf8');
  const statusWithBadConfig = runHook('hooks/sheepdog-mode-tracker.js', {
    input: JSON.stringify({ prompt: '/sheepdog status' }),
    env: { XDG_CONFIG_HOME: configHome },
  });
  fs.rmSync(configHome, { recursive: true, force: true });
  assert.equal(statusWithBadConfig.status, 0);
  assert.equal(statusWithBadConfig.stdout, '');

  const off = runHook('hooks/sheepdog-mode-tracker.js', {
    input: JSON.stringify({ prompt: 'normal mode' }),
    env: { SHEEPDOG_DEFAULT_MODE: 'on' },
  });
  assert.equal(off.status, 0);
  assert.equal(off.stdout, 'SHEEPDOG MODE OFF');
});
