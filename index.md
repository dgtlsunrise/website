# dgtl-connector for Grok Bot

A Grok Bot plugin that connects your agent to your marketing accounts. Install it, connect Google (and Meta, Shopify, Klaviyo, or TikTok when you need them), then ask in chat.

Free Google Analytics, Search Console, and Tag Manager run on your machine (read and manage). Report bytes do not go through DGTL.

## Install

In Grok Bot, run:

```
grok plugin install dgtlsunrise/dgtl-connector
```

You do not need a DGTL Sunrise account to get started. Connect the account that owns the property when the plugin asks. Also works in Grok Build and Cursor.

## How to use it

1. Install the plugin in Grok Bot.
2. Connect the account that owns the property.
3. Ask in chat.
4. Review and approve before anything is published or changed on your accounts.

Never paste access tokens, refresh tokens, or license keys into chat.

## Free and Pro

**What is free.** Install the plugin and connect the marketing accounts you already use. No DGTL Sunrise account is required.

- Google Analytics 4, Search Console, and Tag Manager run on your machine (read and manage). Edits stay off until you enable writes on the install, and nothing goes live until you approve it. Report bytes stay on your machine and do not go through DGTL.
- Klaviyo uses a private API key you hold on the install. Free. Not Pro. The key stays on your machine.
- Shopify connects on the install. Catalog and inventory changes wait for your approval.
- Merchant Center is plugin-direct Google. You can create a data source and upsert or delete product inputs when writes are enabled, and only after you approve. This is not the Pro gateway.
- Google Business Profile can be read when that path is available. Edit is not in this version.

**What is paid.** Pro is $19 / month. It unlocks the hosted gateway for advertising platforms:

- Google Ads reporting, plus manage and create (campaigns, budgets, keywords, ads, and more). Details: [/google-ads](/google-ads).
- Meta Ads insights, campaigns, ad sets, ads, audiences, catalogs, and Conversions API events (when Meta has granted the needed app access).
- TikTok Ads advertisers, campaigns, insights, catalogs, and Events API tracking.*

Nothing is published or changed on your ad accounts until you review and approve it first.

\*TikTok Ads is included in Pro. We expect TikTok to finish approving our app access soon; until then some TikTok calls may wait on that approval.

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

With Pro, ask for ad account insights and, when Meta access allows, create or update campaigns, ad sets, ads, and audiences. List catalogs and catalog products. Create a catalog and batch catalog products. Upload Conversions API events when that path is enabled on your install. Nothing goes live until you approve it. Pro is required. Meta app access still applies.

### Merchant Center

List accounts, products, statuses, account issues, and data sources. Create a data source. Upsert or delete product inputs. Writes stay off until you enable them on the install, and nothing goes live until you approve it. Connect the Google account that owns Merchant Center.

### Google Business Profile

List accounts and locations. Performance and search keywords. Edit is not in this version. Some calls need Google’s Business Profile API access.

### Shopify

Shop details, products, orders, locations, inventory, publications, catalogs, and product feeds. Adjust inventory. Create or update products with a product set. Those write paths stay off until you enable them on the install, and nothing goes live until you approve it.

### Klaviyo

**Overview.** Ask your agent about your Klaviyo account, lists, segments, flows, campaigns, catalog, and reviews. When writes are enabled on your install, it can create a draft email campaign, send an existing draft after you confirm, and update profiles or catalog items.

**Read.** Open the account. List profiles (sparse fields only). Show lists, segments, flows, campaigns, and metrics. List catalog items, categories, and variants. List reviews.

**Edit.** Create a draft email campaign. Send an existing draft. That send needs its own confirmation. Upsert a profile. Create an event for backfill. Upsert catalog items (capped). Writes stay off until you enable them on the install, and nothing goes live until you approve it.

**Requirements.** Free. This is not a Pro feature. Connect Klaviyo with a private API key you hold on the install. That key stays on your machine. Never paste the key into chat.

**Example asks.** Which Klaviyo lists and segments can I access? Show recent email campaigns and their status. Create a draft email campaign after I confirm. Send this existing draft after I confirm send. Upsert this profile after I confirm.

**Guardrails.** The agent never asks you to paste the API key into chat. It asks which account or list to use when more than one is available. It does not invent profile fields. Creating a draft does not send it. A send needs its own explicit send confirmation.

### TikTok Ads

List advertisers, campaigns, insights, and catalogs. With Pro: campaign status updates, catalog create/upload/bind, and Events API tracking. TikTok Ads is included in Pro. We expect TikTok to finish approving our app access soon; until then some TikTok calls may wait on that approval. Nothing goes live until you approve it.

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
