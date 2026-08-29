import { readFileSync, existsSync, statSync } from "node:fs";
import type { LoadedPrompt } from "./loader.js";

/**
 * A raw --input value is either a path to an existing file (its contents are
 * read in) or a literal string used as-is. This lets `--input PAGE=./draft.md`
 * and `--input PAGE="some text"` both work.
 */
export function resolveInputValue(raw: string): string {
  if (existsSync(raw) && statSync(raw).isFile()) {
    return readFileSync(raw, "utf-8");
  }
  return raw;
}

/**
 * CLI --input keys are matched to declared inputs case-insensitively, so
 * `--input page=./draft.md` matches a declared `PAGE` input.
 */
export function normalizeInputKey(key: string): string {
  return key.trim().toUpperCase().replace(/[^A-Z0-9_]/g, "_");
}

export function renderPrompt(prompt: LoadedPrompt, rawInputs: Record<string, string>): string {
  const declared = Object.keys(prompt.frontmatter.inputs);
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(rawInputs)) {
    normalized[normalizeInputKey(key)] = value;
  }

  const missing: string[] = [];
  for (const name of declared) {
    const spec = prompt.frontmatter.inputs[name];
    if (spec.required !== false && !(name in normalized)) {
      missing.push(name);
    }
  }
  if (missing.length > 0) {
    throw new Error(
      `Missing required input(s): ${missing.join(", ")}\n` +
        `Provide with --input NAME=value or --input NAME=./path/to/file`
    );
  }

  let rendered = prompt.body;
  for (const [name, value] of Object.entries(normalized)) {
    if (!declared.includes(name)) {
      throw new Error(
        `Unknown input "${name}" -- ${prompt.slug} declares: ${declared.join(", ")}`
      );
    }
    const resolved = resolveInputValue(value);
    rendered = rendered.split(`{{${name}}}`).join(resolved);
  }
  return rendered;
}
