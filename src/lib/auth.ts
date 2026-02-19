import bcrypt from "bcryptjs";
import { query, queryOne } from "./db";

// 사용자 타입
export interface User {
  id: number;
  email: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

interface UserRow extends User {
  password: string;
}

export class AuthError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
  }
}

/** 회원가입 */
export async function signup(
  email: string,
  password: string
): Promise<User> {
  // 비밀번호 해싱 (bcrypt)
  const hashed = await bcrypt.hash(password, 10);

  try {
    const rows = await query<User>(
      `INSERT INTO nextbi.users (email, password)
       VALUES ($1, $2)
       RETURNING id, email, name, created_at, updated_at`,
      [email, hashed]
    );
    return rows[0];
  } catch (err: unknown) {
    const pgErr = err as { code?: string };
    if (pgErr.code === "23505") {
      throw new AuthError("이미 등록된 이메일입니다", "EMAIL_EXISTS");
    }
    throw err;
  }
}

/** 로그인 */
export async function login(
  email: string,
  password: string
): Promise<User> {
  const row = await queryOne<UserRow>(
    `SELECT id, email, password, name, created_at, updated_at
     FROM nextbi.users WHERE email = $1`,
    [email]
  );

  if (!row) {
    throw new AuthError(
      "이메일 또는 비밀번호가 올바르지 않습니다",
      "INVALID_CREDENTIALS"
    );
  }

  const valid = await bcrypt.compare(password, row.password);
  if (!valid) {
    throw new AuthError(
      "이메일 또는 비밀번호가 올바르지 않습니다",
      "INVALID_CREDENTIALS"
    );
  }

  const { password: _, ...user } = row;
  return user;
}

/** ID로 사용자 조회 */
export async function getUserById(id: number): Promise<User | null> {
  return queryOne<User>(
    `SELECT id, email, name, created_at, updated_at
     FROM nextbi.users WHERE id = $1`,
    [id]
  );
}
