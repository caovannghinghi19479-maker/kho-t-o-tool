const tokenize = (text: string): string[] =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);

const ngrams = (tokens: string[], n: number): Set<string> => {
  const out = new Set<string>();
  for (let i = 0; i <= tokens.length - n; i += 1) {
    out.add(tokens.slice(i, i + n).join(' '));
  }
  return out;
};

const jaccard = (a: Set<string>, b: Set<string>): number => {
  if (a.size === 0 && b.size === 0) return 1;
  const intersection = [...a].filter((x) => b.has(x)).length;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : intersection / union;
};

export interface OriginalityScore {
  score: number;
  lexicalOverlap: number;
  phraseOverlap: number;
  verdict: 'excellent' | 'good' | 'medium' | 'low';
}

export const scoreOriginality = (source: string, rewritten: string): OriginalityScore => {
  const sourceTokens = tokenize(source);
  const rewrittenTokens = tokenize(rewritten);
  const lexical = jaccard(new Set(sourceTokens), new Set(rewrittenTokens));
  const phrase = jaccard(ngrams(sourceTokens, 3), ngrams(rewrittenTokens, 3));

  const overlap = lexical * 0.6 + phrase * 0.4;
  const score = Math.max(0, Math.min(100, Math.round((1 - overlap) * 100)));

  const verdict: OriginalityScore['verdict'] =
    score >= 80 ? 'excellent' : score >= 65 ? 'good' : score >= 45 ? 'medium' : 'low';

  return {
    score,
    lexicalOverlap: Number(lexical.toFixed(4)),
    phraseOverlap: Number(phrase.toFixed(4)),
    verdict
  };
};
