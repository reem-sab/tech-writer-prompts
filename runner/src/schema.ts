import { z } from "zod";

/**
 * Authoritative schema for prompt.md frontmatter.
 * Human-readable mirror lives at prompts/SCHEMA.md — keep them in sync.
 */
export const AuthorSchema = z.object({
  name: z.string(),
  url: z.string().url(),
});

export const DEFAULT_AUTHOR = {
  name: "Reem Sabawi",
  url: "https://github.com/reem-sab",
};

export const InputSpecSchema = z.object({
  description: z.string(),
  required: z.boolean().optional().default(true),
});

/**
 * The controlled tag vocabulary. These are the only tags the dashboard has
 * hues and filter pills for -- a tag outside this set would render as a
 * broken-color chip and be unfilterable, so tags are validated against it.
 * Adding a tag here also means adding its hue in the dashboard's design
 * tokens; the two must stay coupled.
 */
export const TAG_VOCABULARY = [
  "docs-review",
  "api",
  "agents",
  "release",
  "localization",
  "style",
  "ia",
] as const;

export const TestedWithSchema = z.object({
  model: z.string(),
  // YAML parses an unquoted YYYY-MM-DD as a Date, not a string -- accept
  // both and normalize to a YYYY-MM-DD string either way.
  date: z
    .union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"), z.date()])
    .transform((d) => (d instanceof Date ? d.toISOString().slice(0, 10) : d)),
});

export const PromptFrontmatterSchema = z.object({
  name: z.string(),
  version: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/, "version must be semver, e.g. 1.0.0"),
  description: z.string(),
  inputs: z.record(z.string(), InputSpecSchema),
  model_notes: z.string().optional(),
  tags: z.array(z.enum(TAG_VOCABULARY)).min(1),
  tested_with: z.array(TestedWithSchema).min(1),
  author: AuthorSchema.optional(),
  // Pre-formatted snippet shown in the dashboard's detail overlay. Newlines
  // preserved verbatim.
  example_output: z.string().optional(),
  // Editorial "Prompt of the Month" flags. The entry with the greatest
  // featured_month becomes the featured card on the dashboard.
  featured_month: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "featured_month must be YYYY-MM")
    .optional(),
  featured_note: z.string().optional(),
});

export type Author = z.infer<typeof AuthorSchema>;
export type InputSpec = z.infer<typeof InputSpecSchema>;
export type TestedWith = z.infer<typeof TestedWithSchema>;
export type PromptFrontmatter = z.infer<typeof PromptFrontmatterSchema>;

export function resolveAuthor(fm: PromptFrontmatter): Author {
  return fm.author ?? DEFAULT_AUTHOR;
}

/**
 * One eval case for a prompt. Exactly one of the `expect` variants must be set.
 */
export const EvalExpectSchema = z
  .object({
    contains: z.array(z.string()).optional(),
    regex: z.array(z.string()).optional(),
    judge_rubric: z.string().optional(),
  })
  .refine(
    (e) => [e.contains, e.regex, e.judge_rubric].filter((v) => v !== undefined).length > 0,
    { message: "expect must set at least one of: contains, regex, judge_rubric" }
  );

export const EvalCaseSchema = z.object({
  id: z.string(),
  input: z.record(z.string(), z.string()),
  expect: EvalExpectSchema,
});

export const EvalsFileSchema = z.array(EvalCaseSchema).min(3).max(5);

export type EvalCase = z.infer<typeof EvalCaseSchema>;
export type EvalsFile = z.infer<typeof EvalsFileSchema>;
