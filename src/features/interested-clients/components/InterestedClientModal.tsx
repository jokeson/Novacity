"use client";

import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

import { InterestedClientForm } from "./InterestedClientForm";
import { InterestedClientSuccess } from "./InterestedClientSuccess";

export type InterestedClientModalProps = {
  slug: string;
  propertyId: string;
  ownerId: string;
  propertyTitle?: string;
};

export const InterestedClientModal = ({
  slug,
  propertyId,
  ownerId,
  propertyTitle,
}: InterestedClientModalProps) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setStep("form");
    }
  };

  const handleSuccess = useCallback(() => {
    setStep("success");
  }, []);

  const handleCloseSuccess = useCallback(() => {
    setOpen(false);
    setStep("form");
  }, []);

  const handleCancelForm = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <Button
        type="button"
        variant="success"
        size="sm"
        className="w-full cursor-pointer justify-center"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        Contact
      </Button>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
        {step === "form" ? (
          <InterestedClientForm
            slug={slug}
            propertyId={propertyId}
            ownerId={ownerId}
            propertyTitle={propertyTitle}
            onSuccess={handleSuccess}
            onCancel={handleCancelForm}
          />
        ) : (
          <InterestedClientSuccess
            propertyTitle={propertyTitle}
            onClose={handleCloseSuccess}
          />
        )}
      </DialogContent>
    </Dialog>
    </>
  );
};
