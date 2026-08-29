import { loadPrompt, loadEvals } from "./loader.js";
import { renderPrompt } from "./render.js";
import { runPrompt, judgeOutput, DEFAULT_MODEL } from "./anthropic.js";
import { checkContains, checkRegex } from "./matchers.js";
import type { EvalCase } from "./schema.js";

export interface EvalCaseResult {
  id: string;
  status: "pass" | "fail" | "skipped";
  failures: string[];
  output?: string;
}

export interface PromptEvalResult {
  slug: string;
  passing: number;
  total: number;
  skipped: number;
  cases: EvalCaseResult[];
}

async function runOneCase(
  slug: string,
  evalCase: EvalCase,
  opts: { judge: boolean; model: string; verbose?: boolean }
): Promise<EvalCaseResult> {
  const prompt = loadPrompt(slug);
  const rendered = renderPrompt(prompt, evalCase.input);
  const output = await runPrompt(rendered, opts.model);

  const failures: string[] = [];
  const { contains, regex, judge_rubric } = evalCase.expect;

  const containsResult = checkContains(output, contains);
  failures.push(...containsResult.failures);

  const regexResult = checkRegex(output, regex);
  failures.push(...regexResult.failures);

  if (judge_rubric) {
    if (!opts.judge) {
      // A case that ONLY has judge_rubric (no contains/regex) is skipped
      // entirely without --judge. If it also has contains/regex, those
      // still ran above and determine the result.
      if (!contains?.length && !regex?.length) {
        return { id: evalCase.id, status: "skipped", failures: [], output };
      }
    } else {
      const judgeResult = await judgeOutput(judge_rubric, output, opts.model);
      if (!judgeResult.pass) {
        failures.push(`judge: ${judgeResult.reason}`);
      }
    }
  }

  return {
    id: evalCase.id,
    status: failures.length === 0 ? "pass" : "fail",
    failures,
    output: opts.verbose ? output : undefined,
  };
}

export async function runEvalsForSlug(
  slug: string,
  opts: { judge?: boolean; model?: string; verbose?: boolean } = {}
): Promise<PromptEvalResult> {
  const cases = loadEvals(slug);
  const model = opts.model ?? DEFAULT_MODEL;
  const results: EvalCaseResult[] = [];

  for (const evalCase of cases) {
    const result = await runOneCase(slug, evalCase, { judge: !!opts.judge, model, verbose: opts.verbose });
    results.push(result);
  }

  const skipped = results.filter((r) => r.status === "skipped").length;
  const executed = results.filter((r) => r.status !== "skipped");
  const passing = executed.filter((r) => r.status === "pass").length;

  return { slug, passing, total: executed.length, skipped, cases: results };
}
