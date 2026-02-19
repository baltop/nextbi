# 아키텍처

## 기술 스택

| 레이어 | 기술 | 버전 | 역할 |
|--------|------|------|------|
| 프레임워크 | Next.js | 15.5 | SSR/SSG, App Router |
| 언어 | TypeScript | 5.7 | 타입 안전성 |
| 스타일 | Tailwind CSS | 4.x | 유틸리티 CSS + CSS 변수 테마 |
| DB | PostgreSQL | 16 | 데이터 저장 (nextbi 스키마) |
| DB 드라이버 | pg | — | Node.js PostgreSQL 클라이언트 |
| AI | Anthropic Claude | claude-sonnet-4-20250514 | AI 채팅 어시스턴트 |
| 인증 | bcrypt | — | 비밀번호 해싱 |

## 프로젝트 구조

```
works/nextbi/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts       # POST 로그인
│   │   │   │   ├── logout/route.ts      # POST 로그아웃
│   │   │   │   └── signup/route.ts      # POST 회원가입
│   │   │   ├── ai/
│   │   │   │   └── chat/route.ts        # POST AI 채팅 (SSE)
│   │   │   └── interview/
│   │   │       ├── upload/route.ts      # POST 파일 업로드
│   │   │       └── files/route.ts       # GET 업로드된 파일 목록
│   │   ├── dashboard/
│   │   │   ├── page.tsx                 # 대시보드 (서버 컴포넌트)
│   │   │   ├── dashboard-client.tsx     # 대시보드 UI (클라이언트)
│   │   │   └── interview-upload/
│   │   │       ├── page.tsx             # 인터뷰 업로드 (서버)
│   │   │       └── interview-upload-client.tsx  # 업로드 UI (클라이언트)
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── page.tsx                     # 랜딩
│   │   ├── layout.tsx                   # 루트 레이아웃
│   │   └── globals.css                  # CSS 변수 + 다크/라이트 테마
│   ├── lib/
│   │   ├── auth.ts                      # 회원가입/로그인 로직
│   │   ├── db.ts                        # PostgreSQL 연결 + 마이그레이션
│   │   ├── session.ts                   # DB 세션 관리
│   │   └── anthropic.ts                 # Anthropic Claude 클라이언트
│   └── middleware.ts                    # 인증 미들웨어
├── __tests__/
│   ├── auth.test.ts                     # auth 유닛 테스트 (8)
│   ├── api-auth.test.ts                 # API 라우트 테스트 (9)
│   └── setup.ts                         # 테스트 환경 설정
├── docs/                                # 문서
├── uploads/                             # 업로드 파일 저장 (gitignored)
├── next.config.ts
├── vitest.config.ts
└── package.json
```

## DB 스키마 격리

BiViz(`public` 스키마)와 동일한 `devdb`를 사용하되, NextBI는 `nextbi` 스키마로 격리:

```sql
CREATE SCHEMA IF NOT EXISTS nextbi;
-- nextbi.users, nextbi.sessions
```

## 세션 관리

메모리 세션은 Next.js dev 모드의 워커 간 공유 불가 문제로 DB 세션 방식 사용:

```
createSessionToken() → DB INSERT → cookie set → 브라우저
getSession() → cookie read → DB SELECT → 세션 객체
```
