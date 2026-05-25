"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Loader2, Upload } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";

import { FormInput } from "@/components/forms/FormInput";
import { FormSelect } from "@/components/forms/FormSelect";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SOUTH_SUDAN_STATE_OPTIONS } from "@/constants/southSudanStates";
import { cn } from "@/lib/utils";
import { submitOwnerVerificationApplicationAction } from "@/features/verification/actions/ownerVerificationActions";
import {
  ownerVerificationSubmitSchema,
  type OwnerVerificationSubmitInput,
} from "@/features/verification/validators/ownerVerificationSubmitSchema";

const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const PDF_MIME = "application/pdf";

const isPdfFile = (file: File): boolean =>
  file.type === PDF_MIME || file.name.toLowerCase().endsWith(".pdf");

const isAllowedVerificationFile = (file: File): boolean => {
  if (ALLOWED_IMAGE_MIMES.has(file.type)) {
    return true;
  }
  if (isPdfFile(file)) {
    return true;
  }
  return false;
};

const nationalityOptions = [
  { value: "south-sudanese", label: "South Sudanese" },
  { value: "international", label: "Non–South Sudanese" },
] as const;

const idTypeOptionsSs = [
  { value: "national_id", label: "National ID" },
  { value: "drivers_license", label: "Driver license" },
] as const;

const idTypeOptionsIntl = [{ value: "passport", label: "Passport" }] as const;

export const ApplicantVerificationForm = () => {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [localObjectUrl, setLocalObjectUrl] = useState<string | null>(null);
  const [reviewDocumentKind, setReviewDocumentKind] = useState<"image" | "pdf" | null>(
    null,
  );
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    return () => {
      if (localObjectUrl) {
        URL.revokeObjectURL(localObjectUrl);
      }
    };
  }, [localObjectUrl]);

  const form = useForm<OwnerVerificationSubmitInput>({
    resolver: zodResolver(ownerVerificationSubmitSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      residentialAddress: "",
      postingState: SOUTH_SUDAN_STATE_OPTIONS[0]?.value ?? "Lakes",
      applicantNationality: "south-sudanese",
      idDocumentType: "national_id",
      idDocumentUrl: "",
    },
  });

  const { control, setValue } = form;

  const nationality = useWatch({
    control,
    name: "applicantNationality",
  });

  const idDocumentUrl = useWatch({
    control,
    name: "idDocumentUrl",
  });

  useEffect(() => {
    if (nationality === "south-sudanese") {
      setValue("idDocumentType", "national_id");
    } else {
      setValue("idDocumentType", "passport");
    }
  }, [nationality, setValue]);

  const resetDocumentPreview = (): void => {
    setReviewDocumentKind(null);
    setSelectedFileName(null);
    setLocalObjectUrl(null);
  };

  const handleClickChooseDocument = (): void => {
    setUploadError(null);
    fileRef.current?.click();
  };

  const handleFileInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploadError(null);
    form.clearErrors("idDocumentUrl");

    if (!isAllowedVerificationFile(file)) {
      setUploadError("Unsupported file type. Use JPEG, PNG, WebP, GIF, or PDF.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_DOCUMENT_BYTES) {
      setUploadError("File is too large (max 10 MB).");
      event.target.value = "";
      return;
    }

    const isPdf = isPdfFile(file);
    setReviewDocumentKind(isPdf ? "pdf" : "image");
    setSelectedFileName(file.name);

    if (!isPdf) {
      setLocalObjectUrl(URL.createObjectURL(file));
    } else {
      setLocalObjectUrl(null);
    }

    setIsUploadingDoc(true);
    try {
      const fd = new FormData();
      fd.set("file", file);

      const res = await fetch("/api/verification/document", {
        method: "POST",
        body: fd,
      });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) {
        setUploadError(json.error ?? "Upload failed.");
        form.setValue("idDocumentUrl", "", { shouldValidate: true });
        resetDocumentPreview();
        return;
      }

      form.setValue("idDocumentUrl", json.url, { shouldValidate: true });
      form.clearErrors("idDocumentUrl");
      setLocalObjectUrl(null);
    } finally {
      setIsUploadingDoc(false);
    }
  };

  const handleSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await submitOwnerVerificationApplicationAction(values);
      if (!result.ok) {
        if (result.fieldErrors) {
          for (const [key, messages] of Object.entries(result.fieldErrors)) {
            if (!messages?.length) {
              continue;
            }
            form.setError(key as keyof OwnerVerificationSubmitInput, {
              message: messages[0],
            });
          }
        }
        if (result.message) {
          form.setError("root", { message: result.message });
        }
        return;
      }
      router.refresh();
      resetDocumentPreview();
      form.reset({
        ...values,
        idDocumentUrl: "",
      });
      setFileInputKey((key) => key + 1);
    });
  });

  const showReview = Boolean(localObjectUrl) || reviewDocumentKind !== null;
  const imagePreviewSrc =
    localObjectUrl ??
    (reviewDocumentKind === "image" && idDocumentUrl ? idDocumentUrl : null);
  const pdfReady = reviewDocumentKind === "pdf" && Boolean(idDocumentUrl?.trim());
  const submitBlocked =
    pending ||
    form.formState.isSubmitting ||
    isUploadingDoc ||
    !idDocumentUrl?.trim();

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput<OwnerVerificationSubmitInput>
            name="fullName"
            label="Full name"
            autoComplete="name"
            required
          />
          <FormInput<OwnerVerificationSubmitInput>
            name="phone"
            label="Phone number"
            type="tel"
            autoComplete="tel"
            required
          />
        </div>
        <FormTextarea<OwnerVerificationSubmitInput>
          name="residentialAddress"
          label="Residential address"
          rows={3}
          required
        />
        <FormSelect<OwnerVerificationSubmitInput>
          name="postingState"
          label="State / region where you will post listings"
          options={SOUTH_SUDAN_STATE_OPTIONS.map((o) => ({
            value: o.value,
            label: o.label,
          }))}
        />
        <FormSelect<OwnerVerificationSubmitInput>
          name="applicantNationality"
          label="Applicant nationality"
          options={[...nationalityOptions]}
        />
        <FormSelect<OwnerVerificationSubmitInput>
          name="idDocumentType"
          label="Identification type"
          options={
            nationality === "south-sudanese"
              ? [...idTypeOptionsSs]
              : [...idTypeOptionsIntl]
          }
        />

        <FormField
          control={form.control}
          name="idDocumentUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Identification document</FormLabel>
              <FormControl>
                <Input type="hidden" {...field} />
              </FormControl>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  key={fileInputKey}
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,application/pdf,.pdf"
                  className="sr-only"
                  aria-hidden
                  tabIndex={-1}
                  onChange={(e) => void handleFileInputChange(e)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-lg"
                  onClick={handleClickChooseDocument}
                  disabled={pending || isUploadingDoc}
                  aria-label="Choose identification document from your device"
                >
                  {isUploadingDoc ? (
                    <Loader2 className="size-5 animate-spin" aria-hidden />
                  ) : (
                    <Upload className="size-5" aria-hidden />
                  )}
                </Button>
                <p className="text-muted-foreground max-w-md text-xs leading-relaxed">
                  Tap the upload icon to pick a file from your device. JPEG, PNG, WebP, GIF, or PDF
                  — max 10 MB. Your file uploads automatically when selected.
                </p>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {showReview ? (
          <div
            className="border-border bg-muted/30 space-y-3 rounded-2xl border p-4"
            aria-live="polite"
          >
            <p className="text-foreground text-sm font-medium">Review before you submit</p>
            {reviewDocumentKind === "image" && imagePreviewSrc ? (
              <div className="border-border bg-background overflow-hidden rounded-xl border">
                {/* eslint-disable-next-line @next/next/no-img-element -- user-uploaded blob or same-origin / public URL */}
                <img
                  src={imagePreviewSrc}
                  alt="Preview of your identification document"
                  className="mx-auto max-h-64 w-full object-contain p-2"
                />
              </div>
            ) : null}
            {reviewDocumentKind === "pdf" ? (
              <div className="border-border bg-background flex flex-col items-start gap-2 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="text-muted-foreground size-10 shrink-0" aria-hidden />
                  <div>
                    <p className="text-foreground text-sm font-medium">PDF document</p>
                    {selectedFileName ? (
                      <p className="text-muted-foreground text-xs">{selectedFileName}</p>
                    ) : null}
                    {!pdfReady && isUploadingDoc ? (
                      <p className="text-muted-foreground mt-1 text-xs">Uploading…</p>
                    ) : null}
                    {pdfReady ? (
                      <p className="text-muted-foreground mt-1 text-xs">Ready to submit.</p>
                    ) : null}
                  </div>
                </div>
                {pdfReady && idDocumentUrl ? (
                  <a
                    href={idDocumentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "rounded-lg")}
                  >
                    Open PDF
                  </a>
                ) : null}
              </div>
            ) : null}
            {reviewDocumentKind === "image" && idDocumentUrl && !localObjectUrl ? (
              <p className="text-muted-foreground text-xs">Document uploaded — preview above.</p>
            ) : null}
          </div>
        ) : null}

        {uploadError ? (
          <p className="text-destructive text-sm" role="alert">
            {uploadError}
          </p>
        ) : null}
        {form.formState.errors.root?.message ? (
          <p className="text-destructive text-sm" role="alert">
            {form.formState.errors.root.message}
          </p>
        ) : null}

        <Button
          type="submit"
          className="rounded-lg"
          disabled={submitBlocked}
          aria-busy={pending || form.formState.isSubmitting || undefined}
        >
          {pending || form.formState.isSubmitting ? "Submitting…" : "Submit application"}
        </Button>
        {submitBlocked && !pending && !form.formState.isSubmitting ? (
          <p className="text-muted-foreground text-xs">
            {isUploadingDoc
              ? "Wait for your document to finish uploading."
              : "Upload an identification document to enable submit."}
          </p>
        ) : null}
      </form>
    </Form>
  );
};
