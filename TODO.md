# TODO.md

This is a tracked inbox for rough ideas, review candidates, and open follow-up
items that still need human sorting.

## New

- [ ] Decide how `npm run lint:system` should be handled. The script runs
  `osv-scanner scan -r .`, which needs to send dependency metadata to
  `api.osv.dev`; the scan was blocked in this environment pending explicit
  approval.
- [ ] Decide whether `npm run lint:markdown` should scan ignored `scratch/`
  files. The current script matches `s**/*.{md,mdx}`, so local ignored scratch
  notes can fail the repository lint even though they are not tracked.
- [ ] Continue the prompt frontmatter decision from `ROADMAP.md`: `name` should
  become the canonical prompt identifier, then schemas and prompt files need to
  be migrated consistently.

## Scratch Cleanup Candidates

These come from the ignored `scratch/CLEANUP.md` inventory and should be
reviewed before turning anything into tracked issues or repository assets.

- [ ] Review and consolidate prose/writing instructions, including
  `scratch/SKILL.md`, `scratch/skills/humanise-prose/`, and related prose
  compiler material.
- [ ] Review TypeScript instruction drafts against the existing tracked
  TypeScript instructions.
- [ ] Review Markdown instruction drafts and the Markdown accessibility agent.
- [ ] Review Astro, HTML, CSS, and web instruction drafts.
- [ ] Review the remaining individual instruction files for promotion,
  consolidation, or deletion.
- [ ] Review standalone reference docs such as the Conventional Commits guide,
  epistemic philosophy note, Copilot customization note, schema fragment, and
  skill-building PDF.
- [ ] Review general prompt drafts in `scratch/prompts/`.
- [ ] Review Copilot prompt drafts and decide what to do with repo-specific
  `kollitsch.dev` material.
- [ ] Review scratch agents and classify them as prompts, skills, agents, or
  deletions.
- [ ] Decide how to handle `scratch/skills/codex-task-preparation/`, which has
  instruction files inside the skill directory.
- [ ] Review `scratch/skills/mcp-builder/`.
- [ ] Review `scratch/skills/skill-creator/`.
- [ ] Decide whether to promote or delete the office document skills: `docx`,
  `pptx`, `xlsx`, and `pdf`.
- [ ] Decide whether to promote or delete `scratch/skills/canvas-design/`, which
  includes font binaries.
- [ ] Review the remaining binary-heavy or script-heavy skills:
  `algorithmic-art`, `slack-gif-creator`, `theme-factory`,
  `web-artifacts-builder`, and `webapp-testing`.
- [ ] Unpack and review `scratch/import/oklch-skill.zip`.
