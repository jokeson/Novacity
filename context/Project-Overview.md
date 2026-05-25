# Novacity — Project Overview

Last Updated: May 2026

## What is Novacity?

Novacity is a modern real estate platform for South Sudan.

The platform helps:

- Buyers

- Renters

- Property owners

- Real estate companies

Users can:

- Browse properties

- Search listings

- Contact owners

- Save favorites

- Manage listings

Novacity focuses on:

- Trust

- Modern UI

- Mobile responsiveness

- SEO

- Scalability

---

# Main Property Types

The platform supports:

- Houses

- Apartments

- Rental properties

- Commercial buildings

- Land

---

# Main User Roles

## Guest

Can:

- Browse properties

- Search listings

- View property details

Cannot:

- Save favorites

- Create listings

---

## User

Regular account after sign up.

Can:

- Save favorites

- Use dashboard

- Apply for owner verification

Cannot:

- Create listings until approved

---

## Verified Owner

Approved by admin.

Can:

- Create listings

- Manage listings

- Publish properties

Still requires:

- Valid PassKey for publishing

---

## Company

Promoted by admin.

Can:

- Manage company listings

- Publish listings

Company accounts may bypass some owner verification and PassKey rules.

---

## Admin

Manages the platform.

Can:

- Approve owner applications

- Manage users

- Manage listings

- Manage PassKeys

- View analytics

Uses:

- /admin

---

# Main Features

## Public Features

- Homepage

- Property search

- Property filters

- Property details page

- Favorites

- Share listing

- Contact owner

---

## Authentication

Users can:

- Sign up

- Sign in

- Reset password

Authentication uses:

- JWT

- HttpOnly cookies

---

# Dashboard Features

Users can access:

- Favorites

- Notifications

- Settings

- Owner verification

- Listings management

- PassKey redemption

Route:

- /dashboard

---

# Admin Console

Admins manage:

- Users

- Listings

- Owner applications

- PassKeys

- Analytics

Route:

- /admin

---

# Owner Verification System

Before creating listings, users must apply for owner verification.

The applicant submits:

- Full name

- Phone number

- Address

- State/region

- Valid ID

Accepted IDs:

- National ID

- Driver license

- Passport

Application statuses:

- Pending

- Approved

- Rejected

Admins review all applications.

If approved:

- User becomes Verified Owner

- Listing access becomes available

If rejected:

- User receives rejection reason

- User may resubmit application

---

# Listing Rules

Unverified users cannot:

- Create listings

- Publish listings

- Mark listings as:

  - For sale

  - For rent

  - Sold

  - Rented

  - Featured

All listing permissions are enforced on the server.

---

# PassKey System

Verified owners still need a valid PassKey to publish listings.

Rules:

- First publish consumes one PassKey

- PassKeys can expire

- Admin manages PassKeys

Company and admin accounts are exempt.

---

# Property Discovery Flow

## Visitor Journey

Homepage

→ Search properties

→ Open property details

→ Contact owner

→ Sign in if needed

→ Save favorites

---

# Owner Journey

Sign up

→ Sign in

→ Submit owner verification

→ Wait for approval

→ Create listing

→ Publish property using PassKey

---

# State-Based Listings

Listings are connected to states/regions.

Example:

- Lakes listings appear under:

  /states/lakes

This helps:

- SEO

- Regional browsing

- Organization

---

# Notifications

Users receive notifications for:

- Owner application updates

- Listing activity

- Property interest

- Approval/rejection messages

---

# Technology Stack

Frontend:

- Next.js

- React

- TypeScript

- Tailwind CSS

- shadcn/ui

Backend:

- MongoDB

- Mongoose

- Server Actions

- Route Handlers

Validation:

- Zod

- React Hook Form

Deployment:

- Vercel

---

# Engineering Principles

The application uses:

- Feature-based architecture

- Reusable UI components

- Thin routes

- Server-side authorization

- Strong typing

- Clean folder structure

Important rules:

- Never trust client-side authorization

- Validate everything on the server

- Avoid duplicated business logic

- Keep admin and marketplace systems separate

---

# Long-Term Vision

Future plans may include:

- Mobile app

- AI property recommendations

- Mortgage calculator

- Interactive maps

- Advanced analytics

- Payment integrations