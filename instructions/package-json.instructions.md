---
description: Instructions for keeping package.json deterministic and synchronised with npm lockfiles.
applyTo: "**/package.json"
---

# package.json instructions

When editing `package.json`, keep the manifest deterministic, sorted, and synchronised with `package-lock.json`.

## Package manager

Use npm only.

Do not use Yarn, pnpm, Bun, or mixed package-manager lockfiles unless explicitly instructed.

After any meaningful `package.json` change, run `npm install` so `package-lock.json` is updated.

## Required fields

Ensure these fields are present and set to correct project values:

* `name`
* `description`
* `version`
* `license`
* `type`

Do not invent misleading values.

If a required value is unknown, stop and report the missing field instead of guessing.

## Dependency version policy

Use fixed static versions for npm dependency versions.

Allowed:

```json
"some-package": "1.0.0"
```

Not allowed:

```json
"some-package": "^1.0.0"
"some-package": "~1.0.0"
"some-package": ">=1.0.0"
"some-package": ">1.0.0"
"some-package": "<=1.0.0"
"some-package": "*"
"some-package": "latest"
```

Apply this policy to:

* `dependencies`
* `devDependencies`
* `optionalDependencies`

For `peerDependencies`, do not change existing ranges unless explicitly instructed. If adding a new peer dependency, report whether the project wants a fixed peer version or a compatibility range.

When installing packages, prefer exact versions:

```bash
npm install --save-exact package-name@1.0.0
npm install --save-dev --save-exact package-name@1.0.0
```

## fixpack workflow

After any `package.json` change, run `fixpack` twice.

Use:

```bash
npx fixpack package.json
npx fixpack package.json
```

The first run is allowed to modify `package.json`.

A non-zero exit code on the first run does not automatically mean the task failed. It can mean `fixpack` found and corrected manifest ordering, formatting, or required-field issues.

The second run is the validation run.

If the second run fails:

1. Inspect the `fixpack` output.
2. Identify the exact manifest issue.
3. Fix the issue.
4. Run `fixpack` twice again.
5. If the second run still fails, report the exact failure and include the relevant error output.

## Required sequence after changes

After editing `package.json`, run:

```bash
npx fixpack package.json
npx fixpack package.json
npm install
npx fixpack package.json
npx fixpack package.json
```

If `npm install` fails, fix only issues directly related to the package manifest or lockfile change.

If `npm install` changes `package.json`, repeat the full sequence.

## Final state

Before finishing, verify:

* `package.json` has been normalised by `fixpack`
* the second `fixpack` run passes
* dependency versions are fixed static versions where required
* required fields are present and meaningful
* `package-lock.json` is updated
* `npm install` succeeds
* no unrelated manifest, dependency, or lockfile changes were introduced
