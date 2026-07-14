# ROADMAP

## Project state

This repository is a structured registry of portable AI assets for prompts, skills, instructions, docs, and VS Code custom agents. The `scripts/ai.ts` CLI manages registry listing, validation, linting, schema export, and VS Code prompt-file integration.

As of 2026-07-14, the registry release gate (`npm run ai:check:release`) is clean, and the previously-tracked issues #17 (Markdown-lint scratch scope) and #27 (skill frontmatter validation) are both fixed and closed. However, the top-level `npm run check` quality gate — described in `CLAUDE.md` as the standard pre-commit/pre-release check — now fails on a clean `main` checkout: two skill directories vendored wholesale from third-party sources in a recent reorganization (`dnb-interface-design`, `dnb-site-audit`) violate this repo's Markdown lint rules (187 errors), and `npm run check`'s `&&` chaining means this also blocks `lint:markdown` and `test:ai-symlink` from running in a single invocation. This is newly tracked as #31. Five open dependency-vulnerability issues (#22-#26) remain from an automated OSV scan, unchanged since the last triage — all require a major-version bump, an `overrides` pin, or have no fix upstream yet. Issue #18 (TypeScript skill review/refactor) is still open; the skill directory rename it originally depended on is long done, but the content review itself hasn't started.

## Project health

| Indicator | Status |
| --- | --- |
| Release gate | Passes: `npm run ai:check:release` (0 errors, 0 warnings) |
| Registry validation | Passes: `npm run ai:validate` |
| Registry lint | Passes: `npm run ai:lint` |
| Skill validation | Passes: `node ./scripts/ai.ts validate-skills --root skills --verbose` (24 skills validated) — #27 is fixed |
| Skill Markdown lint | **Fails**: `npm run lint:skills:markdown` reports 187 errors across `dnb-interface-design/` and `dnb-site-audit/`, both vendored third-party content (see #31) |
| Broad Markdown lint | Fails for the same reason (`npm run lint:markdown`); errors are confined to the two vendored skill directories, not spread across the repo |
| Top-level `npm run check` | **Fails** (exit 1) — stops at the Markdown-lint step; `lint:markdown` and `test:ai-symlink` do not get a chance to run in the same invocation (see #31) |
| Script formatting | Passes: `npx biome check scripts` |
| Type checking | Passes: `tsc --noEmit` |
| Script test | Passes: `npm run test:ai-symlink` (8/8, run standalone) |
| Dependency vulnerabilities | 5 open issues, all requiring a major-version bump, an `overrides` pin, or no fix yet: #22 (elliptic, low, no fix available), #23 (js-yaml, moderate, blocked by shared node), #24 (linkify-it, high, major bump), #25 (markdown-it 13.x, moderate, major bump), #26 (markdown-it 13.x/14.x, moderate, mixed). `npm audit` currently reports 11 total (3 low, 6 moderate, 2 high). |
| Working tree | Clean |
| Open issues | 6 |
| CI | Not configured (no `.github/workflows/`) |

## Open issues

### Quality gates

- **[#31](https://github.com/davidsneighbour/ai/issues/31) - fix: npm run check fails — vendored skill content violates markdown lint (dnb-interface-design, dnb-site-audit)**
  New this run. `dnb-interface-design` is a vendored external plugin (own `.claude-plugin/`, `LICENSE`, `FUNDING.yml`); `dnb-site-audit` also fails lint. Needs a decision: fix in place, exclude vendored paths from lint scope, or define a formal vendoring convention.

### Skills

- **[#18](https://github.com/davidsneighbour/ai/issues/18) - Review and refactor strict-typescript-check skill**
  Still open. The directory is now `skills/40-languages-and-runtimes/dnb-strict-typescript-check/` (rename done), but the content itself (4 bullet points) still hasn't been reviewed against `instructions/40-languages-and-runtimes/typescript/` for overlap/consolidation.

### Dependencies (OSV findings, all need a major bump, an override pin, or have no fix yet)

- **[#22](https://github.com/davidsneighbour/ai/issues/22) - elliptic ECDSA signature risk (low)** — no fixed version exists yet upstream.
- **[#23](https://github.com/davidsneighbour/ai/issues/23) - js-yaml quadratic DoS via merge keys (moderate)** — fix is a minor bump (4.1.1 → 4.2.0) but a shared/deduped node blocks auto-fix; needs an `overrides` pin.
- **[#24](https://github.com/davidsneighbour/ai/issues/24) - linkify-it O(N²) DoS (high)** — fix is a major bump (4.x → 5.x).
- **[#25](https://github.com/davidsneighbour/ai/issues/25) - markdown-it 13.x ReDoS via linkify (moderate)** — fix is a major bump (13.x → 14.1.1).
- **[#26](https://github.com/davidsneighbour/ai/issues/26) - markdown-it 13.x/14.x smartquotes DoS (moderate)** — one instance needs a major bump, the other a minor bump blocked by a shared node.

## Suggested order of work

1. **#31** - Top-level `npm run check` is currently broken on a clean checkout; this is the highest-priority fix since it's the documented pre-commit/pre-release gate.
2. **#18** - Rename is done; remaining work is the content refactor itself. Small and self-contained.
3. **#24** - Highest-severity dependency finding (linkify-it, high); evaluate the major-version bump path.
4. **#23, #25, #26** - Remaining moderate dependency findings; group into one dependency-update pass since several share the same upstream chain (`markdownlint` → `markdown-it`/`linkify-it`).
5. **#22** - Low severity, no fix available yet; revisit when elliptic ships a patched release.

## Recent triage outcomes

Created during this triage run (2026-07-14):

- **#31** - Tracks `npm run check` failing due to Markdown-lint violations in two vendored skill directories.

Closed since the last triage run (verified fixed in the repository):

- **#17** - Markdown-lint scratch-scope fix is committed (`589557732cb7`, `ae543da22c73`).
- **#27** - All three flagged skills now pass `validate-skills`; frontmatter was fixed.

No changes needed this run:

- **#22-#26** - Dependency findings unchanged; still blocked on upstream fixes or need manual `overrides` pins.
- **#18** - Still open, no new information to add.

## TODO inbox

`TODO.md` has no actionable items; nothing needed reconciling this run.

## Open clarification questions

- **#31**: Should vendored third-party skill content (`dnb-interface-design`, and possibly `dnb-site-audit`) be fixed in place to satisfy this repo's Markdown lint rules, or excluded from lint scope under a formal "vendored" convention? Is `dnb-site-audit` actually vendored, or authored here and just needs a normal fix?
- **#23/#25/#26**: Should shared, deduped dependency nodes blocked from auto-fix be resolved via `overrides` pins now, or batched into a single dependency-update PR later?
