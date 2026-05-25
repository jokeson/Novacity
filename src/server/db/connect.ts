/**
 * Mongo connection helper shared by server models (`UserModel`, `PropertyModel`, etc.).
 * Requires `MONGODB_URI` in `.env.local` — see `.env.example`.
 */
import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var __novacityMongoose: MongooseCache | undefined;
  var __novacityPropertyMigrationsRan: boolean | undefined;
  var __novacityOwnerVerificationUserMigrationRan: boolean | undefined;
}

const getCache = (): MongooseCache => {
  if (!global.__novacityMongoose) {
    global.__novacityMongoose = { conn: null, promise: null };
  }
  return global.__novacityMongoose;
};

export const connectDB = async (): Promise<typeof mongoose> => {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not defined. Add it to your environment (e.g. .env.local).",
    );
  }

  const cached = getCache();

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false })
      .then((instance) => instance);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  if (!globalThis.__novacityPropertyMigrationsRan) {
    globalThis.__novacityPropertyMigrationsRan = true;
    try {
      const { runPropertyMigrations } = await import("@/server/db/propertyMigrations");
      await runPropertyMigrations();
    } catch (error) {
      globalThis.__novacityPropertyMigrationsRan = false;
      console.warn("[Novacity] property migrations failed:", error);
    }
  }

  if (!globalThis.__novacityOwnerVerificationUserMigrationRan) {
    globalThis.__novacityOwnerVerificationUserMigrationRan = true;
    try {
      const { runOwnerVerificationUserMigration } = await import(
        "@/server/db/ownerVerificationUserMigration"
      );
      await runOwnerVerificationUserMigration();
    } catch (error) {
      globalThis.__novacityOwnerVerificationUserMigrationRan = false;
      console.warn("[Novacity] owner verification user migration failed:", error);
    }
  }

  return cached.conn;
};
