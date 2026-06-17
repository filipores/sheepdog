#!/usr/bin/env node
// sheepdog — Claude/Codex SessionStart activation hook

const { getDefaultMode } = require('./sheepdog-config');
const { getSheepdogInstructions } = require('./sheepdog-instructions');
const { clearMode, isCodex, setMode, writeHookOutput } = require('./sheepdog-runtime');

const mode = getDefaultMode();

if (mode === 'off') {
  clearMode();
  writeHookOutput('SessionStart', 'off', isCodex ? '' : 'OK');
  process.exit(0);
}

try { setMode('on'); } catch (_e) {}
writeHookOutput('SessionStart', 'on', getSheepdogInstructions());
