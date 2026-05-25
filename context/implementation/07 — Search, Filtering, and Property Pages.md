# 07 — Search, Filtering, and Property Pages
Read AGENTS.md before starting ..

# Purpose

Build marketplace browsing, search, filters, and property details pages.

# Goal

Allow users to discover properties easily.

## Related: cross-cutting refactor (phase 13)

**Canonical spec:** [**13 — Listings, PassKeys & Navigation Refactor**](13%20%E2%80%94%20Listings%20PassKeys%20and%20Navigation%20Refactor.md) (§**1** nested / Back with catalog, §**6** ownership labels on detail, §**9** price + currency display). Existing **Navigation and stack exit (Back)** section remains authoritative for catalog ↔ detail behavior.

# Public Routes

Create:

src/app/(public)/properties/page.tsx
src/app/(public)/properties/[slug]/page.tsx

# Search Features

Users can filter by:

- Property type
- Sale/rental status
- Price range
- Bedrooms
- Bathrooms
- Location
- Owner/company listings
- Recently added
- Negotiable pricing
- Availability status

# Components

Create:

src/features/search/components/
├── PropertySearchBar.tsx
├── PropertyFilterPanel.tsx
├── PriceRangeFilter.tsx
├── LocationFilter.tsx
├── PropertyTypeFilter.tsx
└── SearchResults.tsx

Create:

src/features/properties/components/
├── PropertyDetailsPageView.tsx
├── PropertyGallery.tsx
├── PropertyContactCard.tsx
├── PropertyMapLink.tsx
├── PropertyShareActions.tsx
├── FavoriteButton.tsx
└── InterestedButton.tsx

# Rules

- Sync filters with URL query params
- Keep search responsive
- Use pagination or infinite scroll
- Property pages must be SEO-friendly
- Property slugs must be readable
- Use dynamic metadata

# Navigation and stack exit (Back)

Public **catalog** and **property detail** flows should make it easy to **leave detail and return to discovery** without losing context unnecessarily.

Requirements:

- On **`/properties/[slug]`** (detail), provide a clear **Back to listings** (or **← Properties**) control that returns users to **`/properties`** with **search/filter query params preserved** when the user arrived from the catalog (e.g. pass through `searchParams` or a safe subset via query string on the link). If there is no referrer state, linking to plain `/properties` is acceptable.
- Prefer **`Link`** to the catalog URL (with reconstructed query when available) over **only** `router.back()` so behavior is correct after refresh, shared deep link, or new tab.
- From the catalog, opening a listing should not trap the user: browser back may still work, but the **in-app** back affordance must not depend solely on history.
- Ensure controls are **accessible** (visible text or `aria-label`), keyboard-focusable, and use `cursor-pointer` where appropriate.
- Align deeper property-related flows (modals such as interest) with the same focus/close behavior documented in admin/dashboard specs where relevant.

# Completion Checklist

- [x] Properties listing page created
- [x] Search works
- [x] Filters work
- [x] URL query sync works
- [x] Property details page created
- [x] Favorite button added
- [x] Share buttons added
- [x] Contact buttons added
- [x] SEO metadata added
- [x] Back / stack-exit from property detail to catalog with preserved filters (see **Navigation and stack exit (Back)** above)

# Update Tracker

Next file:

08-user-dashboard.md
