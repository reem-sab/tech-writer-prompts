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
