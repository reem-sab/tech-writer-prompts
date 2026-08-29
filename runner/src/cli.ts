#!/usr/bin/env node
import { Command } from "commander";
import { writeFileSync } from "node:fs";
import { listPromptSlugs, loadPrompt } from "./loader.js";
import { lintPrompt } from "./lint.js";
import { renderPrompt } from "./render.js";
import { runPrompt, DEFAULT_MODEL } from "./anthropic.js";
import { runEvalsForSlug } from "./evalRunner.js";
import { writeResults } from "./results.js";
import { maybeShowStarNudge } from "./starNudge.js";
import { generateAllSkills } from "./genSkills.js";

const program = new Command();

program
  .name("twp")
  .description("Run and test the tech-writer-prompts library")
  .version("1.0.0");

program
  .command("list")
  .description("List every prompt in the library")
  .action(() => {
    const slugs = listPromptSlugs();
    if (slugs.length === 0) {
      console.log("No prompts found.");
      return;
    }
    for (const slug of slugs) {
      const { frontmatter } = loadPrompt(slug);
      const tags = frontmatter.tags.join(", ");
      console.log(`${slug}  (v${frontmatter.version})`);
      console.log(`  ${frontmatter.name} -- ${frontmatter.description.trim()}`);
      console.log(`  tags: ${tags}`);
      console.log("");
    }
  });

function parseInputOption(value: string, previous: Record<string, string>): Record<string, string> {
  const eq = value.indexOf("=");
  if (eq === -1) {
    throw new Error(`--input must be NAME=value, got: ${value}`);
  }
  const key = value.slice(0, eq);
  const val = value.slice(eq + 1);
  return { ...previous, [key]: val };
}

program
  .command("run <slug>")
  .description("Render a prompt with inputs and run it against the model")
  .option(
    "--input <NAME=value>",
    "input value, or a path to a file whose contents will be used (repeatable)",
    parseInputOption,
    {}
  )
  .option("--model <model>", "override the model used", DEFAULT_MODEL)
  .option("--out <file>", "write output to a file instead of stdout")
  .option("--dry-run", "render the prompt and print it without calling the model", false)
  .action(async (slug: string, opts: { input: Record<string, string>; model: string; out?: string; dryRun: boolean }) => {
    try {
      const prompt = loadPrompt(slug);
      const lintErrors = lintPrompt(prompt);
      if (lintErrors.length > 0) {
        console.error(`Lint errors in ${slug}:`);
        lintErrors.forEach((e) => console.error(`  - ${e}`));
        process.exitCode = 1;
        return;
      }
      const rendered = renderPrompt(prompt, opts.input);
      if (opts.dryRun) {
        console.log(rendered);
        return;
      }
      const output = await runPrompt(rendered, opts.model);
      if (opts.out) {
        writeFileSync(opts.out, output);
        console.log(`Wrote output to ${opts.out}`);
      } else {
        console.log(output);
      }
    } catch (err) {
      console.error((err as Error).message);
      process.exitCode = 1;
    }
  });

program
  .command("lint [slug]")
  .description("Validate frontmatter and placeholder consistency (all prompts if no slug given)")
  .action((slug?: string) => {
    const slugs = slug ? [slug] : listPromptSlugs();
    let hadErrors = false;
    for (const s of slugs) {
      try {
        const prompt = loadPrompt(s);
        const errors = lintPrompt(prompt);
        if (errors.length > 0) {
          hadErrors = true;
          console.error(`${s}:`);
          errors.forEach((e) => console.error(`  - ${e}`));
        } else {
          console.log(`${s}: OK`);
        }
      } catch (err) {
        hadErrors = true;
        console.error(`${s}: ${(err as Error).message}`);
      }
    }
    if (hadErrors) process.exitCode = 1;
  });

program
  .command("gen-skills")
  .description("Generate a per-prompt SKILL.md for every prompt (used by the dashboard's install commands)")
  .action(() => {
    try {
      const written = generateAllSkills();
      written.forEach((path) => console.log(`wrote ${path}`));
      console.log(`\nGenerated ${written.length} SKILL.md file(s).`);
    } catch (err) {
      console.error((err as Error).message);
      process.exitCode = 1;
    }
  });

program
  .command("eval [slug]")
  .description("Run the eval cases for a prompt (or every prompt with --all)")
  .option("--all", "run evals for every prompt in the library", false)
  .option("--judge", "also run judge_rubric cases via the Anthropic API", false)
  .option("--model <model>", "override the model used", DEFAULT_MODEL)
  .option("--verbose", "include full model output in the console report", false)
  .action(async (slug: string | undefined, opts: { all: boolean; judge: boolean; model: string; verbose: boolean }) => {
    try {
      if (!slug && !opts.all) {
        console.error("Provide a slug, or pass --all to run every prompt's evals.");
        process.exitCode = 1;
        return;
      }
      const slugs = opts.all ? listPromptSlugs() : [slug!];

      // Lint before running -- a broken prompt shouldn't burn API calls.
      let lintFailed = false;
      for (const s of slugs) {
        const prompt = loadPrompt(s);
        const errors = lintPrompt(prompt);
        if (errors.length > 0) {
          lintFailed = true;
          console.error(`Lint errors in ${s}:`);
          errors.forEach((e) => console.error(`  - ${e}`));
        }
      }
      if (lintFailed) {
        process.exitCode = 1;
        return;
      }

      const results = [];
      for (const s of slugs) {
        console.log(`Running evals for ${s}...`);
        const result = await runEvalsForSlug(s, { judge: opts.judge, model: opts.model, verbose: opts.verbose });
        results.push(result);
        for (const c of result.cases) {
          const icon = c.status === "pass" ? "PASS" : c.status === "fail" ? "FAIL" : "SKIP";
          console.log(`  [${icon}] ${c.id}`);
          if (c.status === "fail") {
            c.failures.forEach((f) => console.log(`         ${f}`));
          }
          if (c.status === "skipped") {
            console.log("         judge_rubric case -- rerun with --judge to evaluate");
          }
        }
        console.log(`  ${result.passing}/${result.total} passing (${result.skipped} skipped)\n`);
      }

      writeResults(results, opts.model);

      const allPassing = results.every((r) => r.total > 0 && r.passing === r.total);
      const anyExecuted = results.some((r) => r.total > 0);
      if (allPassing && anyExecuted) {
        maybeShowStarNudge();
      }

      const anyFailed = results.some((r) => r.passing < r.total);
      if (anyFailed) process.exitCode = 1;
    } catch (err) {
      console.error((err as Error).message);
      process.exitCode = 1;
    }
  });

program.parseAsync(process.argv);
