import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type InterestedClientSuccessProps = {
  propertyTitle?: string;
  onClose: () => void;
};

export const InterestedClientSuccess = ({
  propertyTitle,
  onClose,
}: InterestedClientSuccessProps) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-heading">Thank you</DialogTitle>
        <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
          Your inquiry was sent securely. The lister has been notified and may follow up
          using the contact details you provided.
          {propertyTitle ? (
            <>
              {" "}
              Reference: <span className="text-foreground font-medium">{propertyTitle}</span>.
            </>
          ) : null}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="sm:justify-end">
        <Button type="button" onClick={onClose} className="rounded-lg">
          Close
        </Button>
      </DialogFooter>
    </>
  );
};
