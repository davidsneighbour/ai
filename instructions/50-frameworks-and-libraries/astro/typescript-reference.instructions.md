---
description: Type reference and official documentation pointers for TypeScript in Astro 5+ projects.
applyTo: "**/*.astro"
references:
  - name: Astro documentation
    src: https://docs.astro.build
  - name: Astro docs (llms.txt)
    src: https://docs.astro.build/llms.txt
  - name: Astro docs (llms-full.txt)
    src: https://docs.astro.build/llms-full.txt
---

# Astro TypeScript reference

This file is a lookup reference for Astro's built-in type utilities. For
rules on how to use them, see `typescript.instructions.md` in this
directory; for generic TypeScript rules that also apply to `.astro` files,
see `instructions/40-languages-and-runtimes/typescript/`.

The authoritative source is the
[official Astro docs](https://docs.astro.build). They publish `llms.txt`
and `llms-full.txt` versions for AI consumption, and an official MCP
server for up-to-date lookups:

```json
"mcpServers": {
  "Astro docs": {
    "type": "http",
    "url": "https://mcp.docs.astro.build/mcp"
  }
}
```

## Built-in HTML attributes

Astro provides the `HTMLAttributes` type to check that markup uses valid
HTML attributes, and to build matching component props. For example, a
`<Link>` component can mirror the default attributes of an `<a>` tag:

`src/components/Link.astro`:

```astro
---
import type { HTMLAttributes } from "astro/types";
// As a type alias:
type Props = HTMLAttributes<"a">;
// Or extended with an interface:
interface Props extends HTMLAttributes<"a"> {
  myProp?: boolean;
}
const { href, ...attrs } = Astro.props;
---
<a href={href} {...attrs}>
  <slot />
</a>
```

## `ComponentProps` type

Added in `astro@4.3.0`.

`ComponentProps` references the `Props` accepted by another component, even
when that component does not export its `Props` type directly.

`src/pages/index.astro`:

```astro
---
import type { ComponentProps } from "astro/types";
import Button from "./Button.astro";
type ButtonProps = ComponentProps<typeof Button>;
---
```

## Polymorphic type

Added in `astro@2.5.0`.

Use `Polymorphic` to build a component that can render as different HTML
elements with full type safety, for example a `<Link>` that renders as
either `<a>` or `<button>` depending on its props. `HTMLTag` constrains the
`as` prop to a valid HTML element.

```astro
---
import type { HTMLTag, Polymorphic } from "astro/types";
type Props<Tag extends HTMLTag> = Polymorphic<{ as: Tag }>;
const { as: Tag, ...props } = Astro.props;
---
<Tag {...props} />
```

## Inferring `getStaticPaths()` types

Added in `astro@2.1.0`.

Use `InferGetStaticParamsType` for the type of `Astro.params`,
`InferGetStaticPropsType` for the type of `Astro.props`, or `GetStaticPaths`
to infer both at once.

`src/pages/posts/[...id].astro`:

```ts
import type {
  InferGetStaticParamsType,
  InferGetStaticPropsType,
  GetStaticPaths,
} from "astro";

export const getStaticPaths = (async () => {
  const posts = await getCollection("blog");
  return posts.map((post) => {
    return {
      params: { id: post.id },
      props: { draft: post.data.draft, title: post.data.title },
    };
  });
}) satisfies GetStaticPaths;

type Params = InferGetStaticParamsType<typeof getStaticPaths>;
type Props = InferGetStaticPropsType<typeof getStaticPaths>;

const { id } = Astro.params as Params;
const { title } = Astro.props;
```
