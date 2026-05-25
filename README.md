# Novacity

Modern real estate marketplace (Next.js 16, MongoDB, Cloudinary). See `context/` for product and architecture docs.

## Local development

```bash
cp .env.example .env.local
# Fill MONGODB_URI, AUTH_SECRET, and Cloudinary (optional locally if using public/uploads)
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build (run before deploy) |
| `npm run lint` | ESLint |
| `npm run verify:deploy` | Check env vars before Vercel deploy |
| `npm run seed:admin` | Create admin user (local only, see `.env.example`) |

## Deploy on Vercel

1. Push the repo and import it in [Vercel](https://vercel.com/new).
2. Add environment variables from [`.env.example`](.env.example) (see **[docs/DEPLOY-VERCEL.md](docs/DEPLOY-VERCEL.md)**).
3. Run `npm run verify:deploy` locally, then `npm run build`.
4. Deploy. Set `NEXT_PUBLIC_APP_URL` to your production domain and redeploy.

**Required on Vercel:** `MONGODB_URI`, `AUTH_SECRET`, Cloudinary credentials. **Recommended:** `NEXT_PUBLIC_APP_URL`, Resend for emails.

Uploads use Cloudinary on Vercel (local disk under `public/uploads/` is dev-only).

## Learn more

- [Next.js documentation](https://nextjs.org/docs)
- [Vercel deployment](https://nextjs.org/docs/app/building-your-application/deploying)
