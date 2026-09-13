# dgtl-connector for Grok Bot

A Grok Bot plugin that connects your agent to your marketing accounts. Install it, connect Google (and Meta, Shopify, or TikTok when you need them), then ask in chat.

Free Google Analytics, Search Console, and Tag Manager reads run on your machine. Those report bytes do not go through DGTL.

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

Ask your agent for GA4 properties and reports. List accounts and properties. Open property details, data streams, and key events. Run reports for the date ranges and metrics you ask for. Property setup and admin changes are not in this version. Free. Connect Google.

### Google Search Console

Ask about verified sites, queries, and URL indexing status. List sites. Query search performance. Inspect a URL. List and open sitemaps. Submitting or changing sitemaps through the plugin is not available yet. Free. Connect Google.

### Google Tag Manager

Inspect containers. When writes are enabled on your install, create or update tags, triggers, and variables, and publish after you approve. Read is free. Edit and publish need writes enabled plus confirmation.

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
- [sitemap.xml](/sitemap.xml)

support@dgtlsunrise.com · contact@dgtlsunrise.com
