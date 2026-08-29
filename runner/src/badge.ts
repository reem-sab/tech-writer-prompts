export interface ShieldsBadge {
  schemaVersion: 1;
  label: string;
  message: string;
  color: string;
}

export function makeBadge(passing: number, total: number): ShieldsBadge {
  const color = total === 0 ? "lightgrey" : passing === total ? "brightgreen" : passing === 0 ? "red" : "yellow";
  return {
    schemaVersion: 1,
    label: "evals",
    message: `${passing}/${total}`,
    color,
  };
}
