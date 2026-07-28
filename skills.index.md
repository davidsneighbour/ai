# Skills index

This index records the skill folder taxonomy and the current skill entries in
this repository. Update this file in the same change whenever a skill is added,
removed, renamed, or moved.

## Sorting rule

Use the shared numbered top-level taxonomy from
[`instructions.index.md`](instructions.index.md). An installable skill lives
below the category that owns its primary operating purpose:

```text
skills/<category>/<skill-id>/SKILL.md
```

The directory directly containing `SKILL.md` must match the skill `id`
frontmatter.

## Skill folders

| Folder | Purpose | Current entries |
| --- | --- | --- |
| `00-system` | Core assistant operating rules and project-governance protocols. | None |
| `10-ai-assets` | Creating, improving, and maintaining prompts, instructions, skills, agents, and other AI assets. | [`dnb-llm-visibility`](skills/10-ai-assets/dnb-llm-visibility/SKILL.md), [`dnb-reference`](skills/10-ai-assets/dnb-reference/SKILL.md) |
| `20-repository-workflows` | Repository maintenance, commits, issues, manifests, releases, and working-tree protocols. | [`dnb-dependency-maintenance`](skills/20-repository-workflows/dnb-dependency-maintenance/SKILL.md), [`dnb-github-label-classifier`](skills/20-repository-workflows/dnb-github-label-classifier/SKILL.md), [`dnb-osv-scan`](skills/20-repository-workflows/dnb-osv-scan/SKILL.md), [`dnb-project-state-report`](skills/20-repository-workflows/dnb-project-state-report/SKILL.md), [`dnb-project-task-triage`](skills/20-repository-workflows/dnb-project-task-triage/SKILL.md), [`dnb-resume-interrupted-work`](skills/20-repository-workflows/dnb-resume-interrupted-work/SKILL.md), [`dnb-select-next-issue`](skills/20-repository-workflows/dnb-select-next-issue/SKILL.md), [`dnb-work-on-issue`](skills/20-repository-workflows/dnb-work-on-issue/SKILL.md), [`dnb-work-on-next-issue`](skills/20-repository-workflows/dnb-work-on-next-issue/SKILL.md), [`dnb-work-through-issues`](skills/20-repository-workflows/dnb-work-through-issues/SKILL.md) |
| `30-quality-and-verification` | Tool-neutral quality gates, verification, CI, and health-check workflows. | [`dnb-behaviour-spec`](skills/30-quality-and-verification/dnb-behaviour-spec/SKILL.md), [`dnb-quality-gate-organisation`](skills/30-quality-and-verification/dnb-quality-gate-organisation/SKILL.md), [`dnb-site-audit`](skills/30-quality-and-verification/dnb-site-audit/SKILL.md) |
| `40-languages-and-runtimes` | Language-specific and runtime-specific programming, testing, review, and configuration rules. | [`dnb-create-js-documentation`](skills/40-languages-and-runtimes/dnb-create-js-documentation/SKILL.md), [`dnb-strict-typescript-check`](skills/40-languages-and-runtimes/dnb-strict-typescript-check/SKILL.md) |
| `50-frameworks-and-libraries` | Framework, CMS, UI library, and library-specific rules. | [`dnb-astro-migration-project`](skills/50-frameworks-and-libraries/dnb-astro-migration-project/SKILL.md) |
| `60-platforms-and-infrastructure` | Operating systems, platforms, infrastructure, deployment, and service administration. | None |
| `70-content-design-and-voice` | Markdown, copy style, editorial voice, social posting, and content presentation. | [`dnb-blog-draft-materialise`](skills/70-content-design-and-voice/dnb-blog-draft-materialise/SKILL.md), [`dnb-blog-draft-meta-matter`](skills/70-content-design-and-voice/dnb-blog-draft-meta-matter/SKILL.md), [`dnb-interface-design`](skills/70-content-design-and-voice/dnb-interface-design/README.md), [`dnb-interface-engineering`](skills/70-content-design-and-voice/dnb-interface-engineering/SKILL.md), [`dnb-markdown-formatting`](skills/70-content-design-and-voice/dnb-markdown-formatting/SKILL.md), [`dnb-post-into-void`](skills/70-content-design-and-voice/dnb-post-into-void/SKILL.md), [`dnb-post-link-into-void`](skills/70-content-design-and-voice/dnb-post-link-into-void/SKILL.md), [`dnb-post-session-into-void`](skills/70-content-design-and-voice/dnb-post-session-into-void/SKILL.md), [`dnb-reddit-refresh-token`](skills/70-content-design-and-voice/dnb-reddit-refresh-token/SKILL.md), [`dnb-threads-refresh-token`](skills/70-content-design-and-voice/dnb-threads-refresh-token/SKILL.md), [`dnb-tumblr-refresh-token`](skills/70-content-design-and-voice/dnb-tumblr-refresh-token/SKILL.md), [`dnb-voice`](skills/70-content-design-and-voice/dnb-voice/SKILL.md) |
| `80-knowledge-research-and-data` | Research, learning, note-taking, bookmark, data, and knowledge-work workflows. | None |
| `90-specialised-domains` | Non-technical, playful, or domain-specific areas such as music tools, math art, and experiments. | None |

## Installable skills

| Skill | Contents |
| --- | --- |
| [`dnb-llm-visibility`](skills/10-ai-assets/dnb-llm-visibility/SKILL.md) | Makes websites, docs, blogs, and landing pages visible and readable to LLMs and AI agents. |
| [`dnb-reference`](skills/10-ai-assets/dnb-reference/SKILL.md) | Adds or updates strict references frontmatter on AI asset files. |
| [`dnb-dependency-maintenance`](skills/20-repository-workflows/dnb-dependency-maintenance/SKILL.md) | Maintains npm dependencies while preserving unrelated work. |
| [`dnb-github-label-classifier`](skills/20-repository-workflows/dnb-github-label-classifier/SKILL.md) | Classifies GitHub issues against the category:value label taxonomy and can apply label changes when tooling is available. |
| [`dnb-osv-scan`](skills/20-repository-workflows/dnb-osv-scan/SKILL.md) | Runs OSV vulnerability triage and tracks accepted, fixed, and workaround decisions. |
| [`dnb-project-state-report`](skills/20-repository-workflows/dnb-project-state-report/SKILL.md) | Reports repository state, remote updates, GitHub activity, and recommended next actions. |
| [`dnb-project-task-triage`](skills/20-repository-workflows/dnb-project-task-triage/SKILL.md) | Syncs project tracking files with GitHub Issues and regenerates roadmap data. |
| [`dnb-resume-interrupted-work`](skills/20-repository-workflows/dnb-resume-interrupted-work/SKILL.md) | Manages project-root `RESUME.md` handoff files. |
| [`dnb-select-next-issue`](skills/20-repository-workflows/dnb-select-next-issue/SKILL.md) | Selects one suitable open GitHub issue without implementing it. |
| [`dnb-work-on-issue`](skills/20-repository-workflows/dnb-work-on-issue/SKILL.md) | Implements a specified GitHub issue and commits the fix. |
| [`dnb-work-on-next-issue`](skills/20-repository-workflows/dnb-work-on-next-issue/SKILL.md) | Selects and implements the next suitable open GitHub issue. |
| [`dnb-work-through-issues`](skills/20-repository-workflows/dnb-work-through-issues/SKILL.md) | Works through suitable open GitHub issues in a loop. |
| [`dnb-behaviour-spec`](skills/30-quality-and-verification/dnb-behaviour-spec/SKILL.md) | Creates, reviews, and generates tests from strict behaviour specifications. |
| [`dnb-quality-gate-organisation`](skills/30-quality-and-verification/dnb-quality-gate-organisation/SKILL.md) | Names and documents repository quality-check command conventions. |
| [`dnb-site-audit`](skills/30-quality-and-verification/dnb-site-audit/SKILL.md) | Audits websites against a launch-readiness and quality checklist. |
| [`dnb-create-js-documentation`](skills/40-languages-and-runtimes/dnb-create-js-documentation/SKILL.md) | Adds or improves generated JavaScript or TypeScript API documentation. |
| [`dnb-strict-typescript-check`](skills/40-languages-and-runtimes/dnb-strict-typescript-check/SKILL.md) | Guides strict TypeScript checks in generated code. |
| [`dnb-astro-migration-project`](skills/50-frameworks-and-libraries/dnb-astro-migration-project/SKILL.md) | Bootstraps and runs parity-first Astro migration projects. |
| [`dnb-blog-draft-materialise`](skills/70-content-design-and-voice/dnb-blog-draft-materialise/SKILL.md) | Materialises a blog draft into the configured content path. |
| [`dnb-blog-draft-meta-matter`](skills/70-content-design-and-voice/dnb-blog-draft-meta-matter/SKILL.md) | Prepares SEO-aware title, slug, description, and summary options. |
| [`dnb-interface-engineering`](skills/70-content-design-and-voice/dnb-interface-engineering/SKILL.md) | Applies design engineering principles for polished interfaces. |
| [`dnb-markdown-formatting`](skills/70-content-design-and-voice/dnb-markdown-formatting/SKILL.md) | Applies the correct Markdown flavor rules for a target renderer. |
| [`dnb-post-into-void`](skills/70-content-design-and-voice/dnb-post-into-void/SKILL.md) | Drafts and publishes a casual Mastodon post after confirmation. |
| [`dnb-post-link-into-void`](skills/70-content-design-and-voice/dnb-post-link-into-void/SKILL.md) | Drafts social posts from URLs and prevents duplicate per-network link posts. |
| [`dnb-post-session-into-void`](skills/70-content-design-and-voice/dnb-post-session-into-void/SKILL.md) | Drafts and publishes a confirmed Mastodon post from the current session. |
| [`dnb-reddit-refresh-token`](skills/70-content-design-and-voice/dnb-reddit-refresh-token/SKILL.md) | Creates a Reddit OAuth refresh token through a local loopback callback without printing secrets. |
| [`dnb-threads-refresh-token`](skills/70-content-design-and-voice/dnb-threads-refresh-token/SKILL.md) | Creates or refreshes a long-lived Threads API access token through a local loopback callback without printing secrets. |
| [`dnb-tumblr-refresh-token`](skills/70-content-design-and-voice/dnb-tumblr-refresh-token/SKILL.md) | Creates or refreshes Tumblr OAuth2 credentials through a local loopback callback without printing secrets. |
| [`dnb-voice`](skills/70-content-design-and-voice/dnb-voice/SKILL.md) | Edits prose so it reads in Patrick's voice. |

## Imported bundles

| Bundle | Contents |
| --- | --- |
| [`dnb-interface-design`](skills/70-content-design-and-voice/dnb-interface-design/README.md) | Imported interface-design bundle kept in the content and design category. |
