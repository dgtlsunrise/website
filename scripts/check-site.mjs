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
check(/<pre><code>grok plugin install dgtlsunrise\/dgtl-connector<\/code><\/pre>/.test(index), "install command is in HTML, not JS");
check(index.includes("run on your machine (read and manage)"), "home free path is read and manage");
check(index.includes("Report bytes do not go through DGTL"), "home report-bytes sentence");
check(index.includes("Manage property settings the tools support"), "home GA4 edit");
check(index.includes("Submit or delete sitemaps after you confirm"), "home GSC edit");
check(index.includes("create or update tags, triggers, and variables"), "home GTM manage");
check(index.includes("$19") && index.includes("Google Ads") && index.includes("Meta"), "home Pro Ads/Meta");

const section = (id) => {
  const re = new RegExp(`<h2 id="${id}">[\\s\\S]*?(?=<h2 |</main>)`);
  const m = index.match(re);
  return m ? m[0] : "";
};

const klaviyo = section("klaviyo");
const merchant = section("merchant-center");
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

check(agent.includes("read and manage"), "agent.json free path is read and manage");
check(!/Free local reads stay/i.test(agent), "agent.json description is not reads-only");
const agentObj = JSON.parse(agent);
const capability = (name) => agentObj.capabilities.find((c) => c.platform === name);

check(capability("Klaviyo") && /Not Pro\. Not stamp/.test(capability("Klaviyo").notes), "agent.json includes Klaviyo");
check(
  capability("Merchant Center") &&
    /product inputs/.test(capability("Merchant Center").notes) &&
    !/Edit is not in this version/.test(capability("Merchant Center").notes),
  "agent.json MC has product-input writes"
);

const indexMd = text("index.md");
const mdSection = (title) => {
  const re = new RegExp(`### ${title}\\n\\n[\\s\\S]*?(?=\\n### |$)`);
  const m = indexMd.match(re);
  return m ? m[0] : "";
};
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

check(!/Ryze/i.test(allServed), "no Ryze in served HTML");
check(!/https?:\/\/[^\s"'<>]*polar[^\s"'<>]*/i.test(allServed), "no Polar URL");
check(!/dual-?door|Two doors|Install it, or hire us/i.test(allServed), "no dual-door copy");
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
check(privacy.includes("Paid Google Ads and Meta Ads (Pro)"), "privacy Pro Ads/Meta already exist");
check(!/future DGTL subscription|when it ships|when shipped|will use it later/i.test(privacy), "privacy Ads/Meta not future-only");
check(privacy.includes("We do not request Gmail, Drive, Calendar, or Contacts"), "privacy no extra Google products");

check(terms.includes("Idaho law governs these terms"), "terms Idaho venue");
check(terms.includes("Live edits need your confirmation"), "terms confirm-gated edits");
check(terms.includes("DGTL Pro subscription"), "terms Pro exists");

const article = (page) => {
  const m = page.match(/<article class="legal-wrap" id="legal">([\s\S]*?)<\/article>/);
  return m ? m[1] : "";
};
check(article(privacy).includes("How we protect Google user data"), "privacy article body present");
check(article(terms).includes("Paid features"), "terms article body present");

for (const page of [html("engagements.html"), ads, privacy, terms]) {
  check(page.includes('class="sunband"'), "sunband on indigo shell page");
  check(!primaryNav(page).includes("Engagements"), "Engagements out of primary nav");
}

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
