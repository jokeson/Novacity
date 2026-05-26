# Novacity — UI Context

## Design Philosophy

The UI should feel:
- Premium
- Modern
- Clean
- Trustworthy
- Spacious
- Professional

The platform should feel like a high-quality real estate SaaS product.

---

# Brand Colors

## Main Colors

- Deep Navy: #0F172A
- Luxury Gold: #D4A017
- White: #FFFFFF

Recommended usage:
- Deep Navy 
- Gold 
- White 

---

## Supporting Colors

- Light Gray: #F8FAFC
- Dark Text: #111827
- Border: #E5E7EB
- Success: #22C55E
- Danger: #EF4444

Use:
- Success color for successful actions/messages
- Danger color for errors and warnings

---

# Typography

## Font

Use:
- Inter

---

## Typography Sizes

- Hero Heading → text-5xl
- Section Title → text-3xl
- Property Title → text-xl
- Property Price → text-2xl
- Body Text → text-sm

---

# UI Style Rules

## Border Radius

Use:
- rounded-2xl

---

## Borders

Use:
- `border-2 border-gray-200` (or `border-2 border-border` token) for cards and image frames

---

## Shadows

Homepage cards use **border-only** surfaces — no elevation shadows.

Use:
- `border border-gray-200` (or `border-border` token)
- `rounded-2xl`

Do not use `shadow-sm` / `hover:shadow-md` on homepage listing, state, company, or promo cards.

**Images:** No elevation shadows or decorative rings on photos — use `uiPropertyImageFrame` / `uiStandaloneImageFrame` in `uiContext.ts` (`border-2`, `shadow-none`).

Other surfaces (dropdowns, modals, buttons) may still use shadows where appropriate.
---

## Transitions

Use:
- transition-all duration-300

---

# Component Design System

The application uses the shadcn/ui design style.

All reusable UI components should feel:
- Clean
- Minimal
- Modern
- Accessible
- Professional

Use shadcn/ui patterns for:
- Buttons 
- Inputs
- Cards
- Forms
- Dialogs
- Dropdowns
- Tables
- Tabs
- Toasts
- Badges

---

# Component Rules

- Use Tailwind CSS
- Keep spacing consistent
- Use clean borders
- Avoid elevation shadows on homepage cards
- Use proper hover states
- Use proper focus states
- Keep components reusable
- Avoid random custom styles

The UI should feel like a professional shadcn/ui-based SaaS application.

---

# Property Card Style

Property cards should include:
- Large responsive image
- Clear pricing
- Property details
- Status badge
- Clean typography
- Smooth hover effects

Cards should feel:
- Elegant
- Spacious
- Professional
- Mobile-friendly

---

# Dashboard Style

Dashboard should feel:
- Clean
- Structured
- Easy to navigate
- Professional

Use:
- Sidebar navigation
- Sticky headers
- Reusable cards
- Consistent spacing

---

# Form Rules

Forms should:
- Be easy to read
- Have clear labels
- Show validation messages
- Work well on mobile devices

---

# Animation Rules

Use Framer Motion subtly.

Allowed:
- Hover animations
- Modal transitions
- Smooth section transitions

Avoid:
- Excessive animations
- Distracting motion

---

# Responsive Design Rules

The application must support:
- Mobile
- Tablet
- Desktop
- Large screens

Use:
- Mobile-first development
- Layout tokens in [`src/lib/responsiveLayout.ts`](../src/lib/responsiveLayout.ts): `uiAppBody`, `uiAppMain`, `uiDashboardMainColumn`, `uiPageSectionY`, `uiPropertyCardGrid`
- `min-w-0` + `overflow-x-clip` on main columns to prevent horizontal scroll
- `Container` horizontal padding: `px-4` → `sm:px-5` → `md:px-6` → `lg:px-8`

---

# Important UI Rules

- Do not overcrowd layouts
- Keep spacing consistent
- Use reusable components
- Keep visual hierarchy clear
- Keep interactions smooth
- Maintain accessibility
- Avoid inconsistent colors

Deep flows like:
- Catalog → detail
- Dashboard → create/edit
- Admin tools

Should always provide:
- Clear Back button
- Clear exit navigation

---

# Final UI Goal

The platform should feel like:
- A premium SaaS product
- A trusted real estate marketplace
- A professional investment-grade application

---

# Implementation (codebase — May 2026)

**Canonical tokens:** [`src/lib/uiContext.ts`](../src/lib/uiContext.ts) — typography, surfaces (`rounded-2xl`, `border-2 border-border`, `transition-all duration-300`), `uiPropertyImageFrame` / `uiStandaloneImageFrame` (border-only photos), public main offset, property card shell, **gold CTA + icon tokens**. Homepage card borders: [`homeCardSurfaces.ts`](../src/features/home/constants/homeCardSurfaces.ts) (`HOME_CARD_BORDER`, `HOME_PROPERTY_CARD_NO_SHADOW`).

**Global theme:** [`src/app/globals.css`](../src/app/globals.css) — CSS variables match brand colors above; utility classes `.text-hero-heading`, `.text-section-title`, `.surface-card-ui`, etc.

**Gold CTAs & icons (Luxury Gold `#D4A017`):**

- **Button variant:** `variant="gold"` on [`Button`](../src/components/ui/button.tsx) — filled gold background, **white** label, hover darken.
- **Token helpers:** `uiButtonGold`, `uiButtonGoldProminent`, `uiIconAccent`, `uiIconInteractive` in `uiContext.ts`.
- **Primary action buttons** use gold: **List a property** / **Verify to list** (navbar, hero, homepage empty states, dashboard listings), **Send message** (contact), **Learn more** (featured listing rail footer), property **Send inquiry**, promo **Browse** CTAs on split sections.
- **Interactive icons** (search, mobile menu, toolbar controls): muted default → gold on hover/focus via `uiIconInteractive`; decorative/empty-state icons use `uiIconAccent` / `text-gold`.

**Shared components wired to tokens:** `PageHeader`, `SectionTitle`, `EmptyState`, `PriceText`, `BackLink`, `PropertyCard`, `PropertyMeta` (bedroom/bathroom labels), `StatusBadge` (success/danger tones).

**Pages/views aligned:** Homepage (`HeroSection`, `HomePageView`), marketplace (`/properties`, detail slug), contact, novacity marketing, auth (`AuthPageView`), 404, dashboard/admin sticky headers, contact form cards.

**Deep flows:** Back navigation via `BackLink` / `DashboardHeader` / `AdminHeader` `backLink` prop (catalog → detail, dashboard nested routes).