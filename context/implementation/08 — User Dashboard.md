# 08 — User Dashboard

Read AGENTS.md before starting ..

# Purpose

Build the authenticated user dashboard.

# Goal

Allow users to manage their marketplace activity.

## Related: cross-cutting refactor (phase 13)

**Canonical spec:** **[13 — Listings, PassKeys & Navigation Refactor](13%20%E2%80%94%20Listings%20PassKeys%20and%20Navigation%20Refactor.md)** (§**1** nested dashboard routes / Back, §**5** PassKey publish banner for non-admin). Complements **Navigation and stack exit (Back)** below.

# Routes

Create:

src/app/(dashboard)/dashboard/page.tsx
src/app/(dashboard)/dashboard/verification/page.tsx
src/app/(dashboard)/dashboard/listings/page.tsx
src/app/(dashboard)/dashboard/favorites/page.tsx
src/app/(dashboard)/dashboard/notifications/page.tsx
src/app/(dashboard)/dashboard/settings/page.tsx

# Components

Create:

src/features/dashboard/components/
├── DashboardLayout.tsx
├── DashboardSidebar.tsx
├── DashboardHeader.tsx
├── DashboardStatsCards.tsx
├── RecentListings.tsx
├── RecentNotifications.tsx
├── DashboardQuickNavTabs.tsx
└── DashboardPageView.tsx

**Owner verification (spec):** add feature-local components under `src/features/verification/components/` (e.g. `ApplicantVerificationForm.tsx`) and compose from `src/app/(dashboard)/dashboard/verification/page.tsx`.

# Dashboard Features

Users can:

- View listings
- Create listings (**after owner verification is approved** for `user` role — see **Novacity — Owner Verification & Listing Access** below)
- Edit listings
- Delete listings
- View favorites
- View notifications
- Track listing views
- Track listing expiration
- Complete **owner verification** (`/dashboard/verification`) when required before listing tools unlock

# Rules

- Dashboard must be protected
- Sidebar must be reusable
- Keep layout separate from pages
- Keep pages thin
- Use clean dashboard UI
- Mobile dashboard must work
- **Owner verification (spec):** never expose listing create/publish , Overview, Listings, Favorite, Notifications, Settings, PassKeys  or marketing status transitions to **unapproved** `user` owners—enforce on **server actions**, APIs, and route/layout guards (see **Novacity — Owner Verification & Listing Access** below)

# Navigation and stack exit (Back)

Dashboard pages should handle navigation clearly so users can **leave nested flows** (e.g. listings → create → edit, passkeys, settings) without getting stuck in a “stack” with no obvious exit.

Requirements:

- Provide a visible **Back** (or equivalent, e.g. “← Listings”) on nested or secondary screens—especially **listing create/edit**, any future wizard steps, and **mobile** contexts where the sidebar is hidden.
- **Primary behavior:** navigate to a **known parent route** with `Link` (or `router.push` to that path) so behavior is predictable after refresh, deep link, or external entry. Preserve meaningful **URL/query state** when returning (e.g. filters on list pages if applicable).
- **Avoid** relying only on `router.back()` as the sole exit when the user may have landed without history (new tab, email link, refresh) or when “back” would leave the dashboard entirely; if offering browser-back style control, combine with a stable parent link when possible.
- Use **accessible** labels (`aria-label` or visible text such as “Back to listings”), focus styles, and `cursor-pointer` on controls.
- Reuse a small shared pattern where practical (e.g. optional `BackLink` in `components/shared` or a prop on `DashboardHeader`) to avoid one-off styling drift.

---

# Novacity — Owner Verification & Listing Access (dashboard scope)

**Status:** Product / architecture specification (see `[Project-Overview.md](../Project-Overview.md)` — **Owner Verification & Listing Approval System**, and `[Architecture-Context.md](../Architecture-Context.md)`). **Admin review UI** lives under `**/admin`** (document in **[10 — Admin Dashboard](10%20%E2%80%94%20Admin%20Dashboard.md)** when implemented). **PassKey** publish rules still apply to verified independent owners per **13** / listing publish policy.

## 1. Restrict listing access for new users

When a user creates an account, they must **not** immediately gain access to:

```txt
/dashboard/listings/create
```

**New users (owners, `user` role)** must first complete a **verification / application** process and receive **admin approval** before they may create or publish listings.

**Until approved, the user must not be able to:**

- Create listings  
- Publish properties  
- Set or transition listing market statuses, including:
  - For rent  
  - For sale  
  - Sold  
  - Rented  
  - Featured  
  - New listing

**Implementation notes**

- Lock **UI** (hide/disable **New listing** tab, sidebar link, deep links) **and** enforce the same rules in **every** listing server action and listing-related API.  
- Redirect unverified owners from `**/dashboard/listings/create`** (and edit/publish paths as needed) to `**/dashboard/verification`**.  
- `**company**` / `**admin**` policy (skip vs parallel verification) should be decided in implementation and recorded in **05** / **10** as appropriate.

## 2. Owner verification application form

Before accessing listing creation, **authenticated** users complete an application form on `**/dashboard/verification`**.

**Collect:**

- Full name  
- Phone number  
- Residential address  
- **State / region** where the user intends to post listings (must align with public `**/states/[slug]`** hubs — see §7)

**Primary UI (example):**

```tsx
<ApplicantVerificationForm />
```

**Requirements**

- Zod-validated server actions; accessible form layout; clear copy when status is `pending`, `approved`, or `rejected`.

### Owner verification progress UI (`/dashboard/verification`)

**Status:** Shipped (May 22, 2026). **Components:** `[OwnerVerificationProgressSteps](../../src/features/verification/components/OwnerVerificationProgressSteps.tsx)`, `[VerificationPageView](../../src/features/verification/components/VerificationPageView.tsx)`, `[OwnerVerificationApprovedCelebration](../../src/features/verification/components/OwnerVerificationApprovedCelebration.tsx)`.

**Three-step display (animated with Framer Motion):**


| Step | Title                   | When visible / state                                                       |
| ---- | ----------------------- | -------------------------------------------------------------------------- |
| 1    | Fill out form           | Active for `unsubmitted` / `rejected`; complete once application submitted |
| 2    | Submit your application | Active while `pending`; complete after submit                              |
| 3    | Approved                | Always visible; **disabled** until admin approves, then shows checkmark    |


**Approved state**

- On-page **congratulations** message welcoming the user as a verified Novacity owner.
- **Email** on admin approval (`adminApproveOwnerVerificationAction`) via `[sendOwnerVerificationApprovedEmail](../../src/features/verification/services/sendOwnerVerificationApprovedEmail.ts)` + Resend (`RESEND_API_KEY`, `EMAIL_FROM` in `.env.example`) with owner policy highlights and link to create listings.
- In-app notification copy updated to mention email + listing access.

**Pending state**

- Steps 1–2 show checkmarks after submit; Step 3 stays disabled until admin approval.

## 3. Valid identification upload

Applicants must upload a **valid identification** document.

**South Sudanese applicants — accepted IDs**

- National ID  
- Driver license

**Non–South Sudanese applicants — accepted ID**

- Passport

**Requirements**

- Secure document upload (private storage, signed URLs or controlled admin download)  
- Store uploaded documents safely (no public bucket; audit who accessed)  
- Validate supported **file types** (images + PDF), size caps, MIME/extension checks  
- Reusable upload component(s) shared where practical

## 4. Notifications (dashboard-relevant events)

Wire notifications (user + admin) for at least:


| Event                             | User                                                                                   | Admin                               |
| --------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------- |
| Application submitted             | Pending / confirmation copy                                                            | New application submitted           |
| Application approved              | Congratulations on page + listing access enabled + **approval email** (owner policies) | (optional)                          |
| Application rejected              | Rejection reason                                                                       | —                                   |
| Missing / incomplete verification | Prompt to complete                                                                     | Pending review reminders (optional) |


Integrate with `[features/notifications](../../src/features/notifications)` patterns; revalidate dashboard notification surfaces as today.

## 5. State-based listing rendering (dashboard ↔ public)

Listings must surface under the correct **state / region** for SEO and discovery.

**Example**

- User selects **Lakes** during verification and/or listing creation → listing appears under `**/states/lakes`** (slug must match canonical state slug; avoid duplicate state master rows).

**Requirements**

- Dynamic aggregation from the listing database into `**/states/[slug]`**  
- Keep state pages **synchronized** on listing create/update/publish/delete (`revalidatePath` / tags as appropriate)  
- **SEO-friendly** route structure: `**/states/[state]`** (slug convention documented in **05** / **07**)

## 6. Security & validation rules

**Requirements**

- Protect listing routes **server-side** (layouts, server actions, mutations).  
- **Never** trust client-side verification status for authorization.  
- Validate uploads securely (type, size, virus policy TBD).  
- Restrict **unapproved** users from listing **APIs** and server actions.  
- Use **role + verification** checks consistently (e.g. after authoritative DB read):

```ts
if (!user.isVerifiedOwner) {
  redirect("/dashboard/verification");
}
```

(Use real field names from the User / application model once added.)

## 7. Code cleanup & architecture

Refactor verification and listing-access logic:

- Keep components **modular** and reusable  
- **Separate** verification feature (`features/verification` or equivalent) from **listings** where practical  
- Reusable **document upload** components  
- Clean **Next.js App Router** structure (thin `page.tsx`, feature views + actions)  
- **Tailwind** + shadcn patterns, responsive UI, loading and error states

**Ensure**

- Production-ready verification flow  
- Scalable **approval** workflow (indexed status queries)  
- Clean handoff to **admin** review experience (see **10**)  
- Accessible, mobile-first verification screens

# Novacity — Navbar Profile Refactor (dashboard scope)

**Status:** Implemented in codebase (May 2026). Cross-ref primary spec: **[03 — Public Layout and Homepage](03%20%E2%80%94%20Public-Layout-and-Homepage.md)** section **Novacity — Navbar Profile Refactor**.

**Dashboard responsibilities (done)**

1. `**[DashboardSidebar](../../src/features/dashboard/components/DashboardSidebar.tsx)`** — Profile strip and footer **Sign out** removed; column = title + `[NotificationBell](../../src/features/notifications/components/NotificationBell.tsx)` + `[DashboardNavLinks](../../src/features/dashboard/components/DashboardNavLinks.tsx)` only.
2. `**[DashboardHeader](../../src/features/dashboard/components/DashboardHeader.tsx)`** mobile sheet — Profile + footer sign-out removed; nav links only (global **Navbar** carries profile + sign-out).
3. `**[DashboardNavLinks](../../src/features/dashboard/components/DashboardNavLinks.tsx)`** — Still uses `[useSidebarProfile](../../src/components/shared/SidebarProfileContext.tsx)` **only** for `role === "admin"` (Admin console link); no avatar/email in sidebar.
4. **Context** — `[SidebarProfileProvider](../../src/components/shared/SidebarProfileContext.tsx)` retained for role-aware nav; display name/image for the bar come from `[Navbar](../../src/components/shared/navigation/Navbar.tsx)` server fetch + React `**cache`** on `[getUserSidebarProfileById](../../src/server/queries/user.queries.ts)`.

---

## AI / implementation prompt — Novacity — Dashboard Overview & Quick Actions Refactor

**Primary owner:** user `[/dashboard](../../src/app/(dashboard)`/dashboard/page.tsx) overview (`[DashboardPageView](../../src/features/dashboard/components/DashboardPageView.tsx)`). Admin parity: **[10 — Admin Dashboard](10%20%E2%80%94%20Admin%20Dashboard.md)** (same prompt block).

Refactor the dashboard overview layout and quick actions experience for the Novacity application.

### 1. Remove Old Authentication Label

Remove this dashboard UI text completely:

`Signed in as kiirayuel@gmail.com · user`

Do not display:

- User email address
- “Signed in as” label
- Inline role badge beside email

The dashboard should have a cleaner and more modern appearance.

### 2. Remove Open Admin Console Section

Remove the entire “Open Admin Console” button/section from the dashboard overview layout.

**Behavior update:**

- Admin-related actions should no longer appear as standalone large buttons inside overview content

### 3. Remove Old Quick Actions Section

Delete the existing Quick Actions section that currently displays items like: New Listing, Manage Listings, Favorites.

Remove:

- Old quick action cards/buttons
- Old layout styling
- Old duplicated dashboard action UI

### 4. Refactor Overview Section

Update the Overview section layout and styling.

**Welcome message**

Render a personalized welcome message on the right side of the Overview section.

**Example:** `Welcome back, Ayuel Jok`

**Requirements:**

- Use authenticated user full name
- Keep clean typography
- Match Novacity dashboard theme
- Ensure responsive layout

### 5. Replace Border Bottom with Tabs Navigation

Remove the current bottom border line used under the Overview section.

Instead:

- Create a tabs-based quick navigation system
- The tabs should replace the old quick actions layout

### 6. Dashboard Tabs Navigation

Create reusable dashboard tabs below the Overview section.

**Tabs should include:** Admin Console, New Listing, Manage Listings, Favorites, PassKeys, Browse Marketplace

**Tabs behavior**

**Admin Console tab**

- Only render when authenticated user role is: `role === "admin"`

**Other tabs**

- Available based on authenticated user permissions

**Requirements:**

- Active tab highlighting
- Smooth tab transitions
- Responsive mobile behavior
- Modern SaaS dashboard styling
- Golden accent color support
- Accessible keyboard navigation

### 7. Dashboard UX Improvements

Improve dashboard experience:

- Cleaner spacing
- Better typography hierarchy
- Modern tab navigation styling
- Better responsive layout
- Consistent component spacing
- Proper hover states
- `cursor-pointer` on interactive elements

### 8. Code Cleanup & Architecture

Refactor dashboard-related code:

- Remove duplicated dashboard UI logic
- Keep components modular and reusable
- Use reusable Tabs components
- Follow clean Next.js App Router architecture
- Use Tailwind CSS best practices

Ensure:

- Production-ready dashboard UI
- Clean separation of concerns
- Scalable dashboard structure
- Accessible interactions

**Shipped in codebase (May 13, 2026):** `[DashboardPageView](../../src/features/dashboard/components/DashboardPageView.tsx)` — removed email/role line, **Open admin console** region, and **Quick actions** card block; **Overview** section = title + description (left) and **Welcome back, {full name}** (right); `[DashboardQuickNavTabs](../../src/features/dashboard/components/DashboardQuickNavTabs.tsx)` link row with gold active styling + `aria-current`, horizontal scroll on narrow viewports, **Admin console** only for `role === "admin"`; home `[page.tsx](../../src/app/(dashboard)`/dashboard/page.tsx) composes view only (no `[DashboardHeader](../../src/features/dashboard/components/DashboardHeader.tsx)`); reusable `[tabs](../../src/components/ui/tabs.tsx)` primitive added for future panel-style tabs.

---

## Novacity — Profile Image Upload & Settings Refactor

**Status:** Shipped in codebase (May 13, 2026). **Primary route:** `[/dashboard/settings](../../src/app/(dashboard)`/dashboard/settings/page.tsx). **Related:** Cloudinary patterns in listing image upload (`[06 — Property Listing System](06%20%E2%80%94%20Property%20Listing%20System.md)`); user model / queries (`[05 — Database Models and Server Layer](05%20%E2%80%94%20Database%20Models%20and%20Server%20Layer.md)`); navbar profile (**[03 — Public Layout and Homepage](03%20%E2%80%94%20Public-Layout-and-Homepage.md)**, **Novacity — Navbar Profile Refactor** above).

**Shipped (code):** `[saveProfileImageAction](../../src/features/dashboard/actions/profileImageActions.ts)` + `[uploadProfileImageBuffer](../../src/lib/cloudinary.ts)`; `[UserAvatar](../../src/components/shared/UserAvatar.tsx)`, `[UserAvatarUpload](../../src/features/dashboard/components/UserAvatarUpload.tsx)`, `[SettingsPageView](../../src/features/dashboard/components/SettingsPageView.tsx)`; `[UserNavbarProfile](../../src/components/shared/navigation/UserNavbarProfile.tsx)` uses shared avatar; user `image` field stores secure HTTPS URL (`profileImageUrl` concept); `router.refresh()` after save for navbar; `[userDisplayInitials](../../src/lib/userInitials.ts)`; optional env `[CLOUDINARY_PROFILE_UPLOAD_FOLDER](../../src/lib/cloudinary.ts)`; `[next.config.ts](../../next.config.ts)` `experimental.serverActions.bodySizeLimit` for 5 MB uploads.

Refactor the `/dashboard/settings` page to allow authenticated users to upload and manage their profile image.

### 1. Profile Image Upload in Settings

Update the **Profile** section inside:

```txt
/dashboard/settings
```

Allow authenticated users to:

- Change profile image/avatar
- Upload a new profile image
- Save updated profile image

### 2. Click Avatar to Upload Image

The current profile initials/avatar inside the Profile section should become **clickable**.

**Behavior:**

- When the user clicks the profile initials/avatar:
  - Open the image file picker
  - Allow the user to select a new profile image

**Example:**

```tsx
<UserAvatarUpload />
```

**Requirements:**

- Support image preview **before** saving
- Allow common image formats:
  - PNG
  - JPG
  - JPEG
  - WEBP
- Keep responsive and accessible UI

### 3. Save Changes Workflow

After selecting a new profile image, the user must click:

```txt
Save Changes
```

**Button behavior:**

- Upload image to Cloudinary
- Save image URL to database
- Update authenticated user profile
- Show loading state while uploading
- Show success notification after save
- Show error notification if upload fails

### 4. Cloudinary Integration

Store uploaded profile images in Cloudinary.

**Requirements:**

- Upload real image file to Cloudinary
- Save returned secure image URL into database

**Example (persisted field):**

```ts
profileImageUrl: string
```

**Requirements:**

- Use secure Cloudinary upload flow
- Validate image size and format
- Prevent invalid file uploads

### 5. Navbar Profile Image Sync

After successful upload and save:

- Navbar profile image should automatically update
- Display uploaded profile image instead of initials/avatar fallback

**Behavior:**

- If profile image exists: render uploaded image
- If profile image does not exist: render initials fallback avatar

**Example:**

```tsx
<UserAvatar src={profileImageUrl} />
```

### 6. Profile UX Improvements

Improve profile settings experience:

- Smooth upload interactions
- Better spacing and typography
- Proper hover states
- Image preview section
- Responsive mobile behavior
- Accessible upload controls

**Ensure:**

- `cursor-pointer` on clickable avatar
- Proper loading indicators
- Professional SaaS-style settings UI

### 7. Code Cleanup & Architecture

Refactor profile-related code:

- Remove duplicated avatar logic
- Reuse shared avatar/upload components
- Keep settings components modular
- Follow clean Next.js App Router architecture
- Use Tailwind CSS best practices

**Ensure:**

- Production-ready image upload system
- Clean component separation
- Proper server-side validation
- Scalable profile management structure

---

## Novacity — Sidebar Theme & Navigation Styling Refactor

**Status:** Shipped in codebase (May 14, 2026). **Primary components:** `[DashboardSidebar](../../src/features/dashboard/components/DashboardSidebar.tsx)`, `[DashboardNavLinks](../../src/features/dashboard/components/DashboardNavLinks.tsx)`. **Visual reference:** application footer (`[PublicFooter](../../src/features/home/components/PublicFooter.tsx)` — see **[03 — Public Layout and Homepage](03%20%E2%80%94%20Public-Layout-and-Homepage.md)**). **Admin parity:** `[AdminSidebar](../../src/features/admin/components/AdminSidebar.tsx)`, `[AdminNavLinks](../../src/features/admin/components/AdminNavLinks.tsx)`, mobile sheets in `[DashboardHeader](../../src/features/dashboard/components/DashboardHeader.tsx)` / `[AdminHeader](../../src/features/admin/components/AdminHeader.tsx)`. **Shared styles:** `[sidebarNavStyles.ts](../../src/components/shared/navigation/sidebarNavStyles.ts)`. **Theme:** `[UI-Context.md](../../UI-Context.md)`.

**Shipped (code):** Sidebar / mobile menu use `**bg-primary text-primary-foreground`** (same deep strip as footer); nav links **white** default, **gold** on hover with `transition-all duration-300`; icons **gold** / brighter on hover / **inset ring + glow** when active; `[NotificationBell](../../src/features/notifications/components/NotificationBell.tsx)` `tone="on-primary"` in desktop sidebar; centralized class helpers to avoid duplicated Tailwind.

Refactor the sidebar styling to match the Novacity application theme and improve navigation appearance.

### 1. Sidebar Background Theme

Update the sidebar background color to match the same background style used in the application footer.

**Requirements:**

- Keep consistent branding across the application
- Match footer dark theme styling
- Maintain premium modern SaaS appearance
- Ensure proper contrast and readability

**Design direction:**

- Elegant dark background
- Professional real estate platform look
- Consistent theme system

### 2. Golden Sidebar Icons

Update all sidebar navigation icons to use golden theme colors.

**Requirements:**

- Apply golden color styling to all sidebar icons
- Keep hover and active icon states
- Maintain accessibility and proper contrast
- Ensure icons look clean in both desktop and mobile sidebar layouts

**Example design:**

```txt
Default: Golden icons
Hover: Brighter golden accent
Active: Highlighted golden state
```

### 3. Navigation Link Styling

Update sidebar navigation links styling.

**Requirements:**

- Navigation text color should be white by default
- On hover:
  - Change text color to golden
  - Add smooth transition animation
- Keep active navigation state visually clear

**Example behavior:**

```txt
Default text: White
Hover text: Golden
```

**Requirements:**

- Use consistent typography
- Improve spacing and alignment
- Add modern hover interactions
- Ensure responsive behavior

### 4. Sidebar UX Improvements

Improve overall sidebar experience:

- Better visual hierarchy
- Cleaner navigation spacing
- Smooth hover transitions
- Proper active link highlighting
- Responsive mobile sidebar behavior

**Ensure:**

- Accessible navigation interactions
- `cursor-pointer` on interactive items
- Consistent styling across dashboard pages

### 5. Code Cleanup & Architecture

Refactor sidebar styling code:

- Remove duplicated styles
- Reuse shared navigation components
- Use centralized theme colors
- Follow clean Next.js App Router architecture
- Use Tailwind CSS best practices

**Ensure:**

- Production-ready sidebar UI
- Scalable navigation structure
- Clean component separation

---

# Completion Checklist

- Dashboard layout created
- Sidebar created
- Dashboard overview created
- `**/dashboard/verification`** — owner application + ID upload; animated 3-step progress UI; status `pending` / `approved` / `rejected`; congratulations + approval email on admin approve; **hidden from nav + redirects to overview when already `approved`** (see **Novacity — Owner Verification & Listing Access**)
- Listings management connected
- **Server + UI gate:** unapproved `user` cannot use dashboard marketplace tools (overview, listings, favorites, notifications, settings, PassKeys, create/edit) or publish / set blocked marketing statuses — redirects + nav filtering (May 22, 2026)
- Favorites page created
- Notifications page created (+ verification reminder sync for incomplete applications)
- Settings page created
- Profile image upload & settings refactor (see **Novacity — Profile Image Upload & Settings Refactor** above)
- Sidebar theme & navigation styling refactor (see **Novacity — Sidebar Theme & Navigation Styling Refactor** above)
- Protected access works
- Back / stack-exit navigation (see **Navigation and stack exit (Back)** above) — shared `BackLink` + parent links on secondary dashboard pages
- **Private ID storage** (§3): production signed URLs / non-public bucket (dev `public/uploads/verification` fallback remains)

# Update Tracker

Next file:

09-passkey-system.md