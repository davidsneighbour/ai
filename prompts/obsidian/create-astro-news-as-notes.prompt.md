---
agent: 'agent'
model: Auto
tools: ['execute/getTerminalOutput', 'execute/runInTerminal', 'read/readFile', 'read/terminalSelection', 'read/terminalLastCommand', 'edit/createFile', 'edit/editFiles', 'web/fetch', 'todo']
description: 'Create Obsidian-ready notes from a raw MD/MDX URL with versioned front matter, per-section files, and linked release note URLs.'
---

# Task: Split MD/MDX into Obsidian notes

## Always ask before execution
* Prompt first: "Provide the raw Markdown/MDX URL for the source file."  
* Do not fetch or process until a URL is supplied and confirmed.

## Inputs (ask if missing)
* **Source URL**: raw MD/MDX URL or blog URL (will be converted automatically)
* **Destination mode**: `"write"` or `"prepare"`  
  * `"write"`: save files into the local repository.  
  * `"prepare"`: output notes in fenced Markdown blocks for manual copy.
* **Destination path**: `30 Life & Work/Snippets/Astro/`
* **Filename pattern**: `{title}.md` — the file name is the note title exactly as in front matter, with spaces and uppercase letters allowed, and no space before `.md`.
* **Ignore sections (exact match, case-insensitive)**: `["Other improvements","Bug Fixes","Community"]`

## Finding the content

If a blog URL (e.g. https://astro.build/blog/<slug>/) is provided instead of a raw MD/MDX URL, convert it to the corresponding GitHub source file:

https://github.com/withastro/astro.build/blob/main/src/content/blog/<slug>.mdx

Then transform it into its raw equivalent:

https://raw.githubusercontent.com/withastro/astro.build/main/src/content/blog/<slug>.mdx

Use this raw URL as the **Source URL** for fetching content.

## URL conversion rule
If the **source URL** matches this pattern:
```

[https://raw.githubusercontent.com/withastro/astro.build/refs/heads/main/src/content/blog/](https://raw.githubusercontent.com/withastro/astro.build/refs/heads/main/src/content/blog/)<slug>.mdx

```
convert it to:
```

[https://astro.build/blog/](https://astro.build/blog/)<slug>/

````
and assign that URL to the front matter key `releasenotes`.

Otherwise, use the source URL unchanged as `releasenotes`.

## Parsing rules
1. **Fetch** the raw Markdown/MDX content. Abort on non-200.
2. **Extract title**:  
   * Use the first `# ` heading or `title` from front matter.  
   * Extract the version number (e.g. `'Astro 5.15' → 5.15`).  
   * Ask user for clarification if not found.
2.5. **Extract created date**:
   * Use `publishDate` from the original front matter as the value for `created` in every generated note.
   * Normalise the timestamp to 12:00:00 on that date.
   * Use UTC output format like `2026-04-08T12:00:00Z`.
   * If `publishDate` is missing or cannot be parsed, use the current date and normalise it to 12:00:00 UTC.
3. **Split sections** by level-2 headings (`## `).
4. **Ignore first section** if it appears to summarise the post (keywords: "in this release", "summary", "overview").
5. **Per-section note**:
   * Note title = section heading.  
   * Note content = Obsidian image embed for the downloaded `coverImage` first, then the section body unchanged.
   * YAML front matter:
     ```yaml
     ---
     title: "<Section Title>"
     version: "<semver like 5.15>"
     releasenotes: "<converted URL>"
     tags: ["astro","release-notes","agent/$FILENAME"]
     created: "<ISO8601 timestamp>"
     ---
     ```
     *`$FILENAME` must automatically reflect the current filename of this agent file (without extension `.prompt.md`). If automation is not available in the runtime, notify the user to update it manually.*
6. **Ignore sections**:
   * If title matches ignore list.
   * If >60% of content lines start with `-`, `*`, or numbers → likely aggregated list, skip.
6.5. **Handle cover image**:
   * Read `coverImage` from the original front matter.
   * Download that image exactly once.
   * Save it under `Meta/resources` relative to the Obsidian vault root.
   * Reuse that same file in every generated section note.
   * Insert an Obsidian image embed at the beginning of each generated note, directly after the front matter and before the section content.
   * If `coverImage` is missing, skip image download and embedding.
7. **Output**:
   * `"write"`: write markdown files under `30 Life & Work/Snippets/Astro/` using the **exact title** as filename (`<Title>.md`).
   * `"prepare"`: output in fenced code blocks, prefixed by filename.

## Reporting
After completion:
* List all generated files.
* Report the downloaded cover image path or state that no `coverImage` was present.
* Report ignored sections and reason (summary / aggregated / explicitly ignored).
* Confirm applied `releasenotes` URL.

## Error handling
* If version cannot be parsed → ask user for manual version.
* If file retrieval fails → show clear message.
* If no sections found → suggest fallback to `#` level or manual split.

## Example front matter
```yaml
---
title: "New build pipeline improvements"
version: "5.15"
releasenotes: "https://astro.build/blog/astro-5150/"
tags: ["astro","release-notes","agent/create-obsidian-notes"]
created: "2026-04-08T12:00:00Z"
---
````

**Filename:**
`New build pipeline improvements.md`

## Execution summary

1. Ask for raw URL and mode.
2. Fetch file.
3. Derive readable blog URL → assign to `releasenotes`.
4. Parse title/version.
5. Split and filter sections.
6. Generate per-section notes.
7. Report summary and ignored sections.

## User prompt

"Please provide the raw Markdown/MDX URL and choose destination mode (write or prepare)."
