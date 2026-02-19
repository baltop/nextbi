import { Pool } from "pg";

// NextBI 전용 스키마 사용 — devdb 내 'nextbi' 스키마로 격리
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://dev:devpass@localhost:5432/devdb",
});

/** DB 초기화: 스키마 생성 + 테이블 마이그레이션 */
export async function migrate() {
  const client = await pool.connect();
  try {
    await client.query(`CREATE SCHEMA IF NOT EXISTS nextbi`);
    await client.query(`
      CREATE TABLE IF NOT EXISTS nextbi.users (
        id          SERIAL PRIMARY KEY,
        email       VARCHAR(255) UNIQUE NOT NULL,
        password    VARCHAR(255) NOT NULL,
        name        VARCHAR(100) DEFAULT '',
        created_at  TIMESTAMPTZ DEFAULT NOW(),
        updated_at  TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_nextbi_users_email ON nextbi.users(email);

      CREATE TABLE IF NOT EXISTS nextbi.sessions (
        token       VARCHAR(64) PRIMARY KEY,
        user_id     INT NOT NULL,
        email       VARCHAR(255) NOT NULL,
        created_at  TIMESTAMPTZ DEFAULT NOW()
      );
    `);
  } finally {
    client.release();
  }
}

/** 쿼리 실행 헬퍼 */
export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const result = await pool.query(text, params);
  return result.rows as T[];
}

/** 단일 행 조회 */
export async function queryOne<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}

// 앱 시작 시 자동 마이그레이션 (한 번만 실행)
let migrated = false;
export async function ensureMigrated() {
  if (migrated) return;
  await migrate();
  migrated = true;
}

// 모듈 로드 시 자동 마이그레이션
ensureMigrated().catch(console.error);

export { pool };
