<h1 align="center">Sheepdog</h1>

<p align="center">
  <em>He says nothing. One look. The stray sheep goes home.</em>
</p>

---

You know him. Low to the ground at the edge of the field. Silent. Watching.
One responsibility drifts into the wrong module; he moves once, and it is back
where it belongs.

Sheepdog puts that stare inside your AI agent.

Ponytail asks: **Does this need to exist?**  
Sheepdog asks: **Does this belong here?**

## What it stops

AI agents are good at local correctness and bad at system boundaries. Sheepdog
blocks the small architectural shortcuts that turn into god orchestrators:

- business rules in entrypoints
- policy decisions in orchestrators
- side effects without adapters or idempotency
- persistence from the wrong layer
- duplicate validators, mappers, clients, helpers
- wrong-way imports and cycles
- new responsibility added to existing god files

## Boundary laws

1. **Entrypoints route only.**
2. **Orchestrators coordinate only.**
3. **Business decisions live in decision/domain/policy modules.**
4. **External side effects go behind adapter/service + idempotency guard.**
5. **Persistence goes through store/repository/data layer.**
6. **Reuse existing patterns before creating parallel implementations.**
7. **Respect dependency direction; no shortcuts/cycles.**
8. **Existing god files are not precedent for new responsibility.**

## Block format

```md
BLOCKED by Law 2 — Orchestrator Law

Stray sheep: new Slack side effect
Wrong field: workflow.py coordinates the flow
Right field: notification service + idempotency guard

Smallest safe move:
1. Move message construction/send logic to the notification service
2. Keep the orchestrator as one method call
3. Add one focused reservation/dedupe check
```

Block means **not here**, not **never**.

## Commands

| Command | What it does |
|---|---|
| `/sheepdog [on | off | status]` | Set/report Sheepdog mode. |
| `/sheepdog-review` | Review the current diff or target for boundary-law blockers. |
| `/sheepdog-audit` | Repo-wide boundary drift audit. |
| `/sheepdog-loop` | Review → fix → review until clean or stopped. |
| `/sheepdog-debt` | List accepted boundary-debt markers. |
| `/sheepdog-help` | Quick reference. |

## Accepted boundary debt

Sometimes a hotfix must ship. Mark it so the agent never treats it as a new
pattern:

```py
# sheepdog: accepted boundary debt, production hotfix only; home: notification service; trigger: before next Slack-related feature
```

No reason, no home, no trigger = not accepted debt.

## Install

### Claude Code

```text
/plugin marketplace add filipores/sheepdog
/plugin install sheepdog@sheepdog
```

### Codex

```bash
codex plugin marketplace add filipores/sheepdog
codex
```

Open `/plugins`, select the Sheepdog marketplace, install Sheepdog, review and
trust hooks, then start a new thread.

### Pi agent harness

```bash
pi install git:github.com/filipores/sheepdog
```

## Development

```bash
npm test
```

## License

MIT.
