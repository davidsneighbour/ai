---
name: prompts-40-languages-and-runtimes-node-cli-output-input
description: Implement a reusable CLI UI layer using picocolors for colour output and @clack/prompts for interactive prompts, centralised behind a single module.
---

# Implement CLI UI helpers with picocolors and @clack/prompts

You are working on an npm package that contains Node.js and TypeScript CLI scripts.

Implement a small reusable CLI UI layer using:

- `picocolors` for colour output
- `@clack/prompts` for interactive prompts

The goal is to avoid using external CLI tools such as `gum` and to keep dependencies minimal, TypeScript-friendly, configurable, and easy to replace later.

## Requirements

- Use TypeScript.
- Use ESM syntax.
- Do not use `any`.
- Use strict typing.
- Use `unknown` with proper error narrowing in catch blocks.
- Keep the implementation small and reusable.
- Add JSDoc documentation to all exported functions and helper functions.
- Do not import `picocolors` or `@clack/prompts` directly throughout the package.
- Centralise all CLI UI logic in one module, for example `src/lib/cli-ui.ts`.
- Scripts should import the local CLI UI helper instead of importing third-party prompt or colour packages directly.
- Support colour fallback behaviour.
- Support `NO_COLOR` by default through `picocolors`.
- Support explicit colour modes:
  - `"auto"`
  - `"always"`
  - `"never"`
- Support configurable output prefixing, for example `[package-name]`.
- Handle prompt cancellation explicitly.
- Exit with a non-zero status code on cancelled interactive operations unless the calling script handles cancellation itself.
- Print useful error messages.
- Do not leave empty catch blocks.
- Do not silently ignore failures.

## Dependencies

Install the required dependencies:

```bash
npm install --save picocolors @clack/prompts
```

## Implementation target

Create a reusable module at:

`src/lib/cli-ui.ts`

The module MUST expose a `createCliUi()` function.

The helper SHOULD provide at least these methods:

- `info(message: string): void`
- `success(message: string): void`
- `warn(message: string): void`
- `error(message: string): void`
- `intro(message: string): void`
- `outro(message: string): void`
- `askText(options): Promise<string>`
- `askConfirm(options): Promise<boolean>`
- `askSelect<T extends string>(message, options): Promise<T>`

## Suggested implementation

```ts
import pc, { createColors } from "picocolors";
import { cancel, confirm, intro, isCancel, outro, select, text } from "@clack/prompts";

export type ColourMode = "auto" | "always" | "never";

export interface CliUiOptions {
  readonly colour?: ColourMode;
  readonly prefix?: string;
}

export interface SelectOption<T extends string> {
  readonly value: T;
  readonly label: string;
  readonly hint?: string;
}

export interface TextInputOptions {
  readonly message: string;
  readonly placeholder?: string;
  readonly defaultValue?: string;
  readonly required?: boolean;
}

export interface ConfirmInputOptions {
  readonly message: string;
  readonly initialValue?: boolean;
}

/**
 * Creates a reusable CLI UI helper for colour output and interactive prompts.
 *
 * @param options - CLI UI configuration.
 * @returns A configured CLI UI helper.
 *
 * @example
 * const ui = createCliUi({ colour: "auto", prefix: "my-package" });
 * ui.info("Preparing files...");
 */
export function createCliUi(options: CliUiOptions = {}) {
  const colourMode = options.colour ?? "auto";

  const colours = createColors(colourMode === "always" ? true : colourMode === "never" ? false : pc.isColorSupported);

  const prefix = options.prefix ? colours.dim(`[${options.prefix}]`) : "";

  /**
   * Adds the configured prefix to a message.
   *
   * @param message - Message to format.
   * @returns The prefixed message.
   */
  function withPrefix(message: string): string {
    return prefix.length > 0 ? `${prefix} ${message}` : message;
  }

  /**
   * Handles cancelled prompts consistently.
   *
   * @returns Never returns. Exits the process.
   */
  function handleCancel(): never {
    cancel("Operation cancelled.");
    process.exit(1);
  }

  return {
    colour: colours,

    /**
     * Prints an informational message.
     *
     * @param message - Message to print.
     */
    info(message: string): void {
      console.log(withPrefix(colours.cyan(message)));
    },

    /**
     * Prints a success message.
     *
     * @param message - Message to print.
     */
    success(message: string): void {
      console.log(withPrefix(colours.green(message)));
    },

    /**
     * Prints a warning message.
     *
     * @param message - Message to print.
     */
    warn(message: string): void {
      console.warn(withPrefix(colours.yellow(message)));
    },

    /**
     * Prints an error message.
     *
     * @param message - Message to print.
     */
    error(message: string): void {
      console.error(withPrefix(colours.red(message)));
    },

    /**
     * Starts an interactive CLI section.
     *
     * @param message - Intro message.
     */
    intro(message: string): void {
      intro(withPrefix(message));
    },

    /**
     * Ends an interactive CLI section.
     *
     * @param message - Outro message.
     */
    outro(message: string): void {
      outro(withPrefix(message));
    },

    /**
     * Asks the user for text input.
     *
     * @param inputOptions - Text prompt options.
     * @returns The entered text.
     */
    async askText(inputOptions: TextInputOptions): Promise<string> {
      const result = await text({
        message: inputOptions.message,
        placeholder: inputOptions.placeholder,
        defaultValue: inputOptions.defaultValue,
        validate(value) {
          if (inputOptions.required === true && value.trim().length === 0) {
            return "This value is required.";
          }

          return undefined;
        },
      });

      if (isCancel(result)) {
        handleCancel();
      }

      return result;
    },

    /**
     * Asks the user for yes/no confirmation.
     *
     * @param inputOptions - Confirmation prompt options.
     * @returns The selected boolean value.
     */
    async askConfirm(inputOptions: ConfirmInputOptions): Promise<boolean> {
      const result = await confirm({
        message: inputOptions.message,
        initialValue: inputOptions.initialValue ?? true,
      });

      if (isCancel(result)) {
        handleCancel();
      }

      return result;
    },

    /**
     * Asks the user to select one option.
     *
     * @param message - Prompt message.
     * @param options - Selectable options.
     * @returns The selected option value.
     */
    async askSelect<T extends string>(message: string, options: readonly SelectOption<T>[]): Promise<T> {
      const result = await select({
        message,
        options: options.map((option) => ({
          value: option.value,
          label: option.label,
          hint: option.hint,
        })),
      });

      if (isCancel(result)) {
        handleCancel();
      }

      return result;
    },
  };
}
```

## Usage pattern

Use the helper in scripts instead of importing `picocolors` or `@clack/prompts` directly.

Example:

```ts
import { createCliUi } from "./lib/cli-ui.js";

const ui = createCliUi({
  colour: "auto",
  prefix: "my-package",
});

try {
  ui.intro("Package setup");

  const packageName = await ui.askText({
    message: "Package name?",
    placeholder: "@davidsneighbour/my-package",
    required: true,
  });

  const mode = await ui.askSelect("Setup mode?", [
    {
      value: "minimal",
      label: "Minimal",
      hint: "Only required files",
    },
    {
      value: "full",
      label: "Full",
      hint: "Recommended defaults",
    },
  ] as const);

  const confirmed = await ui.askConfirm({
    message: `Create ${packageName} using ${mode} mode?`,
    initialValue: true,
  });

  if (!confirmed) {
    ui.warn("No files changed.");
    process.exit(0);
  }

  ui.success("Setup completed.");
  ui.outro("Done.");
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  ui.error(message);
  process.exit(1);
}
```

## CLI configuration

If the package already has CLI flags or configuration handling, wire colour mode into it.

Recommended flag:

```txt
--colour=auto|always|never
```

Accepted spelling:

```txt
--color=auto|always|never
```

Internally prefer the British spelling `colour`.

The default MUST be:

```ts
"auto";
```

## Design rules

- Keep this helper boring and stable.
- Do not turn it into a full TUI framework.
- Do not add more dependencies unless there is a specific need.
- Keep all third-party prompt and colour usage behind the wrapper.
- Add new prompt types only when the package actually needs them.
- Prefer explicit methods over passing raw `@clack/prompts` options through the whole codebase.
- Keep cancellation handling consistent.
- Keep output readable when colours are disabled.
- Ensure all scripts still work in non-colour terminals and CI environments.

## Validation checklist

After implementation, verify:

- `npm run typecheck` passes.
- No `any` types were introduced.
- No empty catch blocks were introduced.
- `NO_COLOR=1 node ./path/to/script.js` disables colours.
- `--colour=never` disables colours if CLI flag support exists.
- `--colour=always` forces colours if CLI flag support exists.
- Prompt cancellation exits cleanly.
- Error output is readable.
- Non-interactive output remains useful without colours.
