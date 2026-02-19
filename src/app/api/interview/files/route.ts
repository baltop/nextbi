import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { readdir, stat } from "fs/promises";
import path from "path";

const UPLOAD_DIR = "uploads/interviews";

function formatBytes(b: number): string {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userDir = path.join(process.cwd(), UPLOAD_DIR, String(session.userId));

  try {
    const entries = await readdir(userDir, { withFileTypes: true });
    const files = await Promise.all(
      entries
        .filter((e) => !e.isDirectory())
        .map(async (e) => {
          const info = await stat(path.join(userDir, e.name));
          return {
            name: e.name,
            size: formatBytes(info.size),
            time: info.mtime.toISOString().slice(0, 16).replace("T", " "),
          };
        })
    );
    files.sort((a, b) => (a.time > b.time ? -1 : 1));
    return NextResponse.json(files);
  } catch {
    return NextResponse.json([]);
  }
}
