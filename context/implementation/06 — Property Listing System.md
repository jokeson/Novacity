# 06 — Property Listing System
Read AGENTS.md before starting ..

# Purpose

Build the core real estate listing management system.

# Goal

Allow authenticated users and admins to create, edit, delete, and manage property listings.

## Related: cross-cutting refactor (phase 13)

**Canonical spec:** [**13 — Listings, PassKeys & Navigation Refactor**](13%20%E2%80%94%20Listings%20PassKeys%20and%20Navigation%20Refactor.md) — admin PassKey bypass (§**3**), remove listing channel (§**7**), image upload UX (§**8**), multi-currency (§**9**), ownership rules feeding public labels (§**6**). **Navigation** details: **08** + **13** §**1**.

# Feature Structure

Use:

src/features/listings/
├── actions/
├── components/
├── hooks/
├── services/
├── validators/
├── types/
└── utils/

# User Listing Features

Users can:

- Create listing
- Edit listing
- Delete listing
- Upload multiple images
- Manage status
- Mark listing as sold or rented
- Track listing expiration

# Routes

Create:

src/app/(dashboard)/dashboard/listings/page.tsx
src/app/(dashboard)/dashboard/listings/create/page.tsx
src/app/(dashboard)/dashboard/listings/[id]/edit/page.tsx

# Components

Create:

src/features/listings/components/
├── ListingForm.tsx
├── ListingImageUpload.tsx
├── ListingStatusSelect.tsx
├── ListingPricingFields.tsx
├── ListingLocationFields.tsx
├── ListingTable.tsx
└── ListingActions.tsx

# Validation

Create:

src/features/listings/validators/listingSchema.ts

Validate:

- title
- description
- price
- propertyType
- listingType
- pricingType
- location
- images
- status

# Rules

- Users must be authenticated
- Owners need valid PassKey before publishing
- Admins do not need PassKey
- Validate all form data
- Keep upload logic reusable
- Keep forms clean and modular

# Completion Checklist

- [x] Listing form created
- [x] Create listing works
- [x] Edit listing works
- [x] Delete listing works
- [x] Image upload works
- [x] Status update works
- [x] Expiration logic added
- [x] PassKey rule respected

# Update Tracker

Mark property listing system progress.

Next file:

07-search-filtering-and-property-pages.md
