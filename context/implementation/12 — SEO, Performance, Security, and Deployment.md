# 12 — SEO, Performance, Security, and Deployment
Read AGENTS.md before starting ..

# Purpose

Prepare Novacity for production deployment.

# Goal

Make the platform fast, secure, SEO-friendly, and production-ready.

# SEO Tasks

Implement:

- Dynamic metadata
- Open Graph metadata
- Twitter metadata
- Property structured data
- Sitemap
- Robots.txt
- SEO-friendly slugs

# Performance Tasks

Optimize:

- Images
- Server rendering
- Database queries
- Lazy loading
- Dynamic imports
- Bundle size

# Security Tasks

Implement:

- Route protection
- Role checks
- Zod validation
- Input sanitization
- Secure headers
- Rate limiting
- Upload validation

# Deployment Tasks

Prepare:

- Vercel deployment
- Production environment variables
- MongoDB production database
- Error handling
- Build verification

# Required Checks

Run:

npm run lint
npm run build

Fix all errors before deployment.

# Production Rules

- Never expose secrets
- Never commit .env.local
- Use .env.example
- Validate all server actions
- Protect all admin routes
- Protect all dashboard routes

# Completion Checklist

- [ ] SEO metadata complete
- [ ] Sitemap created
- [ ] Robots.txt created
- [ ] Images optimized
- [ ] Database queries optimized
- [ ] Security checks added
- [ ] Production env configured
- [ ] Build passes
- [ ] Deployed to Vercel

# Update Tracker

Mark project production preparation complete.
