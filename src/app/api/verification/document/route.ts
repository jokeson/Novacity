import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { NextResponse } from "next/server";

import { isCloudinaryConfigured, uploadListingImageBuffer } from "@/lib/cloudinary";
import { bufferMatchesDeclaredImageType } from "@/lib/image-magic-bytes";
import { checkRateLimit } from "@/lib/rate-limit";
import { getSession } from "@/server/auth/session";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_BYTES = 10 * 1024 * 1024;
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const PDF_TYPE = "application/pdf";

const isPdfBuffer = (buffer: Buffer): boolean =>
  buffer.length >= 5 &&
  buffer[0] === 0x25 &&
  buffer[1] === 0x50 &&
  buffer[2] === 0x44 &&
  buffer[3] === 0x46 &&
  buffer[4] === 0x2d;

const sanitizeBaseName = (name: string): string => {
  const base = name.replace(/[^\w.\-]+/g, "_").slice(0, 80);
  return base.length > 0 ? base : "id-document";
};

const clientKeyFromRequest = (req: Request): string => {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return req.headers.get("x-real-ip") ?? "unknown";
};

export const POST = async (req: Request): Promise<Response> => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rate = checkRateLimit(
    `verification-doc:${clientKeyFromRequest(req)}`,
    20,
    60_000,
  );
  if (!rate.ok) {
    const retrySec = Math.max(1, Math.ceil(rate.retryAfterMs / 1000));
    return NextResponse.json(
      { error: "Too many uploads. Try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(retrySec) },
      },
    );
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file field." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File is too large (max 10 MB)." },
      { status: 400 },
    );
  }

  let effectiveType = file.type;

  if (IMAGE_TYPES.has(file.type)) {
    if (!bufferMatchesDeclaredImageType(buffer, file.type)) {
      return NextResponse.json(
        { error: "File content does not match an allowed image type." },
        { status: 400 },
      );
    }
  } else if (file.type === PDF_TYPE || file.name.toLowerCase().endsWith(".pdf")) {
    if (!isPdfBuffer(buffer)) {
      return NextResponse.json(
        { error: "Invalid PDF file." },
        { status: 400 },
      );
    }
    effectiveType = PDF_TYPE;
  } else {
    return NextResponse.json(
      { error: "Unsupported file type. Use JPEG, PNG, WebP, GIF, or PDF." },
      { status: 400 },
    );
  }

  if (isCloudinaryConfigured() && IMAGE_TYPES.has(effectiveType)) {
    try {
      const { url } = await uploadListingImageBuffer(buffer, session.sub);
      return NextResponse.json({ url });
    } catch (err) {
      console.error("[verification-doc] Cloudinary upload failed:", err);
      return NextResponse.json(
        { error: "Upload to storage failed. Try again." },
        { status: 502 },
      );
    }
  }

  if (process.env.VERCEL === "1") {
    return NextResponse.json(
      {
        error:
          "ID uploads on production require Cloudinary for images, or contact support for document onboarding.",
      },
      { status: 503 },
    );
  }

  const uploadsDir = join(process.cwd(), "public", "uploads", "verification");
  await mkdir(uploadsDir, { recursive: true });
  const ext =
    effectiveType === PDF_TYPE
      ? "pdf"
      : effectiveType === "image/png"
        ? "png"
        : effectiveType === "image/webp"
          ? "webp"
          : effectiveType === "image/gif"
            ? "gif"
            : "jpg";
  const safe = `${session.sub}-${Date.now()}-${sanitizeBaseName(file.name)}.${ext}`;
  const diskPath = join(uploadsDir, safe);
  await writeFile(diskPath, buffer);
  const publicPath = `/uploads/verification/${safe}`;
  return NextResponse.json({ url: publicPath });
};
