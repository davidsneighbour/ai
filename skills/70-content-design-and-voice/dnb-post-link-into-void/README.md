# Direct Network Credentials

This note records the practical credential setup for
`dnb-post-link-into-void`. The skill itself is the source of truth for the
posting workflow; this file is only a quick operator map.

## Working Networks

- Mastodon through Crosspost
- Bluesky through Crosspost
- LinkedIn through Crosspost
- Nostr through Crosspost
- Reddit through `resources/post-reddit.ts`
- Threads through `resources/post-threads.ts`
- Tumblr through `resources/post-tumblr.ts`

Reddit uses:

```bash
node skills/70-content-design-and-voice/dnb-reddit-refresh-token/scripts/create-reddit-refresh-token.ts \
  --write-env
```

It stores `REDDIT_REFRESH_TOKEN` in `~/.env` without printing it.

Threads and Tumblr both reject `localhost`/`127.0.0.1` OAuth redirect URIs,
so their token helpers use a hosted Netlify callback microsite instead of a
local loopback server. See each skill's `auth-site/README.md` for the
current deployed callback URL and deploy commands:

- `skills/70-content-design-and-voice/dnb-threads-refresh-token/auth-site/README.md`
- `skills/70-content-design-and-voice/dnb-tumblr-refresh-token/auth-site/README.md`

```bash
node skills/70-content-design-and-voice/dnb-threads-refresh-token/scripts/create-threads-refresh-token.ts \
  --write-env \
  --redirect-uri "<threads auth-site URL>/callback"

node skills/70-content-design-and-voice/dnb-tumblr-refresh-token/scripts/create-tumblr-refresh-token.ts \
  --write-env \
  --redirect-uri "<tumblr auth-site URL>/callback"
```

Both store their tokens in `~/.env` without printing them. The hosted
callback page is a static, client-side-only page; it never stores or
transmits the OAuth `code`/`state` anywhere itself.

Threads text posts do not reliably auto-attach a link preview via the API,
so `post-crosspost.ts` passes `--canonical-url`/`--source-url` through as
`--link-attachment` for Threads automatically. Tumblr posts support an
optional `--image`/`--image-alt` local file attachment via NPF multipart
upload (not a hosted image URL).
