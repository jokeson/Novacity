"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { redeemPassKeyAction } from "@/features/passkeys/actions/passkeyActions";

export const PassKeyForm = () => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(
    null,
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const code = String(formData.get("code") ?? "");

    setMessage(null);
    setError(null);
    setFieldErrors(null);

    startTransition(async () => {
      const res = await redeemPassKeyAction({ code });
      if (!res.ok) {
        if (res.fieldErrors) {
          setFieldErrors(res.fieldErrors as Record<string, string[]>);
        }
        setError(res.message ?? "Could not redeem PassKey.");
        return;
      }
      setMessage(res.message);
      form.reset();
      router.refresh();
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-border bg-card space-y-4 rounded-2xl border p-6 shadow-sm"
      noValidate
    >
      <div>
        <h3 className="font-heading text-foreground text-lg font-semibold tracking-tight">
          Redeem PassKey
        </h3>
        <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
          Enter the code you received. Pool codes attach to your account; codes
          already assigned to you simply confirm access.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="passkey-code">PassKey code</Label>
        <Input
          id="passkey-code"
          name="code"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          placeholder="AB12CD-34EFGH"
          className="rounded-xl font-mono uppercase"
          disabled={pending}
          aria-invalid={Boolean(fieldErrors?.code?.length)}
          aria-describedby={fieldErrors?.code?.length ? "passkey-code-error" : undefined}
        />
        {fieldErrors?.code?.[0] ? (
          <p id="passkey-code-error" className="text-destructive text-sm" role="alert">
            {fieldErrors.code[0]}
          </p>
        ) : null}
      </div>
      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="text-sm text-emerald-700 dark:text-emerald-400" role="status">
          {message}
        </p>
      ) : null}
      <Button type="submit" className="rounded-xl" disabled={pending}>
        {pending ? "Checking…" : "Redeem PassKey"}
      </Button>
    </form>
  );
};
