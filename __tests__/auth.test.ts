import { describe, it, expect } from "vitest";
import { signup, login, getUserById, AuthError } from "@/lib/auth";
import { query, queryOne } from "@/lib/db";

function testEmail(name: string) {
  return `${name}@test.nextbi.local`;
}

describe("signup", () => {
  // A-01: 회원가입 성공
  it("유효한 이메일+비밀번호로 가입 성공", async () => {
    const email = testEmail("signup-ok");
    const user = await signup(email, "password123");

    expect(user.id).toBeGreaterThan(0);
    expect(user.email).toBe(email);
  });

  // A-02: 중복 이메일
  it("중복 이메일 가입 시 AuthError(EMAIL_EXISTS) 발생", async () => {
    const email = testEmail("signup-dup");
    await signup(email, "password123");

    await expect(signup(email, "other-pw")).rejects.toThrow(AuthError);
    try {
      await signup(email, "other-pw");
    } catch (err) {
      expect((err as AuthError).code).toBe("EMAIL_EXISTS");
    }
  });

  // A-09: bcrypt 해시 확인 — 평문이 아닌 해시로 저장
  it("비밀번호가 bcrypt 해시로 저장됨", async () => {
    const email = testEmail("hash-check");
    await signup(email, "plaintext123");

    const row = await queryOne<{ password: string }>(
      "SELECT password FROM nextbi.users WHERE email = $1",
      [email]
    );
    expect(row).not.toBeNull();
    expect(row!.password).not.toBe("plaintext123");
    expect(row!.password.length).toBeGreaterThan(50); // bcrypt 해시 길이
  });
});

describe("login", () => {
  // A-03: 로그인 성공
  it("올바른 자격 증명으로 로그인 성공", async () => {
    const email = testEmail("login-ok");
    await signup(email, "mypassword");

    const user = await login(email, "mypassword");
    expect(user.email).toBe(email);
  });

  // A-04: 잘못된 비밀번호
  it("잘못된 비밀번호로 로그인 실패", async () => {
    const email = testEmail("login-wrongpw");
    await signup(email, "correct-pw");

    await expect(login(email, "wrong-pw")).rejects.toThrow(AuthError);
    try {
      await login(email, "wrong-pw");
    } catch (err) {
      expect((err as AuthError).code).toBe("INVALID_CREDENTIALS");
    }
  });

  // A-05: 존재하지 않는 이메일
  it("미존재 이메일로 로그인 실패", async () => {
    await expect(
      login("nobody@test.nextbi.local", "password")
    ).rejects.toThrow(AuthError);
  });
});

describe("getUserById", () => {
  // A-06: ID로 조회 성공
  it("유효한 ID로 사용자 조회", async () => {
    const email = testEmail("getuser-ok");
    const created = await signup(email, "pw123456");

    const user = await getUserById(created.id);
    expect(user).not.toBeNull();
    expect(user!.email).toBe(email);
  });

  // A-07: 없는 ID
  it("존재하지 않는 ID 조회 시 null 반환", async () => {
    const user = await getUserById(999999);
    expect(user).toBeNull();
  });
});
