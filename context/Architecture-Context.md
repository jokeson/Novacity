# Novacity — Architecture Context

## Purpose

This document explains how the Novacity application is structured.

It defines:
- Folder structure
- Route groups
- Feature architecture
- Shared UI system
- Data flow
- Server architecture
- Engineering rules

For product behavior and business logic, see:
- `Project-Overview.md`

For implementation progress, see:
- `Project-Tracker.md`

---

# Root Structure

```txt
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


Public Routes

Used for:

Homepage
Property browsing
Search
Contact page
State pages

App Router Structure
app/
├── (public)/
├── (auth)/
├── (dashboard)/
├── (admin)/
└── api/



Authentication Routes

Used for:

Sign in
Sign up
Forgot password
(auth)/
├── sign-in/
├── sign-up/
└── forgot-password/



Dashboard Routes

Used for authenticated users.

(dashboard)/
├── dashboard/
├── dashboard/verification/
├── dashboard/listings/
├── dashboard/favorites/
├── dashboard/notifications/
├── dashboard/settings/
└── dashboard/passkeys/



Admin Routes

Used only by admin accounts.

(admin)/
├── admin/users/
├── admin/listings/
├── admin/owner-verifications/
├── admin/passkeys/
├── admin/home-hero/
├── admin/analytics/
└── admin/revenue/



Feature Architecture

The app uses feature-based architecture.

features/
├── auth/
├── home/
├── listings/
├── properties/
├── dashboard/
├── verification/
├── admin/
├── notifications/
├── passkeys/
└── search/


Each feature should contain:

feature-name/
├── actions/
├── components/
├── hooks/
├── services/
├── validators/
├── types/
└── utils/


Shared UI System

The app uses shadcn/ui as the main component system.

Reusable UI components live in:

components/ui/

Shared reusable components live in:

components/shared/

Feature-specific components live inside:

features/[feature-name]/components/

Rules:

Reuse components when possible
Avoid duplicated UI
Keep design consistent
Keep components modular



Server Architecture
server/
├── db/
├── auth/
├── queries/
├── services/
├── repositories/
└── permissions/

Responsibilities:

repositories → database access
services → business logic
queries → read operations
auth → authentication and permissions


Data Flow

Preferred application flow:

UI
→ Action
→ Service
→ Repository
→ Database


Thin Route Rule

Routes should stay simple.

Routes should:

Fetch data
Render views
Handle metadata

Business logic should live inside:

features/
services/
repositories/

State Management

Prefer:

Server Components
URL state
Local component state

Avoid unnecessary global state.



Authentication & Authorization

Authentication uses:

JWT
HttpOnly cookies

Protected areas:

/dashboard
/admin

Important rules:

Never trust client-side authorization
Always validate permissions on the server
Protect all sensitive routes and actions
Owner Verification & Listing Access

Users must complete owner verification before creating listings.

Verification flow:

User submits application
Admin reviews application
Approved users gain listing access

Listing creation and publishing are enforced on the server.

PassKey rules still apply for verified owners.

Search & URL State

Property filters should use URL query state.

Benefits:

Shareable URLs
SEO-friendly pages
Better navigation
Easier state persistence
SEO Rules

Property pages should support:

Dynamic metadata
Open Graph metadata
Structured data
SEO-friendly URLs
Navigation Rules

Deep flows should always provide:

Back button
Clear exit navigation
Predictable routing

Examples:

Catalog → property detail
Dashboard → create/edit
Admin → nested pages
UI Architecture Rules
Use reusable UI components
Keep layouts clean
Keep spacing consistent
Use shadcn/ui patterns
Keep page files thin
Scalability Goals

Architecture should support future:

Mobile applications
Messaging systems
Payment systems
AI features
Multi-language support
Advanced analytics









