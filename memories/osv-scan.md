---
id: osv-scan
title: OSV dependency vulnerability scan policy and decision log
content: Trust boundary, workflow, and human-readable rationale for OSV vulnerability decisions tracked in memories/osv-scan-ledger.json.
importance: high
tags: security, dependencies, osv, policy
---

This repository resolved [#16](https://github.com/davidsneighbour/ai/issues/16) by removing the always-on `lint:system` / `lint:system:fix` npm scripts and replacing them with the `dnb-osv-scan` skill (`skills/dnb-osv-scan/SKILL.md`).

## Trust boundary decision

OSV scanning is a **manual, on-demand check**, not part of the local pre-commit/pre-push gate and not part of any CI workflow. Running the skill sends `package-lock.json` dependency metadata to the public `https://api.osv.dev/v1/querybatch` endpoint. That network call only happens when a human or agent explicitly invokes the `dnb-osv-scan` skill.

## Ledger

`memories/osv-scan-ledger.json` is the machine-readable source of truth for every vulnerability the skill has already triaged. Each entry has a `status`:

- `accepted` — risk accepted, skip in future scans until `review_after` (if set) has passed.
- `fixed` — resolved by upgrading the dependency to `fixed_version`; kept for history.
- `workaround` — mitigated indirectly (e.g. an `overrides`/`resolutions` pin) because the direct dependency has not shipped a native fix yet. Re-checked on every run; promoted to `fixed` once the direct dependency no longer needs the override.
- `open` — a GitHub issue exists and is unresolved; the ledger only records the issue number so the skill does not file a duplicate.

This file (`memories/osv-scan.md`) holds the human-readable rationale behind non-obvious `accepted` or `workaround` decisions. Add a dated note here whenever you accept a risk or add a workaround, referencing the vulnerability ID used in the ledger.

## Decision log

No vulnerabilities have been triaged yet. Add entries below in the form:

```markdown
### <OSV-ID> — <package>@<ecosystem>

- Decided: YYYY-MM-DD
- Status: accepted | workaround
- Reason: <why>
- Issue: <github issue link, if any>
```
