---
name: Instructions folder primer
description: Session-start orientation for the instructions/ folder - what it is, how applyTo scoping works, and where to find the full per-file index.
applyTo: "**/*"
---

# Instructions folder

This folder holds `.instructions.md` files consumed by Copilot-style and
Claude Code agents. Each file carries its own `applyTo` glob in front
matter and is meant to auto-apply only when an edited file matches that
glob - this folder is not one flat block of always-on rules.

Read this primer once per session for orientation. Do not read every file
in the folder verbatim; consult the relevant file(s) for the language,
framework, or workflow actually in play. For the exhaustive file-by-file
table with descriptions, see
[`instructions.index.md`](../instructions.index.md) at the repository root.

## Available folder names

These are the ten numbered categories in the taxonomy. All are valid
destinations for a new instruction file even when no folder currently
exists on disk for one - create the folder when the first file for it is
added, rather than treating an empty category as unavailable.

| Folder | Covers | Typical `applyTo` scope |
| --- | --- | --- |
| `00-system` | Core operating rules (for example design-system lookup via `DESIGN.md`). | Repo-wide (`**/*`) |
| `10-ai-assets` | Writing and maintaining prompt and instruction files themselves. | `*.prompt.md`, `*.instructions.md` |
| `20-repository-workflows` | Commits, issues, `package.json`, resuming interrupted work. | Repo-wide (`**/*.*`) |
| `30-quality-and-verification` | Tool-neutral verification protocol before returning results. | Repo-wide (`**/*.*`) |
| `40-languages-and-runtimes` | JavaScript, TypeScript, shell - language and runtime rules. | Language file extensions |
| `50-frameworks-and-libraries` | Astro, WordPress. Framework-wide content lives in external skills instead - see the caveat below. | Framework file types |
| `60-platforms-and-infrastructure` | Debian/Linux administration. | Repo-wide (`**`) |
| `70-content-design-and-voice` | Markdown (CommonMark/GFM/repo formatting), editorial voice. | `*.md`, repo-wide |
| `80-knowledge-research-and-data` | Research, learning, note-taking, bookmark, data, and knowledge-work workflows. | No files yet |
| `90-specialised-domains` | Non-technical, playful, or domain-specific areas. | No files yet |

## Scope caveat: broad framework globs, and why some content is a skill instead

A file's `applyTo` glob matches on file extension, not on whether a
framework is actually in use. `wordpress/wordpress.instructions.md` matches
every `.js`/`.ts`/`.css`/`.json` file in addition to its `wp-content/**`
scoping - confirm WordPress is actually part of the project before treating
it as binding.

Astro architecture standards and Tailwind Plus Elements documentation used
to live here under the same problem (matching every `.ts`/`.astro` file
regardless of framework) and were moved to external skills instead, because
a skill is invoked by an agent's judgment rather than a blind glob match.
Use the collection repositories listed in
[`skills.index.md`](../skills.index.md), and invoke framework skills only
after confirming the framework is in use (`astro.config.mjs`/`.astro`
files/an `astro` dependency; a `@tailwindplus/elements` dependency or CDN
script tag). `instructions/50-frameworks-and-libraries/astro/` still holds
the Astro-specific TypeScript files, since those extend the generic
TypeScript rules the same way regardless of which Astro features a project
uses.

## Folder structure pattern

A subtopic gets its own folder only when it has more than one file; a
single file stays directly in its numbered folder. A subtopic folder with
more than one file gets a `<subtopic>-index.instructions.md` entry point
describing how its files relate (not a bare `index.instructions.md` -
ids derive from filename, not path) - see
`40-languages-and-runtimes/typescript/typescript-index.instructions.md` and
`50-frameworks-and-libraries/astro/astro-index.instructions.md` for worked
examples. Full rule:
[`10-ai-assets/instructions.instructions.md`](10-ai-assets/instructions.instructions.md).
