---
name: sheepdog-debt
description: >
  Harvest `sheepdog:` accepted boundary-debt markers into a ledger. Use when the
  user asks for sheepdog debt, boundary debt, accepted architecture debt, or to
  list temporary boundary exceptions. Report only unless asked to write a file.
---

# Sheepdog Debt

Collect deliberate boundary exceptions so they do not become precedent.

## Scan

Grep the repo, skipping `.git`, `node_modules`, build output, and virtualenvs:

```bash
grep -rnE '(#|//|/\*) ?sheepdog:' .
```

Expected marker:

```text
sheepdog: accepted boundary debt, <reason>; home: <module/layer>; trigger: <when to move>
```

## Output

Group by file:

```md
<file>:<line> — reason: <reason>. home: <home>. trigger: <trigger>.
```

Tags:

- `no-reason`
- `no-home`
- `no-trigger`

End with:

```md
<N> sheepdog markers, <M> incomplete.
```

Nothing found: `No sheepdog debt. Clean field.`
