---
description: TypeScript, JavaScript, Vitest, and Playwright testing instructions
applyTo: "**/*.{test,spec}.{ts,tsx,js,mjs,cjs},tests/**/*.{ts,tsx,js,mjs,cjs}"
---

# TypeScript and JavaScript testing

Use these instructions when creating or reviewing Vitest or Playwright tests in TypeScript or JavaScript projects.

## General Test Rules

Write tests for new features and bug fixes. Tests should cover edge cases, error handling, and the observable behaviour users or callers depend on.

Never change production code only to make it easier to test. Test the original behaviour through public APIs, visible UI, or stable integration boundaries.

Use descriptive test names that explain the behaviour under test.

## JavaScript And Node.js

For JavaScript files:

- Use ES2022 features and Node.js 20 or newer.
- Use ESM modules.
- Prefer Node.js built-in modules over new dependencies.
- Ask before adding a dependency when the requirement is unclear.
- Use `async` and `await` for asynchronous code.
- Prefer `node:util` promisification over callback-style control flow.
- Prefer functions over classes unless stateful objects are clearly useful.
- Use `undefined` for optional values unless an API explicitly requires `null`.

## Vitest

Use Vitest for unit and integration tests when the repository already uses it or the user asks for it.

Vitest tests should:

- exercise public behaviour rather than implementation details
- include meaningful assertions
- cover error paths
- avoid brittle timing assumptions
- use clear setup helpers when repeated setup obscures the test intent

## Playwright

Use Playwright for browser-level tests.

Start test files with:

```ts
import { expect, test } from "@playwright/test";
```

Prioritise user-facing, role-based locators such as `getByRole`, `getByLabel`, and `getByText`. Use `test.step()` to group meaningful interactions.

Use auto-retrying web-first assertions.

Avoid hard-coded waits and increased default timeouts. Rely on Playwright auto-waiting, specific locators, and assertions that describe the expected state.

## Playwright Test Structure

Group related tests under `test.describe()`. Use `beforeEach` for setup actions common to all tests in a group.

Store Playwright test files in `tests/` unless the repository has a different established convention. Prefer one test file per major application feature or page.

Use file names such as:

```text
login.spec.ts
search.spec.ts
```

## Playwright Assertions

Prefer:

- `toMatchAriaSnapshot` for stable accessibility-tree structure
- `toHaveCount` for element counts
- `toHaveText` for exact text
- `toContainText` for partial text
- `toHaveURL` for navigation results

Avoid `expect(locator).toBeVisible()` unless visibility itself is the behaviour under test.

## Playwright Example

```ts
import { expect, test } from "@playwright/test";

test.describe("Movie search", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://debs-obrien.github.io/playwright-movies-app");
  });

  test("finds a movie by title", async ({ page }) => {
    await test.step("Search by title", async () => {
      await page.getByRole("search").click();
      await page.getByRole("textbox", { name: "Search Input" }).fill("Garfield");
      await page.getByRole("textbox", { name: "Search Input" }).press("Enter");
    });

    await test.step("Verify results", async () => {
      await expect(page.getByRole("main")).toContainText("Garfield");
    });
  });
});
```

## Test Execution Strategy

Run the narrowest meaningful command first, then broaden validation when the change affects shared behaviour.

For Playwright, a first Chromium pass is often enough while iterating:

```sh
npx playwright test --project=chromium
```

Before finalising tests, confirm:

- locators are accessible and specific
- tests are grouped logically
- assertions reflect user expectations
- test names are consistent
- comments explain only non-obvious interactions
