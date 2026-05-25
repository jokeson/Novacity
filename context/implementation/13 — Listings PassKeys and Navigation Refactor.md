# 13 — Listings, PassKeys & Navigation Refactor

Read AGENTS.md before starting.

# Purpose

Single canonical product and engineering spec for a cross-cutting refactor: listings, PassKeys, nested navigation, listing creation UX, pricing, and ownership presentation. **Do not duplicate this entire document** inside phase **02 / 05 / 06 / 07 / 08 / 09 / 10**; those files keep phase-local detail and link here.

# Where work lands (phase map)

| Area | Primary implementation docs |
|------|------------------------------|
| Nested Back / stack exit (dashboard, admin, optional catalog) | [**07**](07%20%E2%80%94%20Search%2C%20Filtering%2C%20and%20Property%20Pages.md), [**08**](08%20%E2%80%94%20User%20Dashboard.md), [**10**](10%20%E2%80%94%20Admin%20Dashboard.md); routing notes in [**Architecture-Context**](../Architecture-Context.md) |
| Icons (gold, hover/active, a11y) | [**02**](02%20%E2%80%94%20UI%20Components-and-Design-System.md), [**UI-Context**](../UI-Context.md) |
| Admin PassKey bypass, user publish gate, bulk issue, banners | [**06**](06%20%E2%80%94%20Property%20Listing%20System.md), [**09**](09%20%E2%80%94%20PassKey%20System.md), [**08**](08%20%E2%80%94%20User%20Dashboard.md), [**10**](10%20%E2%80%94%20Admin%20Dashboard.md) |
| Schema: currency, remove listing channel, ownership | [**05**](05%20%E2%80%94%20Database%20Models%20and%20Server%20Layer.md), [**06**](06%20%E2%80%94%20Property%20Listing%20System.md) |
| Public detail: ownership label, price display | [**07**](07%20%E2%80%94%20Search%2C%20Filtering%2C%20and%20Property%20Pages.md), [**06**](06%20%E2%80%94%20Property%20Listing%20System.md) |
| Image upload UX | [**06**](06%20%E2%80%94%20Property%20Listing%20System.md) |
| Conventions / cleanup | [**Code-Standards**](../Code-Standards.md), [**Architecture-Context**](../Architecture-Context.md) |

Track delivery dates and shipped pointers in [**Project-Process-Tracker**](../Project-Process-Tracker.md).

---

# 1. Nested page navigation

Improve nested page navigation across the application.

**Requirements**

- Ensure proper back button navigation behavior.
- Nested pages should preserve smooth user navigation flow.
- Back navigation should return users to the correct previous page.
- Support responsive mobile and desktop navigation.

**Example nested routes**

- `/dashboard/listings/[id]`
- `/dashboard/passkeys/[id]` (if or when introduced)
- `/admin/listings/[id]` (if or when introduced)

Align with existing **Navigation and stack exit (Back)** sections in **07**, **08**, and **10**; prefer stable parent `Link` targets where history may be empty.

---

# 2. Application icons enhancement

Add more icons throughout the application.

**Requirements**

- Use modern, clean icons (e.g. Lucide, consistent set).
- Apply **gold** accent styling to icons where appropriate for Novacity branding.
- Match Novacity theme; maintain accessibility and visual consistency.
- Add proper **hover** and **active** states.

**Design direction**

- Premium SaaS dashboard appearance.
- Modern real estate platform UI.

---

# 3. Admin PassKey permissions

Admins must **not** require PassKeys to create or publish listings.

**Behavior**

```ts
if (user.role === "admin") {
  bypassPassKeyRequirement = true;
}
```

Only normal authenticated **non-admin** users require PassKeys for publish (per existing publish policy; verify code matches this spec).

---

# 4. PassKey bulk generation

Update `/admin/passkeys`.

**Enhance “Issue PassKey”** so admins can generate **multiple** PassKeys at once.

**Presets / examples**

- 10 PassKeys  
- 50 PassKeys  
- 100 PassKeys  

**Requirements**

- Numeric input (quantity) with sensible min/max validation.
- Generate unique PassKey codes automatically.
- Store PassKeys securely in the database.
- Prevent duplicate codes (unique index + retry or transactional generation).
- Show generation success notification (toast or inline summary).

**Example code format**

`AX33TY-781DSX`

---

# 5. User PassKey requirement notifications

Normal users must have an **active** PassKey to **publish** listings.

**If** PassKey is expired or unavailable:

- Show a clear notification or banner in the dashboard (and optionally on listing create/publish surfaces).

**Example copy**

`PassKey required to publish`

**If** the user already has active PassKey credit (unused valid key as defined by product rules):

- Do **not** show the warning.

**Requirements**

- Check PassKey status **server-side** for banner visibility.
- Keep notification responsive and visually clear; match Novacity theme.

---

# 6. Listing ownership labels

Update listing **detail** pages to display ownership labels.

**User listings** (created by authenticated normal user, not admin / company-as-Novacity rule TBD in code):

- `Listed by Owner`

**Admin / company “Novacity” listings**

- `Listed by Novacity`

**Requirements**

- Render label dynamically from listing owner role (and/or explicit listing source field if introduced).
- Clean, visible typography; reuse badge patterns where appropriate.

---

# 7. Remove listing channel field

Remove the **Listing channel** field from the listing creation form and stack.

**Delete**

- Listing channel selector UI.
- Related Zod / server validation.
- Related backend branching that depended on channel.
- Related database fields (with migration plan for existing documents).

**New behavior**

- Ownership labels are derived from **authenticated role context** (and company rules), not from a manual channel selector:
  - User-created listing → **Listed by Owner** (or equivalent).
  - Admin-created listing → **Listed by Novacity** (or equivalent).

---

# 8. Listing image upload UX

Improve listing image upload experience.

**Requirements**

- Upload control with clear **icon/button** affordance.
- Show **previews immediately** after selection or upload success.
- Dedicated **preview** section (grid or carousel-friendly).
- **Multiple** images; **remove** per image.
- Responsive layout.
- Optional **drag and drop**; loading and error states; accessible controls (labels, keyboard where applicable).

**Suggested component direction**

`<ListingImageUploader />` (name may match existing `ListingImageUpload` — consolidate rather than duplicate.)

---

# 9. Multi-currency listing prices

Update listing pricing across create/edit, APIs, and public surfaces.

**Supported currencies**

- `SSP` — South Sudan Pound  
- `USD` — US Dollar  

Users select currency when creating listings for all relevant property kinds (houses, apartments, rentals, commercial, land).

**Schema**

```ts
currency: "SSP" | "USD";
```

**Requirements**

- Currency selector in listing form.
- Consistent display on listing cards and detail pages.
- Store currency on the listing / property model.
- Clean formatting (locale-appropriate grouping).

**Display examples**

- `SSP 5,000,000`  
- `USD $45,000`  

---

# 10. Code cleanup and architecture

Refactor related listing and PassKey code.

**Goals**

- Remove duplicated logic.
- Simplify listing ownership handling (single source of truth from role + model fields).
- Keep components modular and reusable.
- Thin App Router pages; logic in features / server layer.
- Tailwind best practices; accessible interactions; loading and error states.

---

# Completion checklist (epic)

**Shipped in codebase (May 13, 2026, 20:00 CST)** — see [**Project-Process-Tracker**](../Project-Process-Tracker.md) for phase-level notes.

- [x] Nested navigation / Back behavior — catalog ↔ detail query preserved on card links; stable **Back** on listing detail; dashboard/admin headers with **Back** on nested listing + passkey admin routes (`DashboardHeader`, `AdminHeader`, `PropertyDetailsPageView`, `SearchResults`).
- [x] Icons pass — gold nav icons + `active:scale-[0.99]` on dashboard/admin sidebar links (`DashboardNavLinks`, `AdminNavLinks`); PassKey banner + image upload use Lucide affordances.
- [x] Admin PassKey bypass — `PassKeyAccessGuard` explicit `admin` branch; `publishRules` unchanged (admin already exempt).
- [x] Admin bulk PassKey generation — `adminPassKeyIssueSchema` quantity 1–100; `adminIssuePassKeyAction` bulk path; presets in `AdminPassKeyIssueForm`.
- [x] Dashboard PassKey publish banner — server-side `hasValidPublishPassKey` in `(dashboard)/layout` → `PassKeyPublishBanner` in `DashboardLayout` `topSlot` for `role === "user"` only.
- [x] Ownership labels on public detail — `listingSource` + badge “Listed by Owner” / “Listed by Novacity” (`PropertyDetailsPageView`).
- [x] Listing channel removed — `listingSource` + `currency` on `Property` model; idempotent `runPropertyMigrations` on connect; form/schema/actions no manual channel; catalog filter **Listed by** (`listingSource` query param, legacy `listingType` mapped in `flattenSearchParamsRecord`).
- [x] Listing image upload UX — drag-and-drop zone, multi-file upload, previews grid, `ListingImageUploader` alias (`ListingImageUpload.tsx`).
- [x] Multi-currency `SSP` | `USD` — model + form + `formatListingPriceDisplay` + `PriceText` / cards / admin + favorites aggregation.
- [x] Cleanup — single `resolveListingSourceAndCompanyId` in `listingActions`; ownership not user-selectable.

# Update tracker

**May 13, 2026, 20:00 CST:** Epic **13** implemented in code (see checklist above). Key files: [`Property.ts`](../../src/server/models/Property.ts), [`propertyMigrations.ts`](../../src/server/db/propertyMigrations.ts), [`connect.ts`](../../src/server/db/connect.ts), [`listingActions.ts`](../../src/features/listings/actions/listingActions.ts), [`listingSchema.ts`](../../src/features/listings/validators/listingSchema.ts), [`ListingImageUpload.tsx`](../../src/features/listings/components/ListingImageUpload.tsx), [`passkeyActions.ts`](../../src/features/passkeys/actions/passkeyActions.ts), [`AdminPassKeyIssueForm.tsx`](../../src/features/passkeys/components/AdminPassKeyIssueForm.tsx), [`PropertyDetailsPageView.tsx`](../../src/features/properties/components/PropertyDetailsPageView.tsx), [`layout.tsx`](../../src/app/(dashboard)/layout.tsx). **`npm run build`** green.

Next product-driven docs after **12** remain optional; new epics can follow as **14**, etc.
