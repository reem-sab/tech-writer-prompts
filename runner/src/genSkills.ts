import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { listPromptSlugs, loadPrompt, PROMPTS_DIR, readReadmeFirstParagraph } from "./loader.js";
import { resolveAuthor } from "./schema.js";

/**
 * Generates a per-prompt SKILL.md that wraps a single prompt as an
 * installable Agent Skill. The dashboard's "Install" tab curls
 * prompts/<slug>/SKILL.md, so these must exist and stay in sync with the
 * prompt. Regenerated in CI; never hand-edit the output.
 */
export function skillFileFor(slug: string): string {
  const { frontmatter, body } = loadPrompt(slug);
  const author = resolveAuthor(frontmatter);
  const details = readReadmeFirstParagraph(slug);

  const inputLines = Object.entries(frontmatter.inputs)
    .map(([name, spec]) => `- \`{{${name}}}\`${spec.required === false ? " (optional)" : ""}: ${spec.description.trim()}`)
    .join("\n");

  // The description drives when an agent loads the skill; combine the
  // prompt's own description with its purpose so it triggers specifically.
  const description = `${frontmatter.description.trim()} Use this skill when the task is: ${details}`;

  return `---
name: ${slug}
description: >
  ${description.replace(/\s+/g, " ").trim()}
version: ${frontmatter.version}
author:
  name: ${author.name}
  url: ${author.url}
---

<!-- Generated from prompts/${slug}/prompt.md by \`twp gen-skills\`. Do not edit by hand. -->

# ${frontmatter.name}

${details}

## Inputs

${inputLines}

## How to apply

Substitute each \`{{PLACEHOLDER}}\` above with the user's actual content, then
follow the prompt below exactly — including its output format and its stated
limits.

---

${body}
`;
}

export function generateAllSkills(): string[] {
  const slugs = listPromptSlugs();
  const written: string[] = [];
  for (const slug of slugs) {
    const out = join(PROMPTS_DIR, slug, "SKILL.md");
    writeFileSync(out, skillFileFor(slug));
    written.push(out);
  }
  return written;
}
