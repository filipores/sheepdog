---
name: sheepdog-loop
description: >
  Parent-orchestrated review/fix/review loop for boundary-law violations in a
  diff or target. Use when asked to run sheepdog loop, fix architecture drift
  until clean, or desheepdog a god orchestrator. Edits only after accepted fixes.
---

# Sheepdog Loop

Loop until no blocking boundary leaks remain or the cap is reached. Default cap:
3 rounds.

## Loop

1. Run sheepdog-review on the diff/target.
2. Synthesize only blocker/major findings worth fixing now.
3. Apply the smallest safe moves: move responsibility home, keep callers thin,
   add the smallest boundary check.
4. Run focused tests/static checks.
5. Review again if the fix materially changed structure.

Stop and ask the user when:

- a fix needs a product/scope/architecture decision
- the only path is accepted boundary debt
- the next move is broad refactor unrelated to the requested change
- max rounds reached

## Accepted debt

Only with explicit user approval:

```py
# sheepdog: accepted boundary debt, <reason>; home: <module/layer>; trigger: <when to move>
```

## Final output

```md
sheepdog-loop: clean | stopped | debt-accepted | cap-reached
changed: <files>
checks: <commands>
remaining: <none or blockers>
```
