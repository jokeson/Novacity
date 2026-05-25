import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { NextResponse } from "next/server";

import { isCloudinaryConfigured, uploadListingImageBuffer } from "@/lib/cloudinary";
import { bufferMatchesDeclaredImageType } from "@/lib/image-magic-bytes";
import { checkRateLimit } from "@/lib/rate-limit";
import { getSession } from "@/server/auth/session";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const sanitizeBaseName = (name: string): string => {
  const base = name.replace(/[^\w.\-]+/g, "_").slice(0, 80);
  return base.length > 0 ? base : "upload";
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
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rate = checkRateLimit(`home-hero-image:${clientKeyFromRequest(req)}`, 20, 60_000);
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

  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type. Use JPEG, PNG, WebP, or GIF." },
      { status: 400 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File is too large (max 5 MB)." },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (!bufferMatchesDeclaredImageType(buffer, file.type)) {
    return NextResponse.json(
      { error: "File content does not match an allowed image type." },
      { status: 400 },
    );
  }

  if (isCloudinaryConfigured()) {
    try {
      const { url } = await uploadListingImageBuffer(buffer, "home-hero");
      return NextResponse.json({ url });
    } catch (err) {
      console.error("[home-hero-image] Cloudinary upload failed:", err);
      return NextResponse.json(
        { error: "Image upload to storage failed. Try again or paste an image URL." },
        { status: 502 },
      );
    }
  }

  if (process.env.VERCEL === "1") {
    return NextResponse.json(
      {
        error:
          "File upload requires Cloudinary on Vercel. Set CLOUDINARY credentials, or paste an HTTPS image URL.",
      },
      { status: 400 },
    );
  }

  const ext =
    file.type === "image/png"
      ? ".png"
      : file.type === "image/webp"
        ? ".webp"
        : file.type === "image/gif"
          ? ".gif"
          : ".jpg";

  const dir = join(process.cwd(), "public", "uploads", "home-hero", session.sub);
  await mkdir(dir, { recursive: true });

  const filename = `${Date.now()}-${sanitizeBaseName(file.name)}${ext}`;
  const absolutePath = join(dir, filename);
  await writeFile(absolutePath, buffer);

  const publicPath = `/uploads/home-hero/${session.sub}/${filename}`;
  return NextResponse.json({ url: publicPath });
};
