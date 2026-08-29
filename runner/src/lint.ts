import type { LoadedPrompt } from "./loader.js";

const PLACEHOLDER_RE = /\{\{([A-Z0-9_]+)\}\}/g;

export function findPlaceholders(body: string): Set<string> {
  const found = new Set<string>();
  for (const match of body.matchAll(PLACEHOLDER_RE)) {
    found.add(match[1]);
  }
  return found;
}

/**
 * Checks that the placeholders used in the prompt body exactly match the
 * inputs declared in frontmatter -- no undeclared placeholders, no unused
 * declared inputs.
 */
export function lintPrompt(prompt: LoadedPrompt): string[] {
  const errors: string[] = [];
  const declared = new Set(Object.keys(prompt.frontmatter.inputs));
  const used = findPlaceholders(prompt.body);

  for (const name of used) {
    if (!declared.has(name)) {
      errors.push(`{{${name}}} is used in prompt.md but not declared in frontmatter "inputs"`);
    }
  }
  for (const name of declared) {
    if (!used.has(name)) {
      errors.push(`"${name}" is declared in frontmatter "inputs" but {{${name}}} never appears in prompt.md`);
    }
  }
  return errors;
}
