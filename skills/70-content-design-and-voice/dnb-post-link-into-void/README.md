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

Reddit uses:

```bash
node skills/70-content-design-and-voice/dnb-reddit-refresh-token/scripts/create-reddit-refresh-token.ts \
  --write-env
```

It stores `REDDIT_REFRESH_TOKEN` in `~/.env` without printing it.

## WIP Networks

Threads and Tumblr have direct posting scripts, but their OAuth setup is
currently blocked on localhost callback restrictions from the provider app
settings.

Use the restart notes before resuming:

- `skills/70-content-design-and-voice/dnb-threads-refresh-token/THREADS_RESTART.md`
- `skills/70-content-design-and-voice/dnb-tumblr-refresh-token/TUMBLR_RESTART.md`

The planned direction for both is a tiny hosted Netlify callback page on a
real HTTPS domain. The hosted page must not store or exchange tokens; it should
only receive the OAuth `code` and `state` and hand them back to the local
helper/user. Token exchange and `~/.env` writes stay local.

## Footer Test Post

The footer.design post has already been published to the working networks.
When Threads and Tumblr auth are ready, the prepared drafts are:

```text
scratch/dnb-post-link-into-void/footer-the-only-footer-gallery-on-earth.md
scratch/dnb-post-link-into-void/footer-the-only-footer-gallery-on-earth.threads.md
```
