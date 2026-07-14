---
description: CommonMark syntax rules to apply when writing or reviewing Markdown files.
applyTo: "**/*.md"
references:
  - name: CommonMark specification 0.31.2
    src: https://spec.commonmark.org/0.31.2/
---

# CommonMark Markdown

Apply these rules when writing or reviewing `.md` files. This is the base
Markdown syntax; it says nothing about GitHub-specific extensions such as
tables or task lists. If the target renders through GitHub, a static site
generator, or any other GFM-compatible engine, also read
`markdown-gfm.instructions.md`, which extends this file rather than repeating
it. Use this file alone only when the target is a strict CommonMark renderer
that does not support GFM extensions.

## Preliminaries

- A line ends at a newline (`U+000A`), carriage return (`U+000D`), or end of
  file. A blank line contains only spaces or tabs.
- Tabs behave as 4-space tab stops for block structure but are not expanded
  in content.
- Replace `U+0000` with the replacement character `U+FFFD`.
- **Backslash escapes**: `\` before any ASCII punctuation character renders
  the literal character. Not recognized in code spans, code blocks, or
  autolinks.
- **Entity and numeric character references**: `&amp;`, `&#123;`, `&#x7B;`,
  valid HTML5 entities only. Not recognized in code spans or code blocks.
  Cannot replace structural characters.

## Leaf blocks

- **Thematic breaks**: 3+ matching `-`, `_`, or `*` characters on a line with
  0-3 spaces indent. Only spaces or tabs allowed on the line otherwise. Can
  interrupt a paragraph.
- **ATX headings**: 1-6 `#` characters followed by a space or end of line.
  Optional closing `#` sequence, preceded by a space. 0-3 spaces indent
  allowed.
- **Setext headings**: text underlined with `=` (level 1) or `-` (level 2).
  Cannot interrupt a paragraph; a blank line is required after a preceding
  paragraph.
- **Indented code blocks**: lines indented 4+ spaces. Cannot interrupt a
  paragraph. Content is literal text, not parsed as Markdown.
- **Fenced code blocks**: open with 3+ backticks or tildes, without mixing.
  The closing fence must use the same character with at least the same
  count. An info string after a backtick fence cannot contain backticks.
  Specify a language identifier after the opening fence. Content is literal
  text.
- **HTML blocks**: seven types, defined by start and end tag conditions.
  Types 1-5 end at their matching end pattern. Type 6 ends at a blank line.
  Type 7 cannot interrupt a paragraph and ends at a blank line.
- **Link reference definitions**: `[label]: destination "title"`.
  Case-insensitive label matching, Unicode case fold. The first definition
  wins for duplicate labels. Cannot interrupt a paragraph.
- **Paragraphs**: consecutive non-blank lines not interpretable as other
  block constructs. Leading spaces up to 3 are stripped.
- **Blank lines**: ignored between blocks; determine whether a list is tight
  or loose.

## Container blocks

- **Block quotes**: lines prefixed with `>`, optionally followed by a space.
  Lazy continuation is allowed for paragraph text only. A blank line
  separates consecutive block quotes.
- **List items**: bullet markers (`-`, `+`, `*`) or ordered markers (1-9
  digits plus `.` or `)`). The content column is determined by marker width
  plus spaces to the first non-whitespace character, 1-4 spaces after the
  marker. Sublists must be indented to the content column. An ordered list
  interrupting a paragraph must start with `1`.
- **Lists**: a sequence of same-type list items. Changing the bullet
  character or ordered delimiter starts a new list. A list is loose if any
  item is separated by a blank line.

## Inlines

- **Code spans**: backtick-delimited inline code. Line endings convert to
  spaces. Leading and trailing space is stripped when both are present,
  unless the content is all spaces. Backslash escapes are literal inside
  code spans.
- **Emphasis and strong emphasis**: `*`/`_` for `<em>`, `**`/`__` for
  `<strong>`. `_` is not allowed for intraword emphasis. Left-flanking and
  right-flanking delimiter run rules apply. The delimiter run length sum must
  not be a multiple of 3 when one delimiter can both open and close, unless
  both lengths are multiples of 3.
- **Links**: inline `[text](url "title")` or reference `[text][label]` /
  `[text][]` / `[text]`. Link text may contain inlines but not other links.
  A destination in `<...>` allows spaces; without angle brackets, balanced
  parentheses are allowed. No whitespace between link text and `(` or `[`.
- **Images**: `![alt](src "title")`, the same syntax as links prefixed with
  `!`. Alt text is the plain-string content of the description.
- **Autolinks**: `<URI>` or `<email>` in angle brackets. The scheme must be
  2-32 characters starting with an ASCII letter. Bare URLs are not
  auto-linked in CommonMark; that requires angle brackets or a GFM
  extension.
- **Raw HTML**: open and close tags, comments (`<!--` ... `-->`), processing
  instructions (`<?` ... `?>`), declarations (`<!` ... `>`), and CDATA
  (`<![CDATA[` ... `]]>`) pass through as literal HTML.
- **Hard line breaks**: two or more trailing spaces, or `\` before a line
  ending. Not recognized in code spans or HTML tags. Does not work at the end
  of a block.
- **Soft line breaks**: a line ending not preceded by two or more spaces or
  `\`. Renders as a space in browsers.

## Validation checklist

- ATX headings use 1-6 `#` followed by a space.
- Fenced code blocks specify a language identifier and use matching fence
  characters and counts.
- Backtick fence info strings do not contain backtick characters.
- Indented code blocks are preceded by a blank line; they cannot interrupt a
  paragraph.
- Emphasis uses `*` for intraword emphasis; `_` only at word boundaries.
- Links use `[text](url)` or reference syntax with no whitespace before `(`
  or `[`.
- Images include non-empty alt text.
- Autolinks use angle brackets (`<URL>`); bare URLs are not CommonMark
  autolinks without a GFM extension.
- No unbalanced parentheses in bare link destinations; use `<...>` or
  escape them.
- HTML block type 7 (custom or inline-level tags) is preceded by a blank
  line when it follows a paragraph.
