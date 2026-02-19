import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const UPLOAD_DIR = "uploads/interviews";
const MAX_UPLOAD_BYTES = 50 * 1024 * 1024; // 50MB

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
  }

  const contentLength = parseInt(req.headers.get("content-length") || "0", 10);
  if (contentLength > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: "파일이 너무 큽니다 (최대 50MB)" },
      { status: 400 }
    );
  }

  const formData = await req.formData();
  const files = formData.getAll("files") as File[];

  if (files.length === 0) {
    return NextResponse.json(
      { error: "파일을 선택해주세요" },
      { status: 400 }
    );
  }

  const userDir = path.join(process.cwd(), UPLOAD_DIR, String(session.userId));
  await mkdir(userDir, { recursive: true });

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const safeName = path.basename(file.name);
    await writeFile(path.join(userDir, safeName), buffer);
  }

  return NextResponse.json({ ok: true });
}
