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
  // Identity-linked API keys must send the workspace they act in on every
  // request. Set ANTHROPIC_WORKSPACE_ID for those; a standard workspace key
  // doesn't need it, and the header is omitted when the var is absent.
  const workspaceId = process.env.ANTHROPIC_WORKSPACE_ID;
  const defaultHeaders = workspaceId ? { "anthropic-workspace-id": workspaceId } : undefined;
  client ??= new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, defaultHeaders });
  return client;
}

export async function runPrompt(prompt: string, model: string = DEFAULT_MODEL): Promise<string> {
  const anthropic = getClient();
  let message;
  try {
    message = await anthropic.messages.create({
      model,
      max_tokens: 4096,
      // Note: newer Claude models (claude-sonnet-5) reject the `temperature`
      // parameter -- it is deprecated for them and returns a 400. Determinism
      // instead comes from robust eval assertions and the tolerant judge
      // parsing below, not from forcing temperature 0.
      messages: [{ role: "user", content: prompt }],
    });
  } catch (err) {
    const msg = (err as Error).message ?? "";
    if (/anthropic-workspace-id/.test(msg) && !process.env.ANTHROPIC_WORKSPACE_ID) {
      throw new Error(
        "Your API key is identity-linked and requires a workspace id. Set ANTHROPIC_WORKSPACE_ID\n" +
          "(find it in the Anthropic Console under Settings -> Workspaces; it looks like wrkspc_...):\n" +
          "  export ANTHROPIC_WORKSPACE_ID=wrkspc_...\n" +
          "Or use a standard (non-identity-linked) workspace API key instead."
      );
    }
    throw err;
  }
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
  const judgePrompt = `You are grading whether a piece of writing satisfies a rubric. Grade only against what the rubric asks for. Do not invent extra requirements, and do not penalize output for behavior the rubric does not mention.

Rubric:
${rubric}

Writing to grade:
"""
${output}
"""

Your entire response must be a single line: the word PASS or the word FAIL, then a colon, then a one-sentence reason. The first word must be PASS or FAIL. Do not write anything before it.`;

  const result = await runPrompt(judgePrompt, model);
  const verdict = parseJudgeVerdict(result);
  if (!verdict) {
    return { pass: false, reason: `Judge gave an unparseable response: ${result.trim().slice(0, 200)}` };
  }
  return verdict;
}

/**
 * Reads a PASS/FAIL verdict from the judge's reply. Prefers a strict
 * first-token match, but falls back to the last explicit PASS:/FAIL: marker
 * anywhere in the reply so a judge that reasons before answering still
 * grades correctly instead of scoring as unparseable.
 */
export function parseJudgeVerdict(raw: string): JudgeResult | undefined {
  const trimmed = raw.trim();
  const firstLine = trimmed.split("\n")[0].trim();
  if (/^PASS\b/i.test(firstLine)) return { pass: true, reason: firstLine.replace(/^PASS[:\s-]*/i, "") };
  if (/^FAIL\b/i.test(firstLine)) return { pass: false, reason: firstLine.replace(/^FAIL[:\s-]*/i, "") };

  const markers = [...trimmed.matchAll(/\b(PASS|FAIL)\s*:/gi)];
  if (markers.length > 0) {
    const last = markers[markers.length - 1];
    const pass = last[1].toUpperCase() === "PASS";
    const reason = trimmed.slice(last.index! + last[0].length).trim().split("\n")[0];
    return { pass, reason: reason || (pass ? "passed" : "failed") };
  }
  return undefined;
}
