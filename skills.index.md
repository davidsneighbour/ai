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
| `20-repository-workflows` | Repository maintenance, commits, issues, manifests, releases, and working-tree protocols. | [`dnbhq-configs`](skills/20-repository-workflows/dnbhq-configs/SKILL.md) |
| `30-quality-and-verification` | Tool-neutral quality gates, verification, CI, and health-check workflows. | [`dnb-behaviour-spec`](skills/30-quality-and-verification/dnb-behaviour-spec/SKILL.md), [`dnb-quality-gate-organisation`](skills/30-quality-and-verification/dnb-quality-gate-organisation/SKILL.md), [`dnb-site-audit`](skills/30-quality-and-verification/dnb-site-audit/SKILL.md) |
| `40-languages-and-runtimes` | Language-specific and runtime-specific programming, testing, review, and configuration rules. | [`dnb-create-js-documentation`](skills/40-languages-and-runtimes/dnb-create-js-documentation/SKILL.md), [`dnb-strict-typescript-check`](skills/40-languages-and-runtimes/dnb-strict-typescript-check/SKILL.md) |
| `50-frameworks-and-libraries` | Framework, CMS, UI library, and library-specific rules. | [`dnb-astro-architecture`](skills/50-frameworks-and-libraries/dnb-astro-architecture/SKILL.md), [`dnb-astro-migration-project`](skills/50-frameworks-and-libraries/dnb-astro-migration-project/SKILL.md), [`dnb-tailwindplus-elements`](skills/50-frameworks-and-libraries/dnb-tailwindplus-elements/SKILL.md) |
| `60-platforms-and-infrastructure` | Operating systems, platforms, infrastructure, deployment, and service administration. | None |
| `70-content-design-and-voice` | Markdown, copy style, editorial voice, social posting, and content presentation. | [`dnb-blog-draft-materialise`](skills/70-content-design-and-voice/dnb-blog-draft-materialise/SKILL.md), [`dnb-blog-draft-meta-matter`](skills/70-content-design-and-voice/dnb-blog-draft-meta-matter/SKILL.md), [`dnb-interface-design`](skills/70-content-design-and-voice/dnb-interface-design/README.md), [`dnb-interface-engineering`](skills/70-content-design-and-voice/dnb-interface-engineering/SKILL.md), [`dnb-markdown-formatting`](skills/70-content-design-and-voice/dnb-markdown-formatting/SKILL.md), [`dnb-post-into-void`](skills/70-content-design-and-voice/dnb-post-into-void/SKILL.md), [`dnb-post-session-into-void`](skills/70-content-design-and-voice/dnb-post-session-into-void/SKILL.md), [`dnb-voice`](skills/70-content-design-and-voice/dnb-voice/SKILL.md) |
| `80-knowledge-research-and-data` | Research, learning, note-taking, bookmark, data, and knowledge-work workflows. | None |
| `90-specialised-domains` | Non-technical, playful, or domain-specific areas such as music tools, math art, and experiments. | None |

## Installable skills

| Skill | Contents |
| --- | --- |
| [`dnb-llm-visibility`](skills/10-ai-assets/dnb-llm-visibility/SKILL.md) | Makes websites, docs, blogs, and landing pages visible and readable to LLMs and AI agents. |
| [`dnb-reference`](skills/10-ai-assets/dnb-reference/SKILL.md) | Adds or updates strict references frontmatter on AI asset files. |
| [`dnbhq-configs`](skills/20-repository-workflows/dnbhq-configs/SKILL.md) | Audits and initialises shared DNBHQ repository configuration packages from a registry-backed workflow. |
| [`dnb-behaviour-spec`](skills/30-quality-and-verification/dnb-behaviour-spec/SKILL.md) | Creates, reviews, and generates tests from strict behaviour specifications. |
| [`dnb-quality-gate-organisation`](skills/30-quality-and-verification/dnb-quality-gate-organisation/SKILL.md) | Names and documents repository quality-check command conventions. |
| [`dnb-site-audit`](skills/30-quality-and-verification/dnb-site-audit/SKILL.md) | Audits websites against a launch-readiness and quality checklist. |
| [`dnb-create-js-documentation`](skills/40-languages-and-runtimes/dnb-create-js-documentation/SKILL.md) | Adds or improves generated JavaScript or TypeScript API documentation. |
| [`dnb-strict-typescript-check`](skills/40-languages-and-runtimes/dnb-strict-typescript-check/SKILL.md) | Guides strict TypeScript checks in generated code. |
| [`dnb-astro-architecture`](skills/50-frameworks-and-libraries/dnb-astro-architecture/SKILL.md) | Astro 5+ architecture and development standards; confirms the project is Astro-based before applying. |
| [`dnb-astro-migration-project`](skills/50-frameworks-and-libraries/dnb-astro-migration-project/SKILL.md) | Bootstraps and runs parity-first Astro migration projects. |
| [`dnb-tailwindplus-elements`](skills/50-frameworks-and-libraries/dnb-tailwindplus-elements/SKILL.md) | Tailwind Plus Elements UI component library reference; confirms the dependency is present before applying. |
| [`dnb-blog-draft-materialise`](skills/70-content-design-and-voice/dnb-blog-draft-materialise/SKILL.md) | Materialises a blog draft into the configured content path. |
| [`dnb-blog-draft-meta-matter`](skills/70-content-design-and-voice/dnb-blog-draft-meta-matter/SKILL.md) | Prepares SEO-aware title, slug, description, and summary options. |
| [`dnb-interface-engineering`](skills/70-content-design-and-voice/dnb-interface-engineering/SKILL.md) | Applies design engineering principles for polished interfaces. |
| [`dnb-markdown-formatting`](skills/70-content-design-and-voice/dnb-markdown-formatting/SKILL.md) | Applies the correct Markdown flavor rules for a target renderer. |
| [`dnb-post-into-void`](skills/70-content-design-and-voice/dnb-post-into-void/SKILL.md) | Drafts and publishes a casual Mastodon post after confirmation. |
| [`dnb-post-session-into-void`](skills/70-content-design-and-voice/dnb-post-session-into-void/SKILL.md) | Drafts and publishes a confirmed Mastodon post from the current session. |
| [`dnb-voice`](skills/70-content-design-and-voice/dnb-voice/SKILL.md) | Edits prose so it reads in Patrick's voice. |

## Imported bundles

| Bundle | Contents |
| --- | --- |
| [`dnb-interface-design`](skills/70-content-design-and-voice/dnb-interface-design/README.md) | Imported interface-design bundle kept in the content and design category. |
