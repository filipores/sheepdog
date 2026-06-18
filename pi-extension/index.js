import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const {
  DEFAULT_MODE,
  getDefaultMode,
  normalizeMode,
  parseSheepdogCommand,
  writeDefaultMode,
} = require("../lib/sheepdog-config.js");
const { getSheepdogInstructions } = require("../lib/sheepdog-instructions.js");

export const readDefaultMode = getDefaultMode;
export { getSheepdogInstructions, writeDefaultMode };

export function resolveSessionMode(entries, fallbackMode = DEFAULT_MODE) {
  const fallback = normalizeMode(fallbackMode) || DEFAULT_MODE;
  if (!Array.isArray(entries)) return fallback;

  for (let i = entries.length - 1; i >= 0; i -= 1) {
    const entry = entries[i];
    if (entry?.type !== "custom" || entry?.customType !== "sheepdog-mode") continue;
    const mode = normalizeMode(entry?.data?.mode);
    if (mode) return mode;
  }

  return fallback;
}

export { parseSheepdogCommand };

export default function sheepdogExtension(pi) {
  let currentMode = DEFAULT_MODE;
  let configuredDefaultMode = getDefaultMode();

  const setMode = (mode, ctx) => {
    const normalized = normalizeMode(mode);
    if (!normalized) return;
    currentMode = normalized;
    pi.appendEntry("sheepdog-mode", { mode: normalized });
    ctx?.ui?.notify?.(`Sheepdog mode ${normalized}.`, "info");
  };

  const sendAlias = (skillName, args, ctx) => {
    const normalized = String(args || "").trim();
    const message = normalized ? `${skillName} ${normalized}` : skillName;

    if (ctx?.isIdle?.() === false) {
      pi.sendUserMessage(message, { deliverAs: "followUp" });
      ctx?.ui?.notify?.(`${skillName} queued as follow-up.`, "info");
      return;
    }

    pi.sendUserMessage(message);
  };

  pi.registerCommand("sheepdog", {
    description: "Set or report Sheepdog mode",
    handler: async (args, ctx) => {
      const parsed = parseSheepdogCommand(args, configuredDefaultMode);

      if (parsed.type === "status") {
        ctx?.ui?.notify?.(`Sheepdog: current ${currentMode} • default ${configuredDefaultMode}`, "info");
        return;
      }

      if (parsed.type === "set-default") {
        const written = writeDefaultMode(parsed.mode);
        if (written) {
          configuredDefaultMode = getDefaultMode();
          const message = configuredDefaultMode === written
            ? `Default Sheepdog mode set to ${written}.`
            : `Saved default ${written}, but env override keeps default at ${configuredDefaultMode}.`;
          ctx?.ui?.notify?.(message, "info");
        }
        return;
      }

      if (parsed.type === "set-mode") {
        setMode(parsed.mode, ctx);
        return;
      }

      ctx?.ui?.notify?.("Unknown or unsupported /sheepdog mode.", "warning");
    },
  });

  for (const name of ["review", "audit", "loop", "debt", "help"]) {
    pi.registerCommand(`sheepdog-${name}`, {
      description: `Run /skill:sheepdog-${name}`,
      handler: (args, ctx) => sendAlias(`/skill:sheepdog-${name}`, args, ctx),
    });
  }

  pi.on("input", async (event) => {
    if (event?.source === "extension") return;
    const text = String(event?.text || "");
    if (currentMode !== "off" && /\b(stop sheepdog|normal mode)\b/i.test(text)) {
      setMode("off");
    }
  });

  pi.on("session_start", async (_event, ctx) => {
    const entries = ctx?.sessionManager?.getBranch?.() || ctx?.sessionManager?.getEntries?.() || [];
    configuredDefaultMode = getDefaultMode();
    currentMode = resolveSessionMode(entries, configuredDefaultMode);
  });

  pi.on("before_agent_start", async (event) => {
    if (currentMode !== "on") return;
    return { systemPrompt: `${event.systemPrompt}\n\n${getSheepdogInstructions()}` };
  });
}
