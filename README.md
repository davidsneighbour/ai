# AI

![Oh look Ma! It's AI!!!!!111One](.github/ai.png)

This repository provides a portable structure for my AI assets that can be shared across ChatGPT, Codex, GitHub Copilot, and others.

- [Structure](#structure)
- [Further documentation](#further-documentation)
- [CLI](#cli)
- [Skills](#skills)
  - [Setup](#setup)
  - [Issue handling skills](#issue-handling-skills)
  - [Project management skills](#project-management-skills)
  - [Blog drafting skills](#blog-drafting-skills)
  - [Specification and testing skills](#specification-and-testing-skills)
  - [Reference and documentation skills](#reference-and-documentation-skills)
  - [Engineering guideline skills](#engineering-guideline-skills)
  - [Social media posting](#social-media-posting)
- [VS code prompt file recommendations](#vs-code-prompt-file-recommendations)
  - [Option 1: one recursive glob](#option-1-one-recursive-glob)
  - [Option 2: individual folder entries](#option-2-individual-folder-entries)
- [Licensed content](#licensed-content)
- [Shared config skill](#shared-config-skill)
  - [Supported shared configs](#supported-shared-configs)
  - [Adding another shared config](#adding-another-shared-config)
- [License](#license)

## Structure

| Folder | Contents |
| --- | --- |
| `agents/` | `.agents` protocol sub-agent profiles, grouped by purpose - see [agents.index.md](agents.index.md) |
| `instructions/` | reusable instruction files, grouped by purpose - see [instructions.index.md](instructions.index.md) |
| `memories/` | memory source files, including the [repository glossary](memories/glossary.md) |
| `prompts/` | prompt files grouped by purpose - see [prompts.index.md](prompts.index.md) |
| `schemas/` | validation schemas |
| `scripts/` | CLI runner and validators — see [scripts/README.md](scripts/README.md) |
| `skills/` | agent skills, grouped by purpose - see [skills.index.md](skills.index.md) |
| `tasks/` | repeat task source files |

## Further documentation

- [scripts/README.md](scripts/README.md) — the `scripts/ai.ts` CLI and `scripts/ai-symlink.ts` symlink installer in detail.
- [agents.index.md](agents.index.md) — agent profile folder taxonomy and current profile index.
- [instructions.index.md](instructions.index.md) — shared AI asset folder taxonomy and current instruction index.
- [prompts.index.md](prompts.index.md) — prompt folder taxonomy and current prompt index.
- [skills.index.md](skills.index.md) — skill folder taxonomy and current skill index.
- [memories/glossary.md](memories/glossary.md) — canonical meanings for recurring repository terms.
- [documentation/conventions.doc.md](documentation/conventions.doc.md) — prompt name conventions.
- [documentation/external-tools.doc.md](documentation/external-tools.doc.md) — external tools useful alongside this repository.

## CLI

- List assets: `node ./scripts/ai.ts list`
- Validate registry files: `node ./scripts/ai.ts validate`
- Show one registry item: `node ./scripts/ai.ts show --id test-from-behaviour-spec`
- Validate installable skill directories: `node ./scripts/ai.ts validate-skills --verbose`
- Generate README prompt-location documentation: `node ./scripts/ai.ts build-documentation`
- Configure VS Code prompt file locations: `node ./scripts/ai.ts setup --prompts --mode glob`
- Run the standard repository AI checks: `node ./scripts/ai.ts check --release`

## Skills

> [!CAUTION]
> Skills are engineering knowledge packaged into reusable instructions. My own skills start with `dnb-` and are opinionated and based on my own experience and used tools. The fact that they are published here under a MIT license does not mean it's a released and supported end product. It's work in progress, and will expand as my experience will do over time. If you wish to pay for a supported product, feel free to contact me.

### Setup

Install one skill by id:

```bash
npx skills add davidsneighbour/ai/skills --skill dnb-project-task-triage --yes
```

Install all skills:

```bash
npx skills add davidsneighbour/ai/skills --skill '*' --yes
```

See [skills.sh](https://www.skills.sh/) for the full installer documentation, including updating, global installs, and other skill sources.

### Issue handling skills

- [dnb-github-label-classifier](skills/20-repository-workflows/dnb-github-label-classifier/SKILL.md) — Analyse GitHub issue text or metadata and select or apply labels from the category:value taxonomy.
- [dnb-select-next-issue](skills/20-repository-workflows/dnb-select-next-issue/SKILL.md) — Select one suitable open GitHub issue by priority and roadmap relevance, without implementing it.
- [dnb-work-on-issue](skills/20-repository-workflows/dnb-work-on-issue/SKILL.md) — Inspect a specific GitHub issue by number, implement the required change, validate, and commit with a Conventional Commits message that closes the issue.
- [dnb-work-on-next-issue](skills/20-repository-workflows/dnb-work-on-next-issue/SKILL.md) — Orchestrate selecting and implementing the next suitable open GitHub issue without a specific issue number provided.
- [dnb-work-through-issues](skills/20-repository-workflows/dnb-work-through-issues/SKILL.md) — Continuously work through open GitHub issues until no suitable actionable issues remain, committing each fix individually.

### Project management skills

- [dnb-astro-migration-project](skills/50-frameworks-and-libraries/dnb-astro-migration-project/SKILL.md) — Bootstrap and run a parity-first migration of an existing website to Astro.
- [dnb-dnbhq-configs](skills/20-repository-workflows/dnb-dnbhq-configs/SKILL.md) — Audit and initialise shared DNBHQ repository configuration packages from a registry-backed workflow.
- [dnb-dependency-maintenance](skills/20-repository-workflows/dnb-dependency-maintenance/SKILL.md) — Safely maintain npm dependencies in a single-package repository or npm monorepo.
- [dnb-osv-scan](skills/20-repository-workflows/dnb-osv-scan/SKILL.md) — Scan dependencies for known vulnerabilities with osv-scanner, auto-apply safe fixes, and file GitHub issues for the rest.
- [dnb-project-state-report](skills/20-repository-workflows/dnb-project-state-report/SKILL.md) — Analyse repository state, remote updates, GitHub activity, and recommended next actions.
- [dnb-project-task-triage](skills/20-repository-workflows/dnb-project-task-triage/SKILL.md) — Maintain the repository task-tracking system by syncing TODO.md with GitHub Issues and regenerating ROADMAP.md.
- [dnb-quality-gate-organisation](skills/30-quality-and-verification/dnb-quality-gate-organisation/SKILL.md) — Name repository quality-check commands consistently.
- [dnb-resume-interrupted-work](skills/20-repository-workflows/dnb-resume-interrupted-work/SKILL.md) — Manage a project-root RESUME.md handoff file that blocks new work until previously interrupted work is resolved.

### Blog drafting skills

- [dnb-blog-draft-meta-matter](skills/70-content-design-and-voice/dnb-blog-draft-meta-matter/SKILL.md) — Prepare SEO-aware titles, slugs, descriptions, and summaries from a blog draft or topic.
- [dnb-blog-draft-materialise](skills/70-content-design-and-voice/dnb-blog-draft-materialise/SKILL.md) — Create or move a blog draft into the configured blog content path using a selected metadata option.

### Specification and testing skills

- [dnb-behaviour-spec](skills/30-quality-and-verification/dnb-behaviour-spec/README.md) — Work from strict `Behaviour.spec.md` files as the source of truth for reviewing behaviour, generating tests, and validating implementation. See the skill README for the contract, workflow, examples, and stop conditions.

### Reference and documentation skills

- [dnb-create-js-documentation](skills/40-languages-and-runtimes/dnb-create-js-documentation/SKILL.md) — Add or improve generated API documentation for JavaScript or TypeScript npm projects.
- [dnb-markdown-formatting](skills/70-content-design-and-voice/dnb-markdown-formatting/SKILL.md) — Decide whether strict CommonMark or GitHub Flavored Markdown rules apply to a Markdown file, then apply the matching instruction set.
- [dnb-reference](skills/10-ai-assets/dnb-reference/SKILL.md) — Add or update strict references frontmatter on AI asset files.
- [dnb-voice](skills/70-content-design-and-voice/dnb-voice/SKILL.md) — Edit, rewrite, or review prose so it reads in Patrick's own voice.

### Engineering guideline skills

- [dnb-interface-engineering](skills/70-content-design-and-voice/dnb-interface-engineering/SKILL.md) — Design engineering principles for making interfaces feel polished.
- [dnb-llm-visibility](skills/10-ai-assets/dnb-llm-visibility/SKILL.md) — Make websites, docs, blogs, or landing pages visible and readable to LLMs and AI agents.
- [dnb-strict-typescript-check](skills/40-languages-and-runtimes/dnb-strict-typescript-check/SKILL.md) — Guidelines for strict TypeScript checks in generated code.

### Social media posting

- [dnb-post-into-void](skills/70-content-design-and-voice/dnb-post-into-void/SKILL.md) — Prepare and publish a casual Mastodon post from text supplied with the request or collected through questions.
- [dnb-post-session-into-void](skills/70-content-design-and-voice/dnb-post-session-into-void/SKILL.md) — Draft and publish a confirmed Mastodon post from the current AI session context.

<!-- ai:prompt-files-settings:start -->
<!-- This section is generated by `npm run build:documentation` (`node ./scripts/ai.ts build-documentation`). Do not edit manually. -->

## VS code prompt file recommendations

VS Code can load prompt files from configured workspace locations. This repository keeps prompt files under `prompts/`.

There are two useful configuration styles.

### Option 1: one recursive glob

Use this when all prompt recommendations should be available at once and new folders should be picked up automatically.

```jsonc
{
  "chat.promptFilesLocations": {
    "prompts/**/*.prompt.md": true
  }
}
```

### Option 2: individual folder entries

Use this when prompt recommendation groups should be enabled or disabled independently.

```jsonc
{
  "chat.promptFilesLocations": {
    "prompts/00-system/*.prompt.md": true,
    "prompts/10-ai-assets/*.prompt.md": true,
    "prompts/20-repository-workflows/*.prompt.md": true,
    "prompts/30-quality-and-verification/*.prompt.md": true,
    "prompts/40-languages-and-runtimes/*.prompt.md": true,
    "prompts/50-frameworks-and-libraries/*.prompt.md": true,
    "prompts/60-platforms-and-infrastructure/*.prompt.md": true,
    "prompts/70-content-design-and-voice/*.prompt.md": true,
    "prompts/80-knowledge-research-and-data/*.prompt.md": true,
    "prompts/90-specialised-domains/*.prompt.md": true
  }
}
```

<!-- ai:prompt-files-settings:end -->

## Licensed content

These links into 404s are by design.

- [Tailwind Plus UI-Blocks llms.txt](https://tailwindcss.com/plus/ui-blocks/documentation/llms.txt)
- [Emil.md](https://animations.dev/learn/emil-skill)
- [Animations.dev Skill](https://animations.dev/learn/animation-theory/animations-and-ai#installation)

## Shared config skill

This repository uses one installable skill for applying shared DNBHQ configuration packages to other projects:

- [dnb-dnbhq-configs](skills/20-repository-workflows/dnb-dnbhq-configs/SKILL.md)

The skill audits a target repository, reads the package registry, checks package README.md files for current defaults, and then initialises only the selected shared configuration packages. Package-specific procedures live in resource files under [`skills/20-repository-workflows/dnb-dnbhq-configs/resources/packages/`](skills/20-repository-workflows/dnb-dnbhq-configs/resources/packages/).

The package registry is the source of truth for configurable packages:

- [`package-registry.md`](skills/20-repository-workflows/dnb-dnbhq-configs/resources/package-registry.md)

Use the skill commands:

- `/dnb-dnbhq-configs audit` to inspect current shared configuration state without editing files
- `/dnb-dnbhq-configs init` to initialise selected shared configuration packages

### Supported shared configs

| Config | Resource |
| --- | --- |
| Biome config | [`biome.md`](skills/20-repository-workflows/dnb-dnbhq-configs/resources/packages/biome.md) |
| Markdownlint config | [`markdownlint.md`](skills/20-repository-workflows/dnb-dnbhq-configs/resources/packages/markdownlint.md) |
| Release config | [`release.md`](skills/20-repository-workflows/dnb-dnbhq-configs/resources/packages/release.md) |
| Renovate config | [`renovate.md`](skills/20-repository-workflows/dnb-dnbhq-configs/resources/packages/renovate.md) |
| TypeScript config | [`typescript.md`](skills/20-repository-workflows/dnb-dnbhq-configs/resources/packages/typescript.md) |
| Other registry packages | [`other.md`](skills/20-repository-workflows/dnb-dnbhq-configs/resources/packages/other.md) |

### Adding another shared config

To add another shared configuration workflow:

1. add the package to [`package-registry.md`](skills/20-repository-workflows/dnb-dnbhq-configs/resources/package-registry.md)
2. point the entry to an existing package resource, or add a dedicated resource under `resources/packages/`
3. include current README.md, package metadata, migration, validation, and cleanup guidance
4. assign a registry `Weight` only when the package must run before other configs
5. run the skill validation checks

This keeps shared configuration rollouts repeatable while centralising package-specific behaviour in the skill.

## License

This repository is licensed under the MIT License — see [LICENSE.md](LICENSE.md) for the full text.
