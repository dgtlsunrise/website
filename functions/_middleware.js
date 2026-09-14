/**
 * Homepage ?mode=agent → agent.json.
 * JSON / markdown content negotiation.
 * Docs-discovery health, versioning policy, rate-limit headers.
 * Streamable HTTP MCP at /mcp for docs tools.
 */

const MD_TYPE = "text/markdown; charset=utf-8";
const JSON_TYPE = "application/json; charset=utf-8";
const PROBLEM_TYPE = "application/problem+json; charset=utf-8";
const VARY = "Accept, Accept-Encoding";
const API_VERSION = "1";
const RATE_LIMIT = 120;
const RATE_WINDOW = 60;
const ASSET_CACHE_CONTROL = "public, max-age=300, must-revalidate";

const PATH_TO_MD = {
  "/": "/index.md",
  "/index": "/index.md",
  "/index.html": "/index.md",
  "/about": "/about.md",
  "/about.html": "/about.md",
  "/contact": "/contact.md",
  "/contact.html": "/contact.md",
  "/privacy": "/privacy.md",
  "/privacy.html": "/privacy.md",
  "/terms": "/terms.md",
  "/terms.html": "/terms.md",
  "/google-ads": "/google-ads.md",
  "/google-ads.html": "/google-ads.md",
  "/engagements": "/engagements.md",
  "/engagements.html": "/engagements.md",
  "/developers": "/developers.md",
  "/developers.html": "/developers.md",
  "/404": "/404.md",
  "/404.html": "/404.md",
};

function parseAccept(header) {
  if (!header) return [];
  return header.split(",").map((part) => {
    const [rawType, ...params] = part.trim().split(";");
    let q = 1;
    for (const p of params) {
      const [k, v] = p.trim().split("=");
      if (k === "q" && v != null) {
        const n = Number(v);
        if (!Number.isNaN(n)) q = n;
      }
    }
    return { type: (rawType || "").trim().toLowerCase(), q };
  });
}

function maxQ(types, names) {
  let best = -1;
  for (const { type, q } of types) {
    if (names.includes(type)) best = Math.max(best, q);
  }
  return best;
}

function prefersMarkdown(acceptHeader) {
  const types = parseAccept(acceptHeader);
  if (!types.length) return false;
  const mdQ = maxQ(types, ["text/markdown", "text/x-markdown"]);
  if (mdQ < 0) return false;
  const htmlQ = maxQ(types, ["text/html", "application/xhtml+xml"]);
  const starQ = maxQ(types, ["*/*"]);
  const htmlScore = htmlQ >= 0 ? htmlQ : starQ >= 0 && mdQ < starQ ? starQ : 0;
  if (mdQ > htmlScore) return true;
  if (mdQ === htmlScore && mdQ > 0) {
    const mdIdx = types.findIndex(
      (t) => t.type === "text/markdown" || t.type === "text/x-markdown"
    );
    const htmlIdx = types.findIndex(
      (t) => t.type === "text/html" || t.type === "application/xhtml+xml"
    );
    if (htmlIdx < 0) return true;
    return mdIdx >= 0 && mdIdx <= htmlIdx;
  }
  return false;
}

function prefersJson(acceptHeader) {
  const types = parseAccept(acceptHeader);
  if (!types.length) return false;
  const jsonQ = maxQ(types, ["application/json", "application/problem+json"]);
  if (jsonQ < 0) return false;
  const htmlQ = maxQ(types, ["text/html", "application/xhtml+xml"]);
  const mdQ = maxQ(types, ["text/markdown", "text/x-markdown"]);
  const starQ = maxQ(types, ["*/*"]);
  const other = Math.max(htmlQ, mdQ, starQ >= 0 ? starQ : -1);
  if (jsonQ > other) return true;
  if (jsonQ === other && jsonQ > 0) {
    const jsonIdx = types.findIndex(
      (t) => t.type === "application/json" || t.type === "application/problem+json"
    );
    const htmlIdx = types.findIndex(
      (t) => t.type === "text/html" || t.type === "application/xhtml+xml"
    );
    if (htmlIdx < 0) return true;
    return jsonIdx >= 0 && jsonIdx <= htmlIdx;
  }
  return false;
}

function prefersHtmlOnly(acceptHeader) {
  const types = parseAccept(acceptHeader);
  if (!types.length) return false;
  const htmlQ = maxQ(types, ["text/html", "application/xhtml+xml"]);
  const jsonQ = maxQ(types, ["application/json", "application/problem+json"]);
  const mdQ = maxQ(types, ["text/markdown", "text/x-markdown"]);
  if (jsonQ >= 0 || mdQ >= 0) return false;
  return htmlQ >= 0;
}

function normalizePath(pathname) {
  if (!pathname || pathname === "") return "/";
  let p = pathname;
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p || "/";
}

function rateHeaders(extra = {}) {
  return {
    "API-Version": API_VERSION,
    RateLimit: `limit=${RATE_LIMIT}, remaining=${RATE_LIMIT - 1}, reset=${RATE_WINDOW}`,
    "RateLimit-Policy": `${RATE_LIMIT};w=${RATE_WINDOW}`,
    ...extra,
  };
}

function markdownResponse(body, status = 200) {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": MD_TYPE,
      Vary: VARY,
      "Cache-Control": "public, max-age=300",
      ...rateHeaders(),
    },
  });
}

function jsonResponse(body, status = 200, contentType = JSON_TYPE, extraHeaders = {}) {
  const payload = typeof body === "string" ? body : JSON.stringify(body);
  return new Response(payload, {
    status,
    headers: {
      "Content-Type": contentType,
      Vary: VARY,
      "Cache-Control": status === 200 ? "public, max-age=300" : "no-store",
      ...rateHeaders(extraHeaders),
    },
  });
}

function problemNotFound(instance) {
  return {
    type: "https://www.dgtlsunrise.com/problems/not-found",
    title: "Not Found",
    status: 404,
    detail: "That path is not on dgtlsunrise.com.",
    instance,
    code: "not_found",
    message: "That path is not on dgtlsunrise.com.",
    resolution:
      "See https://www.dgtlsunrise.com/openapi.json, https://www.dgtlsunrise.com/llms.txt, or https://www.dgtlsunrise.com/developers.",
  };
}

const FALLBACK_404_MD = `# Not found

That path is not on dgtlsunrise.com.

- [Home](/)
- [OpenAPI](/openapi.json)
- [llms.txt](/llms.txt)
- [Developers](/developers)
- [Docs MCP](/mcp)
- [sitemap.xml](/sitemap.xml)
`;

async function fetchAsset(env, origin, assetPath) {
  const url = new URL(assetPath, origin);
  return env.ASSETS.fetch(new Request(url.toString()));
}

function isHomepage(path) {
  return path === "/" || path === "/index" || path === "/index.html";
}

function isStaticPassthrough(path) {
  return (
    /\.(css|js|png|jpe?g|webp|gif|ico|svg|woff2?|xml|txt|map|json|ya?ml|md)$/i.test(path) &&
    !PATH_TO_MD[path]
  );
}

function isAssetPath(path) {
  return path === "/assets" || path.startsWith("/assets/");
}

function withCacheControl(res, cacheControl) {
  const headers = new Headers(res.headers);
  headers.set("Cache-Control", cacheControl);
  return new Response(res.body, { status: res.status, headers });
}

function maybeAssetCache(res, path) {
  if (res.ok && isAssetPath(path)) {
    return withCacheControl(res, ASSET_CACHE_CONTROL);
  }
  return res;
}

const MCP_TOOLS = [
  {
    name: "get_openapi",
    description: "Fetch the DGTL Connector docs-discovery OpenAPI document (JSON).",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_agent_json",
    description: "Fetch agent.json capabilities for DGTL Connector.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_llms_txt",
    description: "Fetch llms.txt navigation index.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_developers",
    description: "Fetch the developers resources markdown page.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_versioning_policy",
    description: "Fetch the docs-discovery versioning and deprecation policy (JSON).",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
];

function mcpResult(id, result) {
  return jsonResponse({ jsonrpc: "2.0", id: id ?? null, result }, 200);
}

function mcpError(id, code, message) {
  return jsonResponse(
    { jsonrpc: "2.0", id: id ?? null, error: { code, message } },
    200
  );
}

async function handleMcp(request, env, origin) {
  if (request.method === "GET") {
    return jsonResponse({
      ok: true,
      transport: "streamable-http",
      url: "https://www.dgtlsunrise.com/mcp",
      protocolVersions: ["2025-03-26", "2024-11-05"],
      tools: MCP_TOOLS.map((t) => t.name),
    });
  }

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        Allow: "GET, POST, OPTIONS",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "content-type, accept, mcp-session-id",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        ...rateHeaders(),
      },
    });
  }

  if (request.method !== "POST") {
    return jsonResponse(problemNotFound("/mcp"), 405, PROBLEM_TYPE, {
      Allow: "GET, POST, OPTIONS",
    });
  }

  let msg;
  try {
    msg = await request.json();
  } catch {
    return mcpError(null, -32700, "Parse error");
  }

  const { id, method, params } = msg || {};
  if (!method || typeof method !== "string") {
    return mcpError(id, -32600, "Invalid Request");
  }

  if (method === "initialize") {
    return mcpResult(id, {
      protocolVersion: (params && params.protocolVersion) || "2025-03-26",
      capabilities: { tools: { listChanged: false } },
      serverInfo: {
        name: "dgtl-docs",
        version: "1.0.0",
        title: "DGTL Connector docs MCP",
      },
      instructions:
        "Use tools to fetch DGTL Connector public docs discovery resources. Product Ads tools remain on the local stdio plugin.",
    });
  }

  if (method === "notifications/initialized" || method === "initialized") {
    return new Response(null, { status: 202, headers: rateHeaders() });
  }

  if (method === "ping") {
    return mcpResult(id, {});
  }

  if (method === "tools/list") {
    return mcpResult(id, { tools: MCP_TOOLS });
  }

  if (method === "tools/call") {
    const name = params && params.name;
    const map = {
      get_openapi: "/openapi.json",
      get_agent_json: "/agent.json",
      get_llms_txt: "/llms.txt",
      get_developers: "/developers.md",
      get_versioning_policy: null,
    };
    if (!name || !(name in map)) {
      return mcpError(id, -32602, `Unknown tool: ${name || ""}`);
    }
    if (name === "get_versioning_policy") {
      return mcpResult(id, {
        content: [
          {
            type: "text",
            text: JSON.stringify(versioningPolicyBody(), null, 2),
          },
        ],
      });
    }
    try {
      const asset = await fetchAsset(env, origin, map[name]);
      if (!asset.ok) {
        return mcpError(id, -32000, `Failed to fetch ${map[name]}`);
      }
      const text = await asset.text();
      return mcpResult(id, {
        content: [{ type: "text", text }],
      });
    } catch (e) {
      return mcpError(id, -32000, "Tool fetch failed");
    }
  }

  return mcpError(id, -32601, `Method not found: ${method}`);
}

function versioningPolicyBody() {
  return {
    api_version: API_VERSION,
    strategy: "URL path versioning under /v1/docs-discovery/*",
    deprecation: {
      headers: ["Deprecation", "Sunset"],
      policy_url: "https://www.dgtlsunrise.com/api/versioning-policy",
      summary:
        "Breaking changes publish a new /vN path. Deprecated routes send Deprecation and Sunset headers and remain available until the Sunset date.",
    },
    rate_limit: {
      limit: RATE_LIMIT,
      window_seconds: RATE_WINDOW,
      headers: ["RateLimit", "RateLimit-Policy", "Retry-After"],
    },
  };
}

export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);
  const path = normalizePath(url.pathname);
  const accept = request.headers.get("Accept") || "";

  if (path === "/mcp") {
    return handleMcp(request, env, url.origin);
  }

  if (path === "/v1/docs-discovery/health") {
    return jsonResponse({
      ok: true,
      service: "dgtl-sunrise-docs-discovery",
      openapi: "/openapi.json",
    });
  }

  if (path === "/api/versioning-policy") {
    if (prefersMarkdown(accept)) {
      try {
        const asset = await fetchAsset(env, url.origin, "/api/versioning-policy.md");
        if (asset.ok) return markdownResponse(await asset.text(), 200);
      } catch {
        // fall through to JSON
      }
    }
    return jsonResponse(versioningPolicyBody());
  }

  if (isHomepage(path) && url.searchParams.get("mode") === "agent") {
    try {
      const asset = await fetchAsset(env, url.origin, "/agent.json");
      if (asset.ok) return jsonResponse(await asset.text(), 200);
    } catch {
      // fall through
    }
  }

  if (prefersJson(accept) && !prefersMarkdown(accept)) {
    if (isStaticPassthrough(path) || path.endsWith(".md")) {
      const asset = await fetchAsset(env, url.origin, path);
      if (asset.ok) {
        const ct = asset.headers.get("Content-Type") || JSON_TYPE;
        const body = await asset.arrayBuffer();
        return new Response(body, {
          status: 200,
          headers: {
            "Content-Type": ct,
            Vary: VARY,
            "Cache-Control": isAssetPath(path) ? ASSET_CACHE_CONTROL : "public, max-age=300",
            ...rateHeaders(),
          },
        });
      }
      return jsonResponse(problemNotFound(path), 404, PROBLEM_TYPE);
    }

    if (PATH_TO_MD[path]) {
      return jsonResponse({
        ok: true,
        path,
        message:
          "HTML/markdown page. Use Accept: text/markdown for the companion, or see openapi.json.",
        links: {
          openapi: "/openapi.json",
          markdown: PATH_TO_MD[path],
          developers: "/developers",
          llms: "/llms.txt",
          agent: "/agent.json",
          mcp: "/mcp",
          versioning_policy: "/api/versioning-policy",
        },
      });
    }

    return jsonResponse(problemNotFound(path), 404, PROBLEM_TYPE);
  }

  if (!prefersMarkdown(accept)) {
    const res = await next();
    if (res.status === 404 && !prefersHtmlOnly(accept)) {
      return jsonResponse(problemNotFound(path), 404, PROBLEM_TYPE);
    }
    // Add rate-limit headers to successful docs JSON assets served by Pages
    if (res.ok && /\.(json|ya?ml)$/i.test(path)) {
      const headers = new Headers(res.headers);
      for (const [k, v] of Object.entries(rateHeaders())) headers.set(k, v);
      headers.set("Vary", VARY);
      return new Response(res.body, { status: res.status, headers });
    }
    return maybeAssetCache(res, path);
  }

  if (isStaticPassthrough(path) || path.endsWith(".md")) {
    return maybeAssetCache(await next(), path);
  }

  const mdPath = PATH_TO_MD[path];
  if (mdPath) {
    try {
      const asset = await fetchAsset(env, url.origin, mdPath);
      if (asset.ok) return markdownResponse(await asset.text(), 200);
    } catch {
      // fall through
    }
  }

  try {
    const missing = await fetchAsset(env, url.origin, "/404.md");
    if (missing.ok) return markdownResponse(await missing.text(), 404);
  } catch {
    // ignore
  }

  return markdownResponse(FALLBACK_404_MD, 404);
}
