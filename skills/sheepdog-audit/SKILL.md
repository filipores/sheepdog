---
name: sheepdog-audit
description: >
  Whole-repo audit for architecture boundary drift: god orchestrators, layer
  violations, misplaced side effects, persistence leaks, pattern fragmentation,
  and dependency-direction problems. One-shot report; no edits.
---

# Sheepdog Audit

Repo-wide sheepdog-review. Find where responsibilities have wandered into the
wrong fields. Report only.

## Hunt

Rank by risk and change gravity:

- entrypoints with business/persistence/side effects
- orchestrators building payloads, deciding policy, writing storage, sending notifications
- god files receiving unrelated changes
- direct DB/API persistence outside data layer
- external side effects without adapter/idempotency/dedupe/audit
- duplicate validators/mappers/error handling/clients/helpers
- wrong-way imports and cycles

## Output

Ranked list, highest risk first:

```md
<severity> <tag>: <what drifted>. home: <right field>. evidence: <path:L>. move: <smallest safe first extraction>.
```

Severity:

- `blocker` — new work should not continue there
- `major` — likely to produce repeated agent drift
- `watch` — size/gravity signal, not yet a boundary break

End with:

```md
summary: <B> blockers, <M> major, <W> watch. first move: <one smallest extraction>.
```

No findings: `All sheep in field. Ship.`
