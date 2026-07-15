---
id: dnb-tumblr-refresh-token
name: dnb-tumblr-refresh-token
title: DNB Tumblr Refresh Token
description: Create or refresh Tumblr OAuth2 credentials for the dnb-post-link-into-void direct Tumblr poster using a local loopback callback server. Use when Tumblr posting is missing TUMBLR_ACCESS_TOKEN, TUMBLR_REFRESH_TOKEN, or TUMBLR_BLOG_IDENTIFIER, when the Tumblr token has expired, or when the user asks to generate Tumblr credentials for dnb-post-link-into-void.
---

Generate or refresh Tumblr OAuth2 credentials for the
`dnb-post-link-into-void` Tumblr publisher without exposing tokens in chat or
terminal output.

## Bare invocation

If the user invokes `dnb-tumblr-refresh-token` without more context, explain
that the skill can be used directly or as a sub-skill from
`dnb-post-link-into-void`, but the bundled script is not conversational. Tell
the user that a direct run opens Tumblr in the browser, waits for the local
callback, writes token values to `~/.env` only when `--write-env` is used, and
never prints tokens or authorization codes.

Show this command shape:

```bash
node skills/70-content-design-and-voice/dnb-tumblr-refresh-token/scripts/create-tumblr-refresh-token.ts \
  --write-env
```

Then ask whether the user wants to run the setup now.

## Safety model

Never print, paste, summarise, or otherwise reveal `TUMBLR_ACCESS_TOKEN`,
`TUMBLR_REFRESH_TOKEN`, `TUMBLR_CONSUMER_SECRET`, short-lived access tokens, or
authorization codes.

Use the bundled script:

```bash
node skills/70-content-design-and-voice/dnb-tumblr-refresh-token/scripts/create-tumblr-refresh-token.ts
```

The script enforces the core safety checks:

- loopback-only redirect URI: `http://127.0.0.1`, `http://localhost`, or
  `http://[::1]`
- per-run random OAuth `state` with callback verification
- no token printing
- explicit `--write-env` before requesting or refreshing a token
- private dotenv permissions; refuses to write if the file is group/other
  readable unless `--fix-permissions` is passed
- one local callback request, then server shutdown

## Required Tumblr app setup

The user needs a Tumblr app at:

```text
https://www.tumblr.com/oauth/apps
```

Register this OAuth2 redirect URI unless the user chooses a different loopback
URI:

```text
http://127.0.0.1:8767/callback
```

Tumblr requires the redirect URI in the authorization request to match the app
registration exactly, including host, port, path, and trailing slash. If
Tumblr shows a redirect URI error, ask the user for the registered redirect
URI and rerun with `--host`, `--port`, `--callback-path`, or `--redirect-uri`.

Existing required app credentials in `~/.env`:

- `TUMBLR_CONSUMER_KEY`
- `TUMBLR_CONSUMER_SECRET`

Values created or refreshed by this helper:

- `TUMBLR_ACCESS_TOKEN`
- `TUMBLR_REFRESH_TOKEN`
- `TUMBLR_ACCESS_TOKEN_EXPIRES_AT`
- `TUMBLR_BLOG_IDENTIFIER`

Default scopes:

```text
basic write offline_access
```

## Workflow

1. Confirm the user wants to write to `~/.env`. Writing outside the repository
   requires explicit approval in sandboxed Codex sessions.
2. Run the helper with existing dotenv values:

   ```bash
   node skills/70-content-design-and-voice/dnb-tumblr-refresh-token/scripts/create-tumblr-refresh-token.ts \
     --write-env
   ```

3. If the browser cannot open, rerun with `--no-open` and ask the user to open
   the printed authorization URL manually. The URL must not contain secrets.
4. After Tumblr redirects to the local callback page, report only the safe
   summary printed by the script: dotenv path, updated key names, blog
   identifier, and expiry time.
5. Verify the posting skill sees Tumblr as configured:

   ```bash
   node skills/70-content-design-and-voice/dnb-post-link-into-void/resources/post-crosspost.ts --info
   ```

Do not include any token in the final answer. If setup succeeds, say that
`TUMBLR_ACCESS_TOKEN`, `TUMBLR_REFRESH_TOKEN`, and `TUMBLR_BLOG_IDENTIFIER`
are stored and Tumblr is configured.

## Refreshing an existing token

If `TUMBLR_REFRESH_TOKEN` already exists, refresh without opening a browser:

```bash
node skills/70-content-design-and-voice/dnb-tumblr-refresh-token/scripts/create-tumblr-refresh-token.ts \
  --write-env \
  --refresh-existing
```

If the refresh fails because the refresh token is invalid, rerun the normal
browser OAuth flow.

## Options

Use these when defaults do not match the Tumblr app:

```bash
--consumer-key "<key>"
--consumer-secret "<secret>"
--host "localhost"
--port 8080
--callback-path "/callback"
--redirect-uri "http://127.0.0.1:8767/callback"
--scope "basic write offline_access"
--blog-identifier "<blog-name-or-uuid>"
--dotenv "~/.env"
--refresh-existing
--fix-permissions
--no-open
```

Use `--fix-permissions` only when the user agrees to chmod the dotenv file to
`0600`.
