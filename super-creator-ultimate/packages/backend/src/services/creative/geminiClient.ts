import { GoogleGenerativeAI } from '@google/generative-ai';

const modelName = process.env.GEMINI_MODEL ?? 'gemini-1.5-flash';

export const runGeminiText = async (prompt: string, temperature = 0.7): Promise<string | null> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({
    model: modelName,
    generationConfig: { temperature }
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text()?.trim();
  return text || null;
};
