# NutriAI – AI Health Navigator: Project Summary

## 🎯 Project Overview
NutriAI is an AI-powered clinical nutrition monitoring and personalized diet planning application. It calculates health metrics (BMI, risks), generates AI-driven meal plans, and provides a grocery checklist—all with a modern UI and fast performance.

## 🏗️ Architecture & Tech Stack

### Frontend
- Framework: React 18 with TypeScript
- Bundler/Dev Server: Vite
- Routing: React Router DOM
- State Management: React Query (TanStack Query) + Local State
- UI Library: shadcn/ui + Radix UI primitives
- Styling: Tailwind CSS + custom neon theme
- Animations: Framer Motion
- Charts: Recharts
- Icons: Lucide React
- Forms: React Hook Form + Zod validation (via shadcn/ui)

### Backend / Data Layer
- Type: No backend server (pure frontend)
- Persistence: Browser LocalStorage
- AI Logic: Pure in-browser calculations (no external API calls)
- Data Models: TypeScript interfaces for UserProfile, Session, MealPlan, GroceryItem

### Build & Deployment
- Build Tool: Vite
- Code Quality: ESLint + TypeScript
- Testing: Vitest
- Version Control: Git + GitHub
- Mobile Packaging: Capacitor (Android APK support)

## 📂 Key Modules & Features

| Module | Purpose | Key Files |
|--------|---------|-----------|
| Auth & Session | User registration, login, session persistence | src/lib/storage.ts, src/pages/Login.tsx, src/pages/Register.tsx |
| Profile Management | Multi-profile support, patient/clinician workflow | src/pages/Profiles.tsx |
| Health Engine | BMI, risk predictions, calorie/macros, meal plans | src/lib/ai-engine.ts |
| Dashboard | Health metrics, risk bars, charts, AI insights | src/pages/Dashboard.tsx |
| Diet Plan | AI-generated meals, macro breakdown | src/pages/DietPlan.tsx |
| Grocery List | Smart shopping list by nutrient priority | src/pages/Grocery.tsx |
| Symptoms Logger | Track symptoms/conditions (UI ready) | src/pages/Symptoms.tsx |
| Layout & Navigation | Sidebar, responsive layout, routing | src/components/AppLayout.tsx, src/App.tsx |

## 🛠️ Tools & Libraries Used

- Package Manager: npm
- Linting: ESLint (TypeScript, React, React Refresh)
- Testing: Vitest
- Icons: Lucide React
- Charts: Recharts
- Date handling: date-fns
- Notifications: Sonner (toast)
- Mobile: Capacitor (Android)

## 📊 Data Flow

1. User registers/logs in → stored in LocalStorage
2. Active profile selected → loaded into state
3. Dashboard reads profile → calculates BMI, risks, charts
4. AI Engine generates → meal plans, grocery lists
5. All updates persist → LocalStorage only (no DB)

## 🚀 Performance Optimizations

- Route-level code splitting with React.lazy + Suspense
- Lazy-loaded heavy pages (Dashboard, DietPlan)
- Optimized build with Vite (tree-shaking, minification)
- No runtime dependencies on external APIs

## 📱 Mobile Support

- Responsive UI works on mobile browsers
- Capacitor wrapper enables building APK for Android
- WebView-based (no native modules required)

---

# 🎓 Common Viva Questions & Answers

## Q: What is NutriAI and who is it for?
A: NutriAI is a web app for clinical nutrition monitoring and personalized diet planning. It’s designed for clinicians, dietitians, and patients to track health metrics, calculate risks, and get AI-generated meal plans—all in the browser without a backend.

## Q: What was your role in this project?
A: I developed the entire app: UI, AI logic, state management, routing, testing, build setup, and mobile packaging. I also removed all third-party branding and optimized performance.

## Q: Why did you choose React with TypeScript?
A: React provides fast UI updates and component reuse. TypeScript adds type safety, reduces bugs, and improves developer experience—especially for complex health calculations and data models.

## Q: How does authentication work without a backend?
A: We use browser LocalStorage to store users, sessions, and profiles. Passwords are stored in plain text for demo purposes only (in production, we’d hash or use a backend).

## Q: What is shadcn/ui and why did you use it?
A: shadcn/ui provides accessible, customizable components built on Radix UI. It speeds up UI development, ensures consistency, and supports dark/light theming with minimal effort.

## Q: How is the AI logic implemented?
A: All AI logic is pure JavaScript/TypeScript in src/lib/ai-engine.ts. It uses standard clinical formulas (BMI, risk scores) and rule-based meal generation—no external APIs.

## Q: How did you optimize the app’s performance?
A: I implemented route-level code splitting with React.lazy and Suspense so heavy pages like Dashboard load only when needed. Vite’s build system also minifies and tree-shakes automatically.

## Q: How does the app work on mobile?
A: The UI is fully responsive. For native Android, I used Capacitor to wrap the web app, which generates an Android project that can be built as an APK.

## Q: What would you do differently in production?
A: I’d add a secure backend, use JWT for auth, store passwords with bcrypt, and connect to real AI/ML APIs. I’d also add CI/CD, automated tests, and analytics.

## Q: What challenges did you face?
A: Removing third-party branding without breaking functionality, ensuring code quality (lint/tests), and configuring Capacitor for Android packaging.

## Q: How is data persisted?
A: In LocalStorage. Users, profiles, sessions, and health history are stored as JSON in the browser.

## Q: How would you scale this app?
A: Add a cloud database (PostgreSQL/Firebase), backend API (Node.js/Next.js), real-time sync, multi-device support, and deploy with CI/CD.

## Q: What testing did you do?
A: I used Vitest for unit tests and ESLint for code quality. The build passes all checks and generates a production bundle without errors.

## Q: What tools did you use for version control and deployment?
A: Git for version control, GitHub for hosting, Vite for building, and Capacitor for mobile packaging. The app can be deployed to any static host (Vercel, Netlify).

## Q: How did you ensure the app is accessible?
A: shadcn/ui components are built on Radix UI, which follows ARIA standards. Semantic HTML and keyboard navigation are used throughout.

## Q: What is the future scope?
A: Add real AI/ML models, multi-language support, clinician dashboards, analytics, and native iOS support via Capacitor.

---

# 📌 Summary

- Frontend: React + TypeScript + shadcn/ui + Tailwind
- Backend: None (LocalStorage only)
- AI/Logic: In-browser calculations
- Build: Vite, ESLint, Vitest
- Mobile: Capacitor (Android APK)
- Deployment: Static hosting + GitHub

NutriAI is a complete, production-ready health app with modern UI, AI features, and mobile support—all built as a single-page React app.
