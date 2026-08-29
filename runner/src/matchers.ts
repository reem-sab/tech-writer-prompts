export interface MatchResult {
  pass: boolean;
  failures: string[];
}

/** All strings in `contains` must appear verbatim (case-sensitive) in output. */
export function checkContains(output: string, contains: string[] | undefined): MatchResult {
  if (!contains || contains.length === 0) return { pass: true, failures: [] };
  const failures = contains.filter((needle) => !output.includes(needle)).map((needle) => `missing substring: ${JSON.stringify(needle)}`);
  return { pass: failures.length === 0, failures };
}

/** All patterns in `regex` must match somewhere in output. Compiled case-insensitively. */
export function checkRegex(output: string, patterns: string[] | undefined): MatchResult {
  if (!patterns || patterns.length === 0) return { pass: true, failures: [] };
  const failures: string[] = [];
  for (const pattern of patterns) {
    let re: RegExp;
    try {
      re = new RegExp(pattern, "i");
    } catch (err) {
      failures.push(`invalid regex ${JSON.stringify(pattern)}: ${(err as Error).message}`);
      continue;
    }
    if (!re.test(output)) {
      failures.push(`no match for regex: ${JSON.stringify(pattern)}`);
    }
  }
  return { pass: failures.length === 0, failures };
}
