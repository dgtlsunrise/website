# Design. Implementation contract

Full rationale lives in [BRAND-GUIDE.md](./BRAND-GUIDE.md). Check both files before shipping a visual change.

## The lock

- Body is deep indigo (`#08060F` / `#171340` family). Type is light on that body.
- A 12px sunband sits at the top of every page. Yellow to magenta, horizontal. No text or controls on the band.
- Circuit blue and green are focus and link accents only. Do not fill sections with them.
- Logo: small `/logo.webp` plus the words "DGTL Sunrise." (with the period).
- Type: Helvetica Neue / Helvetica / Arial. Mono for commands. No webfonts. No Google Fonts.
- CTAs: sharp rectangles. Primary Install goes to `/connector#install`.
- Primary nav: Connector. No Talk. No Engagements.
- Motion: copy-to-clipboard only. Respect `prefers-reduced-motion`. Pages stay static HTML plus `/assets/style.css` plus `/assets/site.js` (no bundler).
- Copy: plugin loop, not dual-door. No headcount, no "one operator," no RainbowOPTX, no fake logos, no SOC2/ISO, no "1,500 apps."
- Pro is $19/mo for Ads and Meta. Point it at `/connector#pro` and `https://www.dgtlsunrise.com/connector`. Do not invent Polar checkout URLs. Do not name Ryze in served HTML.
- Footer on every page: © 2026 Sunrise Consulting LLC, `contact@dgtlsunrise.com`, `support@dgtlsunrise.com`, Engagements, Privacy, Terms.
- `/plugin` 301s to `/connector`. `/google-ads.html` 301s to `/google-ads`.
- Legal pages keep reviewed article bodies. Restyle the shell only.

## Method

1. Reuse nav, footer, command box, and step list before inventing a new module.
2. One stylesheet: `/assets/style.css`. One behavior file: `/assets/site.js`.
3. If a page needs something neither doc allows, update the docs first.

## Local preview (do not deploy)

This repo is Cloudflare Pages-static (`wrangler.jsonc` `assets.directory` is `./`). Preview only:

```bash
npx wrangler pages dev . --port 8787
```

A plain static server can render the HTML. `_redirects` (`/plugin` → `/connector` 301) is honored by Pages and `wrangler pages dev`, not by a raw file server.

`wrangler.jsonc` sets `not_found_handling` to `404-page`, so unknown paths serve `404.html` with status 404.

Do not run `wrangler pages deploy` or publish to production from this work.

## Ban list

Composio cyan, paper mid-page, scanfield, MATCH theater, staged demo sequencer, dual-door cards, sticky blur theater, scraped graphics, Lottie, Three, fake terminals, fake customers, invented Polar URLs, Google Fonts, unlock/leverage/empower/delve, em dashes on marketing copy.
