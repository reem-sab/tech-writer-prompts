# site/

The marketplace dashboard. Published to GitHub Pages by
[`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml).

## Files

- **`index.html`** — the dashboard itself. A single static page, no build
  step, no runtime dependencies beyond one Google Fonts request. It is
  authored from the design handoff (see the `design_handoff_*` bundle) and
  loads all prompt content at runtime from `prompts.json` in this
  directory — nothing about a prompt is hardcoded in the HTML.
- **`prompts.json`** — **generated.** `build-data.mjs` walks `prompts/*/`
  and emits this file; the evals workflow regenerates and commits it on
  every push, so the dashboard can never drift from the repo. Do not edit by
  hand.
- **`build-data.mjs`** — the generator.

## Data contract

`prompts.json` is an array; one object per prompt, with these fields:

| Field | Type | Source |
|---|---|---|
| `slug` | string | Folder name under `prompts/`. |
| `name`, `version`, `description` | string | Prompt frontmatter. |
| `details` | string | The prompt's `README.md` first paragraph. |
| `tags` | string[] | Frontmatter (controlled vocabulary). `tags[0]` drives the card accent. |
| `author` | `{name, url}` | Frontmatter (defaults to Reem Sabawi). |
| `inputs` | `{placeholder, description}[]` | Frontmatter `inputs`, reshaped to an array. |
| `example_output` | string | Frontmatter `example_output`. |
| `evals_passing` / `evals_total` | number | Latest `evals/results.json`. |
| `raw_url` | string | Raw GitHub URL of the prompt's `prompt.md`. |
| `updated` | `YYYY-MM-DD` | Git last-modified date of `prompt.md`. |
| `featured_month` / `featured_note` | string | Optional; frontmatter. Drives "Prompt of the Month". |

Regenerate locally with:

```bash
node site/build-data.mjs
```

It reads `evals/results.json` for the eval counts; run `twp eval --all`
first for real numbers (otherwise counts fall back to `0 / <case count>`).
