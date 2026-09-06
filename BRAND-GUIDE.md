# DGTL Sunrise — Brand Guide

Pure black canvas, pure white type, an engineered 12-column grid, and text placed on purpose
instead of centered by default. This document is the single source of truth. `DESIGN.md` is the
short contract that points back here; if the two ever disagree, this file wins.

Scope: the public marketing shell — `index.html`, `connector.html`, `engagements.html`,
`privacy.html`, `terms.html` — and anything built on the same system later. `/plugin` redirects
to `/connector`. This is a **system**, not a one-off page skin: every number below is a token,
not a guess made once and forgotten.

---

## 1. Sources studied

Two live sites were read closely (rendered CSS, spacing, and type behavior at desktop and mobile
widths) as reference points for a *category* — enterprise/defense-tech engineering brands that
use extreme minimalism as a credibility signal, not a decoration budget. Neither site's assets,
copy, or component code were copied; see §11 for the exact line between "studied" and "copied."

**Palantir** (palantir.com)
- Type: licensed **Alliance No.1** (text/body, grotesque with inktraps) and **Alliance No.2**
  (display, built for large sizes). Independently corroborated: Alliance No.1/No.2 are a shipped
  Degarism Studio family used across other marketing sites under the same `font-mktg` naming
  convention Palantir's ecosystem uses; direct CSS extraction from the live palantir.com bundle
  was not accessible from this environment, so the specific weights/kerning are taken from the
  brief's reference research and treated as directional, not pixel-exact.
- Structure: 12-column grid, ~30px gutters at desktop, headline and supporting copy given very
  different column spans (wide title, narrow description) instead of matching widths.
- Color: `#ffffff` or `#1e2124` fields, thin hairline rules, no gradients.
- Scale: display type reported around 100px at desktop.
- Placement: text anchored to different edges of the grid on the same screen — not a single
  centered column.

**Anduril** (anduril.com)
- Type: licensed **Helvetica Now Display** as primary. Confirmed independently via extracted
  live CSS (`.header-1 { font-family: "Helvetica Now Display"; font-weight:700; color:#000000 }`
  and similar rules, indexed by a public CSS-in-the-wild tool) — this is the one claim in this
  section with a direct, reproducible source. A secondary **Elios** label face is asserted by the
  brief's reference research; independent search confirms Elios is a real shipped ATK Studio
  stencil/mono display face, but no public source ties it to anduril.com specifically — treat that
  half of the pairing as unverified and optional (§2).
- Structure: 12-column grid, 2rem margins, 1.125rem gaps, viewport-height (`svh`) sections.
- Color: `#010101` / `#ffffff`, 1px rules, very restrained motion.
- Scale: 5rem h1, up to 10rem for the largest display moments.
- Placement: copy anchored bottom, left, or right of a section rather than centered; both very
  narrow and very wide text measures are used deliberately, never one default paragraph width.

**What both sites teach, independent of any specific font:** black-and-white with zero gradient
work as *engineering* signals only when the grid is precise, the rules are load-bearing (they
separate meaning, not decorate space), and every text block has a specific reason to sit where it
sits. That discipline — not any single typeface — is what this guide asks for.

---

## 2. Typography — licensed reference vs. what ships today

| Role | What the reference sites run (licensed, not ours to use) | What DGTL Sunrise ships today |
|---|---|---|
| Primary / display / body | Helvetica Now Display (Anduril) or Alliance No.2 display / Alliance No.1 body (Palantir) | `"Helvetica Neue", Helvetica, Arial, sans-serif` |
| Labels / micro-copy / mono accents | Elios (Anduril, unverified pairing) | `ui-monospace, SFMono-Regular, Menlo, monospace` |

**Why the system stack now:** those font files are proprietary, are not in this repo, and must
never be hotlinked from the reference domains or bundled without a license. The legal system stack
above is metrically close enough (Helvetica Neue/Arial share Helvetica's DNA) that the grid and
type-scale decisions in this guide will not need to be redone when a licensed face is added — only
`--font-sans` / `--font-mono` change.

**Optional exact licensed swap — only when separately licensed, never before:**
- Option A: `--font-sans: "Helvetica Now Display", "Helvetica Neue", Helvetica, Arial, sans-serif;`
  for primary/display/body, plus `--font-mono` (or a new `--font-label`) set to `"Elios", ui-monospace, SFMono-Regular, Menlo, monospace;`
  for labels only, once both are purchased and self-hosted (never loaded from anduril.com).
- Option B: `--font-sans: "Alliance No.1", "Helvetica Neue", Helvetica, Arial, sans-serif;` for
  body copy, with `--font-display: "Alliance No.2", "Helvetica Neue", Helvetica, Arial, sans-serif;`
  reserved for the hero/display sizes in §4, once licensed and self-hosted.
- Do not mix Option A's display face with Option B's body face or vice versa — each pairing is a
  matched system in its source brand; a cross-pair (e.g. Helvetica Now + Alliance No.1) has no
  precedent and would read as arbitrary.
- Either swap is a token change only. No HTML restructuring, no new webfont `<link>` to a third
  party CDN — self-host the licensed `.woff2` files under `/assets/fonts/` with `font-display: swap`
  and a `size-adjust`/fallback check against the current system-stack metrics so layout does not
  reflow visibly when the swap happens.

**No Google Fonts, no third-party font CDN, ever, for this brand.** The previous drafts of this
site loaded Newsreader/Public Sans/Syne/IBM Plex from Google Fonts — all removed. A brand built on
"engineering precision" does not depend on a third-party font request blocking first paint.

---

## 3. Grid

12 columns, always. The count does not change per breakpoint — only the margin, the gutter, and
how many columns a given block is allowed to span collapse toward full-width as the viewport
narrows.

```css
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: var(--gutter);
  max-width: var(--max);      /* 1760px — keeps display type from going absurd on ultra-wide */
  margin-inline: auto;
  padding-inline: var(--margin);
}
```

### Breakpoint table (margin / gutter)

| Breakpoint | Min width | Margin | Gutter | Notes |
|---|---|---|---|---|
| Mobile | 0 | 20px | 12px | Grid collapses to effectively 1 usable column; every recipe in §6 has a documented mobile fallback. |
| Small | 480px | 24px | 16px | |
| Tablet | 768px | 32px | 20px | Recipes may re-introduce 2 columns here (e.g. Free/Paid can sit side by side once there is room). |
| Desktop | 1024px | 48px | 30px | Gutter matches the Palantir reference point exactly — grid math is a craft convention, not IP (§11) — margin is DGTL's own number. |
| Wide | 1440px | 64px | 30px | Content still caps at `--max: 1760px` and centers; margin keeps growing so the grid never touches the glass on very large displays. |

Column spans used across the site are all recorded in §6 next to the recipe that uses them, so a
future page can be assembled from named, tested spans instead of inventing new fractions.

---

## 4. Type scale — size, tracking, leading

All sizes are `rem`/`clamp()` so they scale with viewport; the numbers below are the desktop
value each clamp settles at. Tracking is `letter-spacing`, leading is `line-height`.

| Step | Name | Desktop size | Tracking | Leading | Where |
|---|---|---|---|---|---|
| 0 | micro-mono | 11px (0.6875rem) | 0.16em, uppercase | 1.0 | Header path label, footer meta |
| 1 | label-mono | 12px (0.75rem) | 0.14em, uppercase | 1.2 | Door labels, Free/Pro, section labels, CTA text |
| 2 | body-s | 15px | 0 | 1.5 | (reserved — legal list items sit close to this) |
| 3 | body | 17px | −0.005em | 1.55 | Base `<body>` |
| 4 | body-wide | 20–22px | −0.01em | 1.45–1.5 | Hero lede, step body, offer body |
| 5 | h2 | 32–56px | −0.015 to −0.02em | 1.02–1.1 | Plugin page title |
| 6 | h1 | 56–80px | −0.02em | 1.1 | Legal page `<h1>` |
| 7 | display | 52–144px (`clamp(3.25rem, 11vw, 9rem)`) | −0.03em | 0.94 | "Marketing Engineering" hero |
| 8 | statement | 24–48px (`clamp(1.5rem, 4.5vw, 3rem)`) | −0.015em | 1.05 | Reserved full-bleed line (unused on current pages) |

Rule of thumb: **tracking tightens as size grows, and loosens (goes positive, uppercase) as size
shrinks to mono labels.** There is no step where body-length paragraph text gets tracked tighter
or looser than −0.01em — tight tracking is reserved for display sizes where it corrects for the
otherwise-loose optical spacing of large type; applying it to a paragraph would just hurt
legibility for no visual gain.

---

## 5. Exact tokens

```css
--black: #000000;                       /* the only background color on this site */
--white: #ffffff;                       /* the only text color on this site */
--line: rgba(255, 255, 255, 0.24);      /* structural hairline — borders/rules only, never text */
--line-strong: #ffffff;                 /* full-strength rule, used once per section at most */

--font-sans: "Helvetica Neue", Helvetica, Arial, sans-serif;
--font-mono: ui-monospace, SFMono-Regular, Menlo, monospace;

--margin: 20px;   /* → 24 / 32 / 48 / 64 across breakpoints, see §3 */
--gutter: 12px;   /* → 16 / 20 / 30 / 30 across breakpoints, see §3 */
--max: 1760px;

--ease: cubic-bezier(0.4, 0, 0.2, 1);
--fast: 140ms;
```

**On the "pure white text" lock:** `--line` is the one token that is white-at-reduced-opacity, and
it is never applied to a glyph — only to `border-*` on structural rules (the header/footer
dividers, the legal callout box, the hairline a section label sits on). Every character on
this site renders at `#ffffff`, full stop; hierarchy between a headline and a footnote comes from
the type scale in §4 and from placement in §6, not from dimming the ink. This is the one
deliberate, documented exception to reading the lock as "no opacity anywhere," and it exists so a
1px divider doesn't read as a second, competing pure-white line fighting the text for attention.

---

## 6. Layout recipes

Eight named, reusable compositions. Each has a column/row rule and a mobile fallback. A page is
built by choosing recipes, not by opening a blank canvas — that is what keeps "intentional
non-standard placement" from drifting into "different every time."

1. **Corner Lockup** — the mark + "DGTL Sunrise." wordmark sits at the grid's top-left corner
   (cols 1–6), paired with exactly one functional item pinned to the top-right corner (cols 9–12):
   a real link (home → `mailto:contact@dgtlsunrise.com`) or a real location label (`/connector`,
   `/engagements`). No center-aligned nav bar, no hamburger, no rule under the header.
   *Used: header on every marketing page.* Mobile: unchanged — both corners still fit at 320px
   because there is nothing else in the row.

2. **Wide/Narrow Diagonal Hero** — one `svh`-tall row; the headline spans a wide, non-centered
   range (cols 1–8) and self-aligns to the *start* of the row, while the supporting sentence spans
   a narrow range (cols 9–12, capped at a 30ch measure) and self-aligns to the *end* of the same
   row. Same grid row, opposite corners — that is the "diagonal." *Used: index hero.* Mobile: stack
   — headline first, full width; lede below it, full width, left-aligned, no more diagonal (there
   is no room for one on a 360px screen and forcing it would hurt readability).

3. **Rule-Break Heading** — a full-bleed 1px rule (`--line-strong`) spans all 12 columns in row 1
   of a two-row section; a small mono label shares that same row 1, given an opaque `background:
   var(--black)` so it visually interrupts the rule instead of floating above or below it; the
   body copy for that section sits in row 2, left-aligned to the same column the label started
   from. *Used: Install / How / Google app on interior pages.* Mobile: rule stays full-bleed;
   label moves back to its own line above the body copy (still row 1, full width) since there is
   no spare column to "break into" at narrow widths.

4. **Unequal Twin** — two related blocks in one `svh`-ish-tall row, given different column spans
   (5 cols vs. 6 cols, not a 6/6 card pair) and opposite `align-self` (`start` / `end`), so they
   don't read as a symmetric two-card grid despite being "the same kind of thing." *Used: homepage
   doors (`/connector` vs `/engagements`); connector What it is / is not and Free / Pro.* Mobile:
   stacked, both full width, no alignment trick.

5. **Edge Caption** — a small mono label or path string pinned to one edge of the grid (far right
   of the header, in this system) that reports real state (the current route) rather than
   decorating the corner. *Used: `/connector` and `/engagements` path labels.*

6. **Full-Bleed Statement** — a single line of display-scale type spans all 12 columns edge to
   edge, used **at most once per page**, reserved for one emphatic, true beat — never a slogan
   invented to fill space. Not used on the current marketing pages — documented here so a future
   page doesn't invent a ninth pattern when this one already covers "one big true sentence, full
   width."

7. **Sparse Footer Strip** — the footer is two unequal clusters (legal links left, entity +
   contact right) separated by empty grid space, not an evenly-distributed flexbox row of four
   equal items. One hairline (`--line`) sits above it. *Used: footer on every page except legal
   (legal footers stay centered — see §6a).*

8. **Viewport Module** — a section's height is set with `svh`/`vh` (the hero at `78svh`, the offers
   pair at `min-height: 24vh`) rather than left to auto-size to its copy, so the composition
   occupies a deliberate fraction of the screen regardless of how long the sentence inside it
   turns out to be. *Used: hero, offers.*

**6a. Legal pages are the deliberate exception.** Privacy and Terms carry substantive, previously
reviewed legal text (see the top-level task lock: "do not alter substantive privacy claims"). They
keep a conventional sticky nav, a single centered `72ch` reading column, and a centered footer —
restyled to the black/white tokens, but not run through the asymmetric recipes above. A contract
and a manifesto are different documents; forcing legal prose into a diagonal hero would actively
hurt the one thing that document has to do, which is be read calmly and quoted accurately.

---

## 7. Text placement logic

- **Every block picks one primary anchor edge** — top, bottom, left, or right of its section — and
  states it through `align-self`/`justify-self`, not through manual margin nudging.
- **Wide measure = high-priority statement. Narrow measure = supporting detail.** The hero
  headline gets 8 columns because it is the one sentence a visitor must read; the lede gets 4
  columns and a 30ch cap because it is elaboration, not the pitch.
- **No two adjacent blocks share both the same column span and the same vertical anchor.** If they
  did, the page would default back into a centered stack — the exact "standard SaaS flow" the
  brief rules out. Recipe 4 (Unequal Twin) exists specifically to enforce this for Free/Paid
  Upgrade.
- **A rule is a boundary, not a decoration.** Every `<hr class="rule">` on the marketing pages
  marks a real content boundary (start of a labeled interior section) — never a spacer inserted
  because a section "felt empty."
- **Nothing is centered by default.** `text-align: center` does not appear anywhere in the system
  stylesheet outside the legal-page shell (§6a) and the `.legal-box` callout, both of which are
  reading documents, not compositions.

---

## 8. Line, rule, and button/CTA rules

- **Rules:** always `1px`, always horizontal, always either `--line` (structural, quiet) or
  `--line-strong` (emphasis, used once per section). No vertical dividers — column gaps already do
  that job. No double rules, no dashed/dotted styles.
- **Radius: `0` everywhere.** No rounded corners on links, boxes, or the one legal callout box.
  This is a hard rule specifically because it's the fastest way to slide back toward the banned
  "rounded card grid" softness.
- **Buttons do not exist as filled/pill controls in this system.** Every call to action —
  door links, "Copy" on the paste block, footer links, the legal nav — is text plus a `.cta`/hover
  underline (`transform: scaleX()` reveal on the existing underline, not a color change, not a
  background fill). This matches the reference sites: Palantir/Anduril's primary marketing CTAs
  are text links with a hover state, not SaaS-gradient pill buttons. The Copy control is a
  `<button>` reset to this same text style.
- **One CTA style, reused everywhere.** `.cta` is mono, uppercase, small, with the underline
  animation in `--fast` (140ms) `ease`. There is no second "secondary button" variant to keep
  track of.

---

## 9. Motion

Reference behavior: Anduril's own site is explicitly "restrained" — motion exists, but it never
announces itself. Marketing motion is CSS `:hover`/`:focus-visible` only — nothing
scroll-triggered, nothing that plays on page load. The only JavaScript is `/assets/copy.js` on
the two paste blocks.

- Only `transform` and `opacity`/`border-color` transition — never `height`, `width`, or other
  layout-triggering properties.
- Duration: `140ms` (`--fast`), easing: `cubic-bezier(0.4, 0, 0.2, 1)` (`--ease`) — a plain
  ease-out, not a spring or bounce curve.
- `@media (prefers-reduced-motion: reduce)` collapses every transition/animation duration to
  effectively zero, globally, once.
- **Banned outright, no exceptions:** glow/box-shadow blooms, gradient sweeps, pulsing dots on a
  static status, parallax, autoplay of anything, scroll-linked reveals, spinners for content that
  isn't actually loading.

---

## 10. Accessibility

- **Contrast:** `#000000` background against `#FFFFFF` text is a 21:1 ratio — the maximum possible
  and far past WCAG AAA (7:1). This is a deliberate brand lock, not an oversight the tooling should
  flag; see §12 for how that's documented for automated checks.
- **Focus:** every interactive element gets a visible `2px solid #ffffff` outline with `4px`
  offset on `:focus-visible`. Never `outline: none` without a replacement — there is no replacement
  here, the browser default concept (a visible ring) is kept, just recolored to work on black.
  Note that `outline-color: #fff` needs the `4px` offset specifically because several of our CTAs
  sit directly against the black background: an unoffset white outline touching white text at
  21:1 contrast can look like it's touching the glyph itself, so the offset gives it clear air.
- **Structure:** exactly one `<h1>` per page ("Marketing engineering." / "dgtl-connector" /
  "A running growth system." / "Privacy Policy" / "Terms of Use"), a real heading (`<h2>`) for
  door labels, Free/Pro, and section labels even though they're styled as small mono labels —
  visual size and semantic level are allowed to disagree; that is normal and expected, not a bug.
- **Images:** the logo mark's `alt` is `""` (empty) on every page, because the adjacent visible
  text "DGTL Sunrise" already says the same thing — a screen reader would otherwise announce the
  name twice back to back.
- **Links:** every link's visible text describes its destination on its own ("Connector,"
  "Privacy," "Terms") — no bare "click here" / "learn more."
- **Landmarks:** `<header>`, `<main>`, `<footer>`, and a `<nav aria-label="Legal">` for the footer
  link pair, so assistive tech can jump straight to them.
- **No skip link.** Each marketing page is one short view with no repeated navigation block above
  the content (the header is two links, total), so a skip-to-content link would skip past nothing
  and add a landmark a screen-reader user has to tab past for no benefit. Reassess if a page grows
  a real repeated nav.
- **Motion:** covered in §9 — `prefers-reduced-motion` is respected globally.

---

## 11. Safe inspiration vs. copying

**What's safe to study and reuse from any brand, including Palantir and Anduril:**
- Grid math (12 columns, a gutter number, a margin scale) — this is shared professional
  convention, not intellectual property. Nobody owns "30px gutters."
- The *idea* that headline and supporting copy can have different column spans instead of a
  matching pair — a layout principle, not a specific design.
- The *idea* that a black/white palette signals precision when paired with a precise grid — a
  strategy, not an asset.
- Type-scale discipline (tighten tracking as size grows) — a typographic convention taught in any
  type design course.

**What is never safe, and is not present anywhere in this repo:**
- The licensed font files themselves (Alliance No.1/No.2, Helvetica Now Display, Elios) — not
  downloaded, not hotlinked from palantir.com/anduril.com or any CDN serving them, not embedded.
  §2's system stack is the substitute until/unless a license is purchased.
- Literal component code, literal CSS values lifted wholesale, or a recognizable signature layout
  copied 1:1 (e.g. Anduril's specific hero visual, Palantir's specific nav treatment).
- Their copy, their imagery, their product screenshots, their case studies.
- Their exact color hex values beyond the trivial, unownable `#000000`/`#ffffff` (this system does
  not use Anduril's `#010101` or Palantir's `#1e2124` — pure black/white is DGTL's own lock, stated
  independently in the brief before either reference was studied).

If a future contributor is unsure which side of this line something falls on, the test is: *would
removing this thing require re-licensing a specific named asset, or just re-deriving a number
anyone could re-derive from a ruler and a type book?* The first is off-limits; the second is fine.

---

## 12. Do / Don't

**Do**
- Keep the background `#000000` and the text `#FFFFFF` everywhere, no exceptions, no tinted
  near-black or near-white substitutes.
- Place every block on the 12-column grid with an explicit `grid-column` and an explicit
  `align-self`/`justify-self` — no default centering.
- Reuse the eight recipes in §6 before inventing a ninth.
- Keep every CTA a text link with the shared `.cta` underline treatment.
- Ship zero webfonts until a license for the display face in §2 is actually purchased.
- Keep the company home as two doors (`/connector`, `/engagements`). Put Free/Pro and the agent
  paste block on `/connector` only. Never invent a Polar checkout URL.

**Don't**
- Don't add gradients, glows, blurred orbs, or drop shadows anywhere.
- Don't add rounded corners, pill buttons, or a tile/card grid of "features."
- Don't add a fake terminal, a fake compile animation, or a status pill with a pulsing dot on
  content that never changes.
- Don't invent metrics, case studies, headcount, "about us," or "find a way to contact us" prose —
  the required copy in the project brief is the entire text budget for the marketing pages.
- Don't center a section just because it "looks unfinished" otherwise — that instinct is exactly
  what this whole system exists to override.
- Don't load Google Fonts or any third-party font CDN.
- Don't dim body text with opacity to fake a hierarchy — use §4's type scale instead.

---

## 13. File map

- `/assets/style.css` — the entire system: tokens, grid, recipes, and page component styles.
- `/assets/copy.js` — clipboard only, used by the paste blocks on `/connector` and `/engagements`.
- `/index.html`, `/connector.html`, `/engagements.html` — built from the recipes in §6.
- `/plugin.html` + `/_redirects` — `/plugin` → `/connector`.
- `/privacy.html`, `/terms.html` — legal shell restyled per §6a; body copy untouched except the
  footer emails.
- `/logo.webp` — the only logo asset referenced. `logo-mark.png`/`logo.png` remain in the repo for
  other historical uses but are not linked from these pages.
