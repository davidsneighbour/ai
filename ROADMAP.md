# ROADMAP

## Project state

This repository is a structured registry of portable AI assets for prompts,
skills, instructions, docs, memories, and VS Code custom agents. The
`scripts/ai.ts` CLI manages registry listing, validation, linting, schema export,
and VS Code prompt-file integration.

As of 2026-08-01, GitHub Issues list three open tracked items. The issue tracker
is the source of truth; this roadmap is only a generated planning cache. The
previous quality-gate blocker #31 is closed, and the current top-level quality
gate is blocked by unrelated worktree changes rather than the old vendored-skill
Markdown lint failure. `TODO.md` is currently only an inbox shell with no
actionable notes to promote.

## Project health

| Indicator | Status |
| --- | --- |
| Registry check | Passes: `npm run ai:check` reports 0 validation errors, 0 lint errors, and 0 warnings |
| Full quality gate | Fails: `npm run check` stops at `lint:skills` because untracked `skills/30-quality-and-verification/dnb-site-audit2/SKILL.md` has no YAML front matter |
| Skill validation | Fails for the same untracked `dnb-site-audit2` skill front matter issue |
| Broad Markdown lint | Fails: `npm run lint:markdown` reports 39 issues across `prompts/20-repository-workflows/dnbhq-config-onboarding.prompt.md`, `prompts/20-repository-workflows/renovate-config-onboarding.prompt.md`, and untracked `skills/30-quality-and-verification/dnb-site-audit2/SKILL.md` |
| Dependency audit | Unavailable this run: `npm audit --audit-level=low` was blocked because it requires sending dependency metadata to the npm registry |
| Dependency vulnerabilities | 1 open dependency issue remains tracked in GitHub: #22 (`elliptic`, low severity, no fixed version noted in the issue) |
| Working tree | Dirty before and after triage; non-tracking changes were left untouched |
| Open issues | 3 |
| CI | Not configured in this repo (`.github/workflows/` absent in the last generated roadmap; not changed by this triage pass) |

## Open issues

### Skills

- **[#18](https://github.com/davidsneighbour/ai/issues/18) - Review and refactor strict-typescript-check skill**
  The directory is now
  `skills/40-languages-and-runtimes/dnb-strict-typescript-check/`; the remaining
  work is the content review itself. Compare it with the current TypeScript
  instruction set, then decide whether to expand, consolidate, or remove it.

### Dependencies

- **[#22](https://github.com/davidsneighbour/ai/issues/22) - chore(deps): GHSA-848j-6mx2-7j84 in elliptic (npm)**
  Low-severity transitive dependency issue through
  `@secretlint/secretlint-rule-secp256k1-privatekey`. The issue states there was
  no fixed upstream version when filed; revisit when `elliptic` or the dependent
  chain publishes a safe upgrade.

## Recent triage outcomes

- **#31** is closed and removed from the active roadmap. It was the old
  `npm run check` blocker for vendored skill Markdown lint failures.
- **#35** was added to the roadmap because it is open and was missing from the
  previous generated state.
- `TODO.md` had no actionable entries to promote into GitHub Issues.
- No GitHub issues were created, closed, or updated during this triage pass.

## Suggested order of work

1. **Stabilize the current dirty worktree before starting issue work.** The full
   quality gate is blocked by unrelated untracked/modified asset work, especially
   `dnb-site-audit2` and prompt Markdown table lint.
2. **#35** - Finish the hosted HTTPS callback approach for Threads and Tumblr so
   the in-progress post-link publishing work can be closed cleanly.
3. **#18** - Review the strict TypeScript skill against the current instruction
   set; this is small and self-contained once the worktree is stable.
4. **#22** - Recheck dependency status only when an audit is explicitly approved
   or when upstream `elliptic`/`secp256k1` releases indicate a fix.

## TODO inbox

`TODO.md` has no actionable items; nothing needed promotion to GitHub Issues this
run.

## Open clarification questions

- **#35**: Should the hosted callback be a tiny reusable Netlify page, a
  repository-specific helper, or part of a broader social-auth callback pattern
  shared by the direct posting skills?
- **#18**: Should the strict TypeScript guidance remain a standalone skill, or
  should it be consolidated into the TypeScript instruction set and removed from
  the installable skill list?
