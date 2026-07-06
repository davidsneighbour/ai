# ROADMAP

## Project state

This repository is a structured registry of portable AI assets for prompts, skills, instructions, docs, and VS Code custom agents. The `scripts/ai.ts` CLI manages registry listing, validation, linting, schema export, and VS Code prompt-file integration.

As of 2026-07-05, the registry release gate (`npm run ai:check:release`) is clean, but a separate check the release gate does not cover — `validate-skills` — is currently broken for three installable skills (issue #27). The Markdown-lint/scratch-scope issue (#17) has a fix implemented locally but not yet committed. Five open dependency-vulnerability issues (#22-#26) remain from an automated OSV scan and need manual review since all require major-version bumps or overrides. A closed issue (#21) claims a skill rename that isn't actually present in this repository's history — flagged for human review, not auto-corrected.

## Project health

| Indicator | Status |
| --- | --- |
| Release gate | Passes: `npm run ai:check:release` (0 errors, 0 warnings) |
| Registry validation | Passes: `npm run ai:validate` |
| Registry lint | Passes: `npm run ai:lint` |
| Skill validation | **Fails**: `node ./scripts/ai.ts validate-skills --root skills --verbose` stops at the first error (`skills/dnb-interface-engineering/SKILL.md` missing `id`/`title`); two more files have the same defect (see #27). Not covered by the release gate. |
| Skill Markdown lint | Fails: `npm run lint:skills:markdown` reports pre-existing style errors in several `SKILL.md` files (list style, headings, tables) — not yet tracked as an issue |
| Broad Markdown lint | Fails: `npm run lint:markdown` now genuinely scans the repo (previously the glob only matched paths starting with "s") and surfaces ~38 files with pre-existing violations — not yet tracked as an issue |
| Script formatting | Passes: `npx biome check scripts` |
| Script test | Passes: `npm run test:ai-symlink` (8/8) |
| Dependency vulnerabilities | 5 open, all requiring a major-version bump or `overrides` pin: #22 (elliptic, low), #23 (js-yaml, moderate), #24 (linkify-it, high), #25 (markdown-it 13.x, moderate), #26 (markdown-it 13.x/14.x, moderate) |
| Working tree | Uncommitted fix for #17 staged: `.gitignore`, `package.json`, `.markdownlint-cli2.jsonc` |
| Open issues | 7 |
| CI | Not configured |

## Open issues

### Quality gates

- **[#17](https://github.com/davidsneighbour/ai/issues/17) - fix: align markdown lint scope with ignored scratch files**
  Fix is implemented in the working tree (not committed): `scratch/` added to `.gitignore`, new `.markdownlint-cli2.jsonc` with `gitignore: true`, broken `s**/*.{md,mdx}` glob corrected to `**/*.{md,mdx}`. Close once committed.

### Skills

- **[#27](https://github.com/davidsneighbour/ai/issues/27) - fix: 3 installable skills fail validate-skills (missing id/title)**
  `dnb-interface-engineering` (missing both), `dnb-markdown-formatting` and `dnb-voice` (missing `title`). Not caught by the release gate since `validate-skills` runs separately.

- **[#18](https://github.com/davidsneighbour/ai/issues/18) - Review and refactor strict-typescript-check skill**
  Still open; the skill has now been renamed (`skills/dnb-strict-typescript-check/`) but the content refactor has not happened.

- **[#21](https://github.com/davidsneighbour/ai/issues/21) - Rename strict TypeScript skill to dnb prefix** *(closed, disputed)*
  Closed as completed citing commit `0a29a66`, which does not exist in this repository's history. The rename has since been done directly (`skills/strict-typescript-check/` → `skills/dnb-strict-typescript-check/`), independent of that disputed commit. The provenance discrepancy is still worth flagging to a human, but the rename itself is no longer outstanding.

### Dependencies (OSV findings, all need a major bump or override pin)

- **[#22](https://github.com/davidsneighbour/ai/issues/22) - elliptic ECDSA signature risk (low)** — no fixed version exists yet upstream.
- **[#23](https://github.com/davidsneighbour/ai/issues/23) - js-yaml quadratic DoS via merge keys (moderate)** — fix is a minor bump (4.1.1 → 4.2.0) but a shared/deduped node blocks auto-fix; needs an `overrides` pin.
- **[#24](https://github.com/davidsneighbour/ai/issues/24) - linkify-it O(N²) DoS (high)** — fix is a major bump (4.x → 5.x).
- **[#25](https://github.com/davidsneighbour/ai/issues/25) - markdown-it 13.x ReDoS via linkify (moderate)** — fix is a major bump (13.x → 14.1.1).
- **[#26](https://github.com/davidsneighbour/ai/issues/26) - markdown-it 13.x/14.x smartquotes DoS (moderate)** — one instance needs a major bump, the other a minor bump blocked by a shared node.

## Suggested order of work

1. **#17** - Commit the already-implemented Markdown lint scope fix. Zero remaining risk, just needs a commit.
2. **#27** - Fix the three skill frontmatter validation errors. Small, mechanical, and currently invisible to the release gate.
3. **#18** - Rename is done (`skills/dnb-strict-typescript-check/`); remaining work is the content refactor itself.
4. **#24** - Highest-severity dependency finding (linkify-it, high); evaluate the major-version bump path.
5. **#23, #25, #26** - Remaining moderate dependency findings; group into one dependency-update pass since several share the same upstream chain (`markdownlint` → `markdown-it`/`linkify-it`).
6. **#22** - Low severity, no fix available yet; revisit when elliptic ships a patched release.

## Recent triage outcomes

Created during this triage run (2026-07-05):

- **#27** - Tracks the three installable skills failing `validate-skills` due to missing `id`/`title`.

Commented on during this triage run (2026-07-05):

- **#17** - Noted that a fix is implemented locally but uncommitted.
- **#21** - Flagged that the cited completion commit doesn't exist in this repository.

Already closed before this triage run:

- **#16** - `lint:system` replaced by the `dnb-osv-scan` skill; consistent with current `package.json` (no `lint:system` script present).
- **#19** - Issue-handling instruction published.
- **#20** - Astro migration project skill added.

## TODO inbox

`TODO.md` has no actionable items; nothing needed reconciling this run.

## Open clarification questions

- **#17**: Confirm the working-tree fix should be committed as-is (it currently reveals ~38 files with pre-existing Markdown violations across the repo — should those be fixed in the same change, a follow-up issue, or left for `lint:markdown:fix`?).
- **#23/#25/#26**: Should shared, deduped dependency nodes blocked from auto-fix be resolved via `overrides` pins now, or batched into a single dependency-update PR later?
