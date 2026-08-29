import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT_DIR, PROMPTS_DIR } from "./loader.js";
import { makeBadge } from "./badge.js";
import type { PromptEvalResult } from "./evalRunner.js";

export function writeResults(results: PromptEvalResult[], model: string): void {
  const evalsDir = join(ROOT_DIR, "evals");
  mkdirSync(evalsDir, { recursive: true });

  const payload = {
    generated_at: new Date().toISOString(),
    model,
    prompts: Object.fromEntries(
      results.map((r) => [
        r.slug,
        {
          passing: r.passing,
          total: r.total,
          skipped: r.skipped,
          cases: r.cases.map((c) => ({ id: c.id, status: c.status, failures: c.failures })),
        },
      ])
    ),
  };
  writeFileSync(join(evalsDir, "results.json"), JSON.stringify(payload, null, 2) + "\n");

  for (const r of results) {
    const badge = makeBadge(r.passing, r.total);
    writeFileSync(join(PROMPTS_DIR, r.slug, "badge.json"), JSON.stringify(badge, null, 2) + "\n");
  }
}
