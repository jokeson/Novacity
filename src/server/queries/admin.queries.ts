import { MARKETING_PROPERTY_STATUSES } from "@/constants/propertyMarket";
import { connectDB } from "@/server/db/connect";
import { PassKeyModel } from "@/server/models/PassKey";
import { PropertyModel } from "@/server/models/Property";
import { UserModel } from "@/server/models/User";

export const countAllUsers = async (): Promise<number> => {
  await connectDB();
  return UserModel.countDocuments();
};

export const countSuspendedUsers = async (): Promise<number> => {
  await connectDB();
  return UserModel.countDocuments({
    suspendedAt: { $ne: null },
  });
};

export const countAllProperties = async (): Promise<number> => {
  await connectDB();
  return PropertyModel.countDocuments();
};

export const countFeaturedProperties = async (): Promise<number> => {
  await connectDB();
  return PropertyModel.countDocuments({ isFeatured: true });
};

export const countCompanyUsers = async (): Promise<number> => {
  await connectDB();
  return UserModel.countDocuments({ role: "company" });
};

export const countAllPassKeys = async (): Promise<number> => {
  await connectDB();
  return PassKeyModel.countDocuments();
};

export const countRentalPipelineListings = async (): Promise<number> => {
  await connectDB();
  return PropertyModel.countDocuments({
    status: { $in: ["for-rent", "rented"] },
  });
};

export const countSalePipelineListings = async (): Promise<number> => {
  await connectDB();
  return PropertyModel.countDocuments({
    status: { $in: ["for-sale", "sold"] },
  });
};

export const countMarketingListings = async (): Promise<number> => {
  await connectDB();
  return PropertyModel.countDocuments({
    status: { $in: MARKETING_PROPERTY_STATUSES },
  });
};

export const countNonMarketingListings = async (): Promise<number> => {
  await connectDB();
  return PropertyModel.countDocuments({
    status: { $nin: MARKETING_PROPERTY_STATUSES },
  });
};

export type ListingStatusCount = {
  status: string;
  count: number;
};

export const getListingStatusBreakdown = async (): Promise<ListingStatusCount[]> => {
  await connectDB();
  const rows = await PropertyModel.aggregate<{ _id: string; count: number }>([
    { $group: { _id: "$status", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  return rows.map((r) => ({ status: r._id, count: r.count }));
};

export const getTotalPriceVolume = async (): Promise<number> => {
  await connectDB();
  const [row] = await PropertyModel.aggregate<{ total: number }>([
    { $group: { _id: null, total: { $sum: "$price" } } },
  ]);
  return row?.total ?? 0;
};

/** Sum of listing prices where `currency` is SSP (South Sudanese pound). */
export const getTotalSspPriceVolume = async (): Promise<number> => {
  await connectDB();
  const [row] = await PropertyModel.aggregate<{ total: number }>([
    { $match: { currency: "SSP" } },
    { $group: { _id: null, total: { $sum: "$price" } } },
  ]);
  return row?.total ?? 0;
};

const SSP_NON_RENTAL_STATUSES = ["for-rent", "rented"] as const;

/**
 * SSP listing prices excluding rentals (`for-rent`, `rented`) — sale / ownership market value proxy.
 */
export const getTotalSspNonRentalMarketValue = async (): Promise<number> => {
  await connectDB();
  const [row] = await PropertyModel.aggregate<{ total: number }>([
    {
      $match: {
        currency: "SSP",
        status: { $nin: SSP_NON_RENTAL_STATUSES },
      },
    },
    { $group: { _id: null, total: { $sum: "$price" } } },
  ]);
  return row?.total ?? 0;
};
