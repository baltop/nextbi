"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      router.push("/dashboard");
    } catch {
      setError("서버 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-md">
        {/* 로고 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
               style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 8px 32px rgba(99,102,241,0.3)" }}>
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            Next<span style={{ color: "var(--primary)" }}>BI</span>
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--fg-muted)" }}>데이터 인사이트를 시각화하세요</p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit}
              className="rounded-2xl p-8 space-y-5"
              style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)" }}>
          <h2 className="text-xl font-semibold text-center" style={{ fontFamily: "var(--font-heading)" }}>로그인</h2>

          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl text-sm"
                 style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}>
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium" style={{ color: "var(--fg-muted)" }}>이메일</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                   placeholder="name@example.com"
                   className="w-full px-4 py-3 rounded-xl text-sm transition-all outline-none"
                   style={{ background: "var(--input-bg)", border: "1px solid var(--border)", color: "var(--fg)" }}
                   onFocus={e => { e.target.style.borderColor = "var(--primary)"; e.target.style.boxShadow = "0 0 0 3px var(--ring)"; }}
                   onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }} />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium" style={{ color: "var(--fg-muted)" }}>비밀번호</label>
            <div className="relative">
              <input type={show ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                     placeholder="••••••••"
                     className="w-full px-4 py-3 pr-12 rounded-xl text-sm transition-all outline-none"
                     style={{ background: "var(--input-bg)", border: "1px solid var(--border)", color: "var(--fg)" }}
                     onFocus={e => { e.target.style.borderColor = "var(--primary)"; e.target.style.boxShadow = "0 0 0 3px var(--ring)"; }}
                     onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }} />
              <button type="button" onClick={() => setShow(!show)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: "var(--fg-subtle)", background: "none", border: "none", cursor: "pointer" }}>
                {show ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
                  className="w-full py-3 px-4 text-white font-medium rounded-xl transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 4px 16px rgba(99,102,241,0.3)", border: "none", cursor: "pointer" }}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                로그인 중...
              </span>
            ) : "로그인"}
          </button>

          <p className="text-center text-sm" style={{ color: "var(--fg-muted)" }}>
            계정이 없으신가요?{" "}
            <Link href="/signup" className="font-medium" style={{ color: "var(--primary)" }}>회원가입</Link>
          </p>
        </form>

        <p className="text-center text-xs mt-8" style={{ color: "var(--fg-subtle)" }}>© 2026 NextBI. 데이터 시각화 솔루션</p>
      </div>
    </div>
  );
}
