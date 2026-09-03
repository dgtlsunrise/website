# Design — implementation contract

Full rationale, sources, and rules live in **[BRAND-GUIDE.md](./BRAND-GUIDE.md)**. This file is
the short version Impeccable and future edits should check against before anything ships.

## The lock

- `#000000` background, `#FFFFFF` text. Everywhere. No near-black, no near-white, no gray-as-text.
  This is intentional and documented — see BRAND-GUIDE §5, §10, §12. It is not a contrast bug.
- Logo: `/logo.webp` (transparent) + the literal words "DGTL Sunrise" next to it. No other logo
  file is linked from these pages.
- Type: `--font-sans: "Helvetica Neue", Helvetica, Arial, sans-serif` for everything except mono
  labels, which use `--font-mono: ui-monospace, SFMono-Regular, Menlo, monospace`. No webfonts, no
  Google Fonts. Licensed swap path (Helvetica Now Display + Elios, or Alliance No.2 + No.1) is
  documented in BRAND-GUIDE §2 and gated on an actual license — do not add it speculatively.
- Grid: 12 columns always; margin/gutter scale by breakpoint per BRAND-GUIDE §3.
- Radius: `0`. No pills, no rounded cards.
- Motion: `transform`/`opacity` only, `140ms` ease-out, hover/focus states only, zero JS, respects
  `prefers-reduced-motion`.
- Copy: the project brief's required copy is the entire text budget for `index.html` and
  `plugin.html`. No invented offering prose, no case studies, no "about," no headcount, no vague
  "contact us."
- Plugin CTA always points to `/plugin` and is labeled honestly ("Plugin details," "In
  development") — never implies a live install.
- Legal pages (`privacy.html`, `terms.html`) keep their reviewed body copy; only the header/footer
  shell moves to the black/white system and the contact address becomes `contact@dgtlsunrise.com`.

## Method

1. Every new block gets an explicit `grid-column` + `align-self`/`justify-self`. If you didn't set
   both, you defaulted to centered — go back and pick an edge (BRAND-GUIDE §7).
2. Reuse one of the eight named recipes in BRAND-GUIDE §6 before inventing a new layout pattern.
3. One shared stylesheet: `/assets/style.css`. Don't fork per-page inline `<style>` blocks again.
4. `npx --yes impeccable detect <file>.html` on every page before calling it done. Fix real
   findings. The `#000/#fff` contrast and the zero-radius/no-pill-button choices are intentional —
   see BRAND-GUIDE §10/§12 if a future check flags them; don't "fix" the lock itself.
5. Recheck this file and BRAND-GUIDE.md stay true after any edit — if a page needs something
   neither doc allows, update the docs first, then the page.

## Ban list (unchanged intent, restated for the black/white system)

Gradients, glow, blurred orbs, fake terminals, compile.sh theater, pulsing status dots on static
content, rounded card grids, pill hero chips, decorative motion, gray/near-black/near-white text
or backgrounds, Google Fonts, invented metrics or copy beyond the brief.
