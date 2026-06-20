---
applyTo: "**/package.json"
---

# package.json maintenance instructions

When editing any `package.json`, treat it as an npm package manifest and keep it normalised, sorted, and lockfile-synchronised.

## Package manager

* Use npm only.
* After changing `package.json`, run `npm install` to update `package-lock.json`.
* Do not leave `package.json` and `package-lock.json` out of sync.
* Fix any install issues that are directly caused by the manifest changes.

## Required package fields

Ensure these fields are present and set to appropriate project values:

* `license`
* `type`
* `version`
* `description`

Do not invent misleading values. If the correct value is unknown, report that the field needs a project decision instead of guessing.

## Dependency version policy

Use fixed static versions for npm dependencies.

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

Apply this to dependency sections such as:

* `dependencies`
* `devDependencies`
* `optionalDependencies`
* `peerDependencies`

When adding or updating packages, pin the exact installed version.

## fixpack workflow

After every change to `package.json`, run `fixpack` twice.

Preferred command:

```bash
npx fixpack package.json
npx fixpack package.json
```

If a local script or local binary is available, using `fixpack` directly is also acceptable:

```bash
fixpack package.json
fixpack package.json
```

The first run may modify `package.json` by sorting, formatting, or linting the manifest. If the first run exits with an error code because it changed the file, do not treat that alone as a failure.

The second run is the validation run. It should pass without further changes.

If the second run fails:

1. Inspect the reported `package.json` issue.
2. Fix manifest ordering, formatting, missing required fields, invalid values, or dependency version ranges as needed.
3. Run `fixpack` again twice.
4. If the second run still fails, report the exact issue and the relevant error output.

## Required validation sequence

After modifying `package.json`, run this sequence:

```bash
npx fixpack package.json
npx fixpack package.json
npm install
```

If `npm install` changes `package.json` again, rerun:

```bash
npx fixpack package.json
npx fixpack package.json
npm install
```

Final state must include:

* `package.json` sorted and normalised by `fixpack`
* fixed dependency versions, not ranges
* required fields present
* `package-lock.json` updated
* no unresolved `fixpack` failure on the second run
* no unresolved `npm install` failure
