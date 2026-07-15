# Threads Restart Note

Status on 2026-07-15:

- `dnb-threads-refresh-token` exists and can create or refresh Threads tokens.
- The Reddit-style `http://127.0.0.1` loopback flow failed with:
  `Insecure Login Blocked`.
- The helper was changed to default to:
  `https://127.0.0.1:8766/callback`
- Meta then failed with:
  `URL Blocked: This redirect failed because the redirect URI is not whitelisted`
- The local HTTPS callback may still be too awkward for Meta's app settings.

Tomorrow's better direction:

1. Create a tiny Netlify callback endpoint on a real HTTPS domain.
2. Add that exact URL to the Threads app's redirect callback URLs.
3. Update `create-threads-refresh-token.ts` to support that hosted callback
   flow, likely by accepting a pasted `code` and `state` from the Netlify page
   or by polling a short-lived local handoff if we build one.
4. Keep token handling local: the Netlify endpoint must not store or print
   access tokens. It should only receive the OAuth `code` and hand it back to
   the local helper/user.

The footer.design Threads draft is already prepared at:

```text
scratch/dnb-post-link-into-void/footer-the-only-footer-gallery-on-earth.threads.md
```

When Threads auth works, post with:

```bash
node skills/70-content-design-and-voice/dnb-post-link-into-void/resources/post-crosspost.ts \
  --message-file scratch/dnb-post-link-into-void/footer-the-only-footer-gallery-on-earth.md \
  --message-file-threads scratch/dnb-post-link-into-void/footer-the-only-footer-gallery-on-earth.threads.md \
  --source-url "https://www.footer.design/" \
  --canonical-url "https://www.footer.design/" \
  --to threads
```
