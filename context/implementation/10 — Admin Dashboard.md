# 10 — Admin Dashboard
Read AGENTS.md before starting ..

# Purpose

Build the admin control center.

# Goal

Admins can manage the full marketplace.

## Related: cross-cutting refactor (phase 13)

**Canonical spec:** [**13 — Listings, PassKeys & Navigation Refactor**](13%20%E2%80%94%20Listings%20PassKeys%20and%20Navigation%20Refactor.md) (§**1** admin nested nav / Back, §**4** bulk PassKey issue on `/admin/passkeys`, §**3** admin publish without PassKey). **09** owns PassKey domain rules.

# Routes

Create:

src/app/(admin)/admin/page.tsx
src/app/(admin)/admin/users/page.tsx
src/app/(admin)/admin/listings/page.tsx
src/app/(admin)/admin/passkeys/page.tsx
src/app/(admin)/admin/analytics/page.tsx
src/app/(admin)/admin/revenue/page.tsx

# Components

Create:

src/features/admin/components/
├── AdminLayout.tsx
├── AdminSidebar.tsx
├── AdminHeader.tsx
├── AdminHomePageView.tsx
├── AdminQuickNavTabs.tsx
├── AdminStatsCards.tsx
├── UsersTable.tsx
├── ListingsTable.tsx
├── PassKeysTable.tsx
├── AnalyticsCards.tsx
└── RevenueSummary.tsx

# Admin Features

Admins can:

- Manage users
- Suspend users
- Delete accounts
- Manage listings
- Create company listings
- Manage featured listings
- Manage PassKeys
- View analytics
- Track revenue and commissions

# Rules

- Admin routes must be protected
- Only admin role can access
- Admin does not require PassKey
- Use tables for management pages
- Add confirmation modals for destructive actions

# Navigation and stack exit (Back)

Admin pages should handle navigation clearly so operators can **exit nested contexts** (e.g. long tables + dialogs, multi-step flows, mobile sheet navigation) and return to a predictable place inside **`/admin`**.

Requirements:

- On secondary admin screens (or when the main sidebar is not visible on **mobile**), provide a clear **Back** to the appropriate parent (e.g. **← Overview**, **← Users**, **← Listings**) using stable routes under the app’s `ROUTES` / `src/constants/routes.ts` admin paths rather than only history.
- Prefer **`Link`** to a known admin parent over **only** `router.back()` when entry may be direct URL, refresh, or external—so “exit” never drops the user to a blank or wrong zone.
- Modals and overlays should trap focus while open; closing them should return focus sensibly. Destructive flows already use confirmation dialogs; **Back** on the page is separate from **Cancel** inside a dialog.
- Use accessible naming (`aria-label` / visible “Back to …” text), visible hover/focus states, and `cursor-pointer` on clickable controls.
- Keep behavior consistent with dashboard rules in **08 — User Dashboard** where both areas share patterns (e.g. shared header/back component if introduced).

---

## AI / implementation prompt — Novacity — Dashboard Overview & Quick Actions Refactor

**Primary surface:** user [`/dashboard`](../../src/app/(dashboard)/dashboard/page.tsx) overview ([`DashboardPageView`](../../src/features/dashboard/components/DashboardPageView.tsx)). Admin [`/admin`](../../src/app/(admin)/admin/page.tsx) may adopt the same overview + tabs pattern for consistency; cross-ref [**08 — User Dashboard**](08%20%E2%80%94%20User%20Dashboard.md) for shared behavior.

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

**Shipped in codebase (May 13, 2026):** Admin home [`/admin`](../../src/app/(admin)/admin/page.tsx) — [`AdminHomePageView`](../../src/features/admin/components/AdminHomePageView.tsx): **Overview** + description (left), **Welcome back, {name}** (right, from [`getUserByIdLean`](../../src/server/queries/user.queries.ts)); no top [`AdminHeader`](../../src/features/admin/components/AdminHeader.tsx) on overview only; [`AdminQuickNavTabs`](../../src/features/admin/components/AdminQuickNavTabs.tsx) replaces legacy **card link grid** (admin routes + New listing / Favorites / Browse marketplace; gold active states + `aria-current`); [`AdminStatsCards`](../../src/features/admin/components/AdminStatsCards.tsx) unchanged. Subpages still use [`AdminHeader`](../../src/features/admin/components/AdminHeader.tsx).

# Completion Checklist

- [x] Admin layout created
- [x] Admin protection works
- [x] User management created
- [x] Listing management created
- [x] PassKey management created
- [x] Analytics page created
- [x] Revenue page created
- [x] Confirmation modals added (owner verification approve/reject dialogs; destructive admin table flows use existing confirm patterns)
- [x] Back / stack-exit navigation within `/admin` (see **Navigation and stack exit (Back)** above) — **Overview** back link on Users, Listings, Analytics, Revenue, Owner verifications; Pass keys + Home hero already linked

# Update Tracker

Next file:

11-notification-and-interested-client-system.md
 
Novacity — Sidebar & Admin Dashboard Refactor
1. Sidebar UI Enhancement
Restyle the Sign Out button inside the sidebar so it looks cleaner, modern, and professional.
Requirements:
• Improve spacing and alignment
• Add clear hover and active states
• Use consistent dashboard button styling
• Add smooth transition animations
• Ensure mobile responsiveness
• Show cursor: pointer on hover
• Make the Sign Out button visually separated from regular navigation links
2. Golden Sidebar Icons
Update all sidebar navigation icons to use a golden color theme.
Requirements:
• Apply consistent golden styling across all sidebar icons
• Maintain proper contrast and accessibility
• Support active and hover icon states
• Ensure icons work well in dark and light themes
• Keep the design premium, clean, and modern
3. User Profile Section in Sidebar
Allow authenticated users to display a profile image/avatar inside the sidebar.
Requirements:
• Show user profile image/avatar at the top of the sidebar
• Use a fallback avatar if no profile image exists
• Display user name and user role
• Keep layout clean, responsive, and aligned with the dashboard UI
Suggested component: <UserAvatar />
4. Remove Old Authentication Label
Remove this UI text completely from the sidebar:
Signed in as kiirayuel@gmail.com · user
Do not display:
• User email text label
• “Signed in as” section
• Inline role badge beside email
The new profile/avatar section should replace this old layout.
5. Admin Dashboard Statistics
Enhance the admin dashboard with platform statistics and management tools.
Admin should be able to view:
• Total users using the application
• Total listings
• Total rental listings
• Total sale listings
• Total company accounts
• Total revenue/money generated from selling, renting, and related platform activity
• Total PassKeys generated
• Active vs inactive listings
Use clean dashboard cards and analytics layout.
Example cards: Total Users, Total Revenue, Total Rentals, Total Sales, Generated PassKeys.
6. Admin Listing and User Management
Admin should have permission to:
• Delete listings
• Delete users
• Manage company accounts
• Review listing activity
• Monitor application usage
Requirements:
• Add confirmation modal before every destructive delete action
• Protect admin-only actions on the server side
• Never rely only on client-side role checks
7. PassKey Management System
Create admin functionality to generate PassKey codes that allow users to create or publish listings.
Example PassKey format: AX33TY-781DSX
Purpose:
• PassKeys allow users to create/publish listings
• Only admins can generate PassKeys
• PassKeys can later be assigned, activated, or used by users
Admin functionality should include:
• Generate PassKey
• View generated PassKeys
• Activate/deactivate PassKeys
• Delete PassKeys
• View PassKey usage status
Suggested fields:
code: string
isUsed: boolean
createdBy: string
expiresAt?: Date
8. Sidebar UX Improvements
Improve the overall sidebar experience.
Requirements:
• Better spacing between sidebar items
• Cleaner typography
• Smooth hover transitions
• Proper active navigation highlighting
• Responsive mobile sidebar behavior
• Better accessibility support
9. Code Cleanup and Architecture
Refactor related sidebar and admin dashboard code.
Requirements:
• Remove duplicated styling
• Reuse shared sidebar/admin components
• Keep components modular and scalable
• Follow clean Next.js App Router architecture
• Use Tailwind CSS best practices
• Add proper loading and error states
• Keep the final UI production-ready

Novacity — Navbar Profile Refactor (admin parity)

**Status:** Implemented in codebase (May 2026). Primary spec: [**03 — Public Layout and Homepage**](03%20%E2%80%94%20Public-Layout-and-Homepage.md) section **Novacity — Navbar Profile Refactor**. Dashboard cleanup: [**08 — User Dashboard**](08%20%E2%80%94%20User%20Dashboard.md).

- [`(admin)/layout`](../../src/app/(admin)/layout.tsx) composes [`Navbar`](../../src/components/shared/navigation/Navbar.tsx) + top offset on [`AdminLayout`](../../src/features/admin/components/AdminLayout.tsx) (same pattern as `(dashboard)`).
- Profile identity UI removed from [`AdminSidebar`](../../src/features/admin/components/AdminSidebar.tsx) and [`AdminHeader`](../../src/features/admin/components/AdminHeader.tsx) mobile sheet; **Sign out** only in the global navbar / mobile menu sheet.
- **Supersedes placement** in **Novacity — Sidebar & Admin Dashboard Refactor** §**3. User Profile Section in Sidebar** below: profile lives in the Navbar; admin sidebar stays **navigation-focused** (golden icons, spacing, etc. from that doc still apply).

---

# Novacity — Owner Verification & Listing Approval System

Refactor the listing access workflow to introduce an owner verification and approval system before users can create or publish listings.

---

# 1. Restrict Listing Access for New Users

When a user creates an account, they should NOT immediately gain access to:

```txt
/dashboard/listings/create
```

New users (owners) must first complete a verification/application process before they are allowed to create or publish listings.

Until approved:

* User cannot create listings
* User cannot publish properties
* User cannot mark properties as:

  * For Rent
  * For Sale
  * Sold
  * Rented
  * Featured
  * New Listing

---

# 2. Owner Verification Application Form

Before accessing listing creation features, authenticated users must complete an application form.

The application form should collect:

```txt
Full Name
Phone Number
Residential Address
State/Region where user wants to post listings
```

---

# 3. Valid Identification Upload

Applicants must upload a valid identification document.

## South Sudanese Applicants

Accepted IDs:

* National ID
* Driver License

## Non-South Sudanese Applicants

Accepted ID:

* Passport

Requirements:

* Secure document upload
* Store uploaded documents safely
* Validate supported file types
* Allow image or PDF uploads

Example:

```tsx
<ApplicantVerificationForm />
```

---

# 4. Application Submission Workflow

After user completes the verification form:

* Submit application to Novacity admin
* Save application status in database

Example statuses:

```ts
status: "pending" | "approved" | "rejected"
```

After submission:

* User should see pending review notification
* Listing creation page remains locked until approval

Example message:

```txt
Your application has been submitted and is awaiting admin approval.
```

---

# 5. Admin Verification Review System

**Shipped in codebase (May 14, 2026):** [`/admin/owner-verifications`](../../src/app/(admin)/admin/owner-verifications/page.tsx) — [`listOwnerVerificationApplicationsWithUsers`](../../src/server/repositories/ownerVerification.repository.ts) with **`?status=`** `pending` \| `approved` \| `rejected` \| `all` (default pending); [`AdminOwnerVerificationFilterTabs`](../../src/features/admin/components/AdminOwnerVerificationFilterTabs.tsx); [`AdminOwnerVerificationRow`](../../src/features/admin/components/AdminOwnerVerificationRow.tsx) shows address, nationality, ID type, status badge, rejection copy; **approve** / **reject** confirmation **dialogs** for pending rows.

Admin accounts should receive notifications when a new verification application is submitted.

Admin functionality:

* View submitted applications
* Review applicant details
* Review uploaded ID documents
* Approve application
* Reject application

Requirements:

* Protected admin-only access
* Clean review dashboard
* Application filtering and status tracking

---

# 6. Application Approval Logic

## If Approved

When admin approves application:

* User gains access to:

```txt
/dashboard/listings/create
```

* User can start creating and publishing listings

## If Rejected

If admin rejects application:

* User receives rejection notification
* Display rejection reason/message

Example:

```txt
Your application was rejected. Please upload a clearer identification document.
```

Requirements:

* Store rejection reason in database
* Allow applicant to resubmit application later

---

# 7. State-Based Listing Rendering

Listings should render according to the state/region selected by the owner during listing creation.

Example:

* If user selects:

```txt
Lakes
```

Then the listing should automatically appear in:

```txt
/states/lakes
```

Requirements:

* Dynamically organize listings by state
* Keep state pages synchronized with listing database
* Prevent duplicate state records
* Maintain SEO-friendly route structure

Suggested route structure:

```txt
/states/[state]
```

---

# 8. Notifications System

Create notification support for:

* Application submitted
* Application approved
* Application rejected
* Missing verification status

Admin notifications:

* New application submitted
* Pending application reviews

User notifications:

* Approval status updates
* Rejection reasons
* Listing access enabled

---

# 9. Security & Validation Rules

Requirements:

* Protect listing routes server-side
* Never trust client-side verification status
* Validate uploads securely
* Restrict unapproved users from listing APIs
* Use role + verification middleware checks

Example:

```ts
if (!user.isVerifiedOwner) {
  redirect("/dashboard/verification");
}
```

---

# 10. Code Cleanup & Architecture

Refactor verification and listing-access logic:

* Keep components modular and reusable
* Separate verification logic from listing logic
* Use reusable upload components
* Follow clean Next.js App Router architecture
* Use Tailwind CSS best practices

Ensure:

* Production-ready verification system
* Scalable approval workflow
* Clean admin review experience
* Responsive UI and proper loading states


