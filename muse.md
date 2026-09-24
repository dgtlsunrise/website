# Connect DGTL Sunrise to Muse

DGTL Sunrise exposes a Free Google Analytics read API for Muse over HTTPS. Connect Google, store the Bearer token in Muse, and point Muse at the base URL and OpenAPI document on this page. Full HTML: [/muse](/muse).

## Endpoints

The base URL is `https://muse-api.dgtlsunrise.com`.

The OpenAPI URL is `https://muse-api.dgtlsunrise.com/openapi.json`.

The connect URL is `https://muse-api.dgtlsunrise.com/connect`.

Authentication is a Bearer token minted after Google connect. The token starts with `dgtl_muse_`.

## How to connect

1. Open the connect page and choose Connect Google Analytics.
2. Sign in with the Google account that owns your GA4 property. Grant read-only Analytics access.
3. Copy the one-time Bearer token Muse shows. It starts with `dgtl_muse_`. Store it in Muse as the connector credential.
4. Point Muse at the base URL and the OpenAPI URL above.

## Example asks

Sessions are available for the last 28 days. Ask Muse: "How many sessions did property 554200375 get in the last 28 days?"

Muse calls this path with the Bearer token:

```
GET /v1/ga4/properties/{property_id}/sessions?start_date=28daysAgo&end_date=yesterday
```

Send the token on that request as `Authorization: Bearer dgtl_muse_…`.

## Writes

A write is previewed first. Muse must then send `confirm_phrase`, and that phrase must include the resource id. The stub returns `executed: false` with reason `stub_no_mutate`.

## Access requirements

Use a Google account that can access the GA4 property you name.

Connect requests `openid`, `userinfo.email`, and `https://www.googleapis.com/auth/analytics.readonly`.

The privacy policy is at https://www.dgtlsunrise.com/privacy.

## Guardrails

- DGTL Sunrise does not warehouse report bytes. The response goes back to Muse for the request.
- Refresh tokens for Muse are stored encrypted on DGTL servers. The privacy policy describes that storage.
- The tip stdio plugin and the stamp Ads and Meta path are separate products and are unchanged.
