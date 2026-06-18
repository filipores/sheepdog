const isCopilot = Boolean(process.env.COPILOT_PLUGIN_DATA);
const isCodex = !isCopilot && Boolean(process.env.PLUGIN_DATA);

function writeHookOutput(event, mode, context = '') {
  if (isCopilot) {
    process.stdout.write(JSON.stringify(event === 'SessionStart' && context ? { additionalContext: context } : {}));
    return;
  }
  if (isCodex) {
    const output = { systemMessage: `SHEEPDOG:${mode.toUpperCase()}` };
    if (context) {
      output.hookSpecificOutput = {
        hookEventName: event,
        additionalContext: context,
      };
    }
    process.stdout.write(JSON.stringify(output));
    return;
  }
  process.stdout.write(context);
}

module.exports = {
  isCodex,
  isCopilot,
  writeHookOutput,
};
