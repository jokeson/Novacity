Read AGENTS.md before starting ..

# Purpose

Build the reusable UI foundation for Novacity before creating pages or business features.

## Related: cross-cutting refactor (phase 13)

**Canonical spec:** **[13 — Listings, PassKeys & Navigation Refactor](13%20%E2%80%94%20Listings%20PassKeys%20and%20Navigation%20Refactor.md)** (§**2** icons — gold, hover/active, accessibility). Phase **02** stays the home for shared primitives; link out to **13** rather than duplicating the full epic.

# Required Context

Read first:

1. context/AGENTS.md
2. context/Project-Overview.md
3. context/Architecture-Context.md
4. context/UI-Context.md
5. context/Code-Standards.md
6. context/Project-Process-Tracker.md

# Goal

Create a clean, premium, reusable design system using:

- Tailwind CSS
- shadcn/ui
- Lucide React
- Inter font
- Novacity brand colors

# Work Items

## 1. Configure Global UI Theme

Update:

src/app/globals.css

Include:

- Deep Navy: #0F172A
- Luxury Gold: #D4A017
- White: #FFFFFF
- Light Gray: #F8FAFC
- Dark Text: #111827
- Border: #E5E7EB
- Success: #22C55E
- Danger: #EF4444

## 2. Create Shared UI Components

Create:

src/components/shared/
├── SectionTitle.tsx
├── PageHeader.tsx
├── EmptyState.tsx
├── LoadingSkeleton.tsx
├── StatusBadge.tsx
├── PriceText.tsx
└── Container.tsx

## 3. Create Form Components

Create:

src/components/forms/
├── FormInput.tsx
├── FormTextarea.tsx
├── FormSelect.tsx
├── FormSubmitButton.tsx
└── FormErrorMessage.tsx

## 4. Create Property UI Components

Create:

src/features/properties/components/
├── PropertyCard.tsx
├── PropertyImage.tsx
├── PropertyStatusBadge.tsx
├── PropertyMeta.tsx
└── PropertyPrice.tsx

## 5. Navbar profile / `UserNavbarProfile` (shared pattern)

Cross-ref: **[03 — Public Layout and Homepage](03%20%E2%80%94%20Public-Layout-and-Homepage.md)** **Novacity — Navbar Profile Refactor**.

**Implemented:** `[UserNavbarProfile.tsx](../../src/components/shared/navigation/UserNavbarProfile.tsx)` exports `UserNavbarProfile` + shared type `NavbarProfilePayload` (`name`, `image` only). Consumed from `[NavbarClient](../../src/components/shared/navigation/NavbarClient.tsx)` / `[MobileNavbar](../../src/components/shared/navigation/MobileNavbar.tsx)`.

Add or consolidate a **small reusable** presentation component for the signed-in Navbar (not page-specific marketing copy):

- **Location:** `src/components/shared/navigation/UserNavbarProfile.tsx` (uses `[Avatar](../../src/components/ui/avatar.tsx)`).
- **Fallback:** when `image` is missing, render initials from `name` (first two words).
- **Styling:** Novacity tokens (`bg-primary/15` on fallback, `border-border`, subtle hover on container); `rounded-full` avatar; container is decorative (`role="group"`, `aria-label` includes name).
- **Accessibility:** visible **full name** text + `aria-label` on the group; avatar image `alt=""` because name is exposed on the group.

Do **not** duplicate email, role badges, or username in this chip — **full name only** next to the avatar per **03** §2.

# Rules

- Do not create page-specific UI here
- Do not duplicate shadcn/ui components
- Keep components reusable
- Use TypeScript props
- Use clear naming
- Use Tailwind consistently

# Completion Checklist

- [x] Global theme configured (`globals.css` + `src/lib/uiContext.ts`)
- [x] Shared components created
- [x] Form components created
- [x] Property card components created
- [x] UI follows Novacity brand (May 2026 pass — see `context/UI-Context.md` **Implementation**)
- [x] Components are reusable
- [x] No duplicated UI logic
- [x] Navbar profile chip — `[UserNavbarProfile](../src/components/shared/navigation/UserNavbarProfile.tsx)` (§5)

Update:

context/Project-Process-Tracker.md

Mark:

- shadcn/ui setup
- Global UI system
- Shared UI components
- Property card foundation

Next file:

03-public-layout-and-homepage.md