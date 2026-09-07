# DGTL Sunrise — Brand Guide

Black, white, Helvetica, and one cyan accent. High-density product chrome on
dark and light surfaces. This file is the source of truth. `DESIGN.md` is the
short contract; if the two disagree, this file wins.

Scope: the public marketing shell — `index.html`, `connector.html`,
`engagements.html`, `google-ads.html`, `privacy.html`, `terms.html` — and
anything built on the same system later. `/plugin` redirects to `/connector`.
`/google-ads.html` redirects to `/google-ads`.

---

## 1. What this system is

The previous shell was a sparse black poster (asymmetric display type, no
cards, hover-only motion). Noel approved a full rebuild. The new grammar is
**Composio-density**: sticky nav, mono labels, elevated cards, staged product
chrome, dark hero into light sections, owned motion. The story stays DGTL.

Steal section rhythm. Do not copy Composio assets, logos, copy, Three, or
Lottie. Scanlines, chips, and demo frames in this repo are original CSS/HTML.

---

## 2. Product locks (do not drift)

- Company = marketing engineering / growth systems. No headcount, no “one
  operator,” no RainbowOPTX.
- dgtl-connector is one offering, not the company name on `/`.
- Doors: `/connector` (product) and `/engagements` (hire).
- Free = local GA4 / GSC / GTM. Pro = $19/mo flat Ads/Meta gateway.
- Point Pro at `/connector` and `https://www.dgtlsunrise.com/connector`. Never
  invent a Polar checkout URL.
- Install: `grok plugin install dgtlsunrise/dgtl-connector`.
- Footer on every page: © 2026 Sunrise Consulting LLC ·
  contact@dgtlsunrise.com · support@dgtlsunrise.com · Privacy · Terms.
- `/plugin` → `/connector` 301. `/google-ads.html` → `/google-ads` 301.
  Privacy/terms: restyle the shell only; keep substantive legal claims.
- No fake customer logos. No SOC2/ISO claims. No “1,500 apps.” No role megagrid.
- Public copy: human, concrete, no AI tells, no em dashes, sentence-case
  headings. Ban unlock / leverage / empower / delve and the usual filler.

---

## 3. Color

| Token | Value | Use |
|---|---|---|
| `--black` | `#000000` | Dark surfaces, nav, footer, close |
| `--white` | `#ffffff` | Type on dark, solid CTAs on dark |
| `--paper` | `#f3f3f0` | Light page and mid-page surfaces |
| `--ink` | `#111111` | Type on light |
| `--muted-dark` | `#b4b4b4` | Supporting type on black (AA) |
| `--muted-light` | `#4a4a4a` | Supporting type on paper (AA) |
| `--accent` | `#4aa3ff` | Mono labels, links in chrome, status only |
| `--chrome` | `#0c0c0c` | Product UI panels |

Accent is not a second brand color for fills. Do not add green “connected”
pills, gradients as decoration, or extra brand hues. Status dots reuse accent
or a quiet gray.

No Google Fonts. No third-party font CDN.

---

## 4. Type

| Role | Stack |
|---|---|
| Display / body | `"Helvetica Neue", Helvetica, Arial, sans-serif` |
| Labels / chrome / commands | `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` |

- Headings: sentence case, bold, tracking tighter as size grows.
- Eyebrows: 11px mono, uppercase, accent, 6px square prefix.
- Hero (dark): `clamp(2.25rem, 6.4vw, 4.35rem)`, centered, short measure.
- Interior hero (light): slightly smaller, same voice.
- Body: 16px / 1.55. Supporting copy uses the muted tokens, not opacity hacks
  on white glyphs.

Optional licensed swap later (Helvetica Now Display, etc.) is a token change
only, self-hosted, never hotlinked from another brand.

---

## 5. Grid and rhythm

Content caps at `--max: 1180px` with a 12-ish mental column (flex/grid
recipes, not a forced 12-track on every module). Margins grow with viewport.

**Section order on `/`**

1. Sticky nav
2. Dark hero + owned scanfield
3. Proof strip (text/mono marks we can actually name)
4. Demo stage “Watch it work”
5. Why / capabilities (4)
6. Dual door cards
7. Thin safety
8. Dark close + footer

**Interior marketing pages** open on a light hero (soft grid + faint blue
wash), then two-column copy + chrome, then cards, then footer.

**Legal pages** keep a 72ch reading column. Same nav and footer shell. Do not
run legal prose through a diagonal hero.

---

## 6. Components

1. **Sticky nav** — always dark, 64px, blur. Logo + wordmark left. Connector /
   Engagements. Talk (ghost) + Install (solid white). Wraps on small screens.
2. **Solid / line buttons** — sharp corners (`border-radius: 0`). Mono,
   uppercase. Solid inverts with the surface. This is the DGTL CTA, not a pill.
3. **Elevated card** — white on paper, 10px radius, 1px line, light shadow.
   Used for capabilities, doors, plans, safety.
4. **Product chrome** — dark panel, 10px radius, mono bar, tool chips, MATCH
   tags, connection rows. Home demo and connector checklist live here.
5. **Proof / stack strip** — mono labels only. Allowed marks: Grok Bot,
   Cursor, Google Analytics, Google Ads, Meta, plus GA4 / GSC / GTM on
   `/connector`. Never fake customers.
6. **Paste box** — Polar-style prompt with Copy → Copied. `/connector` and
   `/engagements` only.
7. **Soft diagram** — white nodes, 1px connectors. Portability (Grok Bot /
   connector / Cursor) and engagement outcome. No stock illustration packs.
8. **Scanfield** — CSS bars behind the home hero. Ours. Not a scraped graphic.

---

## 7. Motion

Owned, small, CSS/JS only.

- Scanfield pulse (`transform` + `opacity`).
- Intersection Observer reveals (`.reveal`).
- Staged demo (`[data-demo]` / `[data-demo-show]`), 1350ms steps, Replay.
- Card hover lift (`translateY(-2px)`).
- `prefers-reduced-motion: reduce` zeros animation and shows the full demo.

No third-party animation libraries. No autoplaying video. No Lottie. No Three.

---

## 8. Copy voice

Short sentences. Name the object (GA4, the repo, the gateway). Sentence-case
headings. No em dashes on public marketing copy. The agent paste blocks on
`/connector` are operational prompts: keep their wording unless product
changes.

Do not invent metrics, case studies, certifications, or app counts.

---

## 9. Accessibility

- Contrast: black/white at 21:1; muted tokens stay AA.
- `:focus-visible` is a 2px accent ring, 3px offset.
- One `<h1>` per page. Skip link on every marketing/legal page.
- Logo `alt=""` because the wordmark is visible text.
- Demo log uses `aria-live="polite"`.
- Without JS, demo steps and reveals stay visible.

---

## 10. Safe inspiration

Safe: section rhythm (hero → proof → chrome → cards), the *idea* of a staged
product preview, sticky nav + filled CTA, dark/light surface flip.

Never: Composio (or anyone else’s) logos, screenshots, Lottie, Three scenes,
copy, or a 1:1 layout clone. If removing a thing would require their file,
do not add it.

---

## 11. File map

- `/assets/style.css` — tokens, nav, surfaces, chrome, legal.
- `/assets/site.js` — Copy, demo sequencer, IO reveals.
- `/assets/copy.js` — leftover clipboard helper; pages load `site.js`.
- `/index.html`, `/connector.html`, `/engagements.html`.
- `/google-ads.html` — Google Ads Reporting product page. Clean URL `/google-ads`.
- `/plugin.html` + `/_redirects` — `/plugin` → `/connector` 301;
  `/google-ads.html` → `/google-ads` 301.
- `/privacy.html`, `/terms.html` — new shell, same legal claims.
- `/logo.webp` — lockup mark. Do not swap in other logo files on these pages.
