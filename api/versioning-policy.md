# Docs-discovery versioning policy

DGTL Connector docs discovery on dgtlsunrise.com uses URL path versioning for JSON routes under `/v1/docs-discovery/*`.

## Rules

1. The major version is in the path (`/v1/...`).
2. Breaking changes ship under a new `/vN` path.
3. Deprecated routes send `Deprecation` and `Sunset` response headers and stay available until the Sunset date.
4. Non-breaking additive changes may stay on the current major version.
5. See `/openapi.json` and `/api/versioning-policy` (JSON).

This policy applies to the public docs-discovery surface only. It is not an Ads account API versioning policy.
