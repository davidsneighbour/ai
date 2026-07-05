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

No `accepted` or `workaround` decisions have been made yet — see `memories/osv-scan-ledger.json` for `fixed` and `open` entries, which don't need a rationale note here. Add entries below in the form:

```markdown
### <OSV-ID> — <package>@<ecosystem>

- Decided: YYYY-MM-DD
- Status: accepted | workaround
- Reason: <why>
- Issue: <github issue link, if any>
```

## 2026-07-05 — first scan run

`osv-scanner` (v2.4.0) found 7 vulnerability entries across 5 unique advisories. `osv-scanner fix` (in-place, minor-only) auto-resolved the one safe case; the rest need a major bump or have no fix yet, so they were filed as issues:

- [GHSA-h67p-54hq-rp68](https://github.com/nodeca/js-yaml/security/advisories/GHSA-h67p-54hq-rp68) — `js-yaml@3.14.2` -> `3.15.0`, auto-fixed. A second, deduped `js-yaml@4.1.1` instance is still open as [#23](https://github.com/davidsneighbour/ai/issues/23).
- [GHSA-848j-6mx2-7j84](https://github.com/davidsneighbour/ai/issues/22) — `elliptic@6.6.1`, no fix available yet.
- [GHSA-22p9-wv53-3rq4](https://github.com/davidsneighbour/ai/issues/24) — `linkify-it@4.0.1`, fix is a major bump (5.0.1).
- [GHSA-38c4-r59v-3vqw](https://github.com/davidsneighbour/ai/issues/25) — `markdown-it@13.0.1`, fix is a major bump (14.1.1).
- [GHSA-6v5v-wf23-fmfq](https://github.com/davidsneighbour/ai/issues/26) — `markdown-it@13.0.1` and `14.1.1`, fix is `14.2.0` (major for the 13.x instance, minor but unactionable in-place for the 14.1.1 instance).
