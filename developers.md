# DGTL Sunrise developer resources for DGTL Connector

DGTL Connector by DGTL Sunrise is a local MCP plugin for Grok Bot and other MCP hosts. It connects your agent to marketing accounts you already administer. This page maps install docs, machine-readable site files, and the local MCP manifest.

## Product docs

- [DGTL Connector homepage](/)
- [Install](/#install) (Grok Bot marketplace when listed; Grok Build CLI; Cursor folder; Claude Desktop)
- [Free and Pro](/#free-and-pro)
- [Google Ads product page](/google-ads)
- [GitHub: dgtlsunrise/dgtl-connector](https://github.com/dgtlsunrise/dgtl-connector)

## Machine-readable site files

- [agent.json](/agent.json) · [/?mode=agent](/?mode=agent)
- [llms.txt](/llms.txt) · [llms-full.txt](/llms-full.txt) · [docs/llms.txt](/docs/llms.txt)
- [OpenAPI (docs discovery)](/openapi.json) · [api/openapi.yaml](/api/openapi.yaml)
- [MCP server.json](/server.json) (local stdio plugin manifest)
- [MCP server card](/.well-known/mcp/server-card.json)
- [sitemap.xml](/sitemap.xml)

## Local MCP plugin

DGTL Connector runs on your machine as a local stdio process (`bin/dgtl-connector-mcp`). Clone the GitHub repo, build it, and point your host at that binary. There is no remote MCP URL for account tools in v1.

## Support

support@dgtlsunrise.com · contact@dgtlsunrise.com · Sunrise Consulting LLC
