# Novacity — Project Tracker

Last Updated: May 25, 2026 (Vercel deployment preparation)

**May 25, 2026 — Vercel deployment:** `vercel.json`, `.nvmrc`, `docs/DEPLOY-VERCEL.md`, `npm run verify:deploy`, `getAppBaseUrl()` (`VERCEL_URL` fallback), API `maxDuration` for uploads, updated `.env.example` and README.

**May 24, 2026 — Houses for sale rail:** Homepage section shows **2** most recent `for-sale` listings (sorted by `createdAt`); card thumbnails use fixed assets from `homepageHousesForSale.ts` (not listing upload images); promo image unchanged.

**May 24, 2026 — Marketplace by state:** Navbar **Listings** (`/properties`) shows all published listings in sections labeled per region (e.g. **Upper Nile state**). Filtered/search URLs keep the flat paginated grid.

**May 24, 2026 — Public listing data:** Homepage `PropertyCard` shows location line from listing data; property detail page shows location in header plus **Listing details** section (type, status, state, location, address, beds/baths, contact phone).

**May 24, 2026 — Gold CTAs & icons:** Added `variant="gold"` on shared `Button`; tokens `uiButtonGold`, `uiButtonGoldProminent`, `uiIconAccent`, `uiIconInteractive` in `src/lib/uiContext.ts`. Wired gold styling to **List a property** / **Verify to list**, **Send message**, **Learn more**, contact/property inquiry submits, hero + promo CTAs, and interactive nav icons (search, menu). Recorded in `context/UI-Context.md` **Implementation**.

**May 22, 2026 — UI-Context implementation:** Centralized tokens in `src/lib/uiContext.ts` + globals utilities; shared components and public/auth/contact/novacity/property pages aligned to brand typography, `rounded-2xl` surfaces, shadows, and transitions per `context/UI-Context.md`.

**May 22, 2026 — Owner verification UX (`/dashboard/verification`):** Animated 3-step progress (fill form → submit → admin approval; Step 3 only after approve); congratulations panel for approved owners; transactional approval email with Novacity owner policies (Resend via `RESEND_API_KEY` / `EMAIL_FROM`).

**May 22, 2026 — User Dashboard (doc 08):** Enforced owner-verification gates for unapproved `user` accounts (server redirects + sidebar/quick-nav filtering); fixed listing-access default (no implicit `approved`); added shared `BackLink`, back navigation on favorites/notifications/settings/passkeys; navbar/home “List a property” CTAs route to verification when locked; verification reminder notifications in dashboard sync.

**May 22, 2026 — Rebrand:** Application display name, routes (`/novacity`), listing source enum (`novacity`), session cookie, Cloudinary defaults, and context docs updated from Rentaler → Novacity.

**May 22, 2026 — Hero branding:** Homepage hero overlay shows **NovaCity Holdings**, slogan *Building the Future of African Cities*, and *South Sudan - Juba* above admin-managed hero copy (`homeHeroBranding.ts`).

**May 16, 2026 — Cleanup:** Removed **Property card test** from public navbar ([`mainNavTailItems`](../src/constants/navigation.ts)); deleted `testPropertyCard` from [`routes.ts`](../src/constants/routes.ts) and removed dev preview route `/test/property-card` (`src/app/(public)/test/`).

---

# Current Focus

Current feature:
- Property details page improvements
- Mobile navbar fine-tuning (public layout)

Current goals:
- Improve property details card design
- Refactor property information layout
- Improve mobile responsiveness (property page and navbar)
- Improve image gallery experience
- Property details page polish (remaining)
- Polish mobile Sheet navigation (tap targets, close-on-navigate, keyboard)

Current status:
- In progress

Last worked on:
- **User Dashboard (doc 08)** — verification gates, back navigation, navbar/home CTAs, verification reminder notifications
- **Overlay hero** (doc 03) — full-cover background image, navy scrim, CTAs + search modal on hero
- Public layout and homepage (doc 03) — structure, rails, states, card surfaces
- Property details page

---

# Recently Completed

## May 2026

### UI design system (UI-Context — May 2026)
- `src/lib/uiContext.ts` — brand typography, card surfaces, transitions, public layout offset
- `globals.css` — theme variables + utility classes
- Shared + page views: homepage, properties, contact, novacity, auth, 404, dashboard/admin headers
- Property cards + detail: bedroom/bathroom copy, price scale, fixed card footprint
- **Gold CTAs & icons (May 24, 2026):** `Button` `gold` variant; List a property, Send message, Learn more, inquiry/contact submits; nav icon hover accents

### Owner Verification System
- Users must apply before creating listings
- Admin approval/rejection flow completed
- Verification document upload completed
- Verification notifications completed

### PassKey System
- PassKey publish rules completed
- Bulk PassKey generation completed
- PassKey dashboard banner completed
- Admin PassKey management completed

### Public Layout & Homepage (implementation doc 03)
- **Homepage structure:** `HomePageView` composes navbar → hero → listing rails → states → company info → footer (search via navbar modal only)
- **Route:** Thin `src/app/(public)/page.tsx` (metadata, fetch, render feature view)
- **Sticky navbar:** Desktop and mobile; auth-aware actions (guest / signed-in / admin); no email or role labels in bar
- **Mobile navigation:** shadcn Sheet drawer with large tap targets and close-on-link
- **Dynamic overlay hero:** Full-cover `next/image` background with overlaid copy/CTAs and navy scrim; admin-managed at `/admin/home-hero`; safe defaults when data missing; hero **Search properties** opens `AdvancedSearchModal` (same as navbar)
- **Listing rails:** Featured (ownership, max 4 cards + Learn more → marketplace `?featured=1`), for sale (**2** recent for-sale + hardcoded card images), for rent, apartments, commercial, latest — live DB data via `HomeListingRail`; Suspense fallbacks; empty/error states; `PropertyCard` reuse
- **Section bands (May 2026):** Unique homepage band per section (`homeSectionBands.ts` + `HomeSectionBandShell`) — gold, white, linen, navy, stone, elevated, compass, heritage; subtle decor overlays via brand tokens only (navy, gold, muted)
- **Card surfaces:** Light gray `bg-card` on white/elevated bands; white `bg-background` on tinted bands — `homeCardSurfaces.ts` + `--card` token (`#F8FAFC`)
- **States section:** Top five states by listing count; `#states` placement; white cards on muted band; links to `/states/[slug]`
- **Navbar states dropdown:** Built from real listing data; deduped names; links to state pages
- **Contact page:** `/contact` with server validation, rate limiting, success/error states
- **Novacity page:** `/novacity` marketing content
- **Public footer:** `PublicFooter` on homepage
- Removed demo `sample-listings` data from homepage
- Search modal from navbar; filters in URL query string (SEO-friendly)

### User Dashboard (implementation doc 08 — May 22, 2026)
- **Owner verification steps UI:** `/dashboard/verification` shows animated Steps 1–2 always; Step 3 (admin approval) only after approve; congratulations message + create-listing CTA when approved
- **Owner approval email:** Admin approve sends Resend email with owner policy highlights and listing links (`src/server/services/email.service.ts`, `ownerVerificationApprovedEmail.ts`)
- **Owner verification gates:** Unapproved `user` owners redirected from overview, listings, favorites, notifications, settings, and PassKeys to `/dashboard/verification`; sidebar + quick tabs show only Verification (+ Browse marketplace) until approved; server actions unchanged + stricter `isOwnerVerificationApprovedForListings` (explicit `approved` only)
- **Back / stack exit:** Shared `BackLink`; stable parent links on favorites, notifications, settings, passkeys (plus existing create/edit/listings/verification)
- **Navbar & homepage CTAs:** “List a property” / empty-state links → “Verify to list” when verification pending
- **Verification reminders:** Dashboard notification sync prompts unsubmitted/rejected owners (cooldown-aware)
- **Previously shipped (May 2026):** Overview refactor + `DashboardQuickNavTabs`, profile image upload (settings), sidebar gold-on-primary theme, navbar profile refactor (profile/sign-out in global bar only)

### Dashboard Improvements (earlier)
- Dashboard sidebar redesign completed
- Admin sidebar redesign completed
- Notification system improved
- Profile image upload completed
- Dashboard quick navigation tabs completed

### Property System
- Property create/edit system completed
- Property detail page completed
- Favorites system completed
- Interested client system completed
- Listing expiration system completed

### Authentication
- Sign up completed
- Sign in completed
- JWT session authentication completed
- Protected routes completed
- Role-based authorization completed

### Public Website (supporting routes)
- States pages (`/states/[slug]`) completed
- Removed dev-only **Property card test** nav link and `/test/property-card` preview route (May 16, 2026)
- Navbar, mobile nav, contact, footer, and homepage covered under **Public Layout & Homepage** above

### SEO & Security
- Sitemap completed
- Robots.txt completed
- Open Graph metadata completed
- Security headers completed
- Upload validation completed

---

# In Progress

- Property details page redesign and polish
- UI consistency improvements
- Property details card design
- Mobile responsiveness improvements (property page)
- **Mobile navbar fine-tuning** (public layout doc 03)
- **Private ID document storage** (signed URLs / non-public bucket — spec 08 §3; dev still uses `public/uploads/verification` fallback)

---

# Next Features

## Public homepage (doc 03)

- Homepage performance passes (images, server components, lazy loading where needed)
- Light motion / animation (careful, premium feel)
- Extra homepage sections if product requests them

## Planned Features

- Mortgage calculator
- AI property recommendations
- Interactive property maps
- Payment integration
- Email delivery for forgot password (owner verification approval email shipped via Resend)
- Advanced analytics
- Company listing workflow
- Mobile application

---

# Important Notes

## Architecture Rules

- Use feature-based architecture
- Keep routes thin
- Use reusable components
- Use shadcn/ui patterns
- Use Tailwind CSS only

---

## Security Rules

- Never trust client-side authorization
- Always validate on the server
- Protect dashboard and admin routes
- Validate uploads securely

---

## Listing Rules

- Users cannot create listings until verified
- Verified owners still require PassKeys
- Company and admin accounts bypass PassKey publish rules

---

## UI Rules

- UI should feel premium and modern
- Keep layouts clean and spacious
- Maintain consistent spacing
- Use reusable UI components
- Mobile-first design preferred

---

# Useful Implementation Docs

Detailed implementation specs live inside `context/implementation/`:

- `03 — Public-Layout-and-Homepage.md` — **Done** (May 2026), including overlay hero; in progress: mobile navbar polish; next: performance and motion
- `04 — Authentication-and-Authorization.md`
- `06 — Property Listing System.md`
- `08 — User Dashboard.md` — **Done** (May 22, 2026) except private ID storage (§3); links **13** for PassKey/navigation cross-cuts
- `09 — PassKey System.md`
- `10 — Admin Dashboard.md`
- `13 — Listings PassKeys and Navigation Refactor.md`