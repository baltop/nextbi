import { GoogleGenerativeAI, type GenerateContentResult } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set — AI features will be unavailable");
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

function getModel() {
  if (!genAI) throw new Error("Gemini API key is not configured");
  return genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
}

export async function generateText(prompt: string): Promise<string> {
  const model = getModel();
  const result: GenerateContentResult = await model.generateContent(prompt);
  return result.response.text();
}

export async function chat(
  history: { role: "user" | "model"; parts: { text: string }[] }[],
  message: string
): Promise<string> {
  const model = getModel();
  const chatSession = model.startChat({
    history,
    generationConfig: {
      maxOutputTokens: 4096,
      temperature: 0.7,
    },
  });
  const result = await chatSession.sendMessage(message);
  return result.response.text();
}

export async function* chatStream(
  history: { role: "user" | "model"; parts: { text: string }[] }[],
  message: string
): AsyncGenerator<string> {
  const model = getModel();
  const chatSession = model.startChat({
    history,
    generationConfig: {
      maxOutputTokens: 4096,
      temperature: 0.7,
    },
  });
  const result = await chatSession.sendMessageStream(message);
  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) yield text;
  }
}

export function isGeminiAvailable(): boolean {
  return !!genAI;
}
