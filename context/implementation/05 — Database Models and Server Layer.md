# 05 — Database Models and Server Layer
Read AGENTS.md before starting ..

# Purpose
Create the database foundation and backend architecture.

# Goal

Build clean MongoDB models, server services, queries, repositories, and reusable backend logic.

## Related: cross-cutting refactor (phase 13)

**Canonical spec:** [**13 — Listings, PassKeys & Navigation Refactor**](13%20%E2%80%94%20Listings%20PassKeys%20and%20Navigation%20Refactor.md) (§**7** remove listing channel, §**9** `currency: "SSP" | "USD"` on `Property`, migrations). Implement schema changes here; form and UI in **06** / **07**.

# Server Structure

Use:

src/server/
├── db/
├── models/
├── queries/
├── services/
├── repositories/
└── permissions/




# Models

Create:

src/server/models/
├── User.ts
├── Property.ts
├── PassKey.ts
├── InterestedClient.ts
├── Notification.ts
└── Favorite.ts

# Required Schemas

## User

Fields:

- name
- email
- password
- role
- phone
- image
- savedListings
- createdAt
- updatedAt

## Property
Fields:
- title
- slug
- description
- propertyType
- listingType
- pricingType
- price
- location
- address
- images
- bedrooms
- bathrooms
- status
- ownerId
- companyId
- views
- isFeatured
- expiresAt
- createdAt
- updatedAt

## PassKey
Fields:
- code
- userId
- duration
- isActive
- expiresAt
- usedAt
- createdAt
- updatedAt

## InterestedClient
Fields:
- propertyId
- ownerId
- name
- email
- phone
- message
- status
- createdAt

## Notification
Fields:
- userId
- title
- message
- type
- isRead
- createdAt

# Rules

- Use Mongoose
- Add timestamps
- Add indexes where needed
- Keep schemas typed
- Keep database logic out of UI
- Use repository/service pattern






# Completion Checklist

- [x] User model created
- [x] Property model created
- [x] PassKey model created
- [x] InterestedClient model created
- [x] Notification model created
- [x] Favorite model created
- [x] Server services created
- [x] Queries organized

# Update Tracker

Mark database foundation complete.

Next file:

06-property-listing-system.md
