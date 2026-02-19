import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { chatStream, isGeminiAvailable } from "@/lib/gemini";

const SYSTEM_PROMPT =
  "You are NextBI AI Assistant — a helpful data analysis and BI (Business Intelligence) expert. " +
  "Answer concisely in Korean. Use markdown formatting when helpful. " +
  "Help users understand data, suggest chart types, write SQL queries, and interpret analytics.";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isGeminiAvailable()) {
    return NextResponse.json(
      { error: "AI service is not configured" },
      { status: 503 }
    );
  }

  try {
    const { message, history = [] } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const geminiHistory = [
      { role: "user" as const, parts: [{ text: SYSTEM_PROMPT }] },
      { role: "model" as const, parts: [{ text: "네, NextBI AI 어시스턴트로서 데이터 분석과 BI 관련 질문에 답변하겠습니다." }] },
      ...history.map((h: { role: string; content: string }) => ({
        role: h.role === "user" ? ("user" as const) : ("model" as const),
        parts: [{ text: h.content }],
      })),
    ];

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of chatStream(geminiHistory, message)) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`));
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : "Unknown error";
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: errorMsg })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
