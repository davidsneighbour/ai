# ROADMAP

## Project state

This repository is a structured registry of portable AI assets for prompts, skills, instructions, docs, and VS Code custom agents. The `scripts/ai.ts` CLI manages registry listing, validation, linting, schema export, and VS Code prompt-file integration.

As of 2026-07-14, the registry release gate (`npm run ai:check:release`) is clean, and #17, #27, #23, #24, #25, and #26 are all fixed and closed. The four OSV dependency findings (js-yaml, linkify-it, markdown-it x2) were resolved in one pass via targeted npm `overrides` pins, scoped to avoid disturbing an intentionally-3.x `js-yaml` instance elsewhere in the tree. `npm audit` now reports only the single low-severity `elliptic` finding (#22), which has no upstream fix available. The top-level `npm run check` quality gate — described in `CLAUDE.md` as the standard pre-commit/pre-release check — still fails on a clean `main` checkout: two skill directories vendored wholesale from third-party sources in a recent reorganization (`dnb-interface-design`, `dnb-site-audit`) violate this repo's Markdown lint rules (187 errors), tracked as #31. Issue #18 (TypeScript skill review/refactor) is still open; the skill directory rename it originally depended on is long done, but the content review itself hasn't started.

## Project health

| Indicator | Status |
| --- | --- |
| Release gate | Passes: `npm run ai:check:release` (0 errors, 0 warnings) |
| Registry validation | Passes: `npm run ai:validate` |
| Registry lint | Passes: `npm run ai:lint` |
| Skill validation | Passes: `node ./scripts/ai.ts validate-skills --root skills --verbose` (24 skills validated) |
| Skill Markdown lint | **Fails**: `npm run lint:skills:markdown` reports 187 errors across `dnb-interface-design/` and `dnb-site-audit/`, both vendored third-party content (see #31) |
| Broad Markdown lint | Fails for the same reason (`npm run lint:markdown`); errors are confined to the two vendored skill directories, not spread across the repo |
| Top-level `npm run check` | **Fails** (exit 1) — stops at the Markdown-lint step; `lint:markdown` and `test:ai-symlink` do not get a chance to run in the same invocation (see #31) |
| Script formatting | Passes: `npx biome check scripts` |
| Type checking | Passes: `tsc --noEmit` |
| Script test | Passes: `npm run test:ai-symlink` (8/8, run standalone) |
| Dependency vulnerabilities | 1 open issue: #22 (elliptic, low, no fix available upstream). `npm audit` reports 3 total, all low, all the same elliptic chain. Down from 11 (3 low, 6 moderate, 2 high) after the js-yaml/markdown-it/linkify-it `overrides` fix. |
| Working tree | Clean |
| Open issues | 2 |
| CI | Not configured (no `.github/workflows/`) |

## Open issues

### Quality gates

- **[#31](https://github.com/davidsneighbour/ai/issues/31) - fix: npm run check fails — vendored skill content violates markdown lint (dnb-interface-design, dnb-site-audit)**
  `dnb-interface-design` is a vendored external plugin (own `.claude-plugin/`, `LICENSE`, `FUNDING.yml`); `dnb-site-audit` also fails lint. Needs a decision: fix in place, exclude vendored paths from lint scope, or define a formal vendoring convention.

### Skills

- **[#18](https://github.com/davidsneighbour/ai/issues/18) - Review and refactor strict-typescript-check skill**
  Still open. The directory is now `skills/40-languages-and-runtimes/dnb-strict-typescript-check/` (rename done), but the content itself (4 bullet points) still hasn't been reviewed against `instructions/40-languages-and-runtimes/typescript/` for overlap/consolidation.

### Dependencies

- **[#22](https://github.com/davidsneighbour/ai/issues/22) - elliptic ECDSA signature risk (low)** — no fixed version exists yet upstream; revisit when one ships.

## Suggested order of work

1. **#31** - Top-level `npm run check` is currently broken on a clean checkout; this is the highest-priority fix since it's the documented pre-commit/pre-release gate.
2. **#18** - Rename is done; remaining work is the content refactor itself. Small and self-contained.
3. **#22** - Low severity, no fix available yet; revisit when elliptic ships a patched release.

## Recent triage outcomes

Fixed and closed since the last triage run:

- **#23, #24, #25, #26** - js-yaml, linkify-it, and markdown-it (two advisories) all resolved via npm `overrides` pins in `package.json` (commit `5e7206d4589b`). All four shared the same root cause: `markdownlint-rule-title-case-style`'s pinned `markdownlint@0.31.1` dependency, whose old `markdown-it`/`linkify-it`/`js-yaml` chain is only exercised by that package's own test helper, not its runtime rule code — safe to force upward. Verified `markdownlint-cli2` (including the title-case-style rule itself), `lockfile-lint`, `secretlint`, and the rest of `npm run check` all still pass after the bump.
- **#17** - Markdown-lint scratch-scope fix is committed (`589557732cb7`, `ae543da22c73`).
- **#27** - All three flagged skills now pass `validate-skills`; frontmatter was fixed.

No changes needed this run:

- **#31, #18** - Still open, no new information to add.

## TODO inbox

`TODO.md` has no actionable items; nothing needed reconciling this run.

## Open clarification questions

- **#31**: Should vendored third-party skill content (`dnb-interface-design`, and possibly `dnb-site-audit`) be fixed in place to satisfy this repo's Markdown lint rules, or excluded from lint scope under a formal "vendored" convention? Is `dnb-site-audit` actually vendored, or authored here and just needs a normal fix?
