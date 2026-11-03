# TRY IT OUT — AI-Powered Virtual Fashion Try-On Platform

> **Your Style. Your Look.**  
> Discover your next look. Try it virtually before you wear it.

A premium, production-grade full-stack virtual fashion platform. Built with **TypeScript**, **React 19**, **Vite**, **FastAPI**, and **Supabase** authentication & account management.

---

## 🛠️ Modern Tech Stack

### Frontend
- **Language**: **TypeScript** (strictly typed interfaces and component props)
- **Framework**: React 19 + Vite 8
- **Routing**: React Router DOM v7
- **Auth & Storage**: `@supabase/supabase-js`
- **Icons & Effects**: `lucide-react`, `canvas-confetti`
- **Styling**: Custom editorial luxury design system (Pure CSS tokens & glassmorphism)

### Backend
- **Framework**: **FastAPI** (Python 3.10+)
- **Server**: Uvicorn ASGI
- **Data & Auth**: **Supabase** (PostgreSQL, Row Level Security, JWT Auth)
- **Validation**: Pydantic v2

---

## 🚀 Quick Start

### 1. Frontend Setup (TypeScript + Vite)

```bash
cd Try-it-out

# Install frontend packages
npm install

# Configure environment variables (optional)
cp .env.example .env

# Start frontend development server
npm run dev
```

The frontend will run at `http://localhost:5173`.

### 2. Backend Setup (FastAPI)

```bash
cd Try-it-out/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt

# Configure backend environment (optional)
cp .env.example .env

# Run FastAPI server
python run.py
```

The FastAPI backend will run at `http://localhost:8000`:
- **Interactive Swagger Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check**: [http://localhost:8000/api/health](http://localhost:8000/api/health)

---

## 🔐 Supabase Account Management & Authentication

The platform provides end-to-end account management powered by **Supabase**:
1. **User Sign Up & Sign In**: Secure email/password authentication with automatic session refresh.
2. **Profile Management**: Customize display name, style preferences, and avatar stored in Supabase `profiles` table.
3. **Saved Looks Sync**: Save and organize favorite try-on results linked to your Supabase user ID with Row Level Security (RLS).
4. **FastAPI JWT Authentication**: The frontend automatically passes the Supabase Bearer token to backend requests (`Authorization: Bearer <token>`).

### Database Setup
To set up your Supabase project tables, run `backend/schema.sql` in your Supabase project SQL Editor.

---

## 📱 Application Screens

1. **Main Catalogue (`/`)**
   - Editorial Hero Section with metrics and quick explore CTA
   - Photo Upload station with webcam camera support and client validation
   - Category filtering (`All`, `Casual`, `Formal`, `Traditional`, `Streetwear`, `Party Wear`)
   - Real-time outfit search with live backend sync

2. **Virtual Try-On Workspace (`/try-on/:outfitId`)**
   - Side-by-side balanced panels: User photograph preview & selected outfit
   - 4-stage state machine: Ready → Generating (AI Scanline) → Success (Side-by-side & Confetti) → Error / Offline Fallback

3. **Account Management (`/account`)**
   - Supabase authentication modal (Sign In / Create Account)
   - Profile header with tier badge, avatar, and sign out
   - Tabbed management: Personal Information, My Photo, Saved Looks, and Preferences

4. **How It Works (`/how-it-works`)**
   - 4-step interactive walkthrough with photography guidelines

5. **First-Time Setup (`/setup`)**
   - Onboarding flow with quality checklist recommendations

---

## 🏗️ Production Build

```bash
# Build TypeScript frontend
npm run build

# Preview production bundle
npm run preview
```
