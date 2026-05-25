/**
 * Create or promote an administrator account (local / ops use only).
 *
 * Usage:
 *   1. Set in `.env.local` (never commit real values):
 *      ALLOW_ADMIN_SEED=true
 *      MONGODB_URI=...
 *      SEED_ADMIN_EMAIL=you@example.com
 *      SEED_ADMIN_PASSWORD=at-least-8-chars
 *      SEED_ADMIN_NAME=Site Owner   # optional
 *   2. Run: npm run seed:admin
 *
 * If the email already exists, its role becomes `admin`, password is reset,
 * and `suspendedAt` is cleared. Otherwise a new admin user is created.
 */

import { config } from "dotenv";
import mongoose from "mongoose";

import { normalizeEmail } from "@/features/auth/utils/email";
import { hashPassword } from "@/server/auth/password";
import { connectDB } from "@/server/db/connect";
import { UserModel } from "@/server/models/User";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const requireEnv = (key: string): string => {
  const v = process.env[key]?.trim();
  if (!v) {
    throw new Error(`Missing required env: ${key}`);
  }
  return v;
};

const main = async (): Promise<void> => {
  if (process.env.ALLOW_ADMIN_SEED !== "true") {
    console.error(
      "Refusing to run: set ALLOW_ADMIN_SEED=true in .env.local for this one-time operation.",
    );
    process.exit(1);
  }

  const emailRaw = requireEnv("SEED_ADMIN_EMAIL");
  const password = requireEnv("SEED_ADMIN_PASSWORD");
  if (password.length < 8) {
    console.error("SEED_ADMIN_PASSWORD must be at least 8 characters.");
    process.exit(1);
  }

  const nameFromEnv = process.env.SEED_ADMIN_NAME?.trim();
  const email = normalizeEmail(emailRaw);

  await connectDB();
  const passwordHash = await hashPassword(password);

  const existing = await UserModel.findOne({ email });
  if (existing) {
    const $set: Record<string, unknown> = {
      role: "admin",
      passwordHash,
      suspendedAt: null,
    };
    if (nameFromEnv) {
      $set.name = nameFromEnv;
    }
    await UserModel.updateOne({ _id: existing._id }, { $set });
    console.log(`Updated existing user to admin: ${email}`);
  } else {
    await UserModel.create({
      email,
      passwordHash,
      name: nameFromEnv && nameFromEnv.length > 0 ? nameFromEnv : "Administrator",
      role: "admin",
    });
    console.log(`Created admin user: ${email}`);
  }

  console.log("Done. Sign in at /sign-in with that email and password.");
};

main()
  .catch((err: unknown) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => undefined);
  });
