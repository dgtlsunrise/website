# DGTL Connector developer resources

DGTL Connector by DGTL Sunrise is a local stdio MCP plugin. Agents use it to connect to Google, Meta, Shopify, Klaviyo, and TikTok marketing APIs. This page is the public map for install, machine-readable docs, and the MCP server manifest.

## Product

- [DGTL Connector docs homepage](/)
- [Install commands](/#install) (Grok Bot, Cursor, Grok Build, Claude Desktop)
- [Free and Pro](/#free-and-pro)
- [Google Ads product page](/google-ads)
- [GitHub source (dgtlsunrise/dgtl-connector)](https://github.com/dgtlsunrise/dgtl-connector)

## Machine-readable

- [agent.json](/agent.json) · also [/?mode=agent](/?mode=agent)
- [llms.txt](/llms.txt) · [llms-full.txt](/llms-full.txt) · [docs/llms.txt](/docs/llms.txt) · [api/llms.txt](/api/llms.txt)
- [MCP server.json](/server.json) (local stdio manifest)
- [.well-known/mcp/server-card.json](/.well-known/mcp/server-card.json)
- [sitemap.xml](/sitemap.xml)

## MCP transport

DGTL Connector ships as a local stdio MCP server (`bin/dgtl-connector-mcp`). Clone the GitHub repo, build it, and point your host at that binary. There is no hosted Streamable HTTP MCP for ad-account tools in v1; Pro Ads/Meta/TikTok API hops use the allowlisted stamp gateway after local plugin auth, not a remote MCP URL.

## Support

support@dgtlsunrise.com · contact@dgtlsunrise.com · Sunrise Consulting LLC
