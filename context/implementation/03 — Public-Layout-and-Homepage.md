# 03 — Public layout and homepage

## What we are building

The public site is the first thing visitors see. The homepage should feel premium, modern, and trustworthy. It must work on mobile and desktop and stay friendly to search engines.

Read these before changing this area:

1. `context/Project-Overview.md`
2. `context/Architecture-Context.md`
3. `context/UI-Context.md`
4. `context/Code-Standards.md`
5. `context/Project-Process-Tracker.md`

---

## Main route

**File:** `src/app/(public)/page.tsx`

The route should stay thin: metadata, data fetching, and rendering `HomePageView`. Put UI and business logic in feature components, not in the page file.

---

## Homepage layout (top to bottom)

1. Navbar (sticky)
2. Hero
3. Featured / ownership listings
4. Houses for sale
5. Rental properties
6. Apartments
7. Commercial buildings
8. Latest listings
9. States (browse by region)
10. Company information
11. Footer

Search is opened from the **navbar** (modal), not embedded in the homepage body.

---

## Feature folder

**Path:** `src/features/home/components/`


| Component                | Role                                     |
| ------------------------ | ---------------------------------------- |
| `HomePageView.tsx`       | Composes the full homepage               |
| `HeroSection.tsx`        | Hero image, copy, CTAs                   |
| `HomeListingRail.tsx`    | Loads one listing rail from the database |
| `HomeListingSection.tsx` | Section layout, grid, empty/error states |
| `StatesHomeRail.tsx`     | Loads state highlights                   |
| `StatesHomeSection.tsx`  | States band UI                           |
| `StateHighlightCard.tsx` | Single state card                        |
| `CompanyInfoSection.tsx` | Company stats band                       |
| `PublicFooter.tsx`       | Site footer                              |


Shared listing config: `src/features/home/constants/homeListingSections.ts`  
Card surface rules: `src/features/home/constants/homeCardSurfaces.ts`

---

## Navigation

**Path:** `src/components/shared/navigation/`

The navbar stays at the top, works on mobile and desktop, and changes by auth state.

**Guests:** Sign in, Create account  
**Signed in:** Dashboard, List a property, search, profile name and avatar, Sign out  
**Admin:** Also show Admin console link  

Do not show email or role labels in the navbar.

**Mobile:** Use the shadcn Sheet drawer, large tap targets, close on link click, keyboard accessible.

**States dropdown:** Built from real listing data, links to `/states/[slug]`, no duplicate state names.

---

## Hero section

- **Company overlay (fixed):** `HOME_HERO_BRANDING` in `homeHeroBranding.ts` — **NovaCity Holdings**, slogan, location — small type, bottom-right corner over the hero image scrim (separate from admin-managed headline/CTAs)
- **Layout:** Full-cover hero background with overlaid content — `next/image` fills the section (`object-cover`); copy and CTAs sit in a foreground layer with a navy scrim for contrast
- Primary CTAs: Browse listings, Search properties (opens the same advanced search modal as the navbar), and List a property when signed in
- Content can be edited in admin at `/admin/home-hero`
- If hero data is missing, show safe default copy and image so the page never breaks
- Admin updates use Zod validation, secure uploads, and revalidate the homepage

---

## Homepage listing sections

All listing rails load from the database. Never ship hardcoded production listings except image in Houses for sale section.

**Rails:** Featured (ownership), for sale, for rent, apartments, commercial, latest.

**Featured / ownership rail:**

- Shows at most **4** admin-curated listings (`isFeatured: true` + public marketing status)
- **Learn more** footer link → `/properties?featured=1` (full curated set on the marketplace)
- 4-column grid on large screens

**Rules:**

- Only published, public listings
- Reuse `PropertyCard`
- Suspense fallbacks while loading
- Clear empty and error states with links to browse the catalog
- Responsive grids (3 or 4 columns depending on section)

**Section backgrounds (bands):**

Each listing rail uses a distinct band (top `border-t` divider + brand-aligned background) so visitors feel rhythm while scrolling. Configured in `homeListingSections.ts` (`tone`) and `homeSectionBands.ts`:


| Rail                 | Band       | Background                         |
| -------------------- | ---------- | ---------------------------------- |
| Featured / ownership | `gold`     | Soft gold gradient into light gray |
| Houses for sale      | `white`    | White                              |
| Rental properties    | `muted`    | Light gray                         |
| Apartments           | `navy`     | Subtle navy wash into white/gray   |
| Commercial           | `muted`    | Light gray                         |
| Latest               | `elevated` | Brand light gray (`bg-card`)       |


States and company sections reuse `muted` and `navy` bands for continuity before the footer.

---

## Homepage card colors

Cards must read clearly against each section background and match Novacity brand colors (see `context/UI-Context.md`).

**Design token:** In `src/app/globals.css`, `--card` is brand light gray `#F8FAFC` (same as `--secondary` / `--muted`). Property and UI cards use `bg-card` by default.

**On white sections** (houses for sale, apartments, latest, etc.):

- Listing cards use the light gray `bg-card` surface so they stand out on white.
- Keep `border-2 border-border` and `rounded-2xl` — border-only, no elevation shadows on cards or images.

**On muted gray sections** (featured, rentals, commercial, states, company):

- Use **white** card surfaces (`bg-background`) so cards do not blend into the band.
- State cards keep gold hover on the border (`hover:border-gold/40`).

**Helpers:** `src/features/home/constants/homeCardSurfaces.ts`

- `HOME_CARD_SURFACE_ON_WHITE_SECTION` → `bg-card`
- `HOME_CARD_SURFACE_ON_MUTED_SECTION` → `bg-background`
- `HOME_CARD_BORDER` — border-only chrome for state/company cards
- `HOME_PROPERTY_CARD_NO_SHADOW` — removes PropertyCard shell shadows on homepage
- `HOME_EMPTY_STATE_NO_SHADOW` — removes EmptyState shadows on homepage
- `homeListingCardClassName(tone)` — passed into `PropertyCard` from `HomeListingSection`
- Homepage listing cards use `mobileCenterContent` on `PropertyCard` — centered title/location/meta/price and roomier padding below `md`

---

## States section

- **Placement:** After latest listings, before company info (`#states`)
- **Data:** Up to five states with the most published listings (deduped by name)
- **Each card:** State name, listing count, link to `/states/[slug]`
- **UX:** Suspense fallback, empty state, error state with link to all properties
- **Styling:** White cards on a muted band; same border radius and hover as listing cards

---

## Search

- Filters live in the URL query string (SEO-friendly)
- Advanced search opens from the navbar modal
- Remove old duplicate search pages and refine UIs when refactoring

---

## Contact page

**Route:** `/contact`

Fields: full name, email, phone, subject, message.  
Server validation, rate limiting, success and error states, responsive layout.

---

## Novacity page

**Route:** `/novacity`

Marketing content: what Novacity is, how the marketplace works, and how we help buyers, sellers, renters, and investors.

---

## UI and architecture rules

- Follow `context/UI-Context.md` (navy, gold, light gray, white, `rounded-2xl`, border-only homepage cards)
- Use shadcn/ui and Tailwind only
- Keep routes thin; reuse components; fetch on the server where it fits
- Keyboard focus visible; proper labels on links and buttons

---

## Acceptance checklist

- Homepage renders all sections in order
- Navbar works on desktop and mobile
- Search modal opens from navbar
- Listing rails show live data with loading / empty / error states
- Cards have correct contrast on white vs muted sections
- States section and dropdown work
- Footer, contact, and Novacity pages work
- Hero works with admin content and defaults
- `npm run lint` and `npm run build` pass

---

## Status (May 2026)

**Done**

- Public homepage structure and footer
- Sticky navbar and mobile navigation
- Dynamic hero (admin-managed) with **full-cover background and overlaid content** (`HeroSection`)
- Hero search CTA opens advanced search modal (aligned with navbar search)
- All listing rails from database (`HomeListingRail`)
- States section and navbar states dropdown
- Contact and Novacity pages
- Homepage card surfaces aligned with brand (light gray on white bands, white on muted bands)

**In progress**

- Property details page polish (see project tracker)
- Mobile navbar fine-tuning

**Next**

- Homepage performance and light motion
- Extra homepage sections if product asks for them

