#!/usr/bin/env node
// Walks prompts/*/, reads each prompt's frontmatter + README + latest eval
// results, and emits site/prompts.json. Run by .github/workflows/evals.yml
// after `twp eval --all`, and the resulting JSON is committed -- the
// dashboard reads only this file, so it can never drift from the repo.

import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import matter from "gray-matter";

const ROOT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..");
const PROMPTS_DIR = join(ROOT_DIR, "prompts");
const RESULTS_PATH = join(ROOT_DIR, "evals", "results.json");
const OUT_PATH = join(ROOT_DIR, "site", "prompts.json");

const REPO_RAW_BASE = "https://raw.githubusercontent.com/reem-sab/tech-writer-prompts/main";
const DEFAULT_AUTHOR = { name: "Reem Sabawi", url: "https://github.com/reem-sab" };

function readReadmeFirstParagraph(slug) {
  const readmePath = join(PROMPTS_DIR, slug, "README.md");
  if (!existsSync(readmePath)) return "";
  const lines = readFileSync(readmePath, "utf-8").split("\n");
  const paraLines = [];
  let started = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!started) {
      if (trimmed.startsWith("#") || trimmed === "") continue;
      started = true;
    }
    if (started) {
      if (trimmed === "") break;
      paraLines.push(trimmed);
    }
  }
  return paraLines.join(" ");
}

function gitLastModified(path) {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cs", "--", path], {
      cwd: ROOT_DIR,
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return out || null;
  } catch {
    return null;
  }
}

function loadResults() {
  if (!existsSync(RESULTS_PATH)) {
    console.warn(`No ${RESULTS_PATH} found -- run \`twp eval --all\` first. Eval counts will fall back to 0/N.`);
    return null;
  }
  return JSON.parse(readFileSync(RESULTS_PATH, "utf-8"));
}

function main() {
  const results = loadResults();
  const slugs = readdirSync(PROMPTS_DIR)
    .filter((name) => {
      const full = join(PROMPTS_DIR, name);
      return statSync(full).isDirectory() && existsSync(join(full, "prompt.md"));
    })
    .sort();

  const entries = slugs.map((slug) => {
    const dir = join(PROMPTS_DIR, slug);
    const promptPath = join(dir, "prompt.md");
    const { data } = matter(readFileSync(promptPath, "utf-8"));

    const evalsPath = join(dir, "evals.json");
    const caseCount = existsSync(evalsPath) ? JSON.parse(readFileSync(evalsPath, "utf-8")).length : 0;

    const resultEntry = results?.prompts?.[slug];
    const evalsPassing = resultEntry ? resultEntry.passing : 0;
    const evalsTotal = resultEntry ? resultEntry.total : caseCount;

    const author = data.author ?? DEFAULT_AUTHOR;
    const testedDates = (data.tested_with ?? [])
      .map((t) => (t.date instanceof Date ? t.date.toISOString().slice(0, 10) : t.date))
      .sort();
    const latestTestedDate = testedDates[testedDates.length - 1] ?? null;

    const updated = gitLastModified(promptPath) ?? latestTestedDate ?? new Date().toISOString().slice(0, 10);

    // The dashboard wants inputs as an ordered array of {placeholder, description},
    // with the {{}} braces on the placeholder. Frontmatter authors it as a map.
    const inputs = Object.entries(data.inputs ?? {}).map(([name, spec]) => ({
      placeholder: `{{${name}}}`,
      description: (spec.description ?? "").trim(),
    }));

    const entry = {
      slug,
      name: data.name,
      version: data.version,
      description: (data.description ?? "").trim(),
      // Full paragraph for the detail overlay -- the README's first paragraph.
      details: readReadmeFirstParagraph(slug),
      tags: data.tags ?? [],
      author,
      inputs,
      example_output: (data.example_output ?? "").replace(/\n$/, ""),
      evals_passing: evalsPassing,
      evals_total: evalsTotal,
      raw_url: `${REPO_RAW_BASE}/prompts/${slug}/prompt.md`,
      updated,
    };

    // Optional "Prompt of the Month" editorial flags -- only emitted when set.
    if (data.featured_month) {
      entry.featured_month = data.featured_month;
      if (data.featured_note) entry.featured_note = data.featured_note.trim();
    }

    return entry;
  });

  writeFileSync(OUT_PATH, JSON.stringify(entries, null, 2) + "\n");
  console.log(`Wrote ${entries.length} prompt(s) to ${OUT_PATH}`);
}

main();
