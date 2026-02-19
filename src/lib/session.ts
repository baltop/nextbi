import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import { query, queryOne } from "./db";

// 세션 타입
export interface Session {
  userId: number;
  email: string;
  createdAt: Date;
}

/** 세션 토큰 생성 */
function generateToken(): string {
  return randomBytes(32).toString("hex");
}

/** DB에 세션 테이블 생성 (마이그레이션) */
export async function migrateSession() {
  await query(`
    CREATE TABLE IF NOT EXISTS nextbi.sessions (
      token       VARCHAR(64) PRIMARY KEY,
      user_id     INT NOT NULL,
      email       VARCHAR(255) NOT NULL,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );
  `);
}

/** 세션 생성 (토큰 반환 — 쿠키는 호출자가 설정) */
export async function createSessionToken(
  userId: number,
  email: string
): Promise<string> {
  const token = generateToken();
  await query(
    `INSERT INTO nextbi.sessions (token, user_id, email) VALUES ($1, $2, $3)`,
    [token, userId, email]
  );
  return token;
}

/** 토큰으로 세션 조회 */
export async function getSessionByToken(
  token: string
): Promise<Session | null> {
  const row = await queryOne<{
    user_id: number;
    email: string;
    created_at: Date;
  }>(
    `SELECT user_id, email, created_at FROM nextbi.sessions WHERE token = $1`,
    [token]
  );
  if (!row) return null;
  return { userId: row.user_id, email: row.email, createdAt: row.created_at };
}

/** 현재 요청의 세션 가져오기 (쿠키에서 토큰 읽기) */
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return null;
  return getSessionByToken(token);
}

/** 세션 삭제 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (token) {
    await query(`DELETE FROM nextbi.sessions WHERE token = $1`, [token]);
  }
  cookieStore.set("session_token", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/** 토큰으로 직접 세션 삭제 (테스트/API용) */
export async function deleteSessionByToken(token: string): Promise<void> {
  await query(`DELETE FROM nextbi.sessions WHERE token = $1`, [token]);
}
