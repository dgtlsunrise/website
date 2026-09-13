/**
 * Content negotiation: serve companion .md when Accept prefers markdown.
 * HTML and bare Accept star/star continue to static assets via next().
 */

const MD_TYPE = "text/markdown; charset=utf-8";
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

/** True when the client prefers text/markdown over text/html (explicit markdown). */
function prefersMarkdown(acceptHeader) {
  const types = parseAccept(acceptHeader);
  if (!types.length) return false;

  let mdQ = -1;
  let htmlQ = -1;
  let starQ = -1;

  for (const { type, q } of types) {
    if (type === "text/markdown" || type === "text/x-markdown") {
      mdQ = Math.max(mdQ, q);
    } else if (type === "text/html" || type === "application/xhtml+xml") {
      htmlQ = Math.max(htmlQ, q);
    } else if (type === "*/*") {
      starQ = Math.max(starQ, q);
    }
  }

  // Bare */* or no markdown token → HTML
  if (mdQ < 0) {
    // text/* alone without html can mean "give me text"; only treat as markdown
    // preference when markdown is explicitly listed (is-agentic / CF agents pattern).
    return false;
  }

  // If html not listed, treat as 0 unless */* is the only fallback with higher q
  const htmlScore = htmlQ >= 0 ? htmlQ : starQ >= 0 && mdQ < starQ ? starQ : 0;
  const mdScore = mdQ;

  if (mdScore > htmlScore) return true;
  if (mdScore === htmlScore && mdScore > 0) {
    // Equal q: prefer markdown if it appears and html isn't strictly preferred first
    // with higher specificity — agents often send "text/markdown, text/html"
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

const FALLBACK_404_MD = `# Not found

That path is not on dgtlsunrise.com.

- [Home](/)
- [llms.txt](/llms.txt)
- [sitemap.xml](/sitemap.xml)
- [About](/about)
- [Contact](/contact)
- [Privacy](/privacy)
`;

async function fetchAsset(env, origin, assetPath) {
  const url = new URL(assetPath, origin);
  return env.ASSETS.fetch(new Request(url.toString()));
}

export async function onRequest(context) {
  const { request, next, env } = context;
  const accept = request.headers.get("Accept") || "";

  if (!prefersMarkdown(accept)) {
    return next();
  }

  const url = new URL(request.url);
  const path = normalizePath(url.pathname);

  // Let real static non-page assets pass (css, images, robots, sitemap, llms, raw .md)
  if (
    /\.(css|js|png|jpe?g|webp|gif|ico|svg|woff2?|xml|txt|map)$/i.test(path) &&
    !PATH_TO_MD[path]
  ) {
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

  // Unknown path (or missing companion): agent-friendly 404 markdown, status 404
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
