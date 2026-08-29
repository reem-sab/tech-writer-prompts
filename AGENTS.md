# AGENTS.md

Guidance for coding agents (Claude Code, Cursor, and similar) working in
this repository.

## What this repo is

`tech-writer-prompts` is a tested library of prompts for technical writers.
Each prompt lives in `prompts/<slug>/` and ships with its documentation and
its tests. The core invariant of this project — the thing that makes it
worth existing — is: **a prompt is not done until its evals pass.** Treat
that as a hard rule, not a preference.

## Repository map

| Path | What it is |
|---|---|
| `prompts/<slug>/prompt.md` | The prompt, with YAML frontmatter. |
| `prompts/<slug>/README.md` | What it does, inputs, example, limitations. |
| `prompts/<slug>/evals.json` | 3–5 test cases. |
| `prompts/<slug>/SKILL.md` | **Generated.** Do not hand-edit — run `twp gen-skills`. |
| `prompts/<slug>/badge.json` | **Generated** by `twp eval`. Do not hand-edit. |
| `prompts/SCHEMA.md` | Human-readable frontmatter schema + tag vocabulary. |
| `runner/src/` | The `twp` CLI (TypeScript). `schema.ts` is the authoritative schema. |
| `site/build-data.mjs` | Walks `prompts/` and emits `site/prompts.json` for the dashboard. |
| `evals/results.json` | **Generated** by `twp eval`. |

## Common tasks

**Add or edit a prompt.** Follow [`CONTRIBUTING.md`](CONTRIBUTING.md). After
any change to a `prompt.md` body, bump its `version`, re-run its evals, and
regenerate derived files:

```bash
npm run build
node runner/dist/cli.js lint <slug>
node runner/dist/cli.js eval <slug> --judge      # needs ANTHROPIC_API_KEY
node runner/dist/cli.js gen-skills
node site/build-data.mjs
```

**Do not** hand-edit any file marked *Generated* above — change its source
and regenerate. `prompts/<slug>/SKILL.md` comes from `prompt.md` +
`README.md`; `site/prompts.json`, `badge.json`, and `evals/results.json`
come from the runner.

## Rules that are easy to get wrong

- **Placeholders and inputs must match.** Every `{{PLACEHOLDER}}` in a
  prompt body must have a matching key in frontmatter `inputs`, and vice
  versa. `twp lint` enforces this.
- **Tags are a closed set.** Only `docs-review, api, agents, release,
  localization, style, ia` are valid. The schema rejects others.
- **Evals are the contract.** If you change what a prompt outputs, the evals
  must still pass — or you must update them in the same change and explain
  why in the PR.
- **Respect each prompt's stated Limits.** When applying a prompt, don't
  present its output as more authoritative than the prompt's own Limits
  section claims.

## Applying a prompt to a real task

Read `prompts/<slug>/prompt.md`, substitute the `{{PLACEHOLDER}}` tokens
with the user's content, and produce output in exactly the structure the
prompt specifies. The top-level [`SKILL.md`](SKILL.md) is the index of
which prompt fits which task.
