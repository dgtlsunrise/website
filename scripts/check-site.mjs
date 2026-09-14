#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const baseIdx = args.indexOf("--base");
const base = baseIdx >= 0 ? args[baseIdx + 1] : null;

const fail = [];
const pass = [];
const check = (ok, name, detail) => {
  if (ok) pass.push(name);
  else fail.push(detail ? `${name}: ${detail}` : name);
};

const html = (file) => readFileSync(resolve(root, file), "utf8");
const text = (file) => readFileSync(resolve(root, file), "utf8");
const assetHref = (file) => {
  const hash = createHash("sha256").update(text(file)).digest("hex").slice(0, 12);
  return `/${file}?v=${hash}`;
};
const articleCssHref = assetHref("assets/article.css");
const landingCssHref = assetHref("assets/landing.css");
const siteJsHref = assetHref("assets/site.js");
const unhashedAssetCss = /href="\/assets\/[^"?]+\.css"/;

const served = [
  "index.html",
  "documentation.html",
  "connector.html",
  "engagements.html",
  "google-ads.html",
  "privacy.html",
  "terms.html",
  "plugin.html",
  "404.html",
  "about.html",
];
const allServed = served.map(html).join("\n");

const publicFacing = [
  ...served,
  "index.md",
  "documentation.md",
  "about.md",
  "privacy.md",
  "terms.md",
  "google-ads.md",
  "agent.json",
  "llms.txt",
  "llms-full.txt",
  "docs/llms.txt",
  "api/llms.txt",
].map(text).join("\n");

const index = html("index.html");
const docs = html("documentation.html");
const ads = html("google-ads.html");
const privacy = html("privacy.html");
const terms = html("terms.html");
const about = html("about.html");
const agent = text("agent.json");

const primaryNav = (page) => {
  const m = page.match(/aria-label="Primary"[\s\S]*?<\/nav>/);
  return m ? m[0] : "";
};

check(docs.includes("grok plugin install dgtlsunrise/dgtl-connector"), "docs has install command");
check(/id="install-grok"[^>]*>grok plugin install dgtlsunrise\/dgtl-connector<\/code>/.test(docs), "install command is in HTML, not JS");
check(docs.includes('data-copy="#install-grok"'), "docs Grok install has copy button");
check(docs.includes('data-copy="#install-cursor-cmd"'), "docs Cursor install has copy button");
check(docs.includes('data-copy="#install-claude"'), "docs Claude install has copy button");
check(docs.includes("git clone https://github.com/dgtlsunrise/dgtl-connector.git"), "docs Cursor clone command");
check(docs.includes("Claude Desktop"), "docs Claude Desktop install");
check(/section-label"[^>]*>Grok Bot<\/p>[\s\S]*?marketplace/i.test(docs), "docs Grok Bot install is marketplace");
check(/section-label"[^>]*>Grok Build<\/p>[\s\S]*?id="install-grok"/i.test(docs), "docs grok CLI is under Grok Build");
check(!/section-label"[^>]*>Grok Bot<\/p>[\s\S]{0,500}id="install-grok"/i.test(docs), "docs Bot section does not own grok CLI panel");
check(docs.includes("does not install into Bot"), "docs states CLI does not install into Bot");
check(docs.includes("marketplace listing is under review"), "docs notes Bot marketplace listing under review");
check(!/Marketplace listing is not live yet/.test(docs), "docs dropped marketplace-not-live scaffolding");
check(!/We expect Meta and TikTok to finish approving/.test(docs), "docs dropped Meta/TikTok soon promise");

check(docs.includes(`src="${siteJsHref}"`), "docs loads hashed site.js for copy");
check(!index.includes("/assets/site.js"), "home does not load site.js");
check(!/Package id/.test(index + docs), "site dropped package id line");
check(!/Connect the account that owns the property when the plugin asks/.test(index + docs), "site dropped connect-when-asks line");

check(docs.includes("run on your machine (read and manage)"), "docs free path is read and manage");
check(/<h1 id="hero-title">Connect your Bot to the marketing accounts you already run\.<\/h1>/.test(index), "home headline in product voice");
check(index.includes('class="page-landing"'), "home uses landing body class");
check(index.includes(`href="${landingCssHref}"`), "home imports hashed landing.css");
check(index.includes(`href="${articleCssHref}"`), "home imports hashed article.css");
check(!unhashedAssetCss.test(index), "home has no unhashed /assets CSS href");
check(!index.includes('class="tile-grid"'), "home dropped tile grid");
check(!/Example conversation/.test(index), "home dropped Example conversation label");
check(!/This is a demo transcript with example numbers/.test(index), "home dropped demo transcript note");
check(!/A dgtl-connector session/.test(index), "home dropped session label");
check(index.includes('class="bot-window"') && index.includes('class="agent-list"') && index.includes('class="composer"'), "home keeps Bot window");
check(index.includes("Applied after your approval"), "home demo conversation ends applied");
check(/keyword pause list for campaign C/.test(index), "home demo drafts a keyword pause");
check(index.includes("DGTL Connector") && index.includes("Message DGTL Connector"), "home demo bot is DGTL Connector");
check(!/Ask in chat\. Approve before it goes live/.test(index), "home dropped pair heading");
check(!index.includes('class="pair-section"') && !index.includes('class="pair-card"'), "home dropped pair cards");
check(!index.includes('class="jump"'), "home dropped on-this-page jump nav");
check(!index.includes('class="hero-kicker"'), "home dropped DGTL Connector install chip");
check(!index.includes('class="header-pill"') && !/href="\/contact"/.test(index.match(/<header[\s\S]*?<\/header>/)?.[0] || ""), "home header has no Contact pill");
check(/href="\/documentation"/.test(primaryNav(index)) && !/href="\/about"/.test(primaryNav(index)), "home header About replaced by Documentation");
check(!/Armand|Sales Outbound|Inbox Manager/i.test(index), "home is not x.ai marketing cast");
check(!/cdn\.x\.ai|assets\.x\.ai|grok-bot.*\.(svg|css|js)/i.test(index + text("assets/landing.css")), "home does not hotlink x.ai assets");
check(!/not live yet/i.test(index), "home has no not-live-yet caveat");
check(!/expect .{0,80} soon/i.test(index), "home has no expect-soon caveat");
check(!/Your data stays yours/.test(index), "home dropped data-stays-yours paragraph");
const hero = index.match(/<section class="hero"[\s\S]*?<\/section>/)?.[0] || "";
check(/href="\/documentation#install"/.test(hero), "home hero Install CTA");
check(/href="\/documentation"/.test(hero) && /Documentation<\/a>/.test(hero), "home hero Documentation CTA");
check(!/href="\/about"/.test(hero), "home hero dropped About CTA");
check(docs.includes('href="#install"') && docs.includes('href="#how-to-use"'), "docs TOC includes install and how-to-use");
check(index.includes("A Grok Bot plugin that connects your Bot"), "home lede is Grok Bot plugin");
check(docs.includes("Start with a map"), "docs how-to has Start with a map");
check(docs.includes("Starter prompt"), "docs how-to has Starter prompt");
check(docs.includes("I installed the dgtl-connector plugin"), "docs starter prompt names dgtl-connector");
check(docs.includes("Ask for decisions, not dumps"), "docs how-to has Ask for decisions");
check(docs.includes("Confirm before live changes"), "docs how-to Confirm before live changes");
check(docs.includes("Connect Google once with all Free permissions up front"), "docs Free Connect is all permissions up front");
check(!/Free first, Pro when you need ads/.test(docs), "docs how-to dropped Free-first block");
check(!/enable writes on the install/i.test(docs), "docs does not say enable writes on the install");
check(!/\/dgtl-connector\s+-pro/.test(docs), "docs does not invent a Pro slash command");

check((index.match(/<nav class="contents"/g) || []).length === 0, "home dropped article contents nav");
check((docs.match(/<nav class="contents"/g) || []).length === 1, "docs has table of contents");
check(docs.includes('aria-label="On this page"') && docs.includes("contents-title"), "docs TOC is on-this-page");
check(index.indexOf('class="hero"') < index.indexOf('class="bot-window"') && index.indexOf('class="bot-window"') < index.indexOf('id="platforms-title"'), "home hero then Bot window then platforms");
check(!/href="#install"/.test(index.match(/<header[\s\S]*?<\/header>/)?.[0] || ""), "home header has no Install link");
check(/\.brand img \{[\s\S]*?width:\s*auto/.test(text("assets/article.css")), "home logo uses width auto");
check(docs.includes("Manage property settings the tools support"), "docs GA4 edit");
check(docs.includes("Submit or delete sitemaps after you confirm"), "docs GSC edit");
check(docs.includes("create or update tags, triggers, and variables"), "docs GTM manage");
check(docs.includes("$19") && docs.includes("Google Ads") && docs.includes("Meta"), "docs Pro Ads/Meta");
check(/You do not need a DGTL Sunrise account to get started/.test(docs), "docs no DGTL account required");

const platforms = [
  ["ga4.svg", "Google Analytics 4"],
  ["search-console.svg", "Google Search Console"],
  ["tag-manager.svg", "Google Tag Manager"],
  ["google-ads.svg", "Google Ads"],
  ["meta.svg", "Meta Ads"],
  ["merchant-center.svg", "Merchant Center"],
  ["business-profile.svg", "Google Business Profile"],
  ["shopify.svg", "Shopify"],
  ["klaviyo.svg", "Klaviyo"],
  ["tiktok.svg", "TikTok Ads"],
];
const platformSection = index.match(/<section class="platforms"[\s\S]*?<\/section>/)?.[0] || "";
check(platformSection.includes('id="platforms-title"'), "home has platforms section");
check(/dgtl-connector uses these marketing APIs/.test(platformSection), "home platforms lede is one finished sentence");
check(!/not live yet|pending approval|Consent /i.test(platformSection), "home platforms copy has no caveats");
for (const [file, label] of platforms) {
  check(existsSync(resolve(root, "assets/platforms", file)), `hosted platform mark ${file}`);
  check(platformSection.includes(`/assets/platforms/${file}`), `home hosts ${label} mark`);
  check(platformSection.includes(label), `home names ${label}`);
}
check(!/https?:\/\/[^"']+\/(simpleicons|gstatic|cdn\.jsdelivr|unpkg)/i.test(platformSection), "home does not hotlink platform CDNs");

const section = (id) => {
  const re = new RegExp(`<h2 id="${id}">[\\s\\S]*?(?=<h2 |</main>)`);
  const m = docs.match(re);
  return m ? m[0] : "";
};

const freeAndPro = section("free-and-pro");
check(
  /<h2 id="free-and-pro">Free and Pro<\/h2>/.test(docs) &&
    docs.includes('href="#free-and-pro"') &&
    /What is free/.test(freeAndPro) &&
    /What is Pro/.test(freeAndPro) &&
    !/What is paid/.test(freeAndPro) &&
    /\$19/.test(freeAndPro) &&
    /Google Ads reporting/.test(freeAndPro) &&
    /Meta Ads insights/.test(freeAndPro) &&
    /TikTok Ads advertisers/.test(freeAndPro) &&
    /Nothing is published or changed on your ad accounts until you review and approve it first/.test(freeAndPro) &&
    /Meta Ads and TikTok Ads are included in Pro/.test(freeAndPro) &&
    !/Live changes need confirmation/.test(freeAndPro) &&
    !/Pro entitlement/.test(freeAndPro) &&
    /Nothing is published or changed on your ad accounts until you review and approve it first/.test(freeAndPro) &&
    /Meta Ads and TikTok Ads are included in Pro/.test(freeAndPro) &&
    /Merchant Center accounts, products/.test(freeAndPro) &&
    !/Merchant Center is plugin-direct Google/.test(freeAndPro) &&
    /id="pro-upgrade-prompt"/.test(freeAndPro) &&
    /data-copy="#pro-upgrade-prompt"/.test(freeAndPro) &&
    /I use the dgtl-connector plugin/.test(freeAndPro) &&
    /license_status/.test(freeAndPro) &&
    /license JWT/.test(freeAndPro),
  "docs Free vs Pro section"
);

const klaviyo = section("klaviyo");
const merchant = section("merchant-center");
check(!/Local campaigns/.test(section("google-ads")), "docs Ads Edit has no Local campaigns");
check(/Pro \(\$19 \/ month\)/.test(merchant), "docs MC Requirements are Pro");

const gbp = section("google-business-profile");
const shopify = section("shopify");
const meta = section("meta-ads");
const tiktok = section("tiktok-ads");

check(docs.includes('href="#klaviyo"') && /<h2 id="klaviyo">Klaviyo<\/h2>/.test(docs), "docs contents and heading include Klaviyo");
check(
  /Overview/.test(klaviyo) &&
    /Read/.test(klaviyo) &&
    /Edit/.test(klaviyo) &&
    /Requirements/.test(klaviyo) &&
    /Example asks/.test(klaviyo) &&
    /Guardrails/.test(klaviyo),
  "Klaviyo has full section labels"
);
check(/This is not a Pro feature/.test(klaviyo) && /key stays on your machine/.test(klaviyo), "Klaviyo is free and local");
check(/Creating a draft does not send it/.test(klaviyo), "Klaviyo draft-create does not send");
check(/product inputs/.test(merchant) && !/Not in this version/.test(merchant), "MC documents product-input edits");
check(/Not in this version/.test(gbp), "GBP edit still not in this version");
check(/Publications and catalogs/.test(shopify) && /product set/.test(shopify), "Shopify publications and product set");
check(
  !/writes enabled on your install/.test(section("google-analytics-4") + section("google-search-console") + section("google-tag-manager") + shopify + klaviyo),
  "Free GA4/GSC/GTM/Shopify/Klaviyo are confirmation-only"
);
check(/writes enabled on your install/.test(merchant), "MC still documents writes enabled");
check(/catalogs/.test(meta) && /Conversions API/.test(meta), "Meta catalogs and Conversions API");
check(/catalogs/.test(tiktok) && /Events API/.test(tiktok), "TikTok catalogs and Events API");

check(about.includes("on your machine (read and manage)"), "about free path is read and manage");

check(/No DGTL Sunrise account is required/.test(agent), "agent.json no account required");
check(agent.includes("read and manage"), "agent.json free path is read and manage");
check(!/Free local reads stay/i.test(agent), "agent.json description is not reads-only");
const agentObj = JSON.parse(agent);
const capability = (name) => agentObj.capabilities.find((c) => c.platform === name);

check(capability("Klaviyo") && /Not Pro/.test(capability("Klaviyo").notes) && /private API key/.test(capability("Klaviyo").notes), "agent.json includes Klaviyo");
check(
  capability("Merchant Center") &&
    capability("Merchant Center").tier === "pro" &&
    /product inputs/.test(capability("Merchant Center").notes) &&
    !/Edit is not in this version/.test(capability("Merchant Center").notes),
  "agent.json MC is Pro with product-input writes"
);

const indexMd = text("index.md");
const docsMd = text("documentation.md");
const mdSection = (title) => {
  const re = new RegExp(`### ${title}\\n\\n[\\s\\S]*?(?=\\n### |$)`);
  const m = docsMd.match(re);
  return m ? m[0] : "";
};
check(/Connect your Bot to the marketing accounts you already run/.test(indexMd), "index.md has landing headline");
check(/The platforms it talks to/.test(indexMd), "index.md has platforms list");
check(!/Example conversation/.test(indexMd), "index.md dropped Example conversation label");
check(/Applied after your approval/.test(indexMd), "index.md keeps demo conversation");
check(!/not live yet/i.test(indexMd), "index.md has no not-live-yet caveat");
check(/You do not need a DGTL Sunrise account to get started/.test(docsMd), "documentation.md no DGTL account required");
const freeProMd = (() => {
  const start = docsMd.indexOf("## Free and Pro");
  const end = docsMd.indexOf("## Platforms");
  return start >= 0 ? docsMd.slice(start, end > start ? end : undefined) : "";
})();
check(
  /## Free and Pro/.test(freeProMd) &&
    /\*\*What is free\.\*\*/.test(freeProMd) &&
    /\*\*What is Pro\.\*\*/.test(freeProMd) &&
    !/\*\*What is paid\.\*\*/.test(freeProMd) &&
    /Nothing is published or changed on your ad accounts until you review and approve it first/.test(freeProMd) &&
    /Meta Ads and TikTok Ads are included in Pro/.test(freeProMd) &&
    /I use the dgtl-connector plugin/.test(freeProMd) &&
    /license_status/.test(freeProMd) &&
    !/Live changes need confirmation/.test(freeProMd) &&
    !/Pro entitlement/.test(freeProMd) &&
    !/Free first, Pro when you need ads/.test(docsMd),
  "documentation.md has Free and Pro section"
);
check(/Klaviyo/.test(mdSection("Klaviyo")) && /\*\*Overview\.\*\*/.test(mdSection("Klaviyo")), "documentation.md has Klaviyo section");
check(
  /product inputs/.test(mdSection("Merchant Center")) &&
    !/Edit is not in this version/.test(mdSection("Merchant Center")),
  "documentation.md MC no longer claims edit absent"
);

check(!/DGTL_WRITES_ENABLED/.test(publicFacing), "no DGTL_WRITES_ENABLED product name");
check(!/Waves? 1[89]\b/.test(publicFacing), "no internal wave numbers");
check(!/\bAxos\b/.test(publicFacing), "no Axos");
check(!/marketplace submit/i.test(publicFacing), "no marketplace submit promise");

for (const file of ["llms.txt", "llms-full.txt", "docs/llms.txt", "api/llms.txt"]) {
  check(/Klaviyo/.test(text(file)), `${file} mentions Klaviyo`);
}
for (const file of ["llms.txt", "llms-full.txt", "docs/llms.txt"]) {
  check(/No DGTL Sunrise account is required/.test(text(file)), `${file} no account required`);
  check(/What is Pro/.test(text(file)), `${file} has What is Pro`);
  check(!/Free first, Pro when you need ads/.test(text(file)), `${file} dropped Free-first`);
}
check(/I use the dgtl-connector plugin/.test(text("llms-full.txt")), "llms-full.txt has Pro upgrade prompt");
check(/I use the dgtl-connector plugin/.test(text("docs/llms.txt")), "docs/llms.txt has Pro upgrade prompt");
check(/What is Pro/.test(agent) && /license_status/.test(agent), "agent.json has What is Pro upgrade path");
check(text("llms.txt").includes("/documentation"), "llms.txt links documentation");
check(text("docs/llms.txt").includes("/documentation"), "docs/llms.txt links documentation");
check(text("functions/_middleware.js").includes('"/documentation": "/documentation.md"'), "middleware maps /documentation");

const POLAR_CHECKOUT = "https://buy.polar.sh/polar_cl_aIrywIIxJ2cOwj70VQAcJn2umEgSS9kWBMUJS241Dll";
const polarEscaped = POLAR_CHECKOUT.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
check(!index.includes(POLAR_CHECKOUT), "home Polar checkout moved off homepage");
check(docs.includes(POLAR_CHECKOUT), "docs documents Polar checkout");
check(freeAndPro.includes(POLAR_CHECKOUT), "docs Polar checkout is in What is Pro");
check((docs.match(new RegExp(polarEscaped, "g")) || []).length === 1, "docs Polar checkout appears once");
check(!publicFacing.includes("stamp.dgtlsunrise.com/checkout"), "Polar CTA is not stamp checkout");
const polarUrls = [...publicFacing.matchAll(/https?:\/\/[^\s"'<>\)]*polar[^\s"'<>\)]*/gi)].map((m) => m[0].replace(/[.,]$/, ""));
check(polarUrls.length > 0 && polarUrls.every((u) => u === POLAR_CHECKOUT), "only documented Polar checkout URL");
check(!/Ryze/i.test(allServed), "no Ryze in served HTML");
check(!/dual-?door|Two doors|Install it, or hire us/i.test(allServed), "no dual-door copy");
check(text("developers.html").includes("DGTL Sunrise developer resources"), "developers page exists");
check(text("developers.md").includes("DGTL Sunrise developer resources"), "developers.md exists");
check(text("server.json").includes("com.dgtlsunrise/dgtl-connector"), "server.json MCP manifest");
check(text("openapi.json").includes("DGTL Connector docs discovery"), "openapi.json docs discovery");
check(text("openapi.json").includes("operationId"), "openapi.json has operationIds");
check(text("api/openapi.yaml").includes("DGTL Connector docs discovery"), "api/openapi.yaml exists");
check(text("functions/_middleware.js").includes("application/problem+json"), "middleware JSON problem errors");
check(text("functions/_middleware.js").includes("prefersJson"), "middleware prefersJson");
check(text("functions/_middleware.js").includes("handleMcp"), "middleware docs MCP");
check(text("functions/_middleware.js").includes("RateLimit-Policy"), "middleware rate limit headers");
check(text(".well-known/mcp.json").includes("streamable-http"), "mcp.json has streamable-http remote");
check(text("api/versioning-policy.md").includes("Sunset"), "versioning policy exists");


check(text(".well-known/mcp/server-card.json").includes("streamable-http"), "mcp server-card");
check(text("llms.txt").includes("DGTL Connector by DGTL Sunrise"), "llms.txt names DGTL Connector");
check(text("llms.txt").includes("/developers"), "llms.txt links developers");

check(!/scanfield|tag-match|data-demo|Watch it work/i.test(allServed), "no MATCH/demo theater");
check(!/Grok Bot<\/span>|chrome__bar|bubble--bot/i.test(index), "home chrome uses owned class names");
check(!/Talk<\/a>/.test(allServed) && !primaryNav(index).includes("Engagements"), "no Talk or Engagements in primary nav");

check(!/Consent [AWCGBS]\b/.test(publicFacing), "no internal Consent labels on public HTML/md/json/llms");
check(!/v1 is read-only|read-only scopes|No publishes in v1|v1 does not write/i.test(publicFacing), "no v1 read-only lies");

check(
  !ads.includes("Consent C") &&
    ads.includes("960111255083") &&
    ads.includes("684-442-5544") &&
    /confirm-gated/i.test(ads) &&
    /developer token stays on the Worker/i.test(ads) &&
    /own Google Ads login/i.test(ads),
  "google-ads compliance locks"
);

check(privacy.includes("Limited Use") && privacy.includes("Google API Services User Data Policy"), "privacy Limited Use");
check(privacy.includes("read and manage"), "privacy free path is read and manage");
check(privacy.includes("Paid Google Ads, Meta Ads, and TikTok Ads (Pro)"), "privacy Pro Ads/Meta/TikTok already exist");
check(privacy.includes("Merchant Center (Pro)"), "privacy MC Pro-gated");
check(!/future DGTL subscription|when it ships|when shipped|will use it later/i.test(privacy), "privacy Ads/Meta not future-only");
check(privacy.includes("We do not request Gmail, Drive, Calendar, or Contacts"), "privacy no extra Google products");

check(terms.includes("Idaho law governs these terms"), "terms Idaho venue");
check(terms.includes("Live edits need your confirmation"), "terms confirm-gated edits");
check(terms.includes("DGTL Pro subscription"), "terms Pro exists");

const mainBody = (page) => {
  const m = page.match(/<main[^>]*>([\s\S]*?)<\/main>/);
  return m ? m[1] : "";
};
check(mainBody(privacy).includes("How we protect Google user data"), "privacy article body present");
check(mainBody(terms).includes("Paid features"), "terms article body present");

const articlePages = [
  "index.html",
  "documentation.html",
  "about.html",
  "contact.html",
  "privacy.html",
  "terms.html",
  "engagements.html",
  "google-ads.html",
  "developers.html",
  "404.html",
];
for (const file of articlePages) {
  const page = html(file);
  check(page.includes(`href="${articleCssHref}"`), `${file} uses hashed article.css`);
  check(!unhashedAssetCss.test(page), `${file} has no unhashed /assets CSS href`);
  check(page.includes("AI Marketing Engineering"), `${file} has brand tagline`);
  check(page.includes('class="site-header"') && page.includes('class="site-footer"'), `${file} shared header/footer`);
  check(!page.includes("/assets/style.css"), `${file} not on indigo style.css`);
  check(!page.includes('class="sunband"'), `${file} no indigo sunband`);
  check(!primaryNav(page).includes("Engagements"), `${file} Engagements out of primary nav`);
  check(page.includes('href="/google-ads">Google Ads'), `${file} footer links Google Ads`);
  check(page.includes('href="/documentation">Documentation'), `${file} footer links Documentation`);
  if (file !== "index.html") {
    check(!page.includes("/assets/landing.css"), `${file} does not import landing.css`);
  }
}

const headersFile = text("_headers");
check(/\/assets\/\*/.test(headersFile), "_headers covers /assets/*");
check(
  /Cache-Control:\s*public,\s*max-age=300,\s*must-revalidate/.test(headersFile),
  "_headers short-caches /assets/*"
);
check(
  /Cache-Control:\s*public,\s*max-age=0,\s*must-revalidate/.test(headersFile),
  "_headers keeps HTML at max-age=0 must-revalidate"
);
check(!/max-age=14400/.test(headersFile), "_headers does not keep 4h asset cache");
check(
  !/max-age=31536|immutable/.test(headersFile),
  "_headers does not long-cache unfingerprinted filenames"
);

const middleware = text("functions/_middleware.js");
check(
  middleware.includes('const ASSET_CACHE_CONTROL = "public, max-age=300, must-revalidate"'),
  "middleware short-caches /assets (Functions skip _headers)"
);
check(middleware.includes("maybeAssetCache"), "middleware applies asset cache on passthrough");

check(!index.includes("Details:") || !/Details:[\s\S]{0,40}\/google-ads/.test(index), "home body has no Details /google-ads");

if (base) {
  const fetchText = async (path, opts = {}) => {
    const res = await fetch(new URL(path, base), { redirect: "manual", ...opts });
    const textBody = res.status === 200 ? await res.text() : "";
    return { res, text: textBody };
  };

  const home = await fetchText("/");
  check(home.res.status === 200, "GET / is 200", String(home.res.status));
  check(home.text.includes("The platforms it talks to"), "preview / shows platforms");
  check(home.text.includes("Klaviyo"), "preview / includes Klaviyo");
  check(!/Example conversation/.test(home.text), "preview / dropped Example conversation label");
  check(home.text.includes('class="bot-window"'), "preview / keeps Bot window");
  check(home.text.includes(`href="${landingCssHref}"`), "preview / hashed landing.css");
  check(home.text.includes(`href="${articleCssHref}"`), "preview / hashed article.css");
  const homeCache = (home.res.headers.get("cache-control") || "").toLowerCase();
  check(
    /max-age=0/.test(homeCache) && /must-revalidate/.test(homeCache),
    "preview / HTML revalidates",
    homeCache
  );

  const docsPage = await fetchText("/documentation");
  check(docsPage.res.status === 200, "GET /documentation is 200", String(docsPage.res.status));
  check(docsPage.text.includes("grok plugin install dgtlsunrise/dgtl-connector"), "preview /documentation shows install command");
  check(docsPage.text.includes("run on your machine (read and manage)"), "preview /documentation free path is read and manage");
  check(/You do not need a DGTL Sunrise account to get started/.test(docsPage.text), "preview /documentation no DGTL account required");
  check(docsPage.text.includes('id="free-and-pro"') && docsPage.text.includes('href="#free-and-pro"'), "preview /documentation Free vs Pro section");
  check(docsPage.text.includes('class="contents"'), "preview /documentation has TOC");
  check(docsPage.text.includes(`href="${articleCssHref}"`), "preview /documentation hashed article.css");
  check(!docsPage.text.includes("/assets/landing.css"), "preview /documentation does not import landing.css");

  const landingCss = await fetchText("/assets/landing.css");
  const landingCache = (landingCss.res.headers.get("cache-control") || "").toLowerCase();
  check(landingCss.res.status === 200, "preview landing.css is 200", String(landingCss.res.status));
  check(
    /max-age=300/.test(landingCache) && /must-revalidate/.test(landingCache) && !/max-age=14400/.test(landingCache),
    "preview landing.css short-cache",
    landingCache
  );

  const platformMark = await fetchText("/assets/platforms/ga4.svg");
  check(platformMark.res.status === 200, "preview platform mark is 200", String(platformMark.res.status));

  const aboutPage = await fetchText("/about");
  check(aboutPage.text.includes(`href="${articleCssHref}"`), "preview /about hashed article.css");

  const plugin = await fetchText("/plugin");
  const loc = plugin.res.headers.get("location") || "";
  check(plugin.res.status === 301 && loc.includes("/connector"), "/plugin 301 to /connector", `${plugin.res.status} ${loc}`);

  const adsPage = await fetchText("/google-ads");
  check(
    adsPage.res.status === 200 &&
      !adsPage.text.includes("Consent C") &&
      adsPage.text.includes("960111255083") &&
      adsPage.text.includes("684-442-5544") &&
      /own Google Ads login/i.test(adsPage.text),
    "preview /google-ads locks"
  );

  const missing = await fetchText("/this-path-is-not-a-page");
  check(missing.res.status === 404, "unknown path 404", String(missing.res.status));
}

console.log(`${pass.length} passed`);
if (fail.length) {
  console.error(`${fail.length} failed`);
  for (const f of fail) console.error(`- ${f}`);
  process.exit(1);
}
console.log("all checks passed");
