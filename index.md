# dgtl-connector for Grok Bot

A Grok Bot plugin that connects your agent to your marketing accounts. Install it, connect Google (and Meta, Shopify, Klaviyo, or TikTok when you need them), then ask in chat.

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

With Pro, ask for ad account insights and, when Meta access allows, create or update campaigns, ad sets, ads, and audiences. List catalogs and catalog products. Create a catalog and batch catalog products. Upload Conversions API events when that path is enabled on your install. Live changes need confirmation. Pro is required. Meta app access still applies.

### Merchant Center

List accounts, products, statuses, account issues, and data sources. Create a data source. Upsert or delete product inputs. Live changes need confirmation. Writes are off by default until you enable them on the install. Connect the Google account that owns Merchant Center.

### Google Business Profile

List accounts and locations. Performance and search keywords. Edit is not in this version. Some calls need Google’s Business Profile API access.

### Shopify

Shop details, products, orders, locations, inventory, publications, catalogs, and product feeds. Adjust inventory. Create or update products with a product set. Live changes need confirmation. Those write paths are off until you enable them on the install.

### Klaviyo

**Overview.** Ask your agent about your Klaviyo account, lists, segments, flows, campaigns, catalog, and reviews. When writes are enabled on your install, it can create a draft email campaign, send an existing draft after you confirm, and update profiles or catalog items.

**Read.** Open the account. List profiles (sparse fields only). Show lists, segments, flows, campaigns, and metrics. List catalog items, categories, and variants. List reviews.

**Edit.** Create a draft email campaign. Send an existing draft. That send needs its own confirmation. Upsert a profile. Create an event for backfill. Upsert catalog items (capped). Live changes need confirmation. Writes are off by default until you enable them on the install.

**Requirements.** Free. This is not a Pro feature. Connect Klaviyo with a private API key you hold on the install. That key stays on your machine. Never paste the key into chat.

**Example asks.** Which Klaviyo lists and segments can I access? Show recent email campaigns and their status. Create a draft email campaign after I confirm. Send this existing draft after I confirm send. Upsert this profile after I confirm.

**Guardrails.** The agent never asks you to paste the API key into chat. It asks which account or list to use when more than one is available. It does not invent profile fields. Creating a draft does not send it. A send needs its own explicit send confirmation.

### TikTok Ads

List advertisers, campaigns, insights, and catalogs. Campaign status updates, catalog create/upload/bind, and Events API tracking when TikTok access and Pro entitlement allow them. Live changes need confirmation.

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
