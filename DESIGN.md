# Design — implementation contract

Full rationale lives in **[BRAND-GUIDE.md](./BRAND-GUIDE.md)**. Check both files
before shipping a visual change.

## The lock

- Surfaces: `#000000` dark and `#f3f3f0` light. Type is `#ffffff` on dark and
  `#111111` on light. Muted tokens are documented in the brand guide. Accent
  `#4aa3ff` is for labels, chrome links, and status only.
- Logo: `/logo.webp` + the words “DGTL Sunrise.” (with the period).
- Type: Helvetica Neue / Helvetica / Arial. Mono for labels and commands. No
  webfonts. No Google Fonts.
- CTAs: sharp rectangles. Primary Install → `/connector`. Talk →
  `/engagements` or `mailto:contact@dgtlsunrise.com`.
- Cards and chrome may use a 10px radius. Buttons stay radius 0.
- Motion: CSS keyframes, IO reveals, staged demo JS. Respect
  `prefers-reduced-motion`. Pages stay static HTML + `/assets/style.css` +
  `/assets/site.js` (no bundler).
- Copy: dual-door IA. No headcount, no “one operator,” no RainbowOPTX, no fake
  logos, no SOC2/ISO, no “1,500 apps.”
- Company home is `/`. dgtl-connector lives at `/connector`. Hire is
  `/engagements`. Pro is $19/mo flat. Point it at `/connector` and
  `https://www.dgtlsunrise.com/connector`. Do not invent Polar checkout URLs.
- Footer on every page: © 2026 Sunrise Consulting LLC,
  `contact@dgtlsunrise.com`, `support@dgtlsunrise.com`, Privacy, Terms.
- `/plugin` 301s to `/connector`. `/google-ads.html` 301s to `/google-ads`.
  Legal pages keep reviewed body copy.

## Method

1. Reuse nav, footer, card, chrome, and paste-box patterns before inventing a
   new module.
2. One stylesheet: `/assets/style.css`. One behavior file: `/assets/site.js`.
3. If a page needs something neither doc allows, update the docs first.

## Local preview (do not deploy)

This repo is Cloudflare Pages-static (`wrangler.jsonc` `assets.directory` is
`./`). Preview only:

```bash
npx wrangler pages dev . --port 8787
```

A plain static server can render the HTML; `_redirects` (`/plugin` →
`/connector` 301) is honored by Pages / `wrangler pages dev`, not by a raw
file server.

Do not run `wrangler pages deploy` or publish to production from this work.

## Ban list

Scraped Composio graphics, Lottie, Three, fake terminals that pretend to
compile the brand, fake customers, invented Polar URLs, Google Fonts,
gradients-as-decoration, extra brand colors, unlock/leverage/empower/delve,
em dashes on marketing copy.
