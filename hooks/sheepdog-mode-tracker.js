#!/usr/bin/env node
// sheepdog — UserPromptSubmit hook to track active mode

const { getDefaultMode, normalizeMode } = require('./sheepdog-config');
const { clearMode, setMode, writeHookOutput } = require('./sheepdog-runtime');

let input = '';
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input.replace(/^\uFEFF/, ''));
    const prompt = String(data.prompt || '').trim();
    const lower = prompt.toLowerCase();

    if (/^[/@$]sheepdog(\s|$|:)/.test(lower)) {
      const parts = lower.split(/\s+/);
      const cmd = parts[0].replace(/^[@$]/, '/');
      const arg = parts[1] || '';

      if (cmd === '/sheepdog' || cmd === '/sheepdog:sheepdog') {
        const mode = normalizeMode(arg) || getDefaultMode();
        if (mode === 'off') {
          clearMode();
          writeHookOutput('UserPromptSubmit', 'off', 'SHEEPDOG MODE OFF');
        } else {
          setMode('on');
          writeHookOutput('UserPromptSubmit', 'on', 'SHEEPDOG MODE ON');
        }
      }
    }

    if (/\b(stop sheepdog|normal mode)\b/i.test(prompt)) {
      clearMode();
      writeHookOutput('UserPromptSubmit', 'off', 'SHEEPDOG MODE OFF');
    }
  } catch (_e) {}
});
