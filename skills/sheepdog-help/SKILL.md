---
name: sheepdog-help
description: >
  Quick reference for sheepdog commands and boundary laws. Use when the user asks
  for sheepdog help, sheepdog commands, or how to use sheepdog.
---

# Sheepdog Help

Ponytail asks: **Does this need to exist?**
Sheepdog asks: **Does this belong here?**

## Commands

| Skill | What it does |
|---|---|
| `sheepdog` | Persistent blocking mode for boundary drift while coding. |
| `sheepdog-review` | Diff/target review. Reports boundary-law blockers only. |
| `sheepdog-audit` | Repo-wide hotspot audit. No edits. |
| `sheepdog-loop` | Review → fix → review until clean or stopped. |
| `sheepdog-debt` | Lists accepted boundary-debt markers. |

## Laws

1. Entrypoints route only.
2. Orchestrators coordinate only.
3. Business decisions live in decision/domain/policy modules.
4. External side effects go behind adapter/service + idempotency guard.
5. Persistence goes through store/repository/data layer.
6. Reuse existing patterns before making parallel implementations.
7. Respect dependency direction; no shortcuts/cycles.
8. Existing god files are not precedent for new responsibility.

## Exception marker

```py
# sheepdog: accepted boundary debt, <reason>; home: <module/layer>; trigger: <when to move>
```

No explicit user approval, no exception.
