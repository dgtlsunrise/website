# Product

Audience: a founder or marketer who already has GA4, Search Console, or Tag Manager, and wants those products in the agent they already use (read and manage).

Purpose: dgtl-connector is a free local Grok plugin. You install it, connect accounts you administer, then read and manage those products. Connect Google once with all Free permissions up front. Live edits need confirmation. DGTL Sunrise is the company that ships that plugin and, for a fee, a hosted Ads and Meta gateway.

Not: a dual-door brochure, a plugin company name on `/`, a personal brand, a staff count, invented metrics.

## Public site (this repo)

Visual rules live in `BRAND-GUIDE.md`. Information architecture:

| Route | Job |
|---|---|
| `/` | Install command, six-step loop, free byte path, short Pro pointer. |
| `/connector` | Worksheet. `#install` and `#pro`. |
| `/google-ads` | Google Ads product page for API compliance (confirm-gated manage, not read-only). |
| `/engagements` | Thin hire page. Out of primary nav. Footer mailto. |
| `/privacy`, `/terms` | Legal claims. Restyle the shell only. |
| `/plugin` | 301 to `/connector`. |

Primary nav is Connector plus Install. Talk and Engagements stay out of primary nav.

## The loop

1. Install
2. Auth
3. Pull
4. Analyze
5. Recommend
6. Confirm a live edit or publish when the tools support it

Free is self-hosted. Free GA4, Search Console, and Tag Manager are read and manage on the machine. On the free path, tokens and report bytes never go through DGTL. The platform talks to the agent on the machine you installed.

Pro is $19/mo for the hosted Ads and Meta gateway only. One Polar customer. The same human may use more than one host. No employee seats. Unlimited ad accounts under that human's OAuth. Server-side GTM is not in this version.

Documented Polar checkout: `https://buy.polar.sh/polar_cl_aIrywIIxJ2cOwj70VQAcJn2umEgSS9kWBMUJS241Dll`. Ask the Bot in plain language, then redeem on the install. Do not invent another Polar checkout URL. Do not name Ryze in served HTML.

## How DGTL gets paid

1. The free plugin.
2. Pro at $19/mo for Ads and Meta through the hosted gateway.
3. An engagement, reached by email, not by a second door on `/`.

Do not put extra dollar amounts on the site unless Noel locks them.

## Evidence and voice

None invented. No RainbowOPTX unless a later pass proves it serves this. No $250K/$1M. No headcount. No fake logos. No SOC2/ISO. No "1,500 apps." No invented GA metrics. If an example number appears, label it as an example.

Voice: plain, specific. Sentence-case headings. No em dashes on marketing copy.

Operating context: public site on Cloudflare from Origin. Do not publish until Noel says go. This rebuild is preview-only.
