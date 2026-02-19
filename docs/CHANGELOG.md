# Changelog

## 2026-02-19

### 인터뷰 업로드 기능 추가

- `/dashboard/interview-upload` 페이지 추가 (드래그 & 드롭 + 파일 선택)
- `POST /api/interview/upload` — multipart 파일 업로드 (최대 50MB)
- `GET /api/interview/files` — 업로드된 파일 목록 조회
- 유저별 격리된 저장 경로: `uploads/interviews/{userId}/`
- 지원 형식: TXT, CSV, PDF, DOC, DOCX, MP3, MP4, WAV, M4A, WEBM
- 대시보드 사이드바에 메뉴 연결

#### 변경 파일

| 파일 | 변경 |
|---|---|
| `src/app/dashboard/interview-upload/page.tsx` | 서버 컴포넌트 (신규) |
| `src/app/dashboard/interview-upload/interview-upload-client.tsx` | 업로드 UI (신규) |
| `src/app/api/interview/upload/route.ts` | 업로드 API (신규) |
| `src/app/api/interview/files/route.ts` | 파일 목록 API (신규) |
| `src/app/dashboard/dashboard-client.tsx` | 사이드바 메뉴 추가 |
| `.gitignore` | `uploads/` 제외 추가 |

### AI 채팅 기능 추가 + Gemini → Anthropic 마이그레이션

- 대시보드에 AI 채팅 위젯 (플로팅 버튼 → 사이드 패널)
- SSE 스트리밍, 마크다운 렌더링, 대화 히스토리
- Google Gemini → Anthropic Claude (claude-sonnet-4-20250514) 전환
- `src/lib/anthropic.ts` 신규 생성

### Next.js 16 → 15 다운그레이드

- Node.js v24 환경 호환성 문제로 15.5.12로 변경
- 관련 타입 패키지 버전 조정

### UI 디자인 업그레이드

- Vercel/Linear 스타일 다크/라이트 테마
- CSS 변수 기반 테마 시스템
- 글래스모피즘 + 그래디언트 카드
