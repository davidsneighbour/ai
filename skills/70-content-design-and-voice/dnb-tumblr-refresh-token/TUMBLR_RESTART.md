# Tumblr Restart Note

Status on 2026-07-15:

- `dnb-tumblr-refresh-token` exists and can create or refresh Tumblr OAuth2
  credentials.
- The helper tried the local callback:
  `http://127.0.0.1:8767/callback`
- Tumblr does not accept `localhost` or `127.0.0.1` as the OAuth callback URL
  for this app, similar to the Threads blocker.
- The Tumblr app originally redirected to `kollitsch.dev`, which means the
  current `TUMBLR_CONSUMER_KEY` / `TUMBLR_CONSUMER_SECRET` are tied to an app
  configured for that callback.
- Target blog for this workflow:
  `davidsneighbour`

Tomorrow's better direction:

1. Create or reuse a tiny Netlify callback endpoint on a real HTTPS domain.
2. Add that exact URL to the Tumblr app's OAuth callback URL.
3. Update `create-tumblr-refresh-token.ts` to support the hosted callback flow,
   likely by accepting a pasted `code` and `state` from the Netlify page or by
   using a short-lived local handoff.
4. Keep token handling local: the Netlify endpoint must not store or print
   access tokens or refresh tokens. It should only receive the OAuth `code` and
   hand it back to the local helper/user.

The footer.design Tumblr post can use the existing long draft:

```text
scratch/dnb-post-link-into-void/footer-the-only-footer-gallery-on-earth.md
```

When Tumblr auth works, post with:

```bash
node skills/70-content-design-and-voice/dnb-post-link-into-void/resources/post-crosspost.ts \
  --message-file scratch/dnb-post-link-into-void/footer-the-only-footer-gallery-on-earth.md \
  --source-url "https://www.footer.design/" \
  --canonical-url "https://www.footer.design/" \
  --to tumblr
```

Current working networks for the posting skill:

- Mastodon
- Bluesky
- LinkedIn
- Reddit

Still pending:

- Threads, via hosted HTTPS callback
- Tumblr, via hosted HTTPS callback
