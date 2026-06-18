// sheepdog — shared configuration resolver

const fs = require('fs');
const path = require('path');
const os = require('os');

const DEFAULT_MODE = 'on';
const VALID_MODES = ['on', 'off'];

function normalizeMode(mode) {
  if (typeof mode !== 'string') return null;
  const normalized = mode.trim().toLowerCase();
  return VALID_MODES.includes(normalized) ? normalized : null;
}

function parseSheepdogCommand(text, defaultMode = DEFAULT_MODE) {
  const fallback = normalizeMode(defaultMode) || DEFAULT_MODE;
  const normalizedText = String(text || '').trim().toLowerCase();

  if (!normalizedText) return { type: 'set-mode', mode: fallback === 'off' ? 'on' : fallback };

  const [primary, secondary] = normalizedText.split(/\s+/);
  if (primary === 'status') return { type: 'status' };

  if (primary === 'default') {
    const mode = normalizeMode(secondary);
    return mode ? { type: 'set-default', mode } : { type: 'invalid', reason: 'invalid-default-mode' };
  }

  const mode = normalizeMode(primary);
  return mode ? { type: 'set-mode', mode } : { type: 'invalid', reason: 'invalid-mode', mode: primary };
}

function getConfigDir() {
  if (process.env.XDG_CONFIG_HOME) return path.join(process.env.XDG_CONFIG_HOME, 'sheepdog');
  if (process.platform === 'win32') {
    return path.join(process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'), 'sheepdog');
  }
  return path.join(os.homedir(), '.config', 'sheepdog');
}

function getConfigPath() {
  return path.join(getConfigDir(), 'config.json');
}

function getDefaultMode() {
  const envMode = normalizeMode(process.env.SHEEPDOG_DEFAULT_MODE || '');
  if (envMode) return envMode;

  try {
    const config = JSON.parse(fs.readFileSync(getConfigPath(), 'utf8'));
    const mode = normalizeMode(config.defaultMode);
    if (mode) return mode;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  return DEFAULT_MODE;
}

function writeDefaultMode(mode) {
  const normalized = normalizeMode(mode);
  if (!normalized) return null;
  const configPath = getConfigPath();
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  fs.writeFileSync(configPath, JSON.stringify({ defaultMode: normalized }, null, 2), 'utf8');
  return normalized;
}

module.exports = {
  DEFAULT_MODE,
  VALID_MODES,
  getConfigDir,
  getConfigPath,
  getDefaultMode,
  normalizeMode,
  parseSheepdogCommand,
  writeDefaultMode,
};
