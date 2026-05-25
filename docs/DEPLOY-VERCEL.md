# Deploy Novacity on Vercel

This app is a **Next.js 16** project with **MongoDB**, **JWT sessions**, and **Cloudinary** uploads. Vercel is the recommended host.

## Prerequisites

- [Vercel](https://vercel.com) account
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (or compatible hosted MongoDB)
- [Cloudinary](https://cloudinary.com) account (required for image/document uploads on Vercel)
- Optional: [Resend](https://resend.com) for owner-verification approval emails

## 1. Push code to Git

Connect the repository to Vercel (GitHub, GitLab, or Bitbucket). The root directory is the repo root; framework preset **Next.js** is auto-detected.

## 2. Configure environment variables

In **Vercel → Project → Settings → Environment Variables**, add the variables from [`.env.example`](../.env.example) for **Production** (and **Preview** if you use preview deployments).

| Variable | Required | Notes |
|----------|----------|--------|
| `MONGODB_URI` | Yes | Atlas: Network Access → allow `0.0.0.0/0` or use Vercel’s egress IPs; use a dedicated DB user. |
| `AUTH_SECRET` | Yes | At least 24 characters; use `openssl rand -base64 32`. |
| `NEXT_PUBLIC_APP_URL` | Recommended | Production canonical URL, e.g. `https://novacity.example.com`. |
| `CLOUDINARY_*` or `CLOUDINARY_URL` | Yes on Vercel | Local disk uploads are disabled when `VERCEL=1`. |
| `RESEND_API_KEY` | Optional | Approval emails; skipped in production if unset. |
| `EMAIL_FROM` | Optional | Verified sender in Resend, e.g. `Novacity <notifications@your-domain.com>`. |

Vercel sets `VERCEL=1` and `VERCEL_URL` automatically. If `NEXT_PUBLIC_APP_URL` is unset, metadata and sitemap use `https://${VERCEL_URL}` for preview deployments.

Validate locally (with `.env.local` loaded):

```bash
npm run verify:deploy
```

## 3. Build settings

Defaults (also in [`vercel.json`](../vercel.json)):

| Setting | Value |
|---------|--------|
| Framework | Next.js |
| Build command | `npm run build` |
| Install command | `npm ci` |
| Node.js | 20.x (see [`.nvmrc`](../.nvmrc)) |

Before your first deploy:

```bash
npm run lint
npm run build
npm run verify:deploy
```

## 4. Deploy

1. Import the repo in [Vercel New Project](https://vercel.com/new).
2. Add environment variables.
3. Deploy.

After deploy, set `NEXT_PUBLIC_APP_URL` to your production domain (including custom domain) and redeploy so Open Graph, sitemap, and canonical URLs are correct.

## 5. Post-deploy

### Create an admin user

Do **not** enable public admin signup. From your machine (not Vercel):

```bash
ALLOW_ADMIN_SEED=true SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD='strong-password' npm run seed:admin
```

Use the same `MONGODB_URI` as production. Remove `ALLOW_ADMIN_SEED` after seeding.

### MongoDB Atlas

- Use a production database name/user with least privilege.
- Enable backups and monitoring.
- Restrict network access when possible; serverless needs broad IP allowlisting unless you use Atlas + Vercel private networking.

### Cloudinary

- Configure upload folders via `CLOUDINARY_UPLOAD_FOLDER` / `CLOUDINARY_PROFILE_UPLOAD_FOLDER` if needed (defaults in code).
- `res.cloudinary.com` is already allowed in `next.config.ts` `images.remotePatterns`.

### Custom domain

Add the domain in Vercel → Domains, then update `NEXT_PUBLIC_APP_URL` and redeploy.

## 6. What works differently on Vercel

- **Uploads**: Listing images, profile photos, home hero, and verification documents require Cloudinary (or HTTPS URLs for listings). Files are not written to `public/uploads/` on Vercel.
- **Sessions**: Cookies use `secure: true` in production (`NODE_ENV=production`).
- **Database**: Mongoose connection is cached per serverless instance (`src/server/db/connect.ts`).
- **Sitemap**: If the DB is unreachable at build/runtime, static routes are still emitted; property URLs are added when MongoDB is available.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails TypeScript/lint | Run `npm run build` locally and fix errors. |
| `MONGODB_URI is not defined` at runtime | Add `MONGODB_URI` in Vercel env for Production/Preview. |
| Upload API returns Cloudinary message | Set Cloudinary env vars; redeploy. |
| Wrong links in emails / OG tags | Set `NEXT_PUBLIC_APP_URL` to production URL. |
| Atlas connection timeout | Allow Vercel IPs / `0.0.0.0/0`; check URI and user password encoding. |

## Security checklist

- Never commit `.env.local` or secrets.
- Use strong `AUTH_SECRET` and rotate if compromised.
- Keep `ALLOW_ADMIN_SEED` off in production; run seed only locally with production URI when needed.
- Protect `/admin` and `/dashboard` (middleware + server-side role checks).
