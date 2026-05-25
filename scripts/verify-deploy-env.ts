/**
 * Checks required production environment variables before deploying to Vercel.
 * Run: npm run verify:deploy
 */
import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

type Check = {
  name: string;
  ok: boolean;
  hint: string;
};

const isSet = (key: string): boolean => {
  const value = process.env[key]?.trim();
  return Boolean(value && value.length > 0);
};

const hasAuthSecret = (): boolean => {
  const secret = process.env.AUTH_SECRET?.trim();
  return Boolean(secret && secret.length >= 24);
};

const hasCloudinary = (): boolean => {
  if (isSet("CLOUDINARY_URL")) {
    return true;
  }
  return (
    isSet("CLOUDINARY_CLOUD_NAME") &&
    isSet("CLOUDINARY_API_KEY") &&
    isSet("CLOUDINARY_API_SECRET")
  );
};

const checks: Check[] = [
  {
    name: "MONGODB_URI",
    ok: isSet("MONGODB_URI"),
    hint: "MongoDB Atlas connection string (allow Vercel IPs or 0.0.0.0/0).",
  },
  {
    name: "AUTH_SECRET (24+ chars)",
    ok: hasAuthSecret(),
    hint: "Generate with: openssl rand -base64 32",
  },
  {
    name: "NEXT_PUBLIC_APP_URL (recommended)",
    ok: isSet("NEXT_PUBLIC_APP_URL"),
    hint: "Production URL, e.g. https://your-domain.com — previews can use VERCEL_URL.",
  },
  {
    name: "Cloudinary (required on Vercel for uploads)",
    ok: hasCloudinary(),
    hint: "CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME + API_KEY + API_SECRET.",
  },
  {
    name: "RESEND_API_KEY (optional)",
    ok: isSet("RESEND_API_KEY"),
    hint: "Transactional email; without it, production skips email send.",
  },
  {
    name: "EMAIL_FROM (optional, with Resend)",
    ok: !isSet("RESEND_API_KEY") || isSet("EMAIL_FROM"),
    hint: 'e.g. Novacity <notifications@your-verified-domain.com>',
  },
];

const failed = checks.filter((c) => !c.ok);
const requiredFailed = failed.filter(
  (c) =>
    c.name.startsWith("MONGODB") ||
    c.name.startsWith("AUTH_SECRET") ||
    c.name.startsWith("Cloudinary"),
);

console.log("\nNovacity — Vercel deploy environment check\n");

for (const check of checks) {
  const status = check.ok ? "ok" : "MISSING";
  console.log(`  [${status.padEnd(7)}] ${check.name}`);
  if (!check.ok) {
    console.log(`           → ${check.hint}`);
  }
}

if (requiredFailed.length > 0) {
  console.log(
    "\nFix required variables in Vercel → Project → Settings → Environment Variables.",
  );
  console.log("See docs/DEPLOY-VERCEL.md and .env.example.\n");
  process.exit(1);
}

console.log(
  "\nRequired variables look good. Set NEXT_PUBLIC_APP_URL and Resend before go-live if not already.\n",
);
