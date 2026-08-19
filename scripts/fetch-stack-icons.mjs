// Refreshes src/v2/stackLogos.js with Simple Icons (CC0) path data for the working-stack
// technologies, so the site ships no icon dependency. Needs network access.
//
// Slugs that fail to fetch keep whatever mark stackLogos.js already holds. Two marks are
// currently drawn by hand rather than fetched (see the header of that file), so overwriting
// them blindly would be a regression, not a refresh.
import { readFileSync, writeFileSync } from "node:fs";

// One entry per logo referenced by `workingStack` in src/v2/data.js. Simple Icons renames
// slugs between majors; anything reported missing below just needs its slug corrected.
const SLUGS = [
  "react", "nextdotjs",
  "python", "fastapi", "celery", "redis",
  "langgraph", "langchain", "huggingface",
  "postgresql", "duckdb", "supabase", "pinecone",
  "docker", "kubernetes", "amazonwebservices", "prometheus", "grafana",
];

// Simple Icons slug -> the key used in stackLogos.js and data.js, where they differ.
const KEYS = { amazonwebservices: "aws" };

// A mark's title is also its visible label, so where Simple Icons uses the full legal name it
// is shortened to what the design shows. Without this, aws would come back as "Amazon Web
// Services" and overflow the label column.
const TITLES = { aws: "AWS" };

const target = new URL("../src/v2/stackLogos.js", import.meta.url);
const existingSource = readFileSync(target, "utf8");
const header = existingSource.split("export const stackLogos = {")[0];
const existing = Object.fromEntries(
  [...existingSource.matchAll(/^ {2}(\w+): \{ title: "([^"]*)", path: "([^"]*)" \},$/gm)]
    .map(([, key, title, path]) => [key, { title, path }]),
);

const fetched = {};
const missing = [];

for (const slug of SLUGS) {
  const url = `https://cdn.jsdelivr.net/npm/simple-icons@13/icons/${slug}.svg`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      missing.push(`${slug} (${response.status})`);
      continue;
    }
    const markup = await response.text();
    const title = markup.match(/<title>([^<]+)<\/title>/)?.[1];
    const path = markup.match(/ d="([^"]+)"/)?.[1];
    if (!title || !path) {
      missing.push(`${slug} (unparsed)`);
      continue;
    }
    const key = KEYS[slug] ?? slug;
    fetched[key] = { title: TITLES[key] ?? title, path };
    console.log(`ok   ${slug.padEnd(20)} ${title} (${path.length} chars)`);
  } catch (error) {
    missing.push(`${slug} (${error.message})`);
  }
}

if (!Object.keys(fetched).length) {
  console.error("\nNothing fetched, so stackLogos.js is left alone. Check network access.");
  process.exit(1);
}

// Keys stay in SLUGS order; a mark that failed to fetch falls back to its current value.
const kept = [];
const entries = SLUGS.map((slug) => {
  const key = KEYS[slug] ?? slug;
  const mark = fetched[key] ?? existing[key];
  if (!mark) {
    missing.push(`${slug} (no existing mark to keep)`);
    return null;
  }
  if (!fetched[key]) kept.push(key);
  return `  ${key}: { title: ${JSON.stringify(mark.title)}, path: ${JSON.stringify(mark.path)} },`;
}).filter(Boolean);

console.log("\nmissing:", missing.length ? missing.join(", ") : "none");
if (kept.length) console.log("kept existing:", kept.join(", "));

writeFileSync(target, `${header}export const stackLogos = {\n${entries.join("\n")}\n};\n`);
console.log(`\nwrote src/v2/stackLogos.js with ${entries.length} marks`);
console.log("The file header lists which marks are hand-drawn. Update it if this run replaced any.");
