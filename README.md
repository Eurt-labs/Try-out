# TRY IT OUT — AI-Powered Virtual Fashion Try-On Platform

> **Your Style. Your Look.**  
> Discover your next look. Try it virtually before you wear it.

A premium, production-grade frontend web application for virtual fashion try-ons. Built with React 19, Vite, React Router DOM, and custom luxury editorial design system.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
The application connects to backend services via `VITE_API_BASE_URL`:
```bash
# In .env:
VITE_API_BASE_URL=http://localhost:8000
```
*Note: If the backend service is offline, the frontend provides transparent diagnostics and high-fidelity showcase simulation mode so all UI/UX workflows remain fully testable.*

### 3. Start Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

### 5. Preview Production Build
```bash
npm run preview
```

### 6. Lint Codebase
```bash
npm run lint
```

---

## 🎨 Design System & Color Palette

- **Primary Background**: `#FAF9F6`
- **Secondary Background**: `#F3F1EC`
- **Card Background**: `#FFFFFF`
- **Primary Text**: `#171717`
- **Secondary Text**: `#737373`
- **Primary Accent**: `#7357E8` (Royal Purple)
- **Accent Hover**: `#6044CF`
- **Borders**: `#EAE8E3`
- **Success**: `#16A36A`
- **Error**: `#DC4545`
- **Typography**: Plus Jakarta Sans & Inter

---

## 📱 Application Screens

1. **Main Catalogue (`/`)**
   - Brand Navigation with photo readiness indicator & mobile drawer
   - Editorial Hero Section with quick explore CTA & metrics
   - "Start With Your Photo" drag & drop upload station with client validation
   - "Explore Your Next Look" responsive outfit grid (4 cols desktop, 2-3 cols tablet, 1-2 mobile)
   - Category filtering (`All`, `Casual`, `Formal`, `Traditional`, `Streetwear`, `Party Wear`)
   - Real-time outfit search with debounced filtering & empty states
   - Luxury Footer with platform links, data policies & feature guarantees

2. **Virtual Try-On Workspace (`/try-on/:outfitId`)**
   - Side-by-side balanced panels:
     - **Panel 01**: User photograph preview, silhouette status, replace/remove photo
     - **Panel 02**: Selected outfit, category badge, change outfit action
   - **State 1 — Ready**: Generates look once photo and outfit are locked in
   - **State 2 — Generating**: Rotating status indicators, AI scanline orb, prevents duplicate submissions
   - **State 3 — Success**: Actual generated image, side-by-side comparison, fabric details, celebratory confetti, download look, save to my looks
   - **State 4 — Error**: Clear error description, Retry button, showcase simulation fallback

3. **How It Works (`/how-it-works`)**
   - 4-step interactive walkthrough with step numbering and editorial illustrations:
     1. Upload Your Photo
     2. Explore Outfits
     3. Choose Your Outfit
     4. See Your New Look
   - Photography quality recommendations (lighting, pose, background, privacy)
   - "Ready to find your next look?" CTA

4. **First-Time Setup (`/setup`)**
   - 4-step onboarding flow: Welcome → Upload → Preview & Confirm Checklist → Completion
   - Returning user detection
   - Quality checklist recommendations

5. **Account Window (`/account`)**
   - Profile header with tier badge, avatar, and sign out
   - Tabbed management: Personal Information, My Photo, Saved Looks, and Preferences

---

## 📁 Architecture Overview

```
src/
├── app/                  # Application root, routing & shell
│   ├── App.jsx
│   └── AppRoutes.jsx
├── components/
│   ├── common/           # Button, Badge, Loader, Skeleton, Toast, Modal, States
│   └── layout/           # Navbar, Footer, PageLayout
├── context/              # React Context & useReducer global state
│   └── AppContext.jsx
├── data/                 # Curated showcase outfits & demo profiles
│   └── demoOutfits.js
├── features/
│   ├── catalogue/        # Hero, Grid, Cards, Filters
│   ├── photo-upload/     # Drag & drop upload, preview & validation
│   ├── try-on/           # Dual-panel studio, generating states, results
│   ├── how-it-works/     # 4-step walkthrough & photography tips
│   ├── setup/            # First-time onboarding wizard
│   └── account/          # Profile, saved looks & preferences
├── hooks/                # useApp, usePhotoUpload custom hooks
├── services/             # API client, catalogue, photo, tryOn & account services
└── styles/               # CSS variables, animations, global resets, utilities
```
