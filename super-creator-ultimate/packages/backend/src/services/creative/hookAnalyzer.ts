export interface HookInput {
  transcript: string;
  visualComplexity: number;
  motionScore: number;
}

export interface HookScore {
  score: number;
  rationale: string[];
}

export const analyzeHook = (input: HookInput): HookScore => {
  const opening = input.transcript.split(/[.!?]/).slice(0, 2).join(' ').toLowerCase();
  let score = 40;
  const rationale: string[] = [];

  if (/\b(you|your|secret|mistake|how to|stop|why)\b/.test(opening)) {
    score += 20;
    rationale.push('Opening uses strong audience-directed or curiosity language.');
  }
  if (input.visualComplexity > 0.12) {
    score += 15;
    rationale.push('Visual complexity suggests richer first-frame stimulation.');
  }
  if (input.motionScore > 0.07) {
    score += 15;
    rationale.push('Early motion level supports retention momentum.');
  }
  if (opening.length > 120) {
    score -= 10;
    rationale.push('Opening may be verbose for first-5-second retention.');
  }

  return { score: Math.max(0, Math.min(100, score)), rationale };
};
