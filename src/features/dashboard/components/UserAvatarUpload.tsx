"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { UserAvatar } from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";
import { saveProfileImageAction } from "@/features/dashboard/actions/profileImageActions";
import { cn } from "@/lib/utils";

export type UserAvatarUploadProps = {
  displayName: string;
  email: string;
  /** Current saved profile image URL from the server (`User.image`). */
  initialImageUrl: string;
};

export const UserAvatarUpload = ({
  displayName,
  email,
  initialImageUrl,
}: UserAvatarUploadProps) => {
  const router = useRouter();
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [savedImageUrl, setSavedImageUrl] = useState(initialImageUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<
    { type: "success" | "error"; message: string } | null
  >(null);

  const avatarName = displayName !== "Not set" ? displayName : email;

  const revokePreview = useCallback(() => {
    setPreviewUrl((prev) => {
      if (prev?.startsWith("blob:")) {
        URL.revokeObjectURL(prev);
      }
      return null;
    });
  }, []);

  useEffect(() => {
    return () => {
      revokePreview();
    };
  }, [revokePreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFeedback(null);
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setFeedback({
        type: "error",
        message: "Please choose a PNG, JPG, JPEG, or WebP image.",
      });
      e.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFeedback({
        type: "error",
        message: "Image must be 5 MB or smaller.",
      });
      e.target.value = "";
      return;
    }
    revokePreview();
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleClearSelection = (): void => {
    setSelectedFile(null);
    revokePreview();
    setFeedback(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async (): Promise<void> => {
    if (!selectedFile) {
      return;
    }
    setIsSaving(true);
    setFeedback(null);
    const fd = new FormData();
    fd.append("file", selectedFile);
    const result = await saveProfileImageAction(fd);
    setIsSaving(false);
    if (!result.ok) {
      setFeedback({ type: "error", message: result.error });
      return;
    }
    setSavedImageUrl(result.imageUrl);
    setSelectedFile(null);
    revokePreview();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFeedback({
      type: "success",
      message: "Profile photo saved. Your navbar will show the new image.",
    });
    router.refresh();
  };

  const previewOrSaved = previewUrl ?? (savedImageUrl.trim() ? savedImageUrl : null);

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-5">
      <div className="flex flex-col items-center gap-3">
        <label
          htmlFor={inputId}
          className={cn(
            "group relative cursor-pointer rounded-full focus-within:ring-ring focus-within:ring-[3px] focus-within:ring-offset-2 focus-within:ring-offset-background focus-within:outline-none",
          )}
        >
          <span className="sr-only">Choose a new profile photo</span>
          <UserAvatar
            name={avatarName}
            imageUrl={previewOrSaved}
            imageAlt={displayName}
            size="lg"
            className="size-28 border-2 border-border shadow-md transition-all duration-300 group-hover:border-gold/50 group-hover:shadow-lg md:size-32"
            fallbackClassName="text-xl font-semibold tracking-tight md:text-2xl"
          />
          <span
            className="border-border bg-background/95 text-foreground pointer-events-none absolute right-0 bottom-0 rounded-full border px-2 py-0.5 text-[0.65rem] font-medium shadow-sm"
            aria-hidden
          >
            Change
          </span>
        </label>
        <input
          ref={fileInputRef}
          id={inputId}
          type="file"
          accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
          className="sr-only"
          onChange={handleFileChange}
        />
        <p className="text-muted-foreground max-w-xs text-center text-xs leading-relaxed">
          PNG, JPG, JPEG, or WebP · up to 5 MB. Preview updates when you pick a
          file; click <span className="text-foreground font-medium">Save Changes</span>{" "}
          to upload.
        </p>
        {selectedFile ? (
          <p className="text-muted-foreground text-center text-xs" aria-live="polite">
            Selected:{" "}
            <span className="text-foreground font-medium">{selectedFile.name}</span>{" "}
            — not saved yet
          </p>
        ) : null}
      </div>

      <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
        <Button
          type="button"
          variant="default"
          className="h-11 min-w-[10rem] cursor-pointer rounded-2xl px-6 font-semibold shadow-sm transition-all duration-300 hover:shadow-md disabled:cursor-not-allowed"
          disabled={!selectedFile || isSaving}
          onClick={handleSave}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
              Saving…
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
        {selectedFile ? (
          <Button
            type="button"
            variant="outline"
            className="h-11 cursor-pointer rounded-2xl border-border px-6 shadow-sm transition-all duration-300 hover:shadow-md"
            disabled={isSaving}
            onClick={handleClearSelection}
          >
            Cancel selection
          </Button>
        ) : null}
      </div>

      {feedback ? (
        <p
          role={feedback.type === "error" ? "alert" : "status"}
          className={cn(
            "text-center text-sm leading-relaxed",
            feedback.type === "success" ? "text-success" : "text-destructive",
          )}
        >
          {feedback.message}
        </p>
      ) : null}
    </div>
  );
};
