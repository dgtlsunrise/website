/**
 * Homepage ?mode=agent → agent.json (machine-readable).
 * Content negotiation:
 *   - mode=agent wins on homepage
 *   - Prefer application/json → JSON (or problem+json 404)
 *   - Prefer text/markdown → companion .md (or markdown 404)
 *   - Else static HTML/assets via next()
 */

const MD_TYPE = "text/markdown; charset=utf-8";
const JSON_TYPE = "application/json; charset=utf-8";
const PROBLEM_TYPE = "application/problem+json; charset=utf-8";
const VARY = "Accept, Accept-Encoding";

/** Map request pathname → static .md asset path (site root). */
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

/** True when the client prefers text/markdown over text/html (explicit markdown). */
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

/** True when the client prefers JSON over HTML (explicit application/json). */
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

function normalizePath(pathname) {
  if (!pathname || pathname === "") return "/";
  let p = pathname;
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p || "/";
}

function markdownResponse(body, status = 200) {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": MD_TYPE,
      Vary: VARY,
      "Cache-Control": "public, max-age=300",
    },
  });
}

function jsonResponse(body, status = 200, contentType = JSON_TYPE) {
  const payload = typeof body === "string" ? body : JSON.stringify(body);
  return new Response(payload, {
    status,
    headers: {
      "Content-Type": contentType,
      Vary: VARY,
      "Cache-Control": status === 200 ? "public, max-age=300" : "no-store",
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
- [sitemap.xml](/sitemap.xml)
- [About](/about)
- [Contact](/contact)
- [Privacy](/privacy)
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
    /\.(css|js|png|jpe?g|webp|gif|ico|svg|woff2?|xml|txt|map|json|ya?ml)$/i.test(path) &&
    !PATH_TO_MD[path]
  );
}

export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);
  const path = normalizePath(url.pathname);
  const accept = request.headers.get("Accept") || "";

  // Structured agent view on homepage: wins before HTML / markdown / JSON negotiation.
  if (isHomepage(path) && url.searchParams.get("mode") === "agent") {
    try {
      const asset = await fetchAsset(env, url.origin, "/agent.json");
      if (asset.ok) {
        const body = await asset.text();
        return jsonResponse(body, 200);
      }
    } catch {
      // fall through
    }
  }

  // Explicit JSON clients: serve known JSON/YAML assets, else problem+json 404.
  if (prefersJson(accept) && !prefersMarkdown(accept)) {
    if (isStaticPassthrough(path) || path.endsWith(".md")) {
      const asset = await fetchAsset(env, url.origin, path);
      if (asset.ok) {
        // Re-wrap so Vary is present; keep upstream content-type when useful.
        const ct = asset.headers.get("Content-Type") || JSON_TYPE;
        const body = await asset.arrayBuffer();
        return new Response(body, {
          status: 200,
          headers: {
            "Content-Type": ct,
            Vary: VARY,
            "Cache-Control": "public, max-age=300",
          },
        });
      }
      return jsonResponse(problemNotFound(path), 404, PROBLEM_TYPE);
    }

    // Page paths: if a companion exists and client asked for JSON, point them at docs discovery.
    if (PATH_TO_MD[path]) {
      // Known page — still not a JSON document except homepage agent mode (handled above).
      // Return a small discovery stub instead of HTML so agents get JSON.
      return jsonResponse(
        {
          ok: true,
          path,
          message: "HTML/markdown page. Use Accept: text/markdown for the companion, or see openapi.json.",
          links: {
            openapi: "/openapi.json",
            markdown: PATH_TO_MD[path],
            developers: "/developers",
            llms: "/llms.txt",
            agent: "/agent.json",
          },
        },
        200
      );
    }

    return jsonResponse(problemNotFound(path), 404, PROBLEM_TYPE);
  }

  if (!prefersMarkdown(accept)) {
    // HTML clients: still return JSON 404 for clearly missing API-ish paths when Accept includes json.
    const res = await next();
    if (
      res.status === 404 &&
      maxQ(parseAccept(accept), ["application/json", "application/problem+json"]) >= 0
    ) {
      return jsonResponse(problemNotFound(path), 404, PROBLEM_TYPE);
    }
    return res;
  }

  // Markdown negotiation (existing behavior).
  if (isStaticPassthrough(path)) {
    return next();
  }
  if (path.endsWith(".md")) {
    return next();
  }

  const mdPath = PATH_TO_MD[path];
  if (mdPath) {
    try {
      const asset = await fetchAsset(env, url.origin, mdPath);
      if (asset.ok) {
        const body = await asset.text();
        return markdownResponse(body, 200);
      }
    } catch {
      // fall through to 404 markdown
    }
  }

  try {
    const missing = await fetchAsset(env, url.origin, "/404.md");
    if (missing.ok) {
      const body = await missing.text();
      return markdownResponse(body, 404);
    }
  } catch {
    // ignore
  }

  return markdownResponse(FALLBACK_404_MD, 404);
}
