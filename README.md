# 🌌 LearnFlow - AI-Powered Adaptive Learning Platform



[![React](https://img.shields.io/badge/React-18.2.0-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646cff?logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Cloud-3ECF8E?logo=supabase)](https://supabase.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.3-38b2ac?logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-10.0-0055FF?logo=framer)](https://www.framer.com/motion/)

## 📖 Overview

**LearnFlow** is an immersive, cinematic web application designed to personalize education using Artificial Intelligence. It adapts to the user's experience level, provides real-time AI tutoring, generates quizzes, and tracks progress through a beautiful, motion-rich interface.

## ✨ Features

### 🧠 AI Learning Core
- **Adaptive AI Chat:** Context-aware responses based on user expertise (Beginner/Intermediate/Advanced).
- **Smart Quiz Generation:** Auto-generated quizzes to test comprehension after lessons.
- **Domain Selection:** Choose from topics like Technology, Science, Financial Literacy, Mental Wellness, and more.
- **Progress Tracking:** Detailed analytics on interactions, quiz accuracy, and learning streaks.

### 🎨 Cinematic UI/UX (Latest Update)
- **Glassmorphism Design:** Modern translucent cards and blur effects.
- **Framer Motion Animations:** Smooth page transitions, staggered loading, and interactive hover states.
- **Dynamic Backgrounds:** Moving gradient orbs and noise textures for an immersive feel.
- **Responsive Layout:** Fully optimized for mobile, tablet, and desktop.

### 🔐 Security & Backend
- **Authentication:** Secure login/signup via Supabase Auth.
- **Database:** PostgreSQL managed by Supabase for user data and interactions.
- **Edge Functions:** Serverless AI processing for low-latency responses.

## 🚀 Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn-ui, Custom CSS |
| **Animation** | Framer Motion |
| **Backend** | Supabase (Auth, DB, Edge Functions) |
| **State** | TanStack Query, React Context |
| **Icons** | Lucide React |

## 🛠️ Installation & Setup
### 1. Clone the Repository
```bash
git clone https://github.com/Manu71862/Learnflow.git
cd Learnflow
npm install
npm run dev
```

## 🌐 Publishing / Static Hosting Fix
If the app is published to a static host (for example GitHub Pages), two issues can break it:
- Vite assets were being generated with absolute URLs (`/assets/...`), which fail when hosted under a repo subpath.
- BrowserRouter depends on server-side route rewrites, which static hosts usually don't provide.

This repository now uses:
- `base: "./"` in Vite so built assets are loaded via relative paths.
- `HashRouter` so client-side routes work without server rewrites.

## 🚀 GitHub Pages publishing
1. Push this branch to GitHub.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Ensure your default branch is `main` (the workflow deploys on pushes to `main`).
4. The site will publish automatically via `.github/workflows/deploy-pages.yml`.

This repo is now configured to publish correctly on static hosting:
- Uses `HashRouter` so deep links work without server rewrites.
- Uses relative Vite asset paths for subpath hosting.
- Includes Supabase client fallbacks so production builds still run even if `VITE_*` env vars are not injected by the host.

