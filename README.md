# AI Mock Interviewer

Production-ready AI Mock Interview Platform built with **FastAPI**, **React**, **SQLite**, and **Google Gemini AI**.

## Features

- JWT Authentication (register, login, refresh, logout, protected routes)
- User profiles with resume upload (PDF extraction)
- AI-powered interview question generation (Gemini with graceful fallback)
- Answer evaluation with multi-dimensional scoring
- Voice interview via browser Speech Recognition
- Dashboard with analytics and score trends
- Interview history and detailed results
- Settings page with AI configuration status
- Modern dark UI with Tailwind CSS v4

---

## Project Structure

```
AI-Mock-Interviewer/
├── backend/
│   ├── app/
│   │   ├── api/routes/          # HTTP endpoints
│   │   ├── application/         # Services & Pydantic schemas
│   │   ├── core/                # Config, DB, security, deps
│   │   ├── domain/              # Enums & domain types
│   │   ├── infrastructure/      # Models, repositories, external services
│   │   ├── presentation/        # Exception handlers
│   │   └── main.py
│   ├── uploads/                 # Resume storage
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    └── src/
        ├── components/ui/       # Reusable UI components
        ├── features/            # Feature modules (auth, dashboard, interview...)
        └── shared/              # API client, hooks, context
```

---

## Installation Guide

### Prerequisites

- Python 3.11+
- Node.js 18+
- Google Gemini API key ([Get one here](https://aistudio.google.com/apikey)) — optional; fallback mode works without it

### Backend

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
# Edit .env: set SECRET_KEY and optionally GEMINI_API_KEY
```

### Frontend

```powershell
cd frontend
npm install
```

---

## Environment Variables

Edit `backend/.env`:

| Variable | Description |
|---|---|
| `SECRET_KEY` | Long random string for JWT signing |
| `GEMINI_API_KEY` | Google Gemini API key (leave empty for fallback mode) |
| `GEMINI_MODEL` | Gemini model name (default: `gemini-2.0-flash`) |
| `DATABASE_URL` | SQLite path (default: `sqlite:///./mock_interviewer.db`) |
| `CORS_ORIGINS` | Frontend URLs (comma-separated) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT access token TTL (default: 60) |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Refresh token TTL (default: 7) |
| `UPLOAD_DIR` | Resume upload directory |
| `MAX_UPLOAD_SIZE_MB` | Max PDF upload size |
| `RATE_LIMIT` | API rate limit (default: `60/minute`) |

---

## Commands to Run

**Backend** (port 8000):

```powershell
cd backend
.\venv\Scripts\uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

**Frontend** (port 5173):

```powershell
cd frontend
npm run dev
```

Open **http://localhost:5173**

- API docs (Swagger): **http://127.0.0.1:8000/docs**
- Health check: **http://127.0.0.1:8000/api/v1/health**

---

## API Documentation

All endpoints are prefixed with `/api/v1`.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login, returns access + refresh tokens |
| POST | `/auth/refresh` | Refresh access token |
| GET | `/auth/me` | Get current user (requires JWT) |
| POST | `/auth/logout` | Logout (client discards tokens) |

### Users

| Method | Endpoint | Description |
|---|---|---|
| GET | `/users/profile` | Get user profile |
| PUT | `/users/profile` | Update profile |

### Resumes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/resumes/upload` | Upload PDF resume |
| GET | `/resumes` | List user resumes |
| GET | `/resumes/{id}` | Get resume details |
| DELETE | `/resumes/{id}` | Delete resume |

### Interviews

| Method | Endpoint | Description |
|---|---|---|
| POST | `/interviews` | Create interview + generate questions |
| GET | `/interviews` | List interviews |
| GET | `/interviews/{id}` | Get interview with questions |
| POST | `/interviews/{id}/questions/{qid}/answer` | Submit answer + AI evaluation |
| POST | `/interviews/{id}/complete` | Complete interview + final scores |

### Dashboard & History

| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard/stats` | Dashboard analytics |
| GET | `/history` | Interview history |

### Settings

| Method | Endpoint | Description |
|---|---|---|
| GET | `/settings` | Account + AI configuration status |
| PUT | `/settings` | Update user preferences |

### Health

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | API health + Gemini status |

---

## Database

Tables are auto-created on startup via SQLAlchemy `create_all`. To reset:

```powershell
cd backend
Remove-Item mock_interviewer.db -ErrorAction SilentlyContinue
# Restart the backend server
```

Tables: `users`, `resumes`, `interviews`, `questions`, `answers`

---

## Gemini API Setup

1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Create an API key
3. Set `GEMINI_API_KEY=your-key` in `backend/.env`
4. Restart the backend

**Without a valid Gemini key**, the app automatically uses:
- Fallback interview questions
- Basic answer scoring based on response length
- Local summary calculation for final results

The Settings page and `/api/v1/health` endpoint show Gemini configuration status.

---

## Test Credentials

Register a new account at `/register`, or use:

```
Email:    test@example.com
Password: password123
```

(Create via API if not already registered:)

```powershell
curl -X POST http://127.0.0.1:8000/api/v1/auth/register `
  -H "Content-Type: application/json" `
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\",\"full_name\":\"Test User\"}"
```

---

## Testing Checklist

1. Register at `/register`
2. Login at `/login`
3. Upload a PDF resume in Profile
4. Start an interview at `/interview/setup`
5. Answer questions (text or voice mic)
6. Complete interview and view results
7. Check dashboard analytics and history
8. Update profile and view settings
9. Logout from Settings

---

## Deployment Guide

### Frontend (Vercel)

1. Connect GitHub repo
2. Set root directory to `frontend`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add rewrite rule: `/api/*` → your backend URL (or use env `VITE_API_URL`)

### Backend (Render / Railway)

1. Create Web Service from repo
2. Root directory: `backend`
3. Build: `pip install -r requirements.txt`
4. Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Set environment variables from `.env.example`
6. Update `CORS_ORIGINS` to your frontend URL

### Production Checklist

- Set a strong `SECRET_KEY`
- Configure valid `GEMINI_API_KEY`
- Set `DEBUG=false` and `APP_ENV=production`
- Use PostgreSQL instead of SQLite for production (`DATABASE_URL`)
- Enable HTTPS on both frontend and backend

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 6, Tailwind CSS v4, React Router, Axios |
| Backend | FastAPI, SQLAlchemy 2, Pydantic v2, python-jose, bcrypt |
| Database | SQLite |
| AI | Google Gemini API (with fallback) |
| Auth | JWT (access + refresh tokens) |
