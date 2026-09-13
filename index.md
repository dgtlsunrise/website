# dgtl-connector for Grok Bot

A Grok Bot plugin that connects your agent to your marketing accounts. Install it, connect Google (and Meta, Shopify, or TikTok when you need them), then ask in chat.

Free Google Analytics, Search Console, and Tag Manager run on your machine (read and manage). Report bytes do not go through DGTL.

## Install

In Grok Bot, run:

```
grok plugin install dgtlsunrise/dgtl-connector
```

Connect the account that owns the property when the plugin asks. Also works in Grok Build and Cursor.

## How to use it

1. Install the plugin in Grok Bot.
2. Connect the account that owns the property.
3. Ask in chat.
4. Approve any confirmation before a live edit or publish.

Never paste access tokens, refresh tokens, or license keys into chat.

## Platforms

### Google Analytics 4

Ask your agent for GA4 properties, reports, and property settings the tools support. List accounts and properties. Open property details, data streams, and key events. Run reports for the date ranges and metrics you ask for. Manage property settings the tools support (data streams, key events, custom definitions, and Measurement Protocol secrets where enabled). Live changes need your confirmation. Edits are off by default until you enable writes on the install. Free. Connect Google.

### Google Search Console

Ask about verified sites, queries, URL indexing status, and sitemaps. List sites. Query search performance. Inspect a URL. List and open sitemaps. Submit or delete sitemaps after you confirm. Edits are off by default until you enable writes on the install. Free. Connect Google.

### Google Tag Manager

Inspect containers and manage tags, triggers, and variables. Publish after you approve. Free. Connect Google. Live edits and publishes need writes enabled on your install, plus confirmation.

### Google Ads

With Pro ($19 / month), ask for account reporting and confirm-gated changes (pause or enable, budgets, keywords, ads, and new campaigns where enabled). Every live change needs confirmation. Details: [/google-ads](/google-ads).

### Meta Ads

With Pro, ask for ad account insights and, when Meta access allows, create or update campaigns, ad sets, ads, and audiences. Live changes need confirmation.

### Merchant Center

List accounts, products, statuses, account issues, and data sources. Edit is not in this version.

### Google Business Profile

List accounts and locations. Performance and search keywords. Edit is not in this version. Some calls need Google’s Business Profile API access.

### Shopify

Shop details, products, orders, locations, inventory. Inventory adjust when that write path is enabled. Live changes need confirmation.

### TikTok Ads

List advertisers and campaigns. Insights. Campaign status updates when TikTok access and Pro entitlement allow them.

## Company

DGTL Sunrise (Sunrise Consulting LLC). Site: https://www.dgtlsunrise.com/

- [About](/about)
- [Contact](/contact)
- [Privacy](/privacy)
- [Terms](/terms)
- [llms.txt](/llms.txt)
- [llms-full.txt](/llms-full.txt)
- [agent.json](/agent.json)
- [Agent mode (JSON)](/?mode=agent)
- [sitemap.xml](/sitemap.xml)

support@dgtlsunrise.com · contact@dgtlsunrise.com
