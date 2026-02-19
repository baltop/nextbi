"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AiChat from "./ai-chat";

interface Props {
  user: { id: number; email: string; name: string };
}

/* 미니 바 차트 컴포넌트 */
function MiniBar({ heights, color }: { heights: number[]; color: string }) {
  return (
    <div className="flex gap-1 items-end" style={{ height: 24 }}>
      {heights.map((h, i) => (
        <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: "var(--minibar-bg)" }}>
          <div className="w-full h-full rounded-sm" style={{ background: color }} />
        </div>
      ))}
    </div>
  );
}

/* 뱃지 컴포넌트 */
function Badge({ children, variant = "gray" }: { children: React.ReactNode; variant?: "green" | "blue" | "gray" }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
          style={{
            background: `var(--badge-${variant}-bg)`,
            color: `var(--badge-${variant}-fg)`,
            border: `1px solid var(--badge-${variant}-border)`,
          }}>
      {children}
    </span>
  );
}

export default function DashboardClient({ user }: Props) {
  const router = useRouter();
  const [dark, setDark] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const isDark = saved === "dark" || !saved;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  const sidebarW = sidebarOpen ? "14rem" : "4rem";

  const navItems = [
    { label: "대시보드", icon: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5", active: true },
    { label: "차트", icon: "M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z", active: false },
    { label: "리포트", icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z", active: false },
  ];

  const dataItems = [
    { label: "데이터셋", icon: "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" },
    { label: "데이터 소스", icon: "M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.193-9.193a4.5 4.5 0 00-6.364 6.364l4.5 4.5a4.5 4.5 0 007.244 1.242" },
    { label: "업로드", icon: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" },
  ];

  const stats = [
    { label: "총 방문자", value: "24,521", change: "+12.5%", up: true, sub: "이번 달 기준", bars: [40,65,45,80,60,90,100], color: "#3b82f6" },
    { label: "전환율", value: "4.28%", change: "+3.2%", up: true, sub: "목표 5.0%", progress: 85.6 },
    { label: "매출", value: "₩12.4M", change: "+8.1%", up: true, sub: "전월 대비", bars: [50,35,70,55,85,75,95], color: "#22c55e" },
    { label: "활성 사용자", value: "1,847", change: "-2.4%", up: false, sub: "현재 접속 중" },
  ];

  const traffic = [
    { label: "직접 방문", pct: 42, color: "#3b82f6" },
    { label: "검색 엔진", pct: 28, color: "#8b5cf6" },
    { label: "소셜 미디어", pct: 18, color: "#22c55e" },
    { label: "추천 링크", pct: 12, color: "#f59e0b" },
  ];

  const activity = [
    { name: "김민수", action: "리포트 생성", time: "2분 전", color: "#3b82f6" },
    { name: "이서연", action: "데이터셋 업로드", time: "15분 전", color: "#8b5cf6" },
    { name: "박준혁", action: "차트 수정", time: "1시간 전", color: "#22c55e" },
    { name: "최유진", action: "대시보드 공유", time: "3시간 전", color: "#f59e0b" },
  ];

  const pages = [
    { path: "/dashboard", visits: "8,492", uniq: "6,241", bounce: "12%" },
    { path: "/analytics", visits: "5,108", uniq: "3,872", bounce: "18%" },
    { path: "/reports/monthly", visits: "3,847", uniq: "2,956", bounce: "24%" },
    { path: "/settings", visits: "2,103", uniq: "1,847", bounce: "32%" },
    { path: "/upload", visits: "1,592", uniq: "1,203", bounce: "28%" },
  ];

  function SideIcon({ d }: { d: string }) {
    return (
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d={d} />
      </svg>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg)" }}>
      {/* 사이드바 */}
      <aside className="fixed inset-y-0 left-0 z-30 flex flex-col transition-all duration-300"
             style={{ width: sidebarW, background: "var(--bg)", borderRight: "1px solid var(--border)" }}>
        {/* 로고 */}
        <div className="flex items-center h-12 px-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
            {sidebarOpen && <span className="text-sm font-bold" style={{ fontFamily: "var(--font-heading)" }}>NextBI</span>}
          </div>
        </div>

        <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-1">
          {sidebarOpen && <div className="text-xs font-semibold uppercase tracking-wider px-3 py-1" style={{ color: "var(--fg-subtle)", fontSize: "0.6875rem" }}>분석</div>}
          {navItems.map(item => (
            <button key={item.label}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all"
                    style={{
                      color: item.active ? "var(--fg)" : "var(--fg-muted)",
                      background: item.active ? "var(--bg-secondary)" : "transparent",
                      fontWeight: item.active ? 500 : 400,
                    }}>
              <SideIcon d={item.icon} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}

          {sidebarOpen && <div className="text-xs font-semibold uppercase tracking-wider px-3 pt-4 py-1" style={{ color: "var(--fg-subtle)", fontSize: "0.6875rem" }}>데이터</div>}
          {dataItems.map(item => (
            <button key={item.label}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all"
                    style={{ color: "var(--fg-muted)" }}>
              <SideIcon d={item.icon} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="px-2 py-3 space-y-1" style={{ borderTop: "1px solid var(--border)" }}>
          <button onClick={toggleTheme}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all"
                  style={{ color: "var(--fg-muted)" }}>
            {dark ? (
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
            ) : (
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
            )}
            {sidebarOpen && <span>{dark ? "라이트 모드" : "다크 모드"}</span>}
          </button>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all"
                  style={{ color: "var(--fg-muted)" }}>
            <svg className={`w-4 h-4 shrink-0 transition-transform duration-300 ${sidebarOpen ? "" : "rotate-180"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
            </svg>
            {sidebarOpen && <span>접기</span>}
          </button>
        </div>
      </aside>

      {/* 메인 */}
      <main className="flex-1 transition-all duration-300" style={{ marginLeft: sidebarW }}>
        {/* 톱바 */}
        <header className="h-12 flex items-center justify-between px-6 sticky top-0 z-20"
                style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold">대시보드</h2>
            <Badge variant="green">Live</Badge>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                    style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--fg-muted)" }}>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              새 차트
            </button>
            <div className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md transition-all text-sm"
                      style={{ color: "var(--fg-muted)" }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
                     style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
                  {(user.name || user.email)[0].toUpperCase()}
                </div>
                {sidebarOpen && <span className="text-sm" style={{ color: "var(--fg-muted)" }}>{user.name || user.email}</span>}
              </button>
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 py-1 z-50 rounded-lg"
                       style={{ background: "var(--dropdown-bg)", border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)" }}>
                    <div className="px-3 py-2 text-xs" style={{ color: "var(--fg-subtle)" }}>{user.email}</div>
                    <div style={{ borderTop: "1px solid var(--border)", margin: "0.25rem 0" }} />
                    <button onClick={handleLogout}
                            className="w-full text-left px-3 py-2 text-sm font-medium transition-all"
                            style={{ color: "#ef4444" }}>
                      로그아웃
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* 콘텐츠 */}
        <div className="px-6 py-5">
          {/* KPI 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map(s => (
              <div key={s.label} className="rounded-lg p-5 transition-all"
                   style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium" style={{ color: "var(--fg-muted)" }}>{s.label}</span>
                  <span className="text-xs font-medium" style={{ color: s.up ? "var(--success)" : "var(--danger)" }}>{s.change}</span>
                </div>
                <div className="text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>{s.value}</div>
                <div className="text-xs mt-1" style={{ color: "var(--fg-subtle)" }}>{s.sub}</div>
                {s.bars && <div className="mt-3"><MiniBar heights={s.bars} color={s.color!} /></div>}
                {s.progress && (
                  <div className="mt-3 rounded-full overflow-hidden" style={{ height: 6, background: "var(--minibar-bg)" }}>
                    <div className="h-full rounded-full" style={{ width: `${s.progress}%`, background: "linear-gradient(90deg, #3b82f6, #8b5cf6)" }} />
                  </div>
                )}
                {!s.bars && !s.progress && (
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex" style={{ marginLeft: 0 }}>
                      {["#3b82f6","#8b5cf6","#22c55e"].map((c, i) => (
                        <div key={i} className="w-5 h-5 rounded-full" style={{ background: c, border: `2px solid var(--bg)`, marginRight: -6 }} />
                      ))}
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-white"
                           style={{ background: "#52525b", border: `2px solid var(--bg)`, fontSize: "0.5rem" }}>+</div>
                    </div>
                    <span className="text-xs" style={{ color: "var(--fg-subtle)" }}>외 1,843명</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 트래픽 + 최근 활동 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* 트래픽 소스 */}
            <div className="rounded-lg" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
                <span className="text-sm font-semibold">트래픽 소스</span>
                <Badge variant="gray">최근 7일</Badge>
              </div>
              <div className="p-5 space-y-4">
                {traffic.map(t => (
                  <div key={t.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{t.label}</span>
                      <span className="text-sm font-medium">{t.pct}%</span>
                    </div>
                    <div className="rounded-full overflow-hidden" style={{ height: 6, background: "var(--minibar-bg)" }}>
                      <div className="h-full rounded-full" style={{ width: `${t.pct}%`, background: t.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 최근 활동 */}
            <div className="rounded-lg" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
                <span className="text-sm font-semibold">최근 활동</span>
                <span className="text-xs" style={{ color: "var(--primary)" }}>전체 보기 →</span>
              </div>
              <div>
                {activity.map((a, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3 transition-colors"
                       style={{ borderBottom: i < activity.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs text-white font-medium"
                           style={{ background: a.color }}>{a.name[0]}</div>
                      <div>
                        <div className="text-sm font-medium">{a.name}</div>
                        <div className="text-xs" style={{ color: "var(--fg-subtle)" }}>{a.action}</div>
                      </div>
                    </div>
                    <span className="text-xs" style={{ color: "var(--fg-subtle)" }}>{a.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 인기 페이지 */}
          <div className="rounded-lg" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
              <span className="text-sm font-semibold">인기 페이지</span>
              <Badge variant="blue">Top 5</Badge>
            </div>
            <div>
              <div className="grid text-xs font-medium uppercase tracking-wider px-5 py-3"
                   style={{ gridTemplateColumns: "1fr 100px 100px 80px", color: "var(--fg-subtle)", borderBottom: "1px solid var(--border)" }}>
                <span>페이지</span><span className="text-right">방문수</span><span className="text-right">고유 방문자</span><span className="text-right">이탈율</span>
              </div>
              {pages.map((p, i) => (
                <div key={i} className="grid items-center px-5 py-3 text-sm transition-colors"
                     style={{ gridTemplateColumns: "1fr 100px 100px 80px", borderBottom: i < pages.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <span>{p.path}</span>
                  <span className="text-right font-medium">{p.visits}</span>
                  <span className="text-right" style={{ color: "var(--fg-muted)" }}>{p.uniq}</span>
                  <span className="text-right">
                    <Badge variant={parseInt(p.bounce) <= 18 ? "green" : "gray"}>{p.bounce}</Badge>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <AiChat />
    </div>
  );
}
