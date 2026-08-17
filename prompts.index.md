# Prompts index

This index records the prompt folder taxonomy and the current prompt files in
this repository. Update this file in the same change whenever a prompt is
added, removed, renamed, or moved.

## Sorting rule

Use the shared numbered top-level taxonomy from
[`instructions.index.md`](instructions.index.md). Prompt files stay directly
inside the numbered prompt folder so the repository's individual
prompt-folder setup mode can discover them by direct child folder.

When flattening a prompt from a more specific folder, preserve important
context in the filename, for example `hugo-upgrade.prompt.md` instead of
`upgrade.prompt.md`.

## Prompt folders

| Folder | Purpose | Current entries |
| --- | --- | --- |
| `00-system` | Core assistant operating rules and project-governance protocols. | None |
| `10-ai-assets` | Creating, improving, and maintaining prompts, instructions, skills, agents, and other AI assets. | [`config-prompt-pair-generator`](prompts/10-ai-assets/config-prompt-pair-generator.prompt.md), [`extend-typescript-programming`](prompts/10-ai-assets/extend.typescript-programming.prompt.md), [`rewrite-agents`](prompts/10-ai-assets/rewrite-agents.prompt.md), [`rule-particles`](prompts/10-ai-assets/rule-particles.prompt.md) |
| `20-repository-workflows` | Repository maintenance, commits, issues, manifests, releases, and working-tree protocols. | [`scratch-cleanup`](prompts/20-repository-workflows/scratch-cleanup.prompt.md) |
| `30-quality-and-verification` | Tool-neutral quality gates, verification, CI, and health-check workflows. | [`project-health-check`](prompts/30-quality-and-verification/project-health-check.prompt.md) |
| `40-languages-and-runtimes` | Language-specific and runtime-specific programming, testing, review, and configuration rules. | [`node-cli-output-input`](prompts/40-languages-and-runtimes/node-cli-output-input.prompt.md), [`node-configuration-setup`](prompts/40-languages-and-runtimes/node-configuration-setup.prompt.md) |
| `50-frameworks-and-libraries` | Framework, CMS, UI library, and library-specific rules. | [`hugo-upgrade`](prompts/50-frameworks-and-libraries/hugo-upgrade.prompt.md) |
| `60-platforms-and-infrastructure` | Operating systems, platforms, infrastructure, deployment, and service administration. | None |
| `70-content-design-and-voice` | Markdown, copy style, editorial voice, and content presentation. | [`rewrite-human`](prompts/70-content-design-and-voice/rewrite-human.prompt.md) |
| `80-knowledge-research-and-data` | Research, learning, note-taking, bookmark, data, and knowledge-work workflows. | [`learning-incremental-understanding-verification`](prompts/80-knowledge-research-and-data/learning-incremental-understanding-verification.prompt.md), [`obsidian-create-astro-news-as-notes`](prompts/80-knowledge-research-and-data/obsidian-create-astro-news-as-notes.prompt.md), [`raindrop-generate-tags`](prompts/80-knowledge-research-and-data/raindrop-generate-tags.prompt.md), [`raindrop-tags`](prompts/80-knowledge-research-and-data/raindrop-tags.prompt.md), [`second-brain`](prompts/80-knowledge-research-and-data/second-brain.prompt.md), [`signal-extraction-framework`](prompts/80-knowledge-research-and-data/signal-extraction-framework.prompt.md) |
| `90-specialised-domains` | Non-technical, playful, or domain-specific areas such as music tools, math art, and experiments. | None |
