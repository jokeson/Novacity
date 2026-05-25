# 11 — Notification and Interested Client System
Read AGENTS.md before starting ..

# Purpose

Build communication and notification systems.

# Goal

Notify users about important marketplace activity and allow clients to express interest in properties.

# Interested Client Flow

1. Visitor opens property details page
2. Visitor clicks Interested
3. Modal opens
4. Visitor submits contact information
5. Owner/company receives inquiry
6. Client receives thank-you response

# Components

Create:

src/features/interested-clients/components/
├── InterestedClientModal.tsx
├── InterestedClientForm.tsx
└── InterestedClientSuccess.tsx

Create:

src/features/notifications/components/
├── NotificationBell.tsx
├── NotificationList.tsx
├── NotificationItem.tsx
└── NotificationEmptyState.tsx

# Notifications Trigger When

- Listing is expiring
- PassKey is expiring
- Client shows interest
- Listing status changes
- Property becomes sold or rented

# Rules

- Validate all interested client forms
- Do not expose private owner data unnecessarily
- Store inquiries securely
- Notify correct property owner/company
- Keep notification system reusable

# Completion Checklist

- [x] Interested button works
- [x] Interested modal created
- [x] Inquiry saved
- [x] Owner/company notification created
- [x] Thank-you response added
- [x] Notification bell created
- [x] Notification list created

# Update Tracker

Next file:

12-seo-performance-security-and-deployment.md
