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
const served = ["index.html", "connector.html", "engagements.html", "google-ads.html", "privacy.html", "terms.html", "plugin.html", "404.html"];
const allServed = served.map(html).join("\n");

const index = html("index.html");
const connector = html("connector.html");
const ads = html("google-ads.html");
const privacy = html("privacy.html");
const terms = html("terms.html");

const primaryNav = (page) => {
  const m = page.match(/aria-label="Primary"[\s\S]*?<\/nav>/);
  return m ? m[0] : "";
};

check(index.includes("grok plugin install dgtlsunrise/dgtl-connector"), "home has install command");
check(/<pre id="install-cmd"><code>grok plugin install dgtlsunrise\/dgtl-connector<\/code><\/pre>/.test(index), "install command is in HTML, not JS");
check(index.includes("tokens and report bytes never go through DGTL"), "free-path sentence");
check(index.includes("The platform talks to the agent on the machine you installed"), "platform-agent sentence");
check(index.includes("$19") && index.includes("Ads and Meta") && index.includes("One Polar customer") && index.includes("No employee seats") && index.includes("more than one host"), "home Pro copy");
check(connector.includes("$19") && connector.includes("One Polar customer") && connector.includes("No employee seats") && connector.includes("Unlimited ad accounts"), "connector Pro copy");
check(connector.includes('id="install"') && connector.includes('id="pro"'), "connector worksheet anchors");
check(!/Ryze/i.test(allServed), "no Ryze in served HTML");
check(!/https?:\/\/[^\s"'<>]*polar[^\s"'<>]*/i.test(allServed), "no Polar URL");
check(!/dual-?door|Two doors|Install it, or hire us/i.test(allServed), "no dual-door copy");
check(!/scanfield|tag-match|data-demo|Watch it work/i.test(allServed), "no MATCH/demo theater");
check(!/Talk<\/a>/.test(allServed) && !primaryNav(index).includes("Engagements"), "no Talk or Engagements in primary nav");
check(ads.includes("Consent C") && ads.includes("960111255083") && ads.includes("684-442-5544") && /flagged off/i.test(ads) && /does not create/i.test(ads) && !/writes are live|live writes/i.test(ads), "google-ads compliance locks");
check(privacy.includes("Limited Use") && privacy.includes("Google API Services User Data Policy"), "privacy Limited Use");
check(terms.includes("Idaho law governs these terms"), "terms Idaho venue");

const article = (page) => {
  const m = page.match(/<article class="legal-wrap" id="legal">([\s\S]*?)<\/article>/);
  return m ? m[1] : "";
};
check(article(privacy).includes("How we protect Google user data"), "privacy article body present");
check(article(terms).includes("Paid features"), "terms article body present");

for (const page of [index, connector, html("engagements.html"), ads, privacy, terms]) {
  check(page.includes('class="sunband"'), "sunband on page");
  check(!primaryNav(page).includes("Engagements"), "Engagements out of primary nav");
}

if (base) {
  const fetchText = async (path, opts = {}) => {
    const res = await fetch(new URL(path, base), { redirect: "manual", ...opts });
    const text = res.status === 200 ? await res.text() : "";
    return { res, text };
  };

  const home = await fetchText("/");
  check(home.res.status === 200, "GET / is 200", String(home.res.status));
  check(home.text.includes("grok plugin install dgtlsunrise/dgtl-connector"), "preview / shows install command");
  check(home.text.includes("tokens and report bytes never go through DGTL"), "preview / free-path sentence");

  const plugin = await fetchText("/plugin");
  const loc = plugin.res.headers.get("location") || "";
  check(plugin.res.status === 301 && loc.includes("/connector"), "/plugin 301 to /connector", `${plugin.res.status} ${loc}`);

  const adsPage = await fetchText("/google-ads");
  check(adsPage.res.status === 200 && adsPage.text.includes("Consent C") && adsPage.text.includes("960111255083") && adsPage.text.includes("684-442-5544"), "preview /google-ads locks");

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
