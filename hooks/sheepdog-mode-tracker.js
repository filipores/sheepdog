#!/usr/bin/env node
// sheepdog — UserPromptSubmit hook to track active mode

const { getDefaultMode, parseSheepdogCommand } = require('../lib/sheepdog-config');
const { writeHookOutput } = require('./sheepdog-runtime');

function commandArgs(prompt) {
  const parts = prompt.trim().toLowerCase().split(/\s+/);
  const command = (parts[0] || '').replace(/^[@$]/, '/');
  if (command !== '/sheepdog' && command !== '/sheepdog:sheepdog') return null;
  return parts.slice(1).join(' ');
}

let input = '';
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
  let prompt = '';
  try {
    prompt = String(JSON.parse(input.replace(/^\uFEFF/, '')).prompt || '').trim();
  } catch (_e) {
    return;
  }

  const args = commandArgs(prompt);
  if (args !== null) {
    const parsed = args ? parseSheepdogCommand(args) : parseSheepdogCommand('', getDefaultMode());
    if (parsed.type === 'set-mode') {
      writeHookOutput('UserPromptSubmit', parsed.mode, `SHEEPDOG MODE ${parsed.mode.toUpperCase()}`);
    }
    return;
  }

  if (/\b(stop sheepdog|normal mode)\b/i.test(prompt)) {
    writeHookOutput('UserPromptSubmit', 'off', 'SHEEPDOG MODE OFF');
  }
});
