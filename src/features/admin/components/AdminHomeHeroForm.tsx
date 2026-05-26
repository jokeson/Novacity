"use client";

import Image from "next/image";
import { useMemo, useState, useTransition } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  adminUpsertHomeHeroAction,
  type AdminHomeHeroMutationError,
} from "@/features/admin/actions/homeHeroAdminActions";
import type { ResolvedHomeHeroContent } from "@/features/home/types/homeHero";
import { isAllowedHeroImageUrl } from "@/features/home/validators/homeHeroSchema";
import { cn } from "@/lib/utils";

export type AdminHomeHeroFormProps = {
  initialValues: ResolvedHomeHeroContent;
};

export const AdminHomeHeroForm = ({ initialValues }: AdminHomeHeroFormProps) => {
  const [eyebrow, setEyebrow] = useState(initialValues.eyebrow);
  const [heading, setHeading] = useState(initialValues.heading);
  const [body, setBody] = useState(initialValues.body);
  const [imageUrl, setImageUrl] = useState(initialValues.imageUrl);
  const [imageAlt, setImageAlt] = useState(initialValues.imageAlt);
  const [rootError, setRootError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[] | undefined>>({});
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();

  const previewSrc = useMemo(() => imageUrl.trim(), [imageUrl]);
  const canPreview = previewSrc.length > 0 && isAllowedHeroImageUrl(previewSrc);

  const handleUploadFiles = async (fileList: FileList | null) => {
    setRootError(null);
    if (!fileList?.length) {
      return;
    }
    const file = fileList[0];
    if (!file) {
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/home-hero-image", {
        method: "POST",
        body: formData,
      });
      const payload = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !payload.url) {
        throw new Error(payload.error ?? "Upload failed.");
      }
      setImageUrl(payload.url);
      setFieldErrors((prev) => ({ ...prev, imageUrl: undefined }));
    } catch (e) {
      setRootError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRootError(null);
    setFieldErrors({});
    setSuccess(false);
    startTransition(async () => {
      const res = await adminUpsertHomeHeroAction({
        eyebrow,
        heading,
        body,
        imageUrl,
        imageAlt,
      });
      if (res.ok) {
        setSuccess(true);
        return;
      }
      const err = res as AdminHomeHeroMutationError;
      if (err.fieldErrors) {
        setFieldErrors(err.fieldErrors);
      }
      setRootError(err.message ?? "Something went wrong.");
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border-border space-y-6 rounded-2xl border p-6 shadow-sm sm:p-8"
      noValidate
    >
      <div className="space-y-1">
        <h2 className="font-heading text-foreground text-xl font-semibold">Hero content</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          This controls the top banner on the public home page. Image URLs must be HTTPS from
          Unsplash or Cloudinary, or an uploaded path under{" "}
          <span className="text-foreground font-medium">/uploads/</span>.
        </p>
      </div>

      {rootError ? (
        <p className="text-destructive text-sm font-medium" role="alert">
          {rootError}
        </p>
      ) : null}

      {success ? (
        <p className="text-primary text-sm font-medium" role="status">
          Saved. The homepage will show the updated hero on the next visit.
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="hero-eyebrow">Eyebrow / kicker</Label>
          <Input
            id="hero-eyebrow"
            name="eyebrow"
            value={eyebrow}
            onChange={(e) => setEyebrow(e.target.value)}
            autoComplete="off"
            maxLength={120}
            className="cursor-text"
            aria-invalid={Boolean(fieldErrors.eyebrow?.length)}
            aria-describedby={fieldErrors.eyebrow?.length ? "hero-eyebrow-error" : undefined}
          />
          {fieldErrors.eyebrow?.[0] ? (
            <p id="hero-eyebrow-error" className="text-destructive text-xs">
              {fieldErrors.eyebrow[0]}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="admin-hero-heading">Main heading (H1)</Label>
          <Input
            id="admin-hero-heading"
            name="heading"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            autoComplete="off"
            maxLength={200}
            required
            className="cursor-text"
            aria-invalid={Boolean(fieldErrors.heading?.length)}
            aria-describedby={fieldErrors.heading?.length ? "admin-hero-heading-error" : undefined}
          />
          {fieldErrors.heading?.[0] ? (
            <p id="admin-hero-heading-error" className="text-destructive text-xs">
              {fieldErrors.heading[0]}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="hero-body">Supporting paragraph</Label>
        <Textarea
          id="hero-body"
          name="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          maxLength={900}
          required
          className="cursor-text resize-y"
          aria-invalid={Boolean(fieldErrors.body?.length)}
          aria-describedby={fieldErrors.body?.length ? "hero-body-error" : undefined}
        />
        {fieldErrors.body?.[0] ? (
          <p id="hero-body-error" className="text-destructive text-xs">
            {fieldErrors.body[0]}
          </p>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="hero-image-url">Hero image URL</Label>
            <Input
              id="hero-image-url"
              name="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              autoComplete="off"
              required
              className="cursor-text"
              aria-invalid={Boolean(fieldErrors.imageUrl?.length)}
              aria-describedby={
                fieldErrors.imageUrl?.length ? "hero-image-url-error" : undefined
              }
            />
            {fieldErrors.imageUrl?.[0] ? (
              <p id="hero-image-url-error" className="text-destructive text-xs">
                {fieldErrors.imageUrl[0]}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              id="hero-image-file"
              disabled={uploading || pending}
              onChange={(e) => {
                void handleUploadFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <label
              htmlFor="hero-image-file"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "cursor-pointer",
                (uploading || pending) && "pointer-events-none opacity-50",
              )}
            >
              {uploading ? "Uploading…" : "Upload image"}
            </label>
          </div>
          {canPreview ? (
            <div className="border-border relative mt-2 aspect-[4/3] max-w-md overflow-hidden rounded-xl border-2 shadow-none">
              <Image
                src={previewSrc}
                alt={imageAlt.trim() || "Hero preview"}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 400px"
              />
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              Enter a valid image URL or upload a file to preview the hero image.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="hero-image-alt">Image alt text</Label>
          <Textarea
            id="hero-image-alt"
            name="imageAlt"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
            rows={3}
            maxLength={220}
            required
            className="cursor-text resize-y"
            aria-invalid={Boolean(fieldErrors.imageAlt?.length)}
            aria-describedby={
              fieldErrors.imageAlt?.length ? "hero-image-alt-error" : undefined
            }
          />
          {fieldErrors.imageAlt?.[0] ? (
            <p id="hero-image-alt-error" className="text-destructive text-xs">
              {fieldErrors.imageAlt[0]}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <Button type="submit" variant="gold" disabled={pending || uploading} className="cursor-pointer">
          {pending ? "Saving…" : "Save hero"}
        </Button>
      </div>
    </form>
  );
};
