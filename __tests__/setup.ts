import { migrate, pool } from "@/lib/db";
import { query } from "@/lib/db";

// 테스트 시작 전 마이그레이션
beforeAll(async () => {
  await migrate();
});

// 각 테스트 후 테스트 데이터 정리
afterEach(async () => {
  await query("DELETE FROM nextbi.users WHERE email LIKE $1", [
    "%@test.nextbi.local",
  ]);
});

// 전체 테스트 후 DB 연결 종료
afterAll(async () => {
  await pool.end();
});
