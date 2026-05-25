# 09 — PassKey System
Read AGENTS.md before starting ..

# Purpose

Build the PassKey listing access system.

# Goal

Independent property owners must have a valid PassKey before publishing listings.

## Related: cross-cutting refactor (phase 13)

**Canonical spec:** [**13 — Listings, PassKeys & Navigation Refactor**](13%20%E2%80%94%20Listings%20PassKeys%20and%20Navigation%20Refactor.md) (§**3** admin bypass, §**4** bulk generation, §**5** user dashboard banner / server-side gating). Admin UI specifics also in **10**.

# Feature Structure

Create:

src/features/passkeys/
├── actions/
├── components/
├── services/
├── validators/
├── types/
└── utils/

# User Flow

1. User creates account
2. User receives or purchases PassKey
3. User enters PassKey
4. System validates PassKey
5. User gains listing access
6. Expiration is tracked

# Components

Create:

src/features/passkeys/components/
├── PassKeyForm.tsx
├── PassKeyStatusCard.tsx
├── PassKeyExpirationAlert.tsx
├── PassKeyAccessGuard.tsx
└── PassKeyPublishBanner.tsx

# Admin PassKey Management

Admins can:

- Generate PassKeys
- Activate PassKeys
- Expire PassKeys
- Monitor usage
- Assign PassKeys to users

# Rules

- Invalid PassKey denies listing access
- Expired PassKey denies publishing access
- Admin does not need PassKey
- Company listings can be managed separately
- PassKey status must be visible in dashboard

# Completion Checklist

- [ ] PassKey validation works
- [ ] User can enter PassKey
- [ ] PassKey expiration works
- [ ] Listing access guard works
- [ ] Admin can generate PassKeys
- [ ] Admin can activate/expire PassKeys

# Update Tracker

Next file:

10-admin-dashboard.md
