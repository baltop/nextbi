import { NextRequest, NextResponse } from "next/server";

// 인증이 필요한 경로
const protectedPaths = ["/dashboard"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 보호 경로 체크
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // 세션 쿠키 확인 (존재 여부만 — 실제 검증은 서버 컴포넌트에서)
  const token = req.cookies.get("session_token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
