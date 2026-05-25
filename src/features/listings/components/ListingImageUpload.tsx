"use client";

import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PROPERTY_DEFAULTS } from "@/constants/property";
import type { ListingFormValues } from "@/features/listings/validators/listingSchema";
import { cn } from "@/lib/utils";

const MAX_IMAGES = PROPERTY_DEFAULTS.maxImages;

const uploadFiles = async (files: FileList | File[]) => {
  const list = Array.from(files);
  const urls: string[] = [];
  for (const file of list) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/listings/images", {
      method: "POST",
      body: formData,
    });
    const body = (await res.json()) as { url?: string; error?: string };
    if (!res.ok || !body.url) {
      throw new Error(body.error ?? "Upload failed.");
    }
    urls.push(body.url);
  }
  return urls;
};

const padSlotImages = (images: string[], slotCount: number): string[] =>
  Array.from({ length: slotCount }, (_, index) => images[index] ?? "");

export type ListingImageUploadProps = {
  className?: string;
  /** Fixed slot grid for create listing (icon per slot). */
  slotCount?: number;
};

const ListingImageSlotUpload = ({
  className,
  slotCount,
}: Required<Pick<ListingImageUploadProps, "slotCount">> & { className?: string }) => {
  const { control, setValue, getValues } = useFormContext<ListingFormValues>();
  const images = useWatch({ control, name: "images", defaultValue: [] }) ?? [];
  const [message, setMessage] = useState<string | null>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const slotImages = padSlotImages(images, slotCount);
  const filledCount = slotImages.filter(Boolean).length;

  const persistSlots = useCallback(
    (nextSlots: string[]) => {
      setValue("images", nextSlots, { shouldValidate: true, shouldDirty: true });
    },
    [setValue],
  );

  const handleOpenSlotPicker = (index: number): void => {
    if (uploadingIndex !== null) {
      return;
    }
    inputRefs.current[index]?.click();
  };

  const handleSlotKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ): void => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleOpenSlotPicker(index);
    }
  };

  const handleSlotFileSelected = useCallback(
    async (index: number, fileList: FileList | null) => {
      setMessage(null);
      const file = fileList?.[0];
      if (!file) {
        return;
      }

      setUploadingIndex(index);
      try {
        const [url] = await uploadFiles([file]);
        const nextSlots = padSlotImages(getValues("images") ?? [], slotCount);
        nextSlots[index] = url;
        persistSlots(nextSlots);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Upload failed.");
      } finally {
        setUploadingIndex(null);
        const input = inputRefs.current[index];
        if (input) {
          input.value = "";
        }
      }
    },
    [getValues, persistSlots, slotCount],
  );

  const handleRemoveSlot = useCallback(
    (index: number) => {
      const nextSlots = padSlotImages(getValues("images") ?? [], slotCount);
      nextSlots[index] = "";
      persistSlots(nextSlots);
    },
    [getValues, persistSlots, slotCount],
  );

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div>
        <Label className="text-base">Property photos</Label>
        <p className="text-muted-foreground mt-1 text-sm">
          Add exactly {slotCount} photos. Tap the gold icon on each slot to choose an image
          (JPEG, PNG, WebP, GIF). The first photo appears as the cover image.
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {slotImages.map((src, index) => {
          const inputId = `listing-image-slot-${index}`;
          const isUploading = uploadingIndex === index;

          return (
            <li key={inputId}>
              <Input
                ref={(node) => {
                  inputRefs.current[index] = node;
                }}
                id={inputId}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                disabled={isUploading}
                className="sr-only"
                onChange={(event) => void handleSlotFileSelected(index, event.target.files)}
              />
              {src ? (
                <div className="border-border group relative overflow-hidden rounded-2xl border bg-background shadow-sm">
                  <div className="bg-muted relative aspect-[4/3] w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element -- owner uploads */}
                    <img
                      src={src}
                      alt={`Listing photo ${index + 1}`}
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex justify-between gap-2 bg-gradient-to-t from-black/65 to-transparent p-2 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
                    <span className="text-[10px] font-medium text-white/90">
                      Photo {index + 1}
                      {index === 0 ? " · Cover" : ""}
                    </span>
                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      className="size-8 rounded-lg shadow-md"
                      aria-label={`Remove photo ${index + 1}`}
                      onClick={() => handleRemoveSlot(index)}
                    >
                      <Trash2 className="size-3.5" aria-hidden />
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={isUploading}
                  aria-label={`Add photo ${index + 1}`}
                  aria-describedby={`${inputId}-hint`}
                  onClick={() => handleOpenSlotPicker(index)}
                  onKeyDown={(event) => handleSlotKeyDown(event, index)}
                  className={cn(
                    "border-border bg-muted/30 text-gold hover:border-gold hover:bg-gold/10 focus-visible:ring-ring flex aspect-[4/3] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed transition-all duration-300 focus-visible:ring-3 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60",
                    isUploading && "border-gold/60 bg-gold/5",
                  )}
                >
                  {isUploading ? (
                    <Loader2 className="size-7 animate-spin" aria-hidden />
                  ) : (
                    <ImagePlus className="size-8" strokeWidth={1.5} aria-hidden />
                  )}
                  <span className="text-muted-foreground text-[11px] font-medium">
                    {isUploading ? "Uploading…" : `Photo ${index + 1}`}
                  </span>
                </button>
              )}
              <span id={`${inputId}-hint`} className="sr-only">
                Opens file picker for photo slot {index + 1}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="text-muted-foreground text-xs">
        {filledCount} of {slotCount} photos added
      </p>

      {message ? (
        <p className="text-destructive text-sm" role="alert">
          {message}
        </p>
      ) : null}
    </div>
  );
};

const ListingImageFlexibleUpload = ({ className }: { className?: string }) => {
  const { control, setValue, getValues } = useFormContext<ListingFormValues>();
  const images = useWatch({ control, name: "images", defaultValue: [] }) ?? [];
  const [urlDraft, setUrlDraft] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleAddUrl = useCallback(() => {
    setMessage(null);
    const next = urlDraft.trim();
    if (!next) {
      setMessage("Paste an image URL first.");
      return;
    }
    const current = getValues("images") ?? [];
    if (current.length >= MAX_IMAGES) {
      setMessage(`You can add at most ${MAX_IMAGES} images.`);
      return;
    }
    if (current.includes(next)) {
      setMessage("That URL is already in the list.");
      return;
    }
    setValue("images", [...current, next], {
      shouldValidate: true,
      shouldDirty: true,
    });
    setUrlDraft("");
  }, [getValues, setValue, urlDraft]);

  const handleRemove = useCallback(
    (index: number) => {
      const current = getValues("images") ?? [];
      setValue(
        "images",
        current.filter((_, i) => i !== index),
        { shouldValidate: true, shouldDirty: true },
      );
    },
    [getValues, setValue],
  );

  const appendUploaded = useCallback(
    (urls: string[]) => {
      const current = getValues("images") ?? [];
      const merged = [...current];
      for (const url of urls) {
        if (merged.length >= MAX_IMAGES) {
          break;
        }
        if (!merged.includes(url)) {
          merged.push(url);
        }
      }
      setValue("images", merged, { shouldValidate: true, shouldDirty: true });
    },
    [getValues, setValue],
  );

  const handleFilesSelected = useCallback(
    async (fileList: FileList | null) => {
      setMessage(null);
      if (!fileList?.length) {
        return;
      }
      const current = getValues("images") ?? [];
      const room = MAX_IMAGES - current.length;
      if (room <= 0) {
        setMessage(`You can add at most ${MAX_IMAGES} images.`);
        return;
      }
      const slice = Array.from(fileList).slice(0, room);
      setUploading(true);
      try {
        const urls = await uploadFiles(slice);
        appendUploaded(urls);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Upload failed.");
      } finally {
        setUploading(false);
      }
    },
    [appendUploaded, getValues],
  );

  const handleDrop = useCallback(
    async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDragActive(false);
      const files = event.dataTransfer.files;
      if (!files?.length) {
        return;
      }
      await handleFilesSelected(files);
    },
    [handleFilesSelected],
  );

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div>
        <Label className="text-base">Images</Label>
        <p className="text-muted-foreground mt-1 text-sm">
          Drag and drop photos, use the upload button, or paste URLs. With Cloudinary
          configured, uploads are stored remotely; otherwise local dev saves under{" "}
          <span className="font-mono text-xs">/public/uploads</span>.
        </p>
      </div>

      <div
        onDragEnter={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = "copy";
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          if (event.currentTarget === event.target) {
            setDragActive(false);
          }
        }}
        onDrop={handleDrop}
        className={cn(
          "border-border focus-within:ring-ring/30 rounded-2xl border border-dashed p-6 transition-colors focus-within:ring-2",
          dragActive ? "border-primary bg-primary/5" : "bg-muted/30",
        )}
      >
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
          <div className="border-border bg-card text-gold flex size-14 shrink-0 items-center justify-center rounded-xl border shadow-sm">
            <ImagePlus className="size-7" aria-hidden />
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <p className="text-foreground text-sm font-medium">Upload images</p>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Drop files here or choose multiple images (JPEG, PNG, WebP, GIF).
            </p>
            <div>
              <Input
                id="listing-image-files"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                disabled={uploading}
                onChange={(event) => void handleFilesSelected(event.target.files)}
                className="sr-only"
              />
              <Label
                htmlFor="listing-image-files"
                className={cn(
                  "bg-primary text-primary-foreground hover:bg-primary/90 inline-flex cursor-pointer items-center justify-center rounded-xl px-4 py-2 text-sm font-medium shadow-sm transition active:scale-[0.99]",
                  uploading && "pointer-events-none opacity-60",
                )}
              >
                {uploading ? "Uploading…" : "Choose files"}
              </Label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="listing-image-url">Image URL</Label>
          <Input
            id="listing-image-url"
            value={urlDraft}
            onChange={(event) => setUrlDraft(event.target.value)}
            placeholder="https://…"
            autoComplete="off"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleAddUrl();
              }
            }}
          />
        </div>
        <Button type="button" variant="secondary" onClick={handleAddUrl}>
          Add URL
        </Button>
      </div>

      {message ? (
        <p className="text-destructive text-sm" role="alert">
          {message}
        </p>
      ) : null}

      {images.length > 0 ? (
        <div>
          <p className="text-muted-foreground mb-3 text-sm font-medium">Previews</p>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.map((src, index) => (
              <li
                key={`${src}-${index}`}
                className="border-border group relative overflow-hidden rounded-xl border bg-background shadow-sm"
              >
                <div className="bg-muted relative aspect-[4/3] w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary owner URLs */}
                  <img
                    src={src}
                    alt={`Listing image preview ${index + 1}`}
                    className="size-full object-cover"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 flex justify-end bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="size-9 rounded-lg shadow-md"
                    aria-label={`Remove image ${index + 1}`}
                    onClick={() => handleRemove(index)}
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export const ListingImageUpload = ({ className, slotCount }: ListingImageUploadProps) => {
  if (slotCount !== undefined) {
    return <ListingImageSlotUpload className={className} slotCount={slotCount} />;
  }

  return <ListingImageFlexibleUpload className={className} />;
};

/** Alias for epic **13** naming; same component as `ListingImageUpload`. */
export const ListingImageUploader = ListingImageUpload;
