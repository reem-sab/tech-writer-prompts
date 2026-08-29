import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { PromptFrontmatterSchema, EvalsFileSchema, type PromptFrontmatter, type EvalCase } from "./schema.js";

// dist/loader.js -> runner/dist -> up twice -> repo root
export const ROOT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
export const PROMPTS_DIR = join(ROOT_DIR, "prompts");

export interface LoadedPrompt {
  slug: string;
  dir: string;
  frontmatter: PromptFrontmatter;
  body: string;
}

export function listPromptSlugs(): string[] {
  return readdirSync(PROMPTS_DIR)
    .filter((name) => {
      const full = join(PROMPTS_DIR, name);
      return statSync(full).isDirectory() && existsSync(join(full, "prompt.md"));
    })
    .sort();
}

export function loadPrompt(slug: string): LoadedPrompt {
  const dir = join(PROMPTS_DIR, slug);
  const promptPath = join(dir, "prompt.md");
  if (!existsSync(promptPath)) {
    throw new Error(`No prompt.md found for "${slug}" (looked in ${promptPath})`);
  }
  const raw = readFileSync(promptPath, "utf-8");
  const { data, content } = matter(raw);
  const result = PromptFrontmatterSchema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(`Invalid frontmatter in ${promptPath}:\n${issues}`);
  }
  return { slug, dir, frontmatter: result.data, body: content.trim() };
}

export function loadEvals(slug: string): EvalCase[] {
  const dir = join(PROMPTS_DIR, slug);
  const evalsPath = join(dir, "evals.json");
  if (!existsSync(evalsPath)) {
    throw new Error(`No evals.json found for "${slug}" (looked in ${evalsPath})`);
  }
  const raw = JSON.parse(readFileSync(evalsPath, "utf-8"));
  const result = EvalsFileSchema.safeParse(raw);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(`Invalid evals.json for "${slug}":\n${issues}`);
  }
  return result.data;
}

export function readReadmeFirstParagraph(slug: string): string {
  const readmePath = join(PROMPTS_DIR, slug, "README.md");
  if (!existsSync(readmePath)) return "";
  const raw = readFileSync(readmePath, "utf-8");
  const lines = raw.split("\n");
  const paraLines: string[] = [];
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
