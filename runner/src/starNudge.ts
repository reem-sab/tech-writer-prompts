import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const FLAG_DIR = join(homedir(), ".twp");
const FLAG_FILE = join(FLAG_DIR, "starred-nudge-shown");

/** Prints the star nudge once per machine, only after a fully passing eval --all run. */
export function maybeShowStarNudge(): void {
  if (existsSync(FLAG_FILE)) return;
  mkdirSync(FLAG_DIR, { recursive: true });
  writeFileSync(FLAG_FILE, new Date().toISOString() + "\n");
  console.log(
    "\nAll evals passing -- if tech-writer-prompts is useful to you, a star at github.com/reem-sab/tech-writer-prompts helps other technical writers find it."
  );
}
