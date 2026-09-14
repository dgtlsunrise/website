#!/usr/bin/env node
import { readFileSync } from "node:fs";
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

const served = [
  "index.html",
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
const ads = html("google-ads.html");
const privacy = html("privacy.html");
const terms = html("terms.html");
const about = html("about.html");
const agent = text("agent.json");

const primaryNav = (page) => {
  const m = page.match(/aria-label="Primary"[\s\S]*?<\/nav>/);
  return m ? m[0] : "";
};

check(index.includes("grok plugin install dgtlsunrise/dgtl-connector"), "home has install command");
check(/id="install-grok"[^>]*>grok plugin install dgtlsunrise\/dgtl-connector<\/code>/.test(index), "install command is in HTML, not JS");
check(index.includes('data-copy="#install-grok"'), "home Grok install has copy button");
check(index.includes('data-copy="#install-cursor"'), "home Cursor install has copy button");
check(index.includes('data-copy="#install-claude"'), "home Claude install has copy button");
check(index.includes("git clone https://github.com/dgtlsunrise/dgtl-connector.git"), "home Cursor clone command");
check(index.includes("Claude Desktop"), "home Claude Desktop install");
check(/section-label">Grok Bot<\/p>[\s\S]*?marketplace/i.test(index), "home Grok Bot install is marketplace");
check(/section-label">Grok Build<\/p>[\s\S]*?id="install-grok"/i.test(index), "home grok CLI is under Grok Build");
check(!/section-label">Grok Bot<\/p>[\s\S]{0,500}id="install-grok"/i.test(index), "home Bot section does not own grok CLI panel");
check(index.includes("does not install into Bot"), "home states CLI does not install into Bot");
check(index.includes("Marketplace listing is not live yet"), "home notes Bot marketplace not live yet");

check(index.includes("/assets/site.js"), "home loads site.js for copy");
check(!/Package id/.test(index), "home dropped package id line");
check(!/Connect the account that owns the property when the plugin asks/.test(index), "home dropped connect-when-asks line");

check(index.includes("run on your machine (read and manage)"), "home free path is read and manage");
check(/<h1>DGTL Connector by DGTL Sunrise<\/h1>/.test(index), "home title DGTL Connector by DGTL Sunrise");
check(!/Your data stays yours/.test(index), "home dropped data-stays-yours paragraph");
const toc = index.match(/<nav class="contents"[\s\S]*?<\/nav>/)?.[0] || "";
check(/href="#install"/.test(toc), "home toc has install");
check(/href="#how-to-use"/.test(toc), "home toc has how-to-use");
check(index.includes("A Grok Bot plugin that connects your Bot"), "home lede is Grok Bot plugin");
check(index.includes("Start with a map"), "home how-to has Start with a map");
check(index.includes("Ask for decisions, not dumps"), "home how-to has Ask for decisions");
check(index.includes("Confirm before live changes"), "home how-to Confirm before live changes");
check(index.includes("Connect Google once with all Free permissions up front"), "home Free Connect is all permissions up front");
check(!/enable writes on the install/i.test(index), "home does not say enable writes on the install");

check((index.match(/<nav class="contents"/g) || []).length === 1, "home has one contents nav");
check(index.indexOf('aria-label="Contents"') < index.indexOf('id="install"'), "home contents before install");
check(!/href="#install"/.test(index.match(/<header[\s\S]*?<\/header>/)?.[0] || ""), "home header has no Install link");
check(/\.brand img \{[\s\S]*?width:\s*auto/.test(text("assets/article.css")), "home logo uses width auto");
check(index.includes("Manage property settings the tools support"), "home GA4 edit");
check(index.includes("Submit or delete sitemaps after you confirm"), "home GSC edit");
check(index.includes("create or update tags, triggers, and variables"), "home GTM manage");
check(index.includes("$19") && index.includes("Google Ads") && index.includes("Meta"), "home Pro Ads/Meta");
check(/You do not need a DGTL Sunrise account to get started/.test(index), "home no DGTL account required");

const section = (id) => {
  const re = new RegExp(`<h2 id="${id}">[\\s\\S]*?(?=<h2 |</main>)`);
  const m = index.match(re);
  return m ? m[0] : "";
};

const freeAndPro = section("free-and-pro");
check(
  /<h2 id="free-and-pro">Free and Pro<\/h2>/.test(index) &&
    index.includes('href="#free-and-pro"') &&
    /What is free/.test(freeAndPro) &&
    /What is paid/.test(freeAndPro) &&
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
    !/Merchant Center is plugin-direct Google/.test(freeAndPro),
  "home Free vs Pro section"
);

const klaviyo = section("klaviyo");
const merchant = section("merchant-center");
check(!/Local campaigns/.test(section("google-ads")), "home Ads Edit has no Local campaigns");
check(/Pro \(\$19 \/ month\)/.test(merchant), "home MC Requirements are Pro");

const gbp = section("google-business-profile");
const shopify = section("shopify");
const meta = section("meta-ads");
const tiktok = section("tiktok-ads");

check(index.includes('href="#klaviyo"') && /<h2 id="klaviyo">Klaviyo<\/h2>/.test(index), "home contents and heading include Klaviyo");
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
const mdSection = (title) => {
  const re = new RegExp(`### ${title}\\n\\n[\\s\\S]*?(?=\\n### |$)`);
  const m = indexMd.match(re);
  return m ? m[0] : "";
};
check(/You do not need a DGTL Sunrise account to get started/.test(indexMd), "index.md no DGTL account required");
const freeProMd = (() => {
  const start = indexMd.indexOf("## Free and Pro");
  const end = indexMd.indexOf("## Platforms");
  return start >= 0 ? indexMd.slice(start, end > start ? end : undefined) : "";
})();
check(
  /## Free and Pro/.test(freeProMd) &&
    /\*\*What is free\.\*\*/.test(freeProMd) &&
    /\*\*What is paid\.\*\*/.test(freeProMd) &&
    /Nothing is published or changed on your ad accounts until you review and approve it first/.test(freeProMd) &&
    /Meta Ads and TikTok Ads are included in Pro/.test(freeProMd) &&
    !/Live changes need confirmation/.test(freeProMd) &&
    !/Pro entitlement/.test(freeProMd),
  "index.md has Free and Pro section"
);
check(/Klaviyo/.test(mdSection("Klaviyo")) && /\*\*Overview\.\*\*/.test(mdSection("Klaviyo")), "index.md has Klaviyo section");
check(
  /product inputs/.test(mdSection("Merchant Center")) &&
    !/Edit is not in this version/.test(mdSection("Merchant Center")),
  "index.md MC no longer claims edit absent"
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
}

check(!/Ryze/i.test(allServed), "no Ryze in served HTML");
check(!/https?:\/\/[^\s"'<>]*polar[^\s"'<>]*/i.test(allServed), "no Polar URL");
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
  check(page.includes('/assets/article.css'), `${file} uses article.css`);
  check(page.includes("AI Marketing Engineering"), `${file} has brand tagline`);
  check(page.includes('class="site-header"') && page.includes('class="site-footer"'), `${file} shared header/footer`);
  check(!page.includes("/assets/style.css"), `${file} not on indigo style.css`);
  check(!page.includes('class="sunband"'), `${file} no indigo sunband`);
  check(!primaryNav(page).includes("Engagements"), `${file} Engagements out of primary nav`);
  check(page.includes('href="/google-ads">Google Ads'), `${file} footer links Google Ads`);
}
check(!index.includes("Details:") || !/Details:[\s\S]{0,40}\/google-ads/.test(index), "home body has no Details /google-ads");

if (base) {
  const fetchText = async (path, opts = {}) => {
    const res = await fetch(new URL(path, base), { redirect: "manual", ...opts });
    const textBody = res.status === 200 ? await res.text() : "";
    return { res, text: textBody };
  };

  const home = await fetchText("/");
  check(home.res.status === 200, "GET / is 200", String(home.res.status));
  check(home.text.includes("grok plugin install dgtlsunrise/dgtl-connector"), "preview / shows install command");
  check(home.text.includes("run on your machine (read and manage)"), "preview / free path is read and manage");
  check(home.text.includes("Klaviyo"), "preview / includes Klaviyo");
  check(/You do not need a DGTL Sunrise account to get started/.test(home.text), "preview / no DGTL account required");
  check(home.text.includes('id="free-and-pro"') && home.text.includes('href="#free-and-pro"'), "preview / Free vs Pro section");

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
