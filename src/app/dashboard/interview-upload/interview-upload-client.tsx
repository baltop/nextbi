"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Props {
  user: { id: number; email: string; name: string };
}

interface UploadedFile {
  name: string;
  size: string;
  time: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function SideIcon({ d }: { d: string }) {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

export default function InterviewUploadClient({ user }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dark, setDark] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const isDark = saved === "dark" || !saved;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const loadUploadedFiles = useCallback(async () => {
    try {
      const res = await fetch("/api/interview/files");
      if (res.ok) {
        setUploadedFiles(await res.json());
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    loadUploadedFiles();
  }, [loadUploadedFiles]);

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

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const added: File[] = [];
    for (let i = 0; i < fileList.length; i++) {
      if (fileList[i].size <= 50 * 1024 * 1024) {
        added.push(fileList[i]);
      }
    }
    setFiles((prev) => [...prev, ...added]);
  }

  async function handleUpload() {
    if (files.length === 0 || uploading) return;
    setUploading(true);
    setError("");

    const form = new FormData();
    files.forEach((f) => form.append("files", f));

    try {
      const resp = await fetch("/api/interview/upload", {
        method: "POST",
        body: form,
      });
      if (resp.ok) {
        setFiles([]);
        await loadUploadedFiles();
      } else {
        const data = await resp.json().catch(() => null);
        setError(data?.error || "업로드에 실패했습니다");
      }
    } catch {
      setError("업로드 중 오류가 발생했습니다");
    } finally {
      setUploading(false);
    }
  }

  const sidebarW = sidebarOpen ? "14rem" : "4rem";

  const navItems = [
    { label: "대시보드", icon: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5", href: "/dashboard" },
    { label: "차트", icon: "M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" },
    { label: "리포트", icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" },
  ];

  const dataItems = [
    { label: "데이터셋", icon: "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" },
    { label: "데이터 소스", icon: "M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.193-9.193a4.5 4.5 0 00-6.364 6.364l4.5 4.5a4.5 4.5 0 007.244 1.242" },
    { label: "업로드", icon: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" },
    { label: "인터뷰 업로드", icon: "M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z", active: true, href: "/dashboard/interview-upload" },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg)" }}>
      {/* 사이드바 */}
      <aside className="fixed inset-y-0 left-0 z-30 flex flex-col transition-all duration-300"
             style={{ width: sidebarW, background: "var(--bg)", borderRight: "1px solid var(--border)" }}>
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
          {navItems.map((item) => (
            <a key={item.label} href={item.href || "#"}
               className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all"
               style={{ color: "var(--fg-muted)", textDecoration: "none" }}>
              <SideIcon d={item.icon} />
              {sidebarOpen && <span>{item.label}</span>}
            </a>
          ))}

          {sidebarOpen && <div className="text-xs font-semibold uppercase tracking-wider px-3 pt-4 py-1" style={{ color: "var(--fg-subtle)", fontSize: "0.6875rem" }}>데이터</div>}
          {dataItems.map((item) => (
            <a key={item.label} href={item.href || "#"}
               className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all"
               style={{
                 color: item.active ? "var(--fg)" : "var(--fg-muted)",
                 background: item.active ? "var(--bg-secondary)" : "transparent",
                 fontWeight: item.active ? 500 : 400,
                 textDecoration: "none",
               }}>
              <SideIcon d={item.icon} />
              {sidebarOpen && <span>{item.label}</span>}
            </a>
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
        {/* 탑바 */}
        <header className="h-12 flex items-center justify-between px-6 sticky top-0 z-20"
                style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold">인터뷰 업로드</h2>
          </div>
          <div className="flex items-center gap-2">
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
                       style={{ background: "var(--dropdown-bg, var(--card))", border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)" }}>
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
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight">인터뷰 업로드</h1>
              <p className="text-sm mt-1" style={{ color: "var(--fg-muted)" }}>
                인터뷰 파일을 업로드하여 분석을 시작하세요
              </p>
            </div>

            {/* 업로드 카드 */}
            <div className="rounded-lg" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="p-6">
                {/* 에러 메시지 */}
                {error && (
                  <div className="flex items-center gap-3 p-4 mb-4 rounded-xl text-sm"
                       style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}>
                    <span>{error}</span>
                    <button onClick={() => setError("")} className="ml-auto" style={{ color: "#ef4444" }}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* 드래그 & 드롭 영역 */}
                <div
                  className="relative rounded-xl p-10 text-center cursor-pointer transition-all duration-200"
                  style={{
                    border: dragging
                      ? "2px dashed #3b82f6"
                      : "2px dashed var(--border)",
                    background: dragging ? "rgba(59,130,246,0.05)" : "transparent",
                  }}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setDragging(false); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    handleFiles(e.dataTransfer.files);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".txt,.csv,.pdf,.doc,.docx,.mp3,.mp4,.wav,.m4a,.webm"
                    multiple
                    onChange={(e) => {
                      handleFiles(e.target.files);
                      e.target.value = "";
                    }}
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center"
                         style={{ background: "var(--bg-secondary)" }}>
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                           style={{ color: "var(--fg-muted)" }}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">파일을 드래그하거나 클릭하여 선택</p>
                      <p className="text-xs mt-1" style={{ color: "var(--fg-muted)" }}>
                        TXT, CSV, PDF, DOC, MP3, MP4, WAV 등 (최대 50MB)
                      </p>
                    </div>
                  </div>
                </div>

                {/* 선택된 파일 목록 */}
                {files.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{files.length}개 파일 선택됨</span>
                      <button onClick={() => setFiles([])} className="text-xs" style={{ color: "#ef4444" }}>
                        전체 삭제
                      </button>
                    </div>

                    {files.map((file, idx) => (
                      <div key={idx} className="rounded-lg flex items-center justify-between p-4"
                           style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                               style={{ background: "var(--bg-secondary)" }}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                                 style={{ color: "var(--fg-muted)" }}>
                              <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs" style={{ color: "var(--fg-muted)" }}>{formatSize(file.size)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setFiles((prev) => prev.filter((_, i) => i !== idx))}
                          className="p-1 rounded transition-colors hover:text-red-500"
                          style={{ color: "var(--fg-muted)" }}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="w-full py-3 px-4 text-white font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      style={{
                        background: "linear-gradient(to right, #4f46e5, #9333ea)",
                        border: "none",
                        cursor: uploading ? "not-allowed" : "pointer",
                        boxShadow: "0 10px 15px -3px rgba(99,102,241,0.25)",
                      }}
                    >
                      {uploading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          업로드 중...
                        </span>
                      ) : (
                        "업로드"
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 업로드된 파일 목록 */}
            {uploadedFiles.length > 0 && (
              <div className="mt-6 rounded-lg" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
                  <span className="text-sm font-semibold">업로드된 파일</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ background: "var(--badge-blue-bg)", color: "var(--badge-blue-fg)", border: "1px solid var(--badge-blue-border)" }}>
                    {uploadedFiles.length}개
                  </span>
                </div>
                <div>
                  {uploadedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between px-5 py-3"
                         style={{ borderBottom: idx < uploadedFiles.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                             style={{ background: "var(--bg-secondary)" }}>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                               style={{ color: "var(--fg-muted)" }}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium">{file.name}</div>
                          <div className="text-xs" style={{ color: "var(--fg-muted)" }}>{file.size}</div>
                        </div>
                      </div>
                      <span className="text-xs" style={{ color: "var(--fg-subtle)" }}>{file.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
