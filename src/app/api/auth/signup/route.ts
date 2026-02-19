import { NextRequest, NextResponse } from "next/server";
import { signup, AuthError } from "@/lib/auth";
import { createSessionToken } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, confirmPassword } = body;

    // 입력 검증
    if (!email || !password) {
      return NextResponse.json(
        { error: "이메일과 비밀번호를 입력해주세요" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "비밀번호는 8자 이상이어야 합니다" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "비밀번호가 일치하지 않습니다" },
        { status: 400 }
      );
    }

    // 회원가입 처리
    const user = await signup(email.trim(), password);

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
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error("회원가입 오류:", err);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
