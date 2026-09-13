# dgtlsunrise.com

Static Cloudflare Pages site for DGTL Sunrise. The public offering is dgtl-connector, a free local Grok plugin, plus a $19/mo Ads and Meta gateway.

This checkout is preview-only. Do not run `wrangler pages deploy`. Do not publish to dgtlsunrise.com from this work.

## Preview

```bash
npm install
npx wrangler pages dev . --port 8787
```

Open `http://127.0.0.1:8787/`. The install command on `/` is in the HTML. It does not need JavaScript.

`wrangler.jsonc` sets `not_found_handling` to `404-page`, so unknown paths serve `404.html` with status 404. `_redirects` sends `/plugin` to `/connector` with a 301. A raw file server will not honor `_redirects`.

## Check locks

```bash
node scripts/check-site.mjs
```

With a preview already running:

```bash
node scripts/check-site.mjs --base http://127.0.0.1:8787
```

The script fails if the install command is missing, if the free-path read-and-manage sentence drifts, if Ryze or a Polar checkout URL appears, if dual-door copy returns, if internal Consent A/W/C labels appear on public HTML/md/json/llms, or if `/google-ads` drops project 960111255083, MCC 684-442-5544, customer login, or confirm-gated management.

## Docs

- `PRODUCT.md`. What we sell and what the routes do.
- `DESIGN.md`. Implementation contract.
- `BRAND-GUIDE.md`. Visual and copy source of truth.

`.assetsignore` keeps `plan/`, `demos/`, and `cloudflare-live/` out of a Pages upload if those trees return.
