#!/usr/bin/env node
// sheepdog — Claude/Codex SessionStart activation hook

const { getDefaultMode } = require('../lib/sheepdog-config');
const { getSheepdogInstructions } = require('../lib/sheepdog-instructions');
const { writeHookOutput } = require('./sheepdog-runtime');

const mode = getDefaultMode();

if (mode === 'off') {
  writeHookOutput('SessionStart', 'off');
  process.exit(0);
}

writeHookOutput('SessionStart', 'on', getSheepdogInstructions());
