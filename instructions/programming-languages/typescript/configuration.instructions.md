---
description: TypeScript configuration baseline
applyTo: "**/tsconfig*.json"
---

Use these instructions when creating or reviewing TypeScript configuration.

## TR014 - Compiler Settings

TypeScript configuration must prioritise:

- strict type safety
- predictable module behaviour
- compatibility with modern runtimes
- minimal implicit behaviour

## Recommended Baseline

Use this template as the starting point for new repositories:

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "moduleResolution": "bundler",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noPropertyAccessFromIndexSignature": true,
    "useUnknownInCatchVariables": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "noEmit": true
  }
}
```

Do not weaken strictness to make errors disappear. Fix the code, improve the model, or validate the data.

## Required Compiler Flags

Repositories adopting these instructions must enable:

- `strict`
- `noImplicitAny`
- `strictNullChecks`
- `exactOptionalPropertyTypes`
- `noUncheckedIndexedAccess`
- `useUnknownInCatchVariables`

These settings enforce strong typing discipline.

## Module System

Repositories must use:

```json
{
  "compilerOptions": {
    "module": "esnext"
  }
}
```

They must not configure CommonJS output.

## Bundler Resolution

Projects using modern bundlers should use:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler"
  }
}
```

This improves compatibility with modern toolchains.

## Optional Settings

Repositories may include additional options such as:

- `allowJs`
- `jsx`
- framework plugins
- path aliases

These options are repository-specific and should be documented locally.

## Standalone Scripts

Some repositories include standalone scripts.

If these scripts require different compilation settings, they may use a local `tsconfig`.

However, TypeScript quality rules from `typescript-programming.instructions.md` still apply.

## Repository Overrides

Repositories may override configuration when required by:

- runtime constraints
- frameworks
- build tools

Overrides must be documented.

Strictness flags must not be disabled without justification.
