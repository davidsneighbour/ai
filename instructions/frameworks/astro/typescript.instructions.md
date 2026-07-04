---
description: Astro-specific TypeScript rules that extend the generic TypeScript instructions for Astro 5+ projects.
applyTo: "**/*.ts, **/*.astro"
---

# Astro TypeScript rules

These rules extend the generic TypeScript instructions
(`instructions/programming-languages/typescript/`) with Astro-specific
practice. They apply to projects built with Astro 5+.

## Astro integration

Integrate TypeScript with Astro through content collections,
framework-provided types, and explicit imports. Avoid ad-hoc typing where an
official Astro type already exists.

## Content collections

- Prefer `CollectionEntry` types from `astro:content`.
- Do not manually reconstruct collection shapes.
- Narrow collection data before use.

```ts
import type { CollectionEntry } from 'astro:content'
```

## Frontmatter and data

Do not assume frontmatter values are correctly typed. Validate or narrow
them before use.

Avoid `Record<string, unknown>` unless the structure is genuinely dynamic.

## Component props

Type Astro component props explicitly.

```ts
interface Props {
  title: string
}
```

Validate or narrow props that originate from frontmatter.

## Image handling

Import types such as `ImageMetadata` explicitly when using Astro's image
tooling. Do not rely on implicit types.

## Client and server separation

Astro projects mix server and browser logic. Keep server-side logic and
client-side behaviour clearly separated. Browser APIs must not appear in
server-only contexts.

## Page transitions

When a project uses Astro's client-side navigation, re-register DOM event
listeners after each navigation using the `astro:page-load` lifecycle
event. Scripts that attach listeners once and never re-run will silently
stop working after the first client-side navigation.

## Deprecated patterns

Use modern Astro 5+ idioms and APIs. Do not carry forward patterns from
earlier Astro versions once a current equivalent exists.

## Imports

Prefer configured path aliases (for example `@utils/...`) over long
relative paths.

## Maintainability

Do not embed business logic deeply inside `.astro` templates. Move complex
behaviour into typed helper modules.
