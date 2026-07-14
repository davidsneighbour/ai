# Agents index

This index records the agent folder taxonomy and the current agent profiles in
this repository. Update this file in the same change whenever an agent is added,
removed, renamed, or moved.

## Sorting rule

Use the shared numbered top-level taxonomy from
[`instructions.index.md`](instructions.index.md). An agent profile lives below
the category that owns its primary operating purpose:

```text
agents/<category>/<agent-id>/agent.md
```

The directory directly containing `agent.md` must match the agent `id`
frontmatter.

## Agent folders

| Folder | Purpose | Current entries |
| --- | --- | --- |
| `00-system` | Core assistant operating rules and project-governance protocols. | None |
| `10-ai-assets` | Creating, improving, and maintaining prompts, instructions, skills, agents, and other AI assets. | None |
| `20-repository-workflows` | Repository maintenance, commits, issues, manifests, releases, and working-tree protocols. | [`repository-maintainer`](agents/20-repository-workflows/repository-maintainer/agent.md) |
| `30-quality-and-verification` | Tool-neutral quality gates, verification, CI, and health-check workflows. | None |
| `40-languages-and-runtimes` | Language-specific and runtime-specific programming, testing, review, and configuration rules. | None |
| `50-frameworks-and-libraries` | Framework, CMS, UI library, and library-specific rules. | None |
| `60-platforms-and-infrastructure` | Operating systems, platforms, infrastructure, deployment, and service administration. | None |
| `70-content-design-and-voice` | Markdown, copy style, editorial voice, and content presentation. | [`markdown-accessibility`](agents/70-content-design-and-voice/markdown-accessibility/agent.md) |
| `80-knowledge-research-and-data` | Research, learning, note-taking, bookmark, data, and knowledge-work workflows. | None |
| `90-specialised-domains` | Non-technical, playful, or domain-specific areas such as music tools, math art, and experiments. | None |

## Agent profiles

| Agent | Contents |
| --- | --- |
| [`repository-maintainer`](agents/20-repository-workflows/repository-maintainer/agent.md) | Maintains AI registry assets, repository documentation, and validation gates. |
| [`markdown-accessibility`](agents/70-content-design-and-voice/markdown-accessibility/agent.md) | Reviews Markdown accessibility issues that linters cannot judge, such as alt-text quality, heading hierarchy, plain language, and emoji usage. |
