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

check(about.includes("on your machine (read and manage)"), "about free path is read and manage");

check(agent.includes("read and manage"), "agent.json free path is read and manage");
check(!/Free local reads stay/i.test(agent), "agent.json description is not reads-only");

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
