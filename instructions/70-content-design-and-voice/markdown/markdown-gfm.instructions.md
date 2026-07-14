---
description: GitHub Flavored Markdown (GFM) extensions to apply on top of CommonMark when the target renders through GitHub or another GFM-compatible engine.
applyTo: "**/*.md"
references:
  - name: GitHub Flavored Markdown Spec
    src: https://github.github.com/gfm/
---

# GitHub Flavored Markdown (GFM)

GFM is a strict superset of CommonMark. Read
`markdown-commonmark.instructions.md` first; it covers the base syntax. This
file documents only what GFM adds or changes on top of that base. Do not
restate the CommonMark rules here when editing this file; add a new
extension section instead.

Apply this file whenever the Markdown target is GitHub itself, a static site
generator, or any other renderer documented as GFM-compatible. If the target
is explicitly a strict CommonMark-only renderer, do not assume these
extensions are available.

## Extensions to leaf blocks

- **Tables**: header row, delimiter row (`---`, `:---:`, `---:`), zero or
  more data rows. Delimit cells with `|`. Escape a literal pipe as `\|`. The
  header and delimiter rows must have matching column count. A table is
  broken at the first blank line or other block-level structure.

## Extensions to container blocks

- **Task list items**: `- [ ]` (unchecked) or `- [x]` (checked) at the start
  of a list item's paragraph. A space between `-` and `[` is required. May be
  nested.

## Extensions to inlines

- **Strikethrough**: `~~text~~`, one or two tildes. Does not span across
  paragraphs. Three or more tildes do not create strikethrough.
- **Autolinks (extension)**: bare `http://`, `https://`, and `www.` URLs, and
  bare email addresses, auto-link without angle brackets. Trailing
  punctuation is excluded; parentheses are balanced. This is in addition to
  the angle-bracket autolinks CommonMark already defines.
- **Disallowed raw HTML**: `<title>`, `<textarea>`, `<style>`, `<xmp>`,
  `<iframe>`, `<noembed>`, `<noframes>`, `<script>`, and `<plaintext>` have
  their leading `<` replaced with `&lt;`, unlike plain CommonMark, which
  passes all raw HTML tags through.

## Validation checklist

- Tables include header and delimiter rows with a matching column count.
  Alignment is set with `:` in the delimiter.
- Task list items have a space between `-` and `[ ]` or `[x]`.
- Strikethrough uses exactly `~~`, not 3 or more tildes.
- No disallowed raw HTML tags (`<script>`, `<style>`, `<title>`,
  `<textarea>`, `<xmp>`, `<iframe>`, `<noembed>`, `<noframes>`,
  `<plaintext>`).
- Everything in `markdown-commonmark.instructions.md`'s checklist still
  applies; GFM does not relax any of it.
