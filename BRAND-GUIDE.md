# DGTL Sunrise. Brand guide

Deep indigo, a 12px sunband, Helvetica, and sparse circuit accents. This file is the source of truth. `DESIGN.md` is the short contract. If the two disagree, this file wins.

Scope: the public marketing shell. `index.html`, `connector.html`, `engagements.html`, `google-ads.html`, `privacy.html`, `terms.html`, and anything built on the same system later. `/plugin` redirects to `/connector`. `/google-ads.html` redirects to `/google-ads`.

---

## 1. What this system is

The previous shell was Composio-density: sticky blur nav, paper mid-page, scanfield, MATCH theater, a staged demo sequencer, and dual-door cards. That grammar assumed two doors (install vs hire). The product is a free local plugin plus a $19 Ads and Meta gateway. The shell follows that product.

Steal nothing from Composio. Do not restyle the old theater in indigo. Delete it.

---

## 2. Product locks (do not drift)

- Company = DGTL Sunrise. The offering on `/` is dgtl-connector, not a second company name.
- Free = local GA4 / GSC / GTM (read and manage). Tokens and report bytes never go through DGTL on the free path. Connect Google once with all Free permissions up front. Live edits need confirmation.
- Pro = $19/mo, Ads and Meta hosted gateway only. One Polar customer. Same human, more than one host, is fine. No employee seats. Unlimited ad accounts under that human's OAuth.
- Server-side GTM is not in this version.
- Point Pro at `/connector#pro` and `https://www.dgtlsunrise.com/connector`. Never invent a Polar checkout URL.
- Do not name Ryze in served HTML.
- Install: `grok plugin install dgtlsunrise/dgtl-connector`. That string must render in HTML without JavaScript.
- Footer on every page: © 2026 Sunrise Consulting LLC · contact@dgtlsunrise.com · support@dgtlsunrise.com · Engagements · Privacy · Terms.
- `/plugin` → `/connector` 301. `/google-ads.html` → `/google-ads` 301.
- Privacy and terms: restyle the shell only. Keep article body claims.
- `/google-ads` keeps Google Cloud project 960111255083, MCC 684-442-5544, customer Google Ads login (no internal consent labels), developer token on the Worker, and confirm-gated management. Do not call Ads read-only.
- No fake customer logos. No SOC2/ISO claims. No "1,500 apps." No invented GA metrics. Label any example number as an example.
- Public copy: human, concrete, no AI tells, no em dashes, sentence-case headings. Ban unlock / leverage / empower / delve.

---

## 3. Color

| Token | Value | Use |
|---|---|---|
| `--band-from` | `#FFD000` | Sunband start (yellow) |
| `--band-to` | `#C2186A` | Sunband end (magenta) |
| `--body` | `#08060F` | Page background |
| `--panel` | `#171340` | Raised panels |
| `--ink` | `#F5F2EA` | Type on indigo |
| `--muted` | `#A39BB8` | Supporting type (AA on `--body`) |
| `--line` | `rgba(245, 242, 234, 0.14)` | Rules |
| `--accent` | `#3D9EFF` | Links and `:focus-visible` |
| `--accent-2` | `#3DDC84` | Rare status or focus sibling, never a fill |

The sunband is `linear-gradient(90deg, var(--band-from), var(--band-to))` and 12px tall. It is decoration only.

Do not add paper (`#f3f3f0`), Composio cyan (`#4aa3ff` as a brand fill), or a light mid-page. Status may use `--accent` or `--muted`. Circuit green is not a "connected" pill system.

No Google Fonts. No third-party font CDN.

---

## 4. Type

| Role | Stack |
|---|---|
| Display / body | `"Helvetica Neue", Helvetica, Arial, sans-serif` |
| Commands | `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` |

- Headings: sentence case, bold, tracking tighter as size grows.
- Hero: `clamp(2rem, 5.5vw, 3.25rem)`, short measure.
- Body: 16px / 1.55. Supporting copy uses `--muted`, not opacity hacks on white glyphs.

Optional licensed swap later is a token change only, self-hosted, never hotlinked.

---

## 5. Grid and rhythm

Content caps at `--max: 40rem` for reading and `--max-wide: 56rem` for the step list. Margins grow with viewport.

**Section order on `/`**

1. Sunband
2. Static nav (not sticky, no blur)
3. Command
4. Six-step loop
5. Free byte path
6. Short Pro pointer
7. Footer

**Interior marketing pages** use the same indigo body. Connector is a worksheet (`#install`, `#pro`). Engagements is one short column plus mailto.

**Legal pages** keep a 72ch reading column. Same nav and footer shell. Do not run legal prose through a decorative hero.

---

## 6. Components

1. **Sunband.** 12px, full bleed, yellow to magenta. No children.
2. **Nav.** Static, indigo, no backdrop blur. Logo mark about 28px tall. Connector. Install.
3. **Solid / line buttons.** Sharp corners (`border-radius: 0`). Mono, uppercase. Solid inverts to `--ink` on `--body`.
4. **Command box.** Mono, panel fill, the install string in the HTML. Copy is enhancement.
5. **Step list.** Numbered 01 to 06. Publish states that a human publishes and the plugin reads back.
6. **Panel.** `--panel` fill, 1px `--line`, no paper card, no 10px product-chrome radius theater.
7. **Paste box.** Agent prompt with Copy to Copied. `/connector` only.

Do not add scanfield, MATCH tags, demo stages, door cards, or proof-strip theater.

---

## 7. Motion

Owned, small, CSS/JS only.

- Copy button label swap.
- `prefers-reduced-motion: reduce` zeros animation.

No Intersection Observer reveal that hides content. No staged demo. No third-party animation libraries. No autoplaying video. No Lottie. No Three.

Without JS, the install command, the loop, and legal articles stay visible.

---

## 8. Copy voice

Short sentences. Name the object (GA4, the repo, the gateway). Sentence-case headings. No em dashes on public marketing copy. The agent paste block on `/connector` is an operational prompt. Keep its rules unless the product changes.

Do not invent metrics, case studies, certifications, or app counts.

---

## 9. Accessibility

- Contrast: `--ink` on `--body` stays well above AA. `--muted` stays AA.
- `:focus-visible` is a 2px `--accent` ring, 3px offset.
- One `<h1>` per page. Skip link on every page.
- Logo `alt=""` because the wordmark is visible text.
- Without JS, commands and steps stay in the document.

---

## 10. Safe inspiration

Safe: the logo's yellow-to-magenta band and indigo core.

Never: Composio (or anyone else's) logos, screenshots, Lottie, Three scenes, copy, or a 1:1 layout clone. If removing a thing would require their file, do not add it.

---

## 11. File map

- `/assets/style.css`. Tokens, sunband, nav, command, steps, legal.
- `/assets/site.js`. Copy only.
- `/index.html`, `/connector.html`, `/engagements.html`.
- `/google-ads.html`. Google Ads Reporting product page. Clean URL `/google-ads`.
- `/plugin.html` + `/_redirects`. `/plugin` to `/connector` 301. `/google-ads.html` to `/google-ads` 301.
- `/privacy.html`, `/terms.html`. New shell, same legal claims.
- `/404.html`. Unknown paths. `not_found_handling` is `404-page`.
- `/logo.webp`. Small lockup mark. Re-export if the file is huge.
- `/scripts/check-site.mjs`. Rerunnable lock checks against files and Pages preview.
