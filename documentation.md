# Documentation

Install, how to use, Free and Pro, and the platform reference for dgtl-connector. This page is the product docs. The homepage is the short product introduction.

## Contents

1. [Install](#install)
   1. [Grok Bot](#install-grok-bot)
   2. [Grok Build](#install-grok-build)
   3. [Cursor](#install-cursor)
   4. [Claude Desktop](#install-claude-desktop)
2. [How to use it](#how-to-use)
   1. [Start with a map](#start-with-a-map)
   2. [Starter prompt](#starter-prompt)
   3. [Ask for decisions, not dumps](#ask-for-decisions)
   4. [Confirm before live changes](#confirm-before-live-changes)
3. [Free and Pro](#free-and-pro)
   1. [What is free](#what-is-free)
   2. [What is Pro](#what-is-pro)
4. [Platforms](#platforms)
   1. [Google Analytics 4](#google-analytics-4)
   2. [Google Search Console](#google-search-console)
   3. [Google Tag Manager](#google-tag-manager)
   4. [Google Ads](#google-ads)
   5. [Meta Ads](#meta-ads)
   6. [Merchant Center](#merchant-center)
   7. [Google Business Profile](#google-business-profile)
   8. [Shopify](#shopify)
   9. [Klaviyo](#klaviyo)
   10. [TikTok Ads](#tiktok-ads)
5. [Company](#company)

## Install

You do not need a DGTL Sunrise account to get started. Pick your agent host.

### Grok Bot

Install from the Grok Bot marketplace when DGTL Connector is listed. That is the one-click Bot path. The `grok plugin install` CLI command does not install into Bot.

The marketplace listing is under review. Grok Build and Cursor remain complete install paths.

### Grok Build

Use the Grok CLI. This installs into Grok Build, not Grok Bot.

```
grok plugin install dgtlsunrise/dgtl-connector
```

### Cursor

Clone the public repo, build it, then load that folder as a local Agent Plugin (`mcp.json`). Grok Build can also load the built folder with `.mcp.json`.

```
git clone https://github.com/dgtlsunrise/dgtl-connector.git
cd dgtl-connector
npm install
npm run build
```

### Claude Desktop

Build the repo with the Cursor steps above, then add this stdio server in Claude Desktop MCP settings. Replace the paths with the absolute paths on your machine.

```
{
  "mcpServers": {
    "dgtl-connector": {
      "command": "/path/to/dgtl-connector/bin/dgtl-connector-mcp",
      "env": {
        "PLUGIN_DATA": "/path/to/dgtl-connector-data"
      }
    }
  }
}
```

ChatGPT and other hosts that can run a local stdio MCP server use the same `bin/dgtl-connector-mcp` command after you build the repo. Hand-wiring a custom MCP server in Grok Bot is an advanced tools-only option; it is not the marketplace install and does not include the full plugin package.

## How to use it

1. Install the plugin in your agent host.
2. Connect the account that owns the property, site, or ad account you care about.
3. Ask in chat. Name the property, site, or account when you have more than one.
4. Review and approve before anything is published or changed on your accounts.

### Start with a map

Before you ask for numbers, ask the Bot to list what it can see: GA4 properties, Search Console sites, GTM accounts, or ad accounts. Then pick the one you mean in plain language. If you leave it vague, a careful Bot will ask which one. Do not let it guess among agency or client accounts.

### Starter prompt

Paste this so the Bot knows you installed `dgtl-connector`, even if you come back weeks later. It should use those tools only, and it should not guess which account you mean.

```
I installed the dgtl-connector plugin (DGTL Sunrise). Connect Google if it is not connected yet. Using dgtl-connector tools only, list every marketing account the plugin can see: GA4 properties, Search Console sites, Tag Manager accounts and containers, plus Shopify, Klaviyo, or ad accounts if those are connected. Do not guess or pick a default. Summarize what is connected, what looks healthy, and the top three questions I should ask next. Keep it short. Do not change anything live.
```

### Ask for decisions, not dumps

Short, specific asks beat vague ones. Prefer a date range, a comparison, and the decision you need. Examples that work well:

- Compare last 28 days to the prior 28 for sessions, conversions, and top landing pages on property X.
- Which Search Console queries gained impressions but lost clicks this month on site Y?
- Show the live GTM tags on container Z and flag anything that still fires on thank-you without a conversion.
- Draft a keyword pause list for campaign C where cost is high and conversions are zero for 14 days. Do not push live until I approve.

If the Bot invents a metric or a property id, stop it and ask it to re-run from the connected account. Real tools beat remembered numbers.

### Confirm before live changes

When you Connect Google for Free features, you grant all Free Google permissions in that one Connect. The plugin expects those permissions before Free Google tools are useful. Live changes still need your confirmation. Treat chat as a draft surface: approve publishes, pauses, budget moves, and catalog edits the same way you would approve a pull request.

## Free and Pro

**What is free.** Install the plugin and connect the marketing accounts you already use. No DGTL Sunrise account is required.

- Free Google Analytics 4, Search Console, and Tag Manager run on your machine (read and manage). Connect Google once with all Free permissions up front. Nothing goes live until you approve it. Report bytes stay on your machine and do not go through DGTL.
- Klaviyo uses a private API key you hold on the install. Free. Not Pro. The key stays on your machine.
- Shopify connects on the install. Catalog and inventory changes wait for your approval.
- Google Business Profile can be read when that path is available. Edit is not in this version.

**What is Pro.** Pro is $19 / month. It unlocks the hosted gateway for advertising platforms, plus Pro-gated Merchant Center on your machine:

- Google Ads reporting, plus manage and create (campaigns, budgets, keywords, ads, and more).
- Meta Ads insights, campaigns, ad sets, ads, audiences, catalogs, and Conversions API events.
- TikTok Ads advertisers, campaigns, insights, catalogs, and Events API tracking.

Nothing is published or changed on your ad accounts until you review and approve it first.

Meta Ads and TikTok Ads are included in Pro. Access on those platforms depends on Meta and TikTok granting app access for the connected account. The plugin reports a denied or pending grant instead of inventing results.

Paste this to ask the Bot to upgrade to Pro. Redeem the license on the install. Never paste tokens or license keys into chat.

```
I use the dgtl-connector plugin (DGTL Sunrise). I want DGTL Pro for Google Ads / Meta / TikTok. Walk me through Polar checkout at $19 / month using https://buy.polar.sh/polar_cl_aIrywIIxJ2cOwj70VQAcJn2umEgSS9kWBMUJS241Dll, then redeem the license on this install using the one-time code or checkout id Polar gives me. Do not ask me to paste a license JWT into chat. After redeem succeeds, confirm license_status and tell me what to Connect next. Do not change any live ad accounts until I approve.
```

## Platforms

### Google Analytics 4

Ask your agent for GA4 properties, reports, and property settings the tools support. List accounts and properties. Open property details, data streams, and key events. Run reports for the date ranges and metrics you ask for. Manage property settings the tools support (data streams, key events, custom definitions, and Measurement Protocol secrets where enabled). Connect Google once with all Free permissions up front. Live changes need your confirmation. Free. Connect Google.

### Google Search Console

Ask about verified sites, queries, URL indexing status, and sitemaps. List sites. Query search performance. Inspect a URL. List and open sitemaps. Submit or delete sitemaps after you confirm. Connect Google once with all Free permissions up front. Free. Connect Google.

### Google Tag Manager

Inspect containers and manage tags, triggers, and variables. Publish after you approve. Free. Connect Google. Live edits and publishes need your confirmation.

### Google Ads

With Pro ($19 / month), ask for account reporting and confirm-gated changes (pause or enable, budgets, keywords, ads, and new campaigns where enabled). Every live change needs confirmation.

### Meta Ads

With Pro, ask for ad account insights and, when Meta access allows, create or update campaigns, ad sets, ads, and audiences. List catalogs and catalog products. Create a catalog and batch catalog products. Upload Conversions API events when that path is enabled on your install. Nothing goes live until you approve it. Pro is required. Meta app access still applies.

### Merchant Center

With Pro, list accounts, products, statuses, account issues, and data sources. Create a data source. Upsert or delete product inputs. Nothing goes live until you approve it. Pro ($19 / month). Connect the Google account that owns Merchant Center. Live edits need writes enabled on your install, plus confirmation. Calls stay on your machine; this is not the Ads/Meta/TikTok Worker hop.

### Google Business Profile

List accounts and locations. Performance and search keywords. Edit is not in this version. Some calls need Google’s Business Profile API access.

### Shopify

Shop details, products, orders, locations, inventory, publications, catalogs, and product feeds. Adjust inventory. Create or update products with a product set. Nothing goes live until you approve it.

### Klaviyo

**Overview.** Ask your agent about your Klaviyo account, lists, segments, flows, campaigns, catalog, and reviews. It can create a draft email campaign, send an existing draft after you confirm, and update profiles or catalog items.

**Read.** Open the account. List profiles (sparse fields only). Show lists, segments, flows, campaigns, and metrics. List catalog items, categories, and variants. List reviews.

**Edit.** Create a draft email campaign. Send an existing draft. That send needs its own confirmation. Upsert a profile. Create an event for backfill. Upsert catalog items (capped). Nothing goes live until you approve it.

**Requirements.** Free. This is not a Pro feature. Connect Klaviyo with a private API key you hold on the install. That key stays on your machine. Never paste the key into chat.

**Example asks.** Which Klaviyo lists and segments can I access? Show recent email campaigns and their status. Create a draft email campaign after I confirm. Send this existing draft after I confirm send. Upsert this profile after I confirm.

**Guardrails.** The agent never asks you to paste the API key into chat. It asks which account or list to use when more than one is available. It does not invent profile fields. Creating a draft does not send it. A send needs its own explicit send confirmation.

### TikTok Ads

List advertisers, campaigns, insights, and catalogs. With Pro: campaign status updates, catalog create/upload/bind, and Events API tracking. TikTok Ads is included in Pro. Reads and writes depend on TikTok granting the needed app access for the connected account. Nothing goes live until you approve it.

## Company

Sunrise Consulting LLC, doing business as DGTL Sunrise, ships dgtl-connector from Coeur d’Alene, Idaho. The plugin connects your agent to the marketing accounts you already run. Legal name, address, and contacts are on [About](/about). Site: https://www.dgtlsunrise.com/

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
