"use client";

import { useState, useTransition } from "react";

import {
  uiInteractiveLink,
  uiSurfaceCard,
  uiSurfaceCardStatic,
  uiTypography,
} from "@/lib/uiContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContactInquiryAction } from "@/features/contact/actions/contactActions";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export const ContactPageView = () => {
  const [form, setForm] = useState(initialForm);
  const [rootError, setRootError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[] | undefined>>({});
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleChange =
    (field: keyof typeof initialForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setRootError(null);
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setRootError(null);
    setFieldErrors({});
    startTransition(async () => {
      const res = await submitContactInquiryAction(form);
      if (res.ok) {
        setSuccess(true);
        setForm(initialForm);
        return;
      }
      if (res.fieldErrors) {
        setFieldErrors(res.fieldErrors);
      }
      setRootError(res.message ?? "Something went wrong.");
    });
  };

  if (success) {
    return (
      <div className={cn(uiSurfaceCardStatic, "mx-auto max-w-xl p-8 text-center")}>
        <h2 className={uiTypography.cardTitle}>Message received</h2>
        <p className={cn(uiTypography.body, "mt-3")}>
          Thank you for contacting Novacity. We will review your note and reply by email when
          appropriate.
        </p>
        <button
          type="button"
          className={cn(uiInteractiveLink, "mt-6")}
          onClick={() => setSuccess(false)}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(uiSurfaceCard, "mx-auto max-w-xl space-y-6 p-6 sm:p-8")}
      noValidate
    >
      <div>
        <h2 className={uiTypography.cardTitle}>Contact Novacity</h2>
        <p className={cn(uiTypography.body, "mt-1")}>
          Questions, partnerships, or product feedback — send us a note.
        </p>
      </div>

      {rootError ? (
        <p role="alert" className="text-destructive text-sm">
          {rootError}
        </p>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="contact-full-name">Full name</Label>
        <Input
          id="contact-full-name"
          name="fullName"
          autoComplete="name"
          value={form.fullName}
          onChange={handleChange("fullName")}
          required
          maxLength={120}
        />
        {fieldErrors.fullName?.[0] ? (
          <p className="text-destructive text-sm">{fieldErrors.fullName[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-email">Email</Label>
        <Input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange("email")}
          required
          maxLength={254}
        />
        {fieldErrors.email?.[0] ? (
          <p className="text-destructive text-sm">{fieldErrors.email[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-phone">Phone (optional)</Label>
        <Input
          id="contact-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={form.phone}
          onChange={handleChange("phone")}
          maxLength={40}
        />
        {fieldErrors.phone?.[0] ? (
          <p className="text-destructive text-sm">{fieldErrors.phone[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-subject">Subject</Label>
        <Input
          id="contact-subject"
          name="subject"
          value={form.subject}
          onChange={handleChange("subject")}
          required
          maxLength={200}
        />
        {fieldErrors.subject?.[0] ? (
          <p className="text-destructive text-sm">{fieldErrors.subject[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          name="message"
          value={form.message}
          onChange={handleChange("message")}
          required
          rows={5}
          maxLength={5000}
          className="min-h-32 resize-y"
        />
        {fieldErrors.message?.[0] ? (
          <p className="text-destructive text-sm">{fieldErrors.message[0]}</p>
        ) : null}
      </div>

      <Button
        type="submit"
        variant="gold"
        disabled={pending}
        aria-busy={pending}
        className="w-full cursor-pointer sm:w-auto"
      >
        {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
};
