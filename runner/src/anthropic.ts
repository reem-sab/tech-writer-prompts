import Anthropic from "@anthropic-ai/sdk";

export const DEFAULT_MODEL = process.env.TWP_MODEL ?? "claude-sonnet-5";

let client: Anthropic | undefined;

function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Export it before running `twp run` or `twp eval`:\n" +
        "  export ANTHROPIC_API_KEY=sk-ant-..."
    );
  }
  client ??= new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

export async function runPrompt(prompt: string, model: string = DEFAULT_MODEL): Promise<string> {
  const anthropic = getClient();
  const message = await anthropic.messages.create({
    model,
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });
  return message.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n");
}

export interface JudgeResult {
  pass: boolean;
  reason: string;
}

export async function judgeOutput(
  rubric: string,
  output: string,
  model: string = DEFAULT_MODEL
): Promise<JudgeResult> {
  const judgePrompt = `You are grading whether a piece of writing satisfies a rubric. Answer strictly.

Rubric:
${rubric}

Writing to grade:
"""
${output}
"""

Respond with exactly one line starting with "PASS:" or "FAIL:", followed by a one-sentence reason. Do not add anything else.`;

  const result = await runPrompt(judgePrompt, model);
  const trimmed = result.trim();
  const pass = /^PASS:/i.test(trimmed);
  const fail = /^FAIL:/i.test(trimmed);
  if (!pass && !fail) {
    return { pass: false, reason: `Judge gave an unparseable response: ${trimmed.slice(0, 200)}` };
  }
  return { pass, reason: trimmed.replace(/^(PASS|FAIL):\s*/i, "") };
}
