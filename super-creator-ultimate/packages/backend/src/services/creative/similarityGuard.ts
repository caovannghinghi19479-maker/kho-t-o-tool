const cosine = (a: number[], b: number[]): number => {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i += 1) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / ((Math.sqrt(na) * Math.sqrt(nb)) || 1);
};

const embed = (text: string): number[] => {
  const vec = Array.from({ length: 16 }, () => 0);
  for (const ch of text) {
    vec[ch.charCodeAt(0) % vec.length] += 1;
  }
  return vec;
};

export const checkPromptSimilarity = (prompt: string, templates: string[]): { maxSimilarity: number; isTooSimilar: boolean } => {
  const p = embed(prompt);
  const sims = templates.map((t) => cosine(p, embed(t)));
  const maxSimilarity = sims.length ? Math.max(...sims) : 0;
  return { maxSimilarity, isTooSimilar: maxSimilarity > 0.93 };
};
