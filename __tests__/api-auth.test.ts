import { describe, it, expect } from "vitest";
import { signup } from "@/lib/auth";
import { query } from "@/lib/db";

// API Route 테스트 — 직접 route handler 함수를 import해서 테스트
// Next.js의 route handler는 순수 함수이므로 직접 호출 가능

// signup route handler import
import { POST as signupHandler } from "../src/app/api/auth/signup/route";
import { POST as loginHandler } from "../src/app/api/auth/login/route";

function testEmail(name: string) {
  return `${name}@test.nextbi.local`;
}

function makeRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost:3000/api/auth/test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/auth/signup", () => {
  // H-02: 회원가입 성공
  it("유효한 입력으로 가입 성공", async () => {
    const email = testEmail("api-signup-ok");
    const req = makeRequest({
      email,
      password: "password123",
      confirmPassword: "password123",
    });
    const res = await signupHandler(req as any);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.user.email).toBe(email);
  });

  // H-03: 빈 입력
  it("빈 이메일/비밀번호 → 400", async () => {
    const req = makeRequest({ email: "", password: "", confirmPassword: "" });
    const res = await signupHandler(req as any);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("입력해주세요");
  });

  // H-04: 비밀번호 너무 짧음
  it("비밀번호 8자 미만 → 400", async () => {
    const req = makeRequest({
      email: "short@test.nextbi.local",
      password: "1234567",
      confirmPassword: "1234567",
    });
    const res = await signupHandler(req as any);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("8자 이상");
  });

  // H-05: 비밀번호 불일치
  it("비밀번호 확인 불일치 → 400", async () => {
    const req = makeRequest({
      email: "mismatch@test.nextbi.local",
      password: "password123",
      confirmPassword: "different",
    });
    const res = await signupHandler(req as any);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("일치하지");
  });

  // H-06: 중복 이메일
  it("중복 이메일 가입 → 409", async () => {
    const email = testEmail("api-dup");
    await signup(email, "password123");

    const req = makeRequest({
      email,
      password: "password123",
      confirmPassword: "password123",
    });
    const res = await signupHandler(req as any);

    expect(res.status).toBe(409);
    const data = await res.json();
    expect(data.error).toContain("이미 등록된");
  });
});

describe("POST /api/auth/login", () => {
  // H-09: 로그인 성공
  it("올바른 자격 증명으로 로그인 성공", async () => {
    const email = testEmail("api-login-ok");
    await signup(email, "mypassword");

    const req = makeRequest({ email, password: "mypassword" });
    const res = await loginHandler(req as any);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });

  // H-10: 잘못된 비밀번호
  it("잘못된 비밀번호 → 401", async () => {
    const email = testEmail("api-login-wrong");
    await signup(email, "correct");

    const req = makeRequest({ email, password: "wrong" });
    const res = await loginHandler(req as any);

    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toContain("올바르지 않습니다");
  });

  // H-11: 빈 입력
  it("빈 이메일/비밀번호 → 400", async () => {
    const req = makeRequest({ email: "", password: "" });
    const res = await loginHandler(req as any);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("입력해주세요");
  });

  // H-12: 미존재 이메일
  it("존재하지 않는 이메일 → 401", async () => {
    const req = makeRequest({
      email: "ghost@test.nextbi.local",
      password: "pw",
    });
    const res = await loginHandler(req as any);

    expect(res.status).toBe(401);
  });
});
