import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSecret } from "./secretStore.js";

async function model(modelName: string) {
  const apiKey = await getSecret("geminiApiKey");
  if (!apiKey) throw new Error("Gemini API key missing in secure local store");
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: modelName });
}

async function jsonCall(modelName: string, prompt: string) {
  const m = await model(modelName);
  const response = await m.generateContent(prompt);
  const raw = response.response.text().replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  return JSON.parse(raw);
}

export const geminiService = {
  expandIdea: (prompt: string) => jsonCall("gemini-2.0-flash", prompt),
  analyzeCompetitor: (prompt: string) => jsonCall("gemini-2.5-pro", prompt),
  creativeDelta: (prompt: string) => jsonCall("gemini-2.0-flash", prompt)
};
