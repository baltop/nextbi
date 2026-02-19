# API 엔드포인트

## 페이지

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|------|------|
| GET | `/` | ✗ | 랜딩 페이지 |
| GET | `/login` | ✗ | 로그인 |
| GET | `/signup` | ✗ | 회원가입 |
| GET | `/dashboard` | ✓ | 대시보드 |
| GET | `/dashboard/interview-upload` | ✓ | 인터뷰 업로드 페이지 |

## API

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|------|------|
| POST | `/api/auth/signup` | ✗ | 회원가입 |
| POST | `/api/auth/login` | ✗ | 로그인 |
| POST | `/api/auth/logout` | ✗ | 로그아웃 |
| POST | `/api/ai/chat` | ✓ | AI 채팅 (SSE 스트리밍) |
| POST | `/api/interview/upload` | ✓ | 인터뷰 파일 업로드 |
| GET | `/api/interview/files` | ✓ | 업로드된 파일 목록 |

---

### POST /api/auth/signup

**요청** (JSON):
```json
{ "email": "user@example.com", "password": "12345678", "name": "홍길동" }
```

**성공**: `200` + 쿠키 `session_token` 설정
**에러**: `400` `{ "error": "..." }`

### POST /api/auth/login

**요청** (JSON):
```json
{ "email": "user@example.com", "password": "12345678" }
```

**성공/에러**: signup과 동일 패턴

### POST /api/auth/logout

**동작**: 세션 삭제 + 쿠키 만료

---

### POST /api/ai/chat

**요청** (JSON):
```json
{
  "message": "매출 분석해줘",
  "history": [
    { "role": "user", "content": "이전 질문" },
    { "role": "assistant", "content": "이전 답변" }
  ]
}
```

**응답** (SSE `text/event-stream`):
```
data: {"text":"안녕"}
data: {"text":"하세요"}
data: [DONE]
```

**모델**: Claude claude-sonnet-4-20250514
**환경변수**: `ANTHROPIC_API_KEY` 필요

---

### POST /api/interview/upload

**요청** (multipart/form-data):
```
files: (바이너리 파일, 복수 가능)
```

**지원 형식**: TXT, CSV, PDF, DOC, DOCX, MP3, MP4, WAV, M4A, WEBM
**최대 크기**: 50MB

**성공**: `200` `{ "ok": true }`
**에러**:
- 401: `{ "error": "인증이 필요합니다" }`
- 400: `{ "error": "파일을 선택해주세요" }` / `{ "error": "파일이 너무 큽니다 (최대 50MB)" }`

**저장 경로**: `uploads/interviews/{userId}/{filename}`

### GET /api/interview/files

**응답** (JSON):
```json
[
  { "name": "interview1.mp3", "size": "12.5 MB", "time": "2026-02-19 14:30" }
]
```
