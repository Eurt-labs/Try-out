# TRY IT OUT — FastAPI Backend & Supabase Integration

This is the backend service for **TRY IT OUT**, providing virtual fashion try-on endpoints, photo uploads, outfit catalogue queries, and authenticated user account management powered by **FastAPI** and **Supabase**.

---

## ⚡ Tech Stack

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10+)
- **Server**: [Uvicorn](https://www.uvicorn.org/) ASGI
- **Validation**: [Pydantic v2](https://docs.pydantic.dev/)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security & JWT Authentication)
- **Security**: Supabase Bearer token verification with PyJWT / Supabase Python Client

---

## 🚀 Quick Start

### 1. Set Up Python Environment

From the `backend` directory:

```bash
# Create a virtual environment
python -m venv venv

# Activate on Windows:
.\venv\Scripts\activate

# Activate on macOS/Linux:
source venv/bin/activate

# Install dependencies:
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```ini
PORT=8000
HOST=0.0.0.0

# Optional: Connect your live Supabase project
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
```

> **Note**: If Supabase credentials are not provided, the backend seamlessly runs in local showcase mode with full endpoint support.

### 3. Run Supabase Database Migration (Optional for Cloud Sync)

Open your Supabase project dashboard at [supabase.com](https://supabase.com):
1. Navigate to **SQL Editor**.
2. Paste the contents of `schema.sql`.
3. Click **Run**.

This creates:
- `profiles` table (linked to `auth.users` with automated trigger on signup)
- `saved_looks` table (with user-isolated Row Level Security)
- `user_photos` table (with user-isolated Row Level Security)

### 4. Start FastAPI Server

```bash
python run.py
```

The API will be available at:
- **Interactive Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc Documentation**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check**: [http://localhost:8000/api/health](http://localhost:8000/api/health)

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | Service health & Supabase status | No |
| `GET` | `/api/catalogue` | Browse curated outfits with category & search filters | No |
| `GET` | `/api/catalogue/{id}` | Get outfit metadata by ID | No |
| `POST` | `/api/photos/upload` | Upload portrait for virtual try-on (JPEG, PNG, WebP) | Optional |
| `POST` | `/api/try-on` | Generate photorealistic virtual try-on result | Optional |
| `GET` | `/api/try-on/status/{job_id}` | Check async AI try-on job status | Optional |
| `GET` | `/api/account/profile` | Retrieve Supabase user profile | Yes (Bearer token) |
| `PUT` | `/api/account/profile` | Update user name, preferences, or avatar | Yes (Bearer token) |
| `GET` | `/api/account/saved-looks` | List saved looks for current user | Yes (Bearer token) |
| `POST` | `/api/account/saved-looks` | Save a new virtual try-on look | Yes (Bearer token) |
| `DELETE` | `/api/account/saved-looks/{id}` | Remove a saved look | Yes (Bearer token) |

