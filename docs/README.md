# NextBI 개발 문서

BI 시각화 솔루션 — Next.js 15 + TypeScript + Tailwind CSS + PostgreSQL

## 문서 목록

| 문서 | 설명 |
|------|------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | 시스템 아키텍처 및 기술 스택 |
| [API.md](API.md) | API 엔드포인트 명세 |
| [CHANGELOG.md](CHANGELOG.md) | 변경 이력 |
| [2026-02-19-work-log.md](2026-02-19-work-log.md) | 작업 일지 |

## 빠른 시작

```bash
cd works/nextbi
npm install
npm run dev
# → http://localhost:3002
```

필수 요건: Node.js 22+, PostgreSQL 16 (Docker)

## 환경변수

```bash
# .env.local
DATABASE_URL=postgresql://dev:devpass@localhost:5432/devdb
ANTHROPIC_API_KEY=sk-ant-...
```
