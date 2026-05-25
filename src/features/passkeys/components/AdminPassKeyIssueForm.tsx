"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminIssuePassKeyAction } from "@/features/passkeys/actions/passkeyActions";

const PRESET_QUANTITIES = [10, 50, 100] as const;

export const AdminPassKeyIssueForm = () => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [quantity, setQuantity] = useState(1);
  const [issued, setIssued] = useState<{ code: string; assigneeEmail: string | null } | null>(
    null,
  );
  const [bulkIssued, setBulkIssued] = useState<{
    codes: string[];
    assigneeEmail: string | null;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(
    null,
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setIssued(null);
    setBulkIssued(null);
    setError(null);
    setFieldErrors(null);

    startTransition(async () => {
      const res = await adminIssuePassKeyAction({
        assignEmail: String(formData.get("assignEmail") ?? ""),
        durationDays: formData.get("durationDays"),
        customCode: String(formData.get("customCode") ?? ""),
        quantity: formData.get("quantity"),
      });

      if (!res.ok) {
        if (res.fieldErrors) {
          setFieldErrors(res.fieldErrors as Record<string, string[]>);
        }
        setError(res.message ?? "Could not issue PassKey.");
        return;
      }

      if (res.mode === "bulk") {
        setBulkIssued({ codes: res.codes, assigneeEmail: res.assigneeEmail });
      } else {
        setIssued({ code: res.code, assigneeEmail: res.assigneeEmail });
      }
      form.reset();
      setQuantity(1);
      router.refresh();
    });
  };

  return (
    <div className="border-border bg-card space-y-6 rounded-2xl border p-6 shadow-sm">
      <div>
        <h3 className="font-heading text-lg font-semibold tracking-tight">
          Issue PassKey
        </h3>
        <p className="text-muted-foreground mt-1 text-sm">
          Leave assignee email blank for pool keys any signed-in user can redeem. For
          quantities above 1, codes are auto-generated (custom code applies only when
          quantity is 1).
        </p>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2" noValidate>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="pk-assign-email">Assign to email (optional)</Label>
          <Input
            id="pk-assign-email"
            name="assignEmail"
            type="email"
            placeholder="owner@example.com"
            autoComplete="off"
            className="rounded-xl"
            disabled={pending}
            aria-invalid={Boolean(fieldErrors?.assignEmail?.length)}
          />
          {fieldErrors?.assignEmail?.[0] ? (
            <p className="text-destructive text-sm" role="alert">
              {fieldErrors.assignEmail[0]}
            </p>
          ) : null}
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="pk-quantity">Quantity (1–100)</Label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <Input
              id="pk-quantity"
              name="quantity"
              type="number"
              min={1}
              max={100}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value) || 1)}
              className="max-w-[140px] rounded-xl"
              disabled={pending}
              aria-invalid={Boolean(fieldErrors?.quantity?.length)}
            />
            <div className="flex flex-wrap gap-2">
              {PRESET_QUANTITIES.map((n) => (
                <Button
                  key={n}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  disabled={pending}
                  onClick={() => setQuantity(n)}
                >
                  {n} keys
                </Button>
              ))}
            </div>
          </div>
          {fieldErrors?.quantity?.[0] ? (
            <p className="text-destructive text-sm" role="alert">
              {fieldErrors.quantity[0]}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="pk-duration">Duration (days)</Label>
          <Input
            id="pk-duration"
            name="durationDays"
            type="number"
            min={1}
            max={3650}
            defaultValue={90}
            className="rounded-xl"
            disabled={pending}
            aria-invalid={Boolean(fieldErrors?.durationDays?.length)}
          />
          {fieldErrors?.durationDays?.[0] ? (
            <p className="text-destructive text-sm" role="alert">
              {fieldErrors.durationDays[0]}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="pk-custom">Custom code (optional, quantity 1 only)</Label>
          <Input
            id="pk-custom"
            name="customCode"
            autoComplete="off"
            className="rounded-xl font-mono uppercase"
            placeholder="Auto-generate if empty"
            disabled={pending || quantity > 1}
            aria-invalid={Boolean(fieldErrors?.customCode?.length)}
          />
          {fieldErrors?.customCode?.[0] ? (
            <p className="text-destructive text-sm" role="alert">
              {fieldErrors.customCode[0]}
            </p>
          ) : null}
        </div>
        <div className="md:col-span-2">
          <Button type="submit" variant="gold" className="rounded-xl" disabled={pending}>
            {pending ? "Issuing…" : quantity > 1 ? `Generate ${quantity} PassKeys` : "Generate PassKey"}
          </Button>
        </div>
      </form>
      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
      {issued ? (
        <div
          className="border-border bg-muted/40 rounded-xl border p-4 text-sm"
          role="status"
        >
          <p className="font-medium">PassKey created</p>
          <p className="text-muted-foreground mt-1">
            {issued.assigneeEmail
              ? `Assigned to ${issued.assigneeEmail}.`
              : "Pool key — share the code securely with the purchaser."}
          </p>
          <p className="text-foreground mt-3 font-mono text-lg tracking-wide">
            {issued.code}
          </p>
        </div>
      ) : null}
      {bulkIssued ? (
        <div
          className="border-border bg-muted/40 max-h-72 space-y-3 overflow-y-auto rounded-xl border p-4 text-sm"
          role="status"
        >
          <p className="font-medium">PassKeys created ({bulkIssued.codes.length})</p>
          <p className="text-muted-foreground">
            {bulkIssued.assigneeEmail
              ? `All assigned to ${bulkIssued.assigneeEmail}.`
              : "Pool keys — distribute securely."}
          </p>
          <ul className="font-mono text-xs leading-relaxed tracking-wide md:text-sm">
            {bulkIssued.codes.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};
