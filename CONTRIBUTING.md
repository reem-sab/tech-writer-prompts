# Contributing to tech-writer-prompts

Thanks for wanting to add a prompt. The bar is simple: **a prompt does not
merge without passing evals.** A prompt without tests is a suggestion, not
a tool — this library exists to be the counterexample to that.

## Adding a new prompt

1. Create `prompts/<slug>/` (kebab-case slug, e.g. `changelog-summarize`).
2. Add `prompt.md` with YAML frontmatter matching the schema in
   [`prompts/SCHEMA.md`](prompts/SCHEMA.md). At minimum: `name`, `version`
   (start at `1.0.0`), `description`, `inputs`, `tags`, and `tested_with`.
   Your `tags` must come from the controlled vocabulary
   (`docs-review, api, agents, release, localization, style, ia`) — anything
   else fails `twp lint`, because the dashboard only has colors and filters
   for those seven. Add an `example_output` block too; it's what shows in the
   dashboard's detail overlay.
3. Write the prompt body. Use `{{UPPER_SNAKE_CASE}}` placeholders that
   exactly match the keys in your `inputs` map — `twp lint` fails the build
   if they don't line up one-to-one.
4. Add `README.md`: what the prompt does, an inputs table, one example run
   (with realistic sample output or a description of it), and a
   **Limitations** section. Every prompt in this library states its limits
   explicitly — don't skip it.
5. Add `evals.json`: 3–5 cases. Each needs an `id`, an `input` object
   keyed by your declared input names, and an `expect` with at least one of
   `contains` (all listed substrings must appear), `regex` (all patterns
   must match, checked case-insensitively), or `judge_rubric` (graded by a
   second model call under `--judge`).

   Use realistic sample input, not a toy one-liner — an eval that would
   pass against any output isn't testing anything. Where it fits, reuse the
   fictional **Lumen API** product already used across this library's
   evals (see `prompts/audit-page/evals.json` for the shape) — it keeps the
   test data coherent across prompts, but it's not mandatory if your prompt
   doesn't fit that domain.

## Author credit

Add an `author` field to your frontmatter so you get credit on the
dashboard:

```yaml
author:
  name: Your Name
  url: https://github.com/your-handle
```

If you omit it, the prompt is attributed to the library maintainer by
default — so if you're contributing, set this.

## Running evals locally before you open a PR

```bash
npm install
npm run build
export ANTHROPIC_API_KEY=sk-ant-...
node runner/dist/cli.js lint <slug>
node runner/dist/cli.js eval <slug>
```

Add `--judge` if any of your cases use `judge_rubric`. `twp eval <slug>`
must show every case passing (or explicitly skipped, if you didn't pass
`--judge`) before you open a PR — CI runs the same command and blocks merge
on failure.

## What gets rejected

- A prompt with fewer than 3 eval cases, or with eval cases that don't
  actually exercise the specific claims in the prompt's rubric/format.
- A README without a stated Limitations section.
- `inputs` in frontmatter that don't match the `{{PLACEHOLDER}}` tokens
  used in the prompt body.
- A rewrite of an existing prompt that isn't a version bump — if you change
  a shipped prompt's behavior, bump `version` and update `tested_with`.

## Changing an existing prompt

Bump `version` (semver) for any change to the prompt body. If the change
alters behavior — not just wording — re-run the evals and add a new
`tested_with` entry with the current date. The dashboard shows version and
eval status per prompt, so this is how users know what they're getting.
