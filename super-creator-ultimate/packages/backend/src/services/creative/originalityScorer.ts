const tokenize = (text: string): Set<string> =>
  new Set(text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 2));

export interface OriginalityScore {
  score: number;
  overlapRatio: number;
}

export const scoreOriginality = (source: string, rewritten: string): OriginalityScore => {
  const a = tokenize(source);
  const b = tokenize(rewritten);
  const common = [...a].filter((t) => b.has(t)).length;
  const overlap = a.size ? common / a.size : 1;
  const score = Math.max(0, Math.min(100, Math.round((1 - overlap) * 100)));
  return { score, overlapRatio: overlap };
};
