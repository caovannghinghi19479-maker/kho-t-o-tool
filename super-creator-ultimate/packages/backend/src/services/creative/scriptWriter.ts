export interface ScriptWriterInput {
  sourceTranscript: string;
  angle: string;
  tone: string;
}

const geminiCall = async (prompt: string): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return `Improved script (local fallback): ${prompt.slice(0, 240)}...`;
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini request failed: ${response.status}`);
  }

  const data = (await response.json()) as any;
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No script returned from Gemini.';
};

export const rewriteScript = async (input: ScriptWriterInput): Promise<string> => {
  const prompt = [
    'Rewrite this competitor transcript into an original and stronger script.',
    `Angle: ${input.angle}`,
    `Tone: ${input.tone}`,
    'Keep core information value but change structure, phrasing, examples, and pacing.',
    'Return plain script only.',
    `Transcript:\n${input.sourceTranscript}`
  ].join('\n\n');

  return geminiCall(prompt);
};
