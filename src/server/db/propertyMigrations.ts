import { PropertyModel } from "@/server/models/Property";

/**
 * Idempotent data fixes after schema changes (listing channel → listingSource, currency).
 * Safe to run on every connect; uses the native collection so legacy keys are visible.
 */
export const runPropertyMigrations = async (): Promise<void> => {
  const coll = PropertyModel.collection;

  await coll.updateMany(
    { listingType: "company" },
    { $set: { listingSource: "novacity" }, $unset: { listingType: "" } },
  );
  await coll.updateMany(
    { listingType: "owner" },
    { $set: { listingSource: "owner" }, $unset: { listingType: "" } },
  );
  await coll.updateMany(
    { listingSource: { $exists: false } },
    { $set: { listingSource: "owner" } },
  );
  await coll.updateMany(
    { listingSource: "rentaler" },
    { $set: { listingSource: "novacity" } },
  );
  await coll.updateMany({ currency: { $exists: false } }, { $set: { currency: "USD" } });
};
