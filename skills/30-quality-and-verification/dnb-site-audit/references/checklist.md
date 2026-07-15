# Website Specification audit checklist

Snapshot date: **2026-07-12**

Canonical source: `https://specification.website/checklist/`

This adapted checklist contains 162 items. Read `../NOTICE.md` for attribution and licensing.

For each item, record one result: Pass, Fail, Partial, Manual review, Not applicable, or Blocked.
The method tags are defined in `audit-methods.md`.

## Foundations

Items: **18**

### FND-001 — The HTML doctype

- **Source status:** Required
- **Methods:** `html,repo`
- **Applicability:** All HTML pages
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### FND-002 — The lang attribute on `<html>`

- **Source status:** Required
- **Methods:** `html,browser,repo`
- **Applicability:** All HTML pages
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### FND-003 — `<meta charset>`

- **Source status:** Required
- **Methods:** `html,repo`
- **Applicability:** All HTML pages
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### FND-004 — `<meta viewport>`

- **Source status:** Required
- **Methods:** `html,repo`
- **Applicability:** Pages intended for mobile or responsive use
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### FND-005 — The `<title>` element

- **Source status:** Required
- **Methods:** `html,crawl,repo`
- **Applicability:** All indexable HTML pages
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### FND-006 — `<meta name="description">`

- **Source status:** Recommended
- **Methods:** `html,crawl,repo`
- **Applicability:** All indexable HTML pages
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### FND-007 — Canonical URL (rel="canonical")

- **Source status:** Recommended
- **Methods:** `html,crawl,headers,repo`
- **Applicability:** Public pages with a preferred canonical URL
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### FND-008 — Favicons and app icons

- **Source status:** Recommended
- **Methods:** `html,endpoint,repo`
- **Applicability:** Public sites
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### FND-009 — `<meta name="theme-color">`

- **Source status:** Recommended
- **Methods:** `html,browser,repo`
- **Applicability:** Sites with branded browser chrome or installable surfaces
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### FND-010 — `<meta name="color-scheme">`

- **Source status:** Recommended
- **Methods:** `html,css,browser,repo`
- **Applicability:** Sites supporting light or dark colour schemes
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### FND-011 — Open Graph protocol

- **Source status:** Recommended
- **Methods:** `html,crawl,repo`
- **Applicability:** Pages intended to be shared
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### FND-012 — Feed discovery with rel="alternate"

- **Source status:** Recommended
- **Methods:** `html,endpoint,repo`
- **Applicability:** Only when the site publishes RSS, Atom, or JSON Feed
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### FND-013 — Feed content hygiene

- **Source status:** Recommended
- **Methods:** `endpoint,validator,repo`
- **Applicability:** Only when the site publishes a feed
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### FND-014 — Popover API

- **Source status:** Recommended
- **Methods:** `browser,repo,manual`
- **Applicability:** Only when the UI contains popovers, menus, tooltips, or similar overlays
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### FND-015 — CSS anchor positioning

- **Source status:** Recommended
- **Methods:** `css,browser,repo,manual`
- **Applicability:** Only when anchored floating UI is present and browser support fits the project
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### FND-016 — Balanced text wrapping

- **Source status:** Recommended
- **Methods:** `css,browser,repo,manual`
- **Applicability:** Where headings or prose would benefit without harming readability
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### FND-017 — CSS container queries

- **Source status:** Recommended
- **Methods:** `css,repo,manual`
- **Applicability:** Component layouts that must respond to container size
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### FND-018 — Invoker commands

- **Source status:** Optional
- **Methods:** `html,browser,repo,manual`
- **Applicability:** Only when supported declarative commands fit existing controls
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

## SEO

Items: **14**

### SEO-001 — robots.txt

- **Source status:** Recommended
- **Methods:** `endpoint,validator,repo`
- **Applicability:** Public websites and non-production environments
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### SEO-002 — XML sitemaps

- **Source status:** Recommended
- **Methods:** `endpoint,validator,crawl,repo`
- **Applicability:** Public sites with indexable URLs
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### SEO-003 — Sitemap index files

- **Source status:** Recommended
- **Methods:** `endpoint,validator,repo`
- **Applicability:** Large sites or sites split into multiple sitemaps
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### SEO-004 — Image and video sitemap extensions

- **Source status:** Optional
- **Methods:** `endpoint,validator,repo`
- **Applicability:** Sites where important media is hard for crawlers to discover
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### SEO-005 — URL structure

- **Source status:** Recommended
- **Methods:** `crawl,repo,manual`
- **Applicability:** Public URLs
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### SEO-006 — Redirects (301/302/307/308)

- **Source status:** Required
- **Methods:** `headers,crawl,repo`
- **Applicability:** Redirecting or migrated URLs
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### SEO-007 — Server-side rendering

- **Source status:** Recommended
- **Methods:** `html,headers,browser,repo`
- **Applicability:** Primary content and metadata
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### SEO-008 — Soft 404s

- **Source status:** Avoid
- **Methods:** `headers,browser,crawl`
- **Applicability:** Unknown or removed URLs
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### SEO-009 — Meta robots and X-Robots-Tag

- **Source status:** Required
- **Methods:** `html,headers,crawl,repo`
- **Applicability:** All public, private, staging, admin, and thin-content routes
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### SEO-010 — Heading hierarchy

- **Source status:** Required
- **Methods:** `html,browser,crawl,repo,manual`
- **Applicability:** Content pages
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### SEO-011 — Internal linking

- **Source status:** Recommended
- **Methods:** `crawl,html,repo,manual`
- **Applicability:** Multi-page sites
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### SEO-012 — Structured data (JSON-LD)

- **Source status:** Recommended
- **Methods:** `html,validator,repo,manual`
- **Applicability:** Pages with entities or content types supported by schema.org
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### SEO-013 — Breadcrumbs

- **Source status:** Recommended
- **Methods:** `html,validator,repo,manual`
- **Applicability:** Hierarchical sites
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### SEO-014 — IndexNow

- **Source status:** Optional
- **Methods:** `endpoint,repo,manual`
- **Applicability:** Sites targeting participating search engines and needing rapid recrawling
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

## Accessibility

Items: **28**

### A11Y-001 — Colour contrast

- **Source status:** Required
- **Methods:** `browser,css,manual,validator`
- **Applicability:** All visual interfaces
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### A11Y-002 — Automatic contrasting colour

- **Source status:** Optional
- **Methods:** `css,browser,repo,manual`
- **Applicability:** Dynamic backgrounds where browser support is acceptable
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### A11Y-003 — Forced colours mode

- **Source status:** Recommended
- **Methods:** `browser,css,manual,repo`
- **Applicability:** All visual interfaces, especially custom controls
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### A11Y-004 — Image alt text

- **Source status:** Required
- **Methods:** `html,crawl,repo,manual`
- **Applicability:** All images; decorative images require empty alternative text
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### A11Y-005 — Form labels

- **Source status:** Required
- **Methods:** `html,browser,validator,repo,manual`
- **Applicability:** All form controls
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### A11Y-006 — Keyboard navigation

- **Source status:** Required
- **Methods:** `browser,manual`
- **Applicability:** All interactive interfaces
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### A11Y-007 — Visible focus indicators

- **Source status:** Required
- **Methods:** `browser,css,manual,repo`
- **Applicability:** All focusable controls
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### A11Y-008 — Skip links

- **Source status:** Required
- **Methods:** `html,browser,repo,manual`
- **Applicability:** Pages with repeated navigation before main content
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### A11Y-009 — The inert attribute

- **Source status:** Recommended
- **Methods:** `html,browser,repo,manual`
- **Applicability:** When modal or overlay content makes the background inactive
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### A11Y-010 — Semantic HTML and landmarks

- **Source status:** Required
- **Methods:** `html,browser,validator,repo,manual`
- **Applicability:** All pages
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### A11Y-011 — ARIA — first rule of ARIA

- **Source status:** Recommended
- **Methods:** `html,browser,repo,manual`
- **Applicability:** Custom widgets or ARIA usage
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### A11Y-012 — Descriptive link text

- **Source status:** Required
- **Methods:** `html,crawl,repo,manual`
- **Applicability:** All links
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### A11Y-013 — Empty links and buttons

- **Source status:** Avoid
- **Methods:** `html,browser,validator,repo`
- **Applicability:** All interactive elements
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### A11Y-014 — Accessible form errors

- **Source status:** Required
- **Methods:** `browser,html,repo,manual`
- **Applicability:** Forms with validation or submission errors
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### A11Y-015 — Accessible authentication

- **Source status:** Recommended
- **Methods:** `browser,repo,manual,policy`
- **Applicability:** Sites with authentication
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### A11Y-016 — Redundant entry

- **Source status:** Recommended
- **Methods:** `browser,repo,manual`
- **Applicability:** Multi-step forms and repeated data collection
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### A11Y-017 — Consistent help

- **Source status:** Recommended
- **Methods:** `browser,crawl,repo,manual`
- **Applicability:** Sites offering help mechanisms across multiple pages
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### A11Y-018 — Document and parts language

- **Source status:** Required
- **Methods:** `html,crawl,repo,manual`
- **Applicability:** All pages containing one or more languages
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### A11Y-019 — Reduced motion

- **Source status:** Required
- **Methods:** `browser,css,repo,manual`
- **Applicability:** Sites with animation, autoplay, transitions, parallax, or motion effects
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### A11Y-020 — Accessibility overlays

- **Source status:** Avoid
- **Methods:** `html,network,repo,manual`
- **Applicability:** All sites
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### A11Y-021 — Captions and transcripts

- **Source status:** Required
- **Methods:** `browser,crawl,repo,manual`
- **Applicability:** Audio, video, and meaningful visual media
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### A11Y-022 — Accessible data tables

- **Source status:** Required
- **Methods:** `html,browser,repo,manual`
- **Applicability:** Tabular data
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### A11Y-023 — Touch target size

- **Source status:** Required
- **Methods:** `browser,css,manual`
- **Applicability:** Pointer and touch interfaces
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### A11Y-024 — Dragging movements

- **Source status:** Recommended
- **Methods:** `browser,repo,manual`
- **Applicability:** Interfaces requiring drag gestures
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### A11Y-025 — Hidden until found

- **Source status:** Recommended
- **Methods:** `html,browser,repo,manual`
- **Applicability:** Collapsible content that should remain searchable
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### A11Y-026 — Mobile-friendly form inputs

- **Source status:** Recommended
- **Methods:** `html,browser,repo,manual`
- **Applicability:** Forms used on mobile devices
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### A11Y-027 — Native interactive elements

- **Source status:** Recommended
- **Methods:** `html,browser,repo,manual`
- **Applicability:** Interactive controls
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### A11Y-028 — CSS state and relational selectors

- **Source status:** Recommended
- **Methods:** `css,repo,manual`
- **Applicability:** Form and component state that can be expressed safely in CSS
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

## Security

Items: **18**

### SEC-001 — HTTPS and TLS

- **Source status:** Required
- **Methods:** `headers,tls,network`
- **Applicability:** All production hosts and subdomains in scope
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### SEC-002 — HSTS (Strict-Transport-Security)

- **Source status:** Required
- **Methods:** `headers,network,repo`
- **Applicability:** HTTPS production hosts after confirming subdomain readiness
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### SEC-003 — Mixed content and upgrade-insecure-requests

- **Source status:** Recommended
- **Methods:** `html,headers,network,browser,repo`
- **Applicability:** HTTPS pages
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### SEC-004 — Content Security Policy (CSP)

- **Source status:** Recommended
- **Methods:** `headers,html,repo,manual`
- **Applicability:** All sites, with policy tailored to actual resources
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### SEC-005 — Reporting API (Reporting-Endpoints)

- **Source status:** Recommended
- **Methods:** `headers,repo,manual`
- **Applicability:** Sites operating browser-policy reporting
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### SEC-006 — /.well-known/security.txt

- **Source status:** Recommended
- **Methods:** `endpoint,validator,repo`
- **Applicability:** Publicly operated domains
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### SEC-007 — X-Content-Type-Options: nosniff

- **Source status:** Required
- **Methods:** `headers,repo`
- **Applicability:** All applicable HTTP responses
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### SEC-008 — Clickjacking protection (frame-ancestors / X-Frame-Options)

- **Source status:** Required
- **Methods:** `headers,repo,manual`
- **Applicability:** HTML pages, with intended embedding documented
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### SEC-009 — Cross-origin isolation (COOP / COEP / CORP)

- **Source status:** Recommended
- **Methods:** `headers,repo,manual`
- **Applicability:** Applications benefiting from isolation; verify third-party compatibility
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### SEC-010 — Referrer-Policy

- **Source status:** Recommended
- **Methods:** `headers,html,repo`
- **Applicability:** All sites
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### SEC-011 — Permissions-Policy

- **Source status:** Recommended
- **Methods:** `headers,repo,manual`
- **Applicability:** Sites that can restrict powerful browser features
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### SEC-012 — Subresource Integrity (SRI)

- **Source status:** Recommended
- **Methods:** `html,repo,network`
- **Applicability:** Third-party scripts and styles loaded from stable URLs
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### SEC-013 — Digest Fields (Content-Digest and Repr-Digest)

- **Source status:** Optional
- **Methods:** `headers,repo,manual`
- **Applicability:** APIs, downloads, and machine-readable resources needing integrity metadata
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### SEC-014 — Trusted Types

- **Source status:** Recommended
- **Methods:** `headers,repo,manual`
- **Applicability:** Script-heavy applications with DOM injection sinks and compatible code
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### SEC-015 — Cookie attributes — Secure, HttpOnly, SameSite

- **Source status:** Required
- **Methods:** `headers,browser,network,repo,manual`
- **Applicability:** Sites setting cookies
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### SEC-016 — Clear-Site-Data

- **Source status:** Optional
- **Methods:** `headers,repo,manual`
- **Applicability:** Logout, account removal, or device-clearing flows
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### SEC-017 — DNS CAA records

- **Source status:** Recommended
- **Methods:** `dns,manual`
- **Applicability:** Domains using public certificate authorities
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### SEC-018 — DNSSEC

- **Source status:** Optional
- **Methods:** `dns,manual`
- **Applicability:** Domains whose registrar, registry, and DNS provider support it end to end
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

## Well-Known URIs

Items: **12**

### WKU-001 — Well-known URIs

- **Source status:** Recommended
- **Methods:** `endpoint,repo,manual`
- **Applicability:** When publishing registered site-wide metadata
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### WKU-002 — /.well-known/change-password

- **Source status:** Optional
- **Methods:** `endpoint,headers,repo`
- **Applicability:** Sites with password-based accounts
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### WKU-003 — /.well-known/webauthn

- **Source status:** Optional
- **Methods:** `endpoint,validator,repo`
- **Applicability:** Passkeys shared across related origins
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### WKU-004 — /.well-known/openid-configuration

- **Source status:** Optional
- **Methods:** `endpoint,validator,repo`
- **Applicability:** OpenID Connect providers
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### WKU-005 — /.well-known/oauth-authorization-server

- **Source status:** Optional
- **Methods:** `endpoint,validator,repo`
- **Applicability:** OAuth 2.0 authorisation servers that are not OIDC providers
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### WKU-006 — /.well-known/oauth-protected-resource

- **Source status:** Optional
- **Methods:** `endpoint,validator,repo`
- **Applicability:** OAuth-protected resource servers
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### WKU-007 — /.well-known/api-catalog

- **Source status:** Recommended
- **Methods:** `endpoint,validator,repo,manual`
- **Applicability:** Hosts exposing APIs or machine-readable resources
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### WKU-008 — /.well-known/webfinger

- **Source status:** Optional
- **Methods:** `endpoint,validator,repo`
- **Applicability:** Fediverse or account-discovery implementations
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### WKU-009 — /.well-known/apple-app-site-association

- **Source status:** Optional
- **Methods:** `endpoint,validator,repo`
- **Applicability:** Sites associated with Apple apps
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### WKU-010 — /.well-known/assetlinks.json

- **Source status:** Optional
- **Methods:** `endpoint,validator,repo`
- **Applicability:** Sites associated with Android apps
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### WKU-011 — /.well-known/nodeinfo

- **Source status:** Optional
- **Methods:** `endpoint,validator,repo`
- **Applicability:** Federated platforms exposing NodeInfo
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### WKU-012 — /.well-known/traffic-advice

- **Source status:** Optional
- **Methods:** `endpoint,validator,repo`
- **Applicability:** Sites controlling private prefetch proxy traffic
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

## Agent Readiness

Items: **20**

### AGT-001 — Agent readiness

- **Source status:** Recommended
- **Methods:** `crawl,html,endpoint,repo,manual`
- **Applicability:** Public content intended to be consumed by agents or crawlers
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### AGT-002 — /llms.txt

- **Source status:** Recommended
- **Methods:** `endpoint,validator,repo,manual`
- **Applicability:** Public sites with important content to curate for language models
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### AGT-003 — /llms-full.txt

- **Source status:** Optional
- **Methods:** `endpoint,validator,repo,manual`
- **Applicability:** Smaller sites where a consolidated full-text corpus is useful
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### AGT-004 — Per-page Markdown source endpoints

- **Source status:** Recommended
- **Methods:** `endpoint,crawl,repo,manual`
- **Applicability:** Documentation or structured editorial sites
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### AGT-005 — robots.txt for AI crawlers

- **Source status:** Recommended
- **Methods:** `endpoint,validator,policy,repo`
- **Applicability:** Sites that need explicit AI crawler policies
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### AGT-006 — Content Signals in robots.txt

- **Source status:** Optional
- **Methods:** `endpoint,validator,policy,repo`
- **Applicability:** Only when adopting the emerging content-signal convention
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### AGT-007 — Web Bot Auth — verifiable bot identity

- **Source status:** Optional
- **Methods:** `headers,network,repo,manual`
- **Applicability:** Sites implementing signed bot authentication
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### AGT-008 — Stable URLs

- **Source status:** Required
- **Methods:** `crawl,repo,manual,history`
- **Applicability:** Published URLs
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### AGT-009 — Structured data for agents

- **Source status:** Recommended
- **Methods:** `html,validator,repo,manual`
- **Applicability:** Pages containing useful typed facts
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### AGT-010 — Machine-readable formats

- **Source status:** Recommended
- **Methods:** `endpoint,repo,manual`
- **Applicability:** Content naturally represented as JSON, feeds, or Markdown
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### AGT-011 — HTTP Link headers for discovery

- **Source status:** Recommended
- **Methods:** `headers,endpoint,repo,manual`
- **Applicability:** Sites publishing machine-readable resources
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### AGT-012 — MCP and tool discovery

- **Source status:** Optional
- **Methods:** `endpoint,validator,repo,manual`
- **Applicability:** Sites exposing structured query or action capabilities
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### AGT-013 — A2A agent cards

- **Source status:** Optional
- **Methods:** `endpoint,validator,repo,manual`
- **Applicability:** Services exposing agent-to-agent capabilities
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### AGT-014 — Agent Skills discovery

- **Source status:** Recommended
- **Methods:** `endpoint,validator,repo,manual`
- **Applicability:** Sites publishing reusable agent skills
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### AGT-015 — DNS for AI Discovery (DNS-AID)

- **Source status:** Optional
- **Methods:** `dns,endpoint,manual`
- **Applicability:** Services adopting DNS-based agent discovery
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### AGT-016 — Agentic Resource Discovery (ARD)

- **Source status:** Optional
- **Methods:** `endpoint,validator,repo,manual`
- **Applicability:** Sites publishing an AI capability catalogue
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### AGT-017 — NLWeb — conversational interface discovery

- **Source status:** Optional
- **Methods:** `endpoint,headers,repo,manual`
- **Applicability:** Sites exposing an NLWeb-compatible conversational endpoint
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### AGT-018 — WebMCP — browser-native tools for agents

- **Source status:** Optional
- **Methods:** `html,browser,repo,manual`
- **Applicability:** Sites adopting browser-native agent tools
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### AGT-019 — Open Knowledge Format (OKF) bundle

- **Source status:** Optional
- **Methods:** `endpoint,validator,repo,manual`
- **Applicability:** Knowledge bases suitable for bundled ingestion
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### AGT-020 — Schemamap — discoverable JSON-LD endpoints per resource

- **Source status:** Optional
- **Methods:** `endpoint,validator,repo,manual`
- **Applicability:** Sites adopting this non-standard convention
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

## Performance

Items: **25**

### PERF-001 — Core Web Vitals (LCP, INP, CLS)

- **Source status:** Required
- **Methods:** `performance,rum,lab,browser,manual`
- **Applicability:** Representative production page types
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### PERF-002 — Image optimisation

- **Source status:** Required
- **Methods:** `html,network,repo,performance,manual`
- **Applicability:** Sites serving images
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### PERF-003 — Lazy loading images, iframes, and video

- **Source status:** Recommended
- **Methods:** `html,browser,repo,performance,manual`
- **Applicability:** Off-screen media; exclude the LCP element
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### PERF-004 — Preload, prefetch, preconnect

- **Source status:** Recommended
- **Methods:** `html,headers,network,repo,performance`
- **Applicability:** Only for resources proven important by measurement
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### PERF-005 — 103 Early Hints

- **Source status:** Optional
- **Methods:** `headers,network,manual`
- **Applicability:** Servers and CDNs supporting early hints
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### PERF-006 — Cache-Control headers

- **Source status:** Required
- **Methods:** `headers,network,repo`
- **Applicability:** HTML and static assets
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### PERF-007 — Conditional requests (ETag, Last-Modified, 304)

- **Source status:** Recommended
- **Methods:** `headers,network,manual`
- **Applicability:** Cacheable responses
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### PERF-008 — No-Vary-Search response header

- **Source status:** Recommended
- **Methods:** `headers,network,repo,manual`
- **Applicability:** Resources where selected query parameters do not change content
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### PERF-009 — Compression (gzip, brotli, zstd)

- **Source status:** Required
- **Methods:** `headers,network,performance`
- **Applicability:** Compressible text responses
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### PERF-010 — Web font loading

- **Source status:** Recommended
- **Methods:** `html,css,network,repo,performance,manual`
- **Applicability:** Sites loading web fonts
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### PERF-011 — Critical CSS and render-blocking resources

- **Source status:** Recommended
- **Methods:** `html,network,repo,performance,manual`
- **Applicability:** Pages with CSS or other render-blocking resources
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### PERF-012 — Script loading — defer, async, module

- **Source status:** Recommended
- **Methods:** `html,network,repo,performance,manual`
- **Applicability:** Pages loading JavaScript
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### PERF-013 — HTTP/2 and HTTP/3

- **Source status:** Recommended
- **Methods:** `network,headers,manual`
- **Applicability:** Production delivery
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### PERF-014 — HTTP/1.1 workarounds: sharding, sprites, and request-driven bundling

- **Source status:** Avoid
- **Methods:** `network,repo,manual`
- **Applicability:** Modern HTTP/2 or HTTP/3 deployments
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### PERF-015 — Speculation Rules

- **Source status:** Recommended
- **Methods:** `html,network,repo,performance,manual`
- **Applicability:** Sites where measured navigation patterns justify speculation
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### PERF-016 — Resource hints overview

- **Source status:** Recommended
- **Methods:** `html,headers,network,repo,manual`
- **Applicability:** Sites using resource hints
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### PERF-017 — View Transitions

- **Source status:** Optional
- **Methods:** `css,browser,repo,manual`
- **Applicability:** Interfaces benefiting from transitions with acceptable support
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### PERF-018 — Back/forward cache (BFCache)

- **Source status:** Recommended
- **Methods:** `browser,performance,repo,manual`
- **Applicability:** Navigation-heavy pages
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### PERF-019 — Visibility-aware rendering

- **Source status:** Optional
- **Methods:** `css,browser,repo,performance,manual`
- **Applicability:** Large pages with substantial off-screen content
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### PERF-020 — CSS containment

- **Source status:** Optional
- **Methods:** `css,browser,repo,performance,manual`
- **Applicability:** Components whose rendering can be isolated safely
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### PERF-021 — Scroll-driven animations

- **Source status:** Optional
- **Methods:** `css,browser,repo,performance,manual`
- **Applicability:** Scroll-linked effects with reduced-motion handling
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### PERF-022 — Scrollbar gutter

- **Source status:** Recommended
- **Methods:** `css,browser,repo,manual`
- **Applicability:** Layouts susceptible to width shifts when scrollbars appear
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### PERF-023 — Dynamic viewport units (dvh, svh, lvh)

- **Source status:** Recommended
- **Methods:** `css,browser,repo,manual`
- **Applicability:** Full-height mobile layouts
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### PERF-024 — Compression Dictionary Transport

- **Source status:** Optional
- **Methods:** `headers,network,repo,manual`
- **Applicability:** Deployments supporting shared compression dictionaries
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### PERF-025 — Server-Timing header

- **Source status:** Optional
- **Methods:** `headers,network,repo,manual`
- **Applicability:** Sites measuring server-side latency without exposing sensitive details
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

## Privacy

Items: **7**

### PRIV-001 — Privacy policy

- **Source status:** Required
- **Methods:** `crawl,policy,repo,manual`
- **Applicability:** Sites collecting, processing, or sharing personal data
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### PRIV-002 — Cookie consent

- **Source status:** Required
- **Methods:** `browser,network,policy,repo,manual`
- **Applicability:** Jurisdictions and use cases requiring prior consent for non-essential storage
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### PRIV-003 — Global Privacy Control (GPC)

- **Source status:** Recommended
- **Methods:** `browser,network,policy,repo,manual`
- **Applicability:** Sites subject to or voluntarily honouring opt-out signals
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### PRIV-004 — Third-party scripts and privacy

- **Source status:** Recommended
- **Methods:** `html,network,policy,repo,manual`
- **Applicability:** Sites loading third-party code or embeds
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### PRIV-005 — Storage Access API

- **Source status:** Optional
- **Methods:** `browser,repo,manual`
- **Applicability:** Cross-site embeds needing partitioned-cookie access
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### PRIV-006 — Privacy-respecting analytics

- **Source status:** Recommended
- **Methods:** `network,policy,repo,manual`
- **Applicability:** Sites using analytics
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### PRIV-007 — Data minimisation

- **Source status:** Recommended
- **Methods:** `forms,network,policy,repo,manual`
- **Applicability:** Any collection or retention of personal data
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

## Resilience

Items: **7**

### RES-001 — Custom error pages (404, 500)

- **Source status:** Required
- **Methods:** `headers,browser,repo,manual`
- **Applicability:** All public sites
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### RES-002 — Maintenance pages and 503

- **Source status:** Recommended
- **Methods:** `headers,browser,repo,manual`
- **Applicability:** Sites with planned maintenance or temporary outages
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### RES-003 — Graceful degradation when JavaScript fails

- **Source status:** Recommended
- **Methods:** `browser,html,repo,manual`
- **Applicability:** Sites depending on client-side JavaScript
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### RES-004 — Offline support and service workers

- **Source status:** Optional
- **Methods:** `browser,network,repo,manual`
- **Applicability:** Applications benefiting from offline or poor-network support
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### RES-005 — Web app manifest

- **Source status:** Recommended
- **Methods:** `html,endpoint,validator,repo`
- **Applicability:** Installable or app-like sites
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### RES-006 — Monitoring and uptime

- **Source status:** Recommended
- **Methods:** `operations,policy,manual`
- **Applicability:** Production services
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### RES-007 — Deprecation and Sunset

- **Source status:** Optional
- **Methods:** `headers,repo,manual`
- **Applicability:** APIs or endpoints being retired
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

## Internationalisation

Items: **13**

### I18N-001 — International URL structure

- **Source status:** Recommended
- **Methods:** `crawl,repo,manual`
- **Applicability:** Multilingual or multi-regional sites
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### I18N-002 — hreflang for language and regional URLs

- **Source status:** Recommended
- **Methods:** `html,crawl,validator,repo`
- **Applicability:** Pages with language or regional alternates
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### I18N-003 — Localised page metadata

- **Source status:** Recommended
- **Methods:** `html,crawl,repo,manual`
- **Applicability:** Translated or localised pages
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### I18N-004 — hreflang in XML sitemaps

- **Source status:** Optional
- **Methods:** `endpoint,validator,repo`
- **Applicability:** Large multilingual sites managing alternates in sitemaps
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### I18N-005 — Automatic IP-based language redirects

- **Source status:** Avoid
- **Methods:** `headers,browser,repo,manual`
- **Applicability:** Multilingual or multi-regional sites
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### I18N-006 — lang attribute on inline content

- **Source status:** Required
- **Methods:** `html,crawl,repo,manual`
- **Applicability:** Pages containing text in a language different from the document language
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### I18N-007 — translate attribute for untranslatable content

- **Source status:** Optional
- **Methods:** `html,repo,manual`
- **Applicability:** Brand names, identifiers, and code that translation systems should preserve
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### I18N-008 — Language switcher

- **Source status:** Recommended
- **Methods:** `html,browser,repo,manual`
- **Applicability:** Multilingual sites
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### I18N-009 — RTL and bidirectional text

- **Source status:** Recommended
- **Methods:** `html,css,browser,repo,manual`
- **Applicability:** Arabic, Hebrew, Persian, Urdu, or mixed-direction content
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### I18N-010 — Writing modes and CJK line breaking

- **Source status:** Optional
- **Methods:** `css,browser,repo,manual`
- **Applicability:** Vertical writing or Chinese, Japanese, Korean, Thai, or Mongolian content
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### I18N-011 — Locale-aware content

- **Source status:** Recommended
- **Methods:** `browser,repo,manual`
- **Applicability:** Localised dates, numbers, currencies, and units
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### I18N-012 — Plural rules and grammatical number

- **Source status:** Recommended
- **Methods:** `browser,repo,manual`
- **Applicability:** Localised messages containing counts
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.

### I18N-013 — Internationalised Domain Names (IDN)

- **Source status:** Optional
- **Methods:** `dns,browser,manual`
- **Applicability:** Domains using non-ASCII labels
- **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../SKILL.md`; do not infer a pass from framework defaults.
- **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.
