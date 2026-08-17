---
id: dnb-astro-architecture
name: dnb-astro-architecture
title: DNB Astro Architecture
description: Astro development standards and best practices for content-driven, server-first websites (Astro 5+). Use when building, reviewing, or advising on an Astro project - content collections, islands architecture, routing, view transitions, or general project structure. Confirm the project is actually Astro-based (astro.config.mjs, .astro files, or an astro dependency in package.json) before applying; file extensions like .ts, .js, or .md alone do not imply Astro.
references:
  - name: Astro documentation
    src: https://docs.astro.build
---

## Overview

Instructions for building Astro applications that follow the content-driven,
server-first architecture with modern best practices.

## Project context

- Astro 5.x with Islands Architecture and the Content Layer API.
- TypeScript for type safety and auto-generated types.
- Content-driven sites: blogs, marketing, e-commerce, documentation.
- Server-first rendering with selective client-side hydration.
- Support for multiple UI frameworks (React, Vue, Svelte, Solid, etc.).
- Static site generation (SSG) by default, with optional server-side
  rendering (SSR).

## Architecture

- Embrace the Islands Architecture: server-render by default, hydrate
  selectively.
- Organise content with Content Collections for type-safe Markdown/MDX
  management.
- Structure projects by feature or content type for scalability.
- Use component-based architecture with clear separation of concerns.
- Implement progressive enhancement patterns.
- Follow a Multi-Page App (MPA) approach over Single-Page App (SPA)
  patterns.

## TypeScript integration

- Configure `tsconfig.json` with the recommended v5.0 settings:

  ```json
  {
    "extends": "astro/tsconfigs/base",
    "include": [".astro/types.d.ts", "**/*"],
    "exclude": ["dist"]
  }
  ```

- Types are auto-generated in `.astro/types.d.ts` (this replaces
  `src/env.d.ts`).
- Run `astro sync` to generate or update type definitions.
- Define component props with TypeScript interfaces.
- Use the auto-generated types for content collections and the Content
  Layer API.

For TypeScript-specific rules and a type reference, see
`typescript.instructions.md` and `typescript-reference.instructions.md`
under `instructions/50-frameworks-and-libraries/astro/`.

## Component design

- Use `.astro` components for static, server-rendered content.
- Import framework components (React, Vue, Svelte) only when interactivity
  is needed.
- Follow Astro's component script structure: frontmatter at the top,
  template below.
- Use meaningful component names in PascalCase.
- Keep components focused and composable.
- Implement proper prop validation and default values.

## Content collections

### Content Layer API (v5.0+)

- Define collections in `src/content.config.ts` using the Content Layer
  API.
- Use the built-in loaders: `glob()` for file-based content, `file()` for
  single files.

  ```typescript
  import { defineCollection, z } from 'astro:content';
  import { glob } from 'astro/loaders';

  const blog = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
    schema: z.object({
      title: z.string(),
      pubDate: z.date(),
      tags: z.array(z.string()).optional()
    })
  });
  ```

### Legacy collections

- Legacy `type: 'content'` collections are still supported through an
  automatic `glob()` implementation.
- Migrate existing collections by adding an explicit `loader`
  configuration.
- Use type-safe queries with `getCollection()` and `getEntry()`.

## View transitions and client-side routing

- Enable with the `<ClientRouter />` component in the layout head (renamed
  from `<ViewTransitions />` in v5.0).
- Import from `astro:transitions`: `import { ClientRouter } from 'astro:transitions'`.
- Customise transition animations with CSS and `view-transition-name`.
- Use the `transition:persist` directive to preserve island state across
  navigations.

## Performance

- Default to zero JavaScript; only add interactivity where needed.
- Use client directives strategically (`client:load`, `client:idle`,
  `client:visible`).
- Implement lazy loading for images and components.
- Rely on the Content Layer API for faster content loading and builds.
- Minimise bundle size by avoiding unnecessary client-side JavaScript.

## Styling

- Use scoped styles in `.astro` components by default.
- Use CSS preprocessing (Sass, Less) only when needed.
- Use CSS custom properties for theming and design systems.
- Follow mobile-first responsive design.
- Ensure accessibility with semantic HTML and proper ARIA attributes.

## Client-side interactivity

- Use framework components (React, Vue, Svelte) for interactive elements.
- Choose the hydration strategy based on actual user interaction patterns.
- Keep state management within framework boundaries.
- Use Web Components for framework-agnostic interactivity.
- Share state between islands using stores or custom events.

## API routes and SSR

- Create API routes in `src/pages/api/` for dynamic functionality.
- Use the correct HTTP methods and status codes.
- Validate requests and handle errors explicitly.
- Enable SSR mode only where dynamic content actually requires it.
- Handle environment variables securely.

## SEO and meta management

- Implement proper Open Graph and Twitter Card metadata.
- Generate sitemaps automatically.
- Use semantic HTML for accessibility and SEO.
- Implement structured data (JSON-LD) for rich snippets where relevant.

## Image optimisation

- Use Astro's `<Image />` component for automatic optimisation.
- Implement responsive images with proper `srcset` generation.
- Prefer WebP and AVIF for modern browsers.
- Lazy load images below the fold.
- Provide alt text for accessibility.

## Data fetching

- Fetch data at build time in component frontmatter.
- Use dynamic imports for conditional data loading.
- Handle errors for external API calls explicitly.
- Cache expensive operations during the build.
- Use Astro's built-in fetch with automatic TypeScript inference.

## Build and deployment

- Configure deployment for static (SSG) or hybrid (SSR) rendering, as the
  project actually needs.
- Use environment variables for configuration.
- Enable compression and caching for production builds.

## Astro v5.0 changes to account for

- **ClientRouter**: use `<ClientRouter />` instead of `<ViewTransitions />`.
- **TypeScript**: types auto-generate into `.astro/types.d.ts`; run
  `astro sync`.
- **Content Layer API**: use the `glob()` and `file()` loaders.

```typescript
// Content Layer API
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({ title: z.string(), pubDate: z.date() })
});
```

## Development workflow

1. Scaffold with `npm create astro@latest` using the TypeScript template.
2. Configure the Content Layer API with the appropriate loaders.
3. Run `astro sync` to generate types.
4. Build layout components around the Islands Architecture.
5. Implement content pages with SEO and performance in mind.
