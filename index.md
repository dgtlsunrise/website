# Connect your Bot to the marketing accounts you already run.

A Grok Bot plugin that connects your Bot to Google, Meta, Shopify, Klaviyo, and TikTok marketing accounts. These connections let your Bot set up and manage accounts, pull reports, recommend changes, and push approved changes live after you review them. It also works with other MCP hosts such as Cursor and Claude Desktop.

[Install](/documentation#install) · [Documentation](/documentation)

**You.** Connect Google if it is not connected yet. Using dgtl-connector tools only, list every marketing account you can see. Do not guess or pick a default.

**Bot.** Google is connected. Example inventory: GA4 property 123456789 (example.com), Search Console sc-domain:example.com, and Tag Manager container GTM-XXXX. No other accounts on this install. Nothing changed live.

**You.** Compare last 28 days to the prior 28 for sessions and conversions on property 123456789.

**Bot.** Example numbers for property 123456789, last 28 days versus the prior 28. Sessions 12,480 versus 11,210. Conversions 186 versus 201. Sessions are up. Conversions are down. The largest landing-page drop is /pricing.

**You.** Draft a keyword pause list for campaign C where cost is high and conversions are zero for 14 days. Do not push live until I approve.

**Bot.** Draft pause list is in the workspace only. 12 keywords in campaign C with spend and zero conversions over 14 days. Live account is unchanged.

**You.** Approve.

**Bot.** Applied after your approval. Those 12 keywords are paused in campaign C.

## The platforms it talks to

dgtl-connector uses these marketing APIs after you connect the accounts you already run.

- [Google Analytics 4](/documentation#google-analytics-4)
- [Google Search Console](/documentation#google-search-console)
- [Google Tag Manager](/documentation#google-tag-manager)
- [Google Ads](/documentation#google-ads)
- [Meta Ads](/documentation#meta-ads)
- [Merchant Center](/documentation#merchant-center)
- [Google Business Profile](/documentation#google-business-profile)
- [Shopify](/documentation#shopify)
- [Klaviyo](/documentation#klaviyo)
- [TikTok Ads](/documentation#tiktok-ads)

Install, how to use, Free and Pro, and the full platform reference live on [Documentation](/documentation). Company pages: [About](/about) · [Contact](/contact).
