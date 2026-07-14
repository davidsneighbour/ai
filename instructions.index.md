# Instructions index

This index records the instruction folder taxonomy and the current instruction
files in this repository. Update this file in the same change whenever an
instruction is added, removed, renamed, or moved.

## Sorting rule

Use the primary subject as the file owner. Adjacent categories should reference
that file instead of duplicating it.

For example, TypeScript testing belongs under
`40-languages-and-runtimes/typescript/` because the testing rules are
language-specific. A general quality or verification instruction may point to
that TypeScript testing file, but should not copy the same rules.

## Shared top-level folders

Use the same numbered top-level folders under `instructions/`, `prompts/`,
`agents/`, and `skills/`. Prompt files stay directly inside the numbered prompt
folder so the repository's individual prompt-folder setup mode can discover
them by direct child folder. Agent and skill assets keep their protocol
entrypoint folder below the numbered category, for example
`agents/20-repository-workflows/repository-maintainer/agent.md` and
`skills/20-repository-workflows/dnb-work-on-issue/SKILL.md`.

| Folder | Purpose |
| --- | --- |
| `00-system` | Core assistant operating rules and project-governance protocols. |
| `10-ai-assets` | Creating, improving, and maintaining prompts, instructions, skills, agents, and other AI assets. |
| `20-repository-workflows` | Repository maintenance, commits, issues, manifests, releases, and working-tree protocols. |
| `30-quality-and-verification` | Tool-neutral quality gates, verification, CI, and health-check workflows. |
| `40-languages-and-runtimes` | Language-specific and runtime-specific programming, testing, review, and configuration rules. |
| `50-frameworks-and-libraries` | Framework, CMS, UI library, and library-specific rules. |
| `60-platforms-and-infrastructure` | Operating systems, platforms, infrastructure, deployment, and service administration. |
| `70-content-design-and-voice` | Markdown, copy style, editorial voice, and content presentation. |
| `80-knowledge-research-and-data` | Research, learning, note-taking, bookmark, data, and knowledge-work workflows. |
| `90-specialised-domains` | Non-technical, playful, or domain-specific areas such as music tools, math art, and experiments. |

## Instruction files

| File | Contents |
| --- | --- |
| [`00-system/design-governance.instructions.md`](instructions/00-system/design-governance.instructions.md) | Design governance lookup rules, with project `DESIGN.md` files as the governing source of truth. |
| [`10-ai-assets/instructions.instructions.md`](instructions/10-ai-assets/instructions.instructions.md) | Guidelines for writing and maintaining custom instruction files. |
| [`10-ai-assets/prompt.instructions.md`](instructions/10-ai-assets/prompt.instructions.md) | Guidelines for writing and maintaining prompt files. |
| [`20-repository-workflows/commit-and-issue.instructions.md`](instructions/20-repository-workflows/commit-and-issue.instructions.md) | Issue, validation, and commit workflow rules for AI-assisted repository changes. |
| [`20-repository-workflows/commit-message.instructions.md`](instructions/20-repository-workflows/commit-message.instructions.md) | Conventional Commit format, scope, body, footer, revert, and merge-subject rules. |
| [`20-repository-workflows/package-json.instructions.md`](instructions/20-repository-workflows/package-json.instructions.md) | Deterministic `package.json` and npm lockfile maintenance rules. |
| [`20-repository-workflows/resume-interrupted-work.instructions.md`](instructions/20-repository-workflows/resume-interrupted-work.instructions.md) | Required `RESUME.md` check before starting repository work. |
| [`30-quality-and-verification/verification-protocol.instructions.md`](instructions/30-quality-and-verification/verification-protocol.instructions.md) | Default and extended verification protocol before returning results. |
| [`40-languages-and-runtimes/javascript/es2025-js.instructions.md`](instructions/40-languages-and-runtimes/javascript/es2025-js.instructions.md) | Modern ES2025/ES2026 JavaScript preferences. |
| [`40-languages-and-runtimes/shell/shell.instructions.md`](instructions/40-languages-and-runtimes/shell/shell.instructions.md) | Shell scripting practices for Bash, sh, zsh, and related shells. |
| [`40-languages-and-runtimes/typescript/architecture.instructions.md`](instructions/40-languages-and-runtimes/typescript/architecture.instructions.md) | TypeScript architecture, module boundaries, dependency direction, and service design. |
| [`40-languages-and-runtimes/typescript/configuration.instructions.md`](instructions/40-languages-and-runtimes/typescript/configuration.instructions.md) | TypeScript compiler and `tsconfig` baseline rules. |
| [`40-languages-and-runtimes/typescript/keycombinations.instructions.md`](instructions/40-languages-and-runtimes/typescript/keycombinations.instructions.md) | TypeScript keyboard shortcut and key-combination patterns. |
| [`40-languages-and-runtimes/typescript/review.instructions.md`](instructions/40-languages-and-runtimes/typescript/review.instructions.md) | TypeScript code-review checklist and verification rules. |
| [`40-languages-and-runtimes/typescript/testing.instructions.md`](instructions/40-languages-and-runtimes/typescript/testing.instructions.md) | TypeScript, JavaScript, Vitest, and Playwright testing rules. |
| [`40-languages-and-runtimes/typescript/typescript-programming.instructions.md`](instructions/40-languages-and-runtimes/typescript/typescript-programming.instructions.md) | Core strict TypeScript programming rules and examples. |
| [`50-frameworks-and-libraries/astro/astro-architecture.instructions.md`](instructions/50-frameworks-and-libraries/astro/astro-architecture.instructions.md) | Astro architecture and development standards. |
| [`50-frameworks-and-libraries/astro/typescript-reference.instructions.md`](instructions/50-frameworks-and-libraries/astro/typescript-reference.instructions.md) | Astro TypeScript type reference and official docs pointers. |
| [`50-frameworks-and-libraries/astro/typescript.instructions.md`](instructions/50-frameworks-and-libraries/astro/typescript.instructions.md) | Astro-specific TypeScript rules extending the generic TypeScript instructions. |
| [`50-frameworks-and-libraries/tailwind-plus/tailwindplus.instructions.md`](instructions/50-frameworks-and-libraries/tailwind-plus/tailwindplus.instructions.md) | Tailwind Plus Elements component reference. |
| [`50-frameworks-and-libraries/wordpress/wordpress.instructions.md`](instructions/50-frameworks-and-libraries/wordpress/wordpress.instructions.md) | WordPress plugin and theme coding, security, and testing rules. |
| [`60-platforms-and-infrastructure/debian-linux/debian-linux.instructions.md`](instructions/60-platforms-and-infrastructure/debian-linux/debian-linux.instructions.md) | Debian-based Linux administration and apt workflow guidance. |
| [`70-content-design-and-voice/markdown/markdown-commonmark.instructions.md`](instructions/70-content-design-and-voice/markdown/markdown-commonmark.instructions.md) | CommonMark Markdown syntax rules. |
| [`70-content-design-and-voice/markdown/markdown-formatting.instructions.md`](instructions/70-content-design-and-voice/markdown/markdown-formatting.instructions.md) | Repository Markdown formatting rules with stable rule identifiers. |
| [`70-content-design-and-voice/markdown/markdown-gfm.instructions.md`](instructions/70-content-design-and-voice/markdown/markdown-gfm.instructions.md) | GitHub Flavored Markdown extensions on top of CommonMark. |
| [`70-content-design-and-voice/voice/voice.instructions.md`](instructions/70-content-design-and-voice/voice/voice.instructions.md) | Baseline copy and wording rules for written files. |
