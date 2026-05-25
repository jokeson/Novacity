import { randomBytes } from "node:crypto";

import { v2 as cloudinary } from "cloudinary";

const getFolder = (): string =>
  (process.env.CLOUDINARY_UPLOAD_FOLDER ?? "novacity/listings").replace(/^\/+|\/+$/g, "");

const getProfileUploadFolder = (ownerId: string): string => {
  const sanitizedId = ownerId.replace(/[^a-zA-Z0-9_-]/g, "");
  const fromEnv = process.env.CLOUDINARY_PROFILE_UPLOAD_FOLDER?.trim().replace(
    /^\/+|\/+$/g,
    "",
  );
  if (fromEnv && fromEnv.length > 0) {
    return `${fromEnv}/${sanitizedId}`;
  }
  const listingsBase = getFolder();
  const root =
    listingsBase.replace(/\/listings\/?$/i, "").replace(/\/+$/, "") || "novacity";
  return `${root}/profiles/${sanitizedId}`;
};

/** Parse `cloudinary://API_KEY:API_SECRET@CLOUD_NAME` from the dashboard "API environment variable". */
const parseCloudinaryUrl = (
  raw: string,
): { cloud_name: string; api_key: string; api_secret: string } | null => {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("cloudinary://")) {
    return null;
  }
  const rest = trimmed.slice("cloudinary://".length);
  const at = rest.lastIndexOf("@");
  if (at <= 0 || at >= rest.length - 1) {
    return null;
  }
  const cloudName = decodeURIComponent(rest.slice(at + 1).trim());
  const auth = rest.slice(0, at);
  const colon = auth.indexOf(":");
  if (colon <= 0 || colon >= auth.length - 1) {
    return null;
  }
  const apiKey = decodeURIComponent(auth.slice(0, colon).trim());
  const apiSecret = decodeURIComponent(auth.slice(colon + 1).trim());
  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }
  return { cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret };
};

const resolveCloudinaryCredentials = (): {
  cloud_name: string;
  api_key: string;
  api_secret: string;
} | null => {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const key = process.env.CLOUDINARY_API_KEY?.trim();
  const secret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (cloud && key && secret) {
    return { cloud_name: cloud, api_key: key, api_secret: secret };
  }
  const fromUrl = process.env.CLOUDINARY_URL?.trim();
  if (fromUrl) {
    return parseCloudinaryUrl(fromUrl);
  }
  return null;
};

export const isCloudinaryConfigured = (): boolean => resolveCloudinaryCredentials() !== null;

let lastConfiguredFingerprint: string | null = null;

const ensureConfigured = (): void => {
  const creds = resolveCloudinaryCredentials();
  if (!creds) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET, or CLOUDINARY_URL.",
    );
  }
  const fingerprint = `${creds.cloud_name}:${creds.api_key}:${creds.api_secret}`;
  if (lastConfiguredFingerprint !== fingerprint) {
    cloudinary.config({ ...creds, secure: true });
    lastConfiguredFingerprint = fingerprint;
  }
};

/**
 * Uploads an image buffer to Cloudinary. Returns HTTPS URL only (store this in MongoDB).
 */
export const uploadListingImageBuffer = async (
  buffer: Buffer,
  ownerId: string,
): Promise<{ url: string }> => {
  ensureConfigured();
  const suffix = randomBytes(6).toString("hex");
  const folder = `${getFolder()}/${ownerId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: `${Date.now()}-${suffix}`,
        resource_type: "image",
        overwrite: false,
        invalidate: true,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        const url = result?.secure_url;
        if (!url) {
          reject(new Error("Cloudinary returned no secure_url."));
          return;
        }
        resolve({ url });
      },
    );
    stream.end(buffer);
  });
};

/**
 * Profile photos — separate Cloudinary folder from listing images.
 * Returns HTTPS `secure_url` only (store on `User.image`).
 */
export const uploadProfileImageBuffer = async (
  buffer: Buffer,
  ownerId: string,
): Promise<{ url: string }> => {
  ensureConfigured();
  const suffix = randomBytes(6).toString("hex");
  const folder = getProfileUploadFolder(ownerId);

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: `${Date.now()}-${suffix}`,
        resource_type: "image",
        overwrite: false,
        invalidate: true,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        const url = result?.secure_url;
        if (!url) {
          reject(new Error("Cloudinary returned no secure_url."));
          return;
        }
        resolve({ url });
      },
    );
    stream.end(buffer);
  });
};
