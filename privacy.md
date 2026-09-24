# Privacy Policy · DGTL Sunrise

Effective September 24, 2026. Sunrise Consulting LLC, doing business as DGTL Sunrise. 2152 W Lima Pl, Coeur d’Alene, ID 83814. contact@dgtlsunrise.com.

This policy covers dgtlsunrise.com, the Grok Bot plugin, the Muse connector, and related consulting work. Full HTML: [/privacy](/privacy).

## Summary

- Grok Bot plugin (GA4, Search Console, GTM): connect Google on your machine for read and manage. Connect Google once with all Free permissions up front. Live edits need confirmation. OAuth tokens for the Grok Bot plugin stay on your computer. Report bytes stay in the local session. Sunrise Consulting LLC does not receive those Grok Bot report bytes and does not store those report bytes on DGTL servers. When you connect Klaviyo, the private API key stays on your machine.
- Muse connector: you sign in with Google on https://muse-api.dgtlsunrise.com. We store the Google refresh token on DGTL servers, encrypted with AES-256-GCM (JOSE alg A256GCM), and keep the DGTL access token only as a one-way hash. Report bytes are not stored. One user's stored Muse refresh token is not available to another user's Muse session. A complete disconnect requires both steps: revoke DGTL Sunrise at Google Account permissions, and email contact@dgtlsunrise.com so we delete the stored refresh token. Grok Bot plugin tokens stay on your computer.
- Paid Google Ads, Meta, and TikTok (Pro) use an allowlisted DGTL gateway for reads and confirm-gated changes. The gateway returns vendor responses to your session and does not archive report bytes. We share data with Google, Meta, or TikTok when you authorize an API call. Merchant Center is also Pro-gated but plugin-direct on your machine (not that gateway hop).
- Use of Google API data adheres to the Google API Services User Data Policy, including Limited Use.
- We do not request Gmail, Drive, Calendar, or Contacts. We do not sell personal information. For the Grok Bot plugin, revoke access at https://myaccount.google.com/permissions and delete the local plugin data on your machine. A complete Muse disconnect requires both steps: revoke DGTL Sunrise at Google Account permissions, and email contact@dgtlsunrise.com so we delete the stored refresh token.

## Where that data lives

### Muse connector

When you connect DGTL Sunrise to Muse, you sign in with Google on https://muse-api.dgtlsunrise.com. You grant read-only access to Google Analytics (analytics.readonly, https://www.googleapis.com/auth/analytics.readonly), plus your Google account ID and email (openid and userinfo.email, https://www.googleapis.com/auth/userinfo.email). We store the Google refresh token on DGTL servers, encrypted with AES-256-GCM (JOSE alg A256GCM). We keep the DGTL access token only as a one-way hash. We use the refresh token only to fetch the Analytics reports you ask Muse for, and we do not store those report bytes. One user's stored Muse refresh token is not available to another user's Muse session. A complete disconnect requires both steps: revoke DGTL Sunrise at Google Account permissions (https://myaccount.google.com/permissions), and email contact@dgtlsunrise.com so we delete the stored refresh token. The Grok Bot plugin is unchanged. Its tokens stay on your computer.

Contact: contact@dgtlsunrise.com.
