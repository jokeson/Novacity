Read AGENTS.md before starting ..
You are Cursor AI working inside the Novacity project.

Your task is to complete the first implementation phase: **System Setup and Installation**.

Before writing any code, read these files in order:

1. `AGENTS.md`
2. `context/Project-Overview.md`
3. `context/Architecture-Context.md`
4. `context/UI-Context.md`
5. `context/Code-Standards.md`
6. `context/AI-Workflow.md`
7. `context/Project-Process-Tracker.md` 

## Main Objective

Set up the Novacity application foundation as a clean, scalable, production-ready Next.js application.

Use:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- MongoDB
- Mongoose
-cloudinary
- Zod
- React Hook Form
- Framer Motion
- Lucide React
- Inter font
- Clean feature-based folder architecture

## Important Rules

Do not start authentication, listings, dashboard, admin, PassKey, or notification features yet.

This phase is only for:

- Project setup
- Package installation
- Folder architecture
- Environment configuration
- MongoDB connection
- Global styling foundation
- Shared constants
- Shared types
- Build verification

---

# Tasks

## 1. Create or verify the Next.js project

Use this setup:

```bash
npx create-next-app@latest novacity

Required choices:
TypeScript: Yes
ESLint: Yes
Tailwind CSS: Yes
src/ directory: Yes
App Router: Yes
Import alias: Yes
Alias: @/*

2. Install dependencies
npm install mongoose zod react-hook-form @hookform/resolvers lucide-react framer-motion clsx tailwind-merge cloudinary
Initialize shadcn/ui:
npx shadcn@latest init

Install UI components:
npx shadcn@latest add button input textarea select dialog dropdown-menu sheet badge card table skeleton separator avatar label form

3. Create root architecture
Inside src/, create:
src/
├── app/
├── features/
├── components/
├── server/
├── lib/
├── hooks/
├── types/
├── validators/
├── providers/
├── constants/
├── config/
└── styles/

4. Create route groups
Inside src/app/, create:
src/app/
├── (public)/
├── (auth)/
├── (dashboard)/
├── (admin)/
├── api/
├── layout.tsx
├── page.tsx
└── globals.css

5. Create feature folders
src/features/
├── auth/
├── listings/
├── properties/
├── dashboard/
├── admin/
├── notifications/
├── favorites/
├── passkeys/
├── search/
└── companies/
6. Create server folders
src/server/
├── db/
├── auth/
├── queries/
├── services/
├── repositories/
└── permissions/

7. Create component folders
src/components/
├── ui/
├── shared/
└── forms/
8. Configure environment files
Create .env.local:

MONGODB_URI=
NEXT_PUBLIC_APP_URL=http://localhost:3000
AUTH_SECRET=
Create .env.example:
MONGODB_URI=
NEXT_PUBLIC_APP_URL=
AUTH_SECRET=

**Cloudinary (listing uploads):** optional for local dev (falls back to `public/uploads`); **required on Vercel** for file uploads unless users paste URLs only. Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`; optional `CLOUDINARY_UPLOAD_FOLDER` (default `novacity/listings`). MongoDB stores **only** the returned HTTPS URL on the `Property` document.

9. Create MongoDB connection
Create:

src/server/db/connect.ts
Requirements:
•	Export connectDB 
•	Use Mongoose 
•	Cache connection in development 
•	Throw clear error if MONGODB_URI is missing 
•	Avoid duplicate database connections 
10. Create utility helper
Create:
src/lib/utils.ts
Add cn() helper using clsx and tailwind-merge.


11. Configure global styles 
Main center for colors in application
Update:
src/app/globals.css
Use Novacity brand foundation:
Primary: #0F172A
Gold: #D4A017
White: #FFFFFF
Light Gray: #F8FAFC
Dark Text: #111827
Border: #E5E7EB
Success: #22C55E
Danger: #EF4444
2. Configure root layout
Update:
src/app/layout.tsx
Requirements:
•	Use Inter font 
•	Add global metadata 
•	Clean body styling 
•	SEO foundation 
•	App name: Novacity 
•	Description: Modern real estate marketplace platform 

13. Create constants
Create:
src/constants/navigation.ts
src/constants/property.ts
src/constants/routes.ts
14. Create shared types
Create:
src/types/index.ts
src/types/property.ts
src/types/user.ts

Include:
export type UserRole = "user" | "admin" | "company";

export type PropertyStatus =
  | "for-sale"
  | "for-rent"
  | "sold"
  | "rented"
  | "featured"
  | "new-listing";

export type ListingType = "owner" | "company";

export type PricingType = "fixed" | "negotiable";

export type PropertyType =
  | "house"
  | "apartment"
  | "land"
  | "commercial"
  | "rental";

15. Verify project
Run:
npm run dev
npm run lint
npm run build

Fix all errors before continuing.
Completion Checklist
Mark complete only when:
•	Next.js app is created 
•	TypeScript is enabled 
•	Tailwind CSS works 
•	shadcn/ui is configured 
•	Dependencies are installed 
•	Folder structure is complete 
•	Route groups are created 
•	Feature folders are created 
•	Server folders are created 
•	Environment files are created 
•	MongoDB connection works 
•	Global styles are configured 
•	Root layout is configured 
•	Constants are created 
•	Shared types are created 
•	App runs locally 
•	Lint passes 
•	Build passes

•	After Completion
•	Update:
•	context/Project-Process-Tracker.md
•	Set:
•	## Foundation

- [x] Project initialization
- [x] Tailwind configuration
- [x] shadcn/ui setup
- [x] MongoDB connection
- [x] Environment configuration
- [x] Folder structure setup

## Current Phase

System setup and installation completed.

## Next Implementation File

02-ui-components-and-design-system.md

