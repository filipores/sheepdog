---
name: sheepdog-review
description: >
  Review a diff or target for agentic architecture drift and boundary-law
  violations. Use for sheepdog review, architecture drift review, god
  orchestrator review, layer-boundary review, or before merging AI-generated
  code. Report only; do not edit.
---

# Sheepdog Review

Review the current diff or named target for misplaced responsibility. Report
only. Do not fix.

## Laws

Use Sheepdog laws 1-8:
entrypoint, orchestrator, decision-owner, side-effect, persistence,
pattern-reuse, dependency-direction, god-gravity.

## Method

1. Read repo guidance first when present: `AGENTS.md`, `ARCHITECTURE.md`, ADRs,
   architecture/domain docs relevant to the target.
2. Inspect changed files and nearby existing patterns.
3. Flag only concrete boundary violations with file/line evidence.
4. Size is only a signal. Do not block merely because a file is long.

## Format

One finding per line:

```md
<file>:L<line>: law<n> <tag>: <stray sheep>. wrong field: <current>. home: <right field>. move: <smallest safe move>.
```

Tags:

- `entrypoint:` handler owns non-routing work
- `orchestrator:` coordinator owns rules/details/effects
- `decision:` policy/state logic in wrong place
- `side-effect:` external effect bypasses adapter/guard
- `persistence:` direct storage access from wrong layer
- `reuse:` parallel implementation instead of existing pattern
- `dependency:` wrong-way import or cycle
- `god-gravity:` new responsibility added to god file

End with:

```md
verdict: BLOCKED (<N> boundary leaks)
```

or:

```md
All sheep in field. Ship.
```
