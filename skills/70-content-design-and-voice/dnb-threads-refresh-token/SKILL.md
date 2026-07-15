---
id: dnb-threads-refresh-token
name: dnb-threads-refresh-token
title: DNB Threads Refresh Token
description: Create or refresh a long-lived Threads API access token for the dnb-post-link-into-void direct Threads poster using a local loopback callback server. Use when Threads posting is missing THREADS_ACCESS_TOKEN or THREADS_USER_ID, when the long-lived Threads token has expired or is close to expiring, or when the user asks to generate Threads credentials for dnb-post-link-into-void.
---

Generate or refresh a long-lived Threads API access token for the
`dnb-post-link-into-void` Threads publisher without exposing tokens in chat or
terminal output.

## Bare invocation

If the user invokes `dnb-threads-refresh-token` without more context, explain
that the skill can be used directly or as a sub-skill from
`dnb-post-link-into-void`, but the bundled script is not conversational. Tell
the user that a direct run opens Threads in the browser, waits for the local
callback, writes the token values to `~/.env` only when `--write-env` is used,
and never prints tokens or authorization codes.

Show this command shape:

```bash
node skills/70-content-design-and-voice/dnb-threads-refresh-token/scripts/create-threads-refresh-token.ts \
  --write-env
```

Then ask whether the user wants to run the setup now.

## Safety model

Never print, paste, summarise, or otherwise reveal `THREADS_ACCESS_TOKEN`,
`THREADS_APP_SECRET`, short-lived access tokens, long-lived access tokens, or
authorization codes.

Use the bundled script:

```bash
node skills/70-content-design-and-voice/dnb-threads-refresh-token/scripts/create-threads-refresh-token.ts
```

The script enforces the core safety checks:

- loopback-only redirect URI: `https://127.0.0.1`, `https://localhost`,
  `https://[::1]`, or the same hosts over `http://` when explicitly supplied
- per-run random OAuth `state` with callback verification
- no token printing
- explicit `--write-env` before requesting or refreshing a token
- HTTPS loopback by default with a temporary self-signed certificate, because
  Threads blocks insecure login pages
- private dotenv permissions; refuses to write if the file is group/other
  readable unless `--fix-permissions` is passed
- one local callback request, then server shutdown

## Required Threads app setup

The user needs a Meta app with Threads API enabled. Configure the app's OAuth
redirect URI to match this helper's default, unless the user chooses a
different loopback URI:

```text
https://127.0.0.1:8766/callback
```

Threads requires the redirect URI in the authorization request to match the app
registration exactly, including host, port, path, and trailing slash. If
Threads shows a redirect URI error, ask the user for the registered redirect
URI and rerun with `--host`, `--port`, `--callback-path`, or `--redirect-uri`.
If the browser shows a certificate warning after authorization, continue to
the local callback page; the helper uses a temporary self-signed certificate
only for the loopback server.

Existing required app credentials in `~/.env`:

- `THREADS_APP_ID`
- `THREADS_APP_SECRET`
- `THREADS_CLIENT_TOKEN`

Values created or refreshed by this helper:

- `THREADS_ACCESS_TOKEN`
- `THREADS_USER_ID`
- `THREADS_ACCESS_TOKEN_EXPIRES_AT`
- `THREADS_USERNAME` when the API returns it

Default permissions:

```text
threads_basic,threads_content_publish
```

## Workflow

1. Confirm the user wants to write to `~/.env`. Writing outside the repository
   requires explicit approval in sandboxed Codex sessions.
2. Run the helper with existing dotenv values:

   ```bash
   node skills/70-content-design-and-voice/dnb-threads-refresh-token/scripts/create-threads-refresh-token.ts \
     --write-env
   ```

3. If the browser cannot open, rerun with `--no-open` and ask the user to open
   the printed authorization URL manually. The URL must not contain secrets.
4. After Threads redirects to the local callback page, report only the safe
   summary printed by the script: dotenv path, updated key names, user id, and
   expiry time.
5. Verify the posting skill sees Threads as configured:

   ```bash
   node skills/70-content-design-and-voice/dnb-post-link-into-void/resources/post-crosspost.ts --info
   ```

Do not include any token in the final answer. If setup succeeds, say that
`THREADS_ACCESS_TOKEN` and `THREADS_USER_ID` are stored and Threads is
configured.

## Refreshing an existing long-lived token

If `THREADS_ACCESS_TOKEN` already exists and has not fully expired, refresh it
without opening a browser:

```bash
node skills/70-content-design-and-voice/dnb-threads-refresh-token/scripts/create-threads-refresh-token.ts \
  --write-env \
  --refresh-existing
```

If the refresh fails because the token is expired or invalid, rerun the normal
browser OAuth flow.

## Options

Use these when defaults do not match the Threads app:

```bash
--app-id "<id>"
--app-secret "<secret>"
--host "localhost"
--port 8080
--callback-path "/callback"
--redirect-uri "https://127.0.0.1:8766/callback"
--https-key "./localhost-key.pem"
--https-cert "./localhost-cert.pem"
--scope "threads_basic,threads_content_publish"
--dotenv "~/.env"
--refresh-existing
--fix-permissions
--no-open
```

Use `--fix-permissions` only when the user agrees to chmod the dotenv file to
`0600`.
