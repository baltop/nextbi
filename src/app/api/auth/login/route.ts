import { NextRequest, NextResponse } from "next/server";
import { login, AuthError } from "@/lib/auth";
import { createSessionToken } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // 입력 검증
    if (!email || !password) {
      return NextResponse.json(
        { error: "이메일과 비밀번호를 입력해주세요" },
        { status: 400 }
      );
    }

    // 로그인 처리
    const user = await login(email.trim(), password);

    // 세션 토큰 생성 + 쿠키를 응답 헤더에 직접 설정
    const token = await createSessionToken(user.id, user.email);
    const res = NextResponse.json({ success: true, user: { id: user.id, email: user.email } });
    res.cookies.set("session_token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }
    console.error("로그인 오류:", err);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
