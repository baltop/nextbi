import Anthropic from "@anthropic-ai/sdk";
import type { MessageParam } from "@anthropic-ai/sdk/resources/messages";

const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
  console.warn("ANTHROPIC_API_KEY is not set — AI features will be unavailable");
}

const client = apiKey ? new Anthropic({ apiKey }) : null;

const MODEL = "claude-sonnet-4-20250514";

function getClient(): Anthropic {
  if (!client) throw new Error("Anthropic API key is not configured");
  return client;
}

export async function generateText(prompt: string): Promise<string> {
  const c = getClient();
  const message = await c.messages.create({
    model: MODEL,
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });
  const block = message.content[0];
  return block.type === "text" ? block.text : "";
}

export async function chat(
  messages: MessageParam[],
  systemPrompt?: string
): Promise<string> {
  const c = getClient();
  const message = await c.messages.create({
    model: MODEL,
    max_tokens: 4096,
    ...(systemPrompt ? { system: systemPrompt } : {}),
    messages,
  });
  const block = message.content[0];
  return block.type === "text" ? block.text : "";
}

export async function* chatStream(
  messages: MessageParam[],
  systemPrompt?: string
): AsyncGenerator<string> {
  const c = getClient();
  const stream = c.messages.stream({
    model: MODEL,
    max_tokens: 4096,
    ...(systemPrompt ? { system: systemPrompt } : {}),
    messages,
  });
  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      yield event.delta.text;
    }
  }
}

export function isAnthropicAvailable(): boolean {
  return !!client;
}
