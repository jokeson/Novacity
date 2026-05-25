export type PassKeyExpirationAlertProps = {
  expiringWithinSevenDays: boolean;
  soonestValidExpiresAt: string | null;
};

export const PassKeyExpirationAlert = ({
  expiringWithinSevenDays,
  soonestValidExpiresAt,
}: PassKeyExpirationAlertProps) => {
  if (!expiringWithinSevenDays || !soonestValidExpiresAt) {
    return null;
  }

  const formatted = new Date(soonestValidExpiresAt).toLocaleString();

  return (
    <div
      role="status"
      className="border-amber-500/35 bg-amber-500/10 text-foreground rounded-2xl border px-4 py-3 text-sm leading-relaxed shadow-sm"
    >
      <p className="font-medium text-amber-950 dark:text-amber-100">
        PassKey expiring soon
      </p>
      <p className="text-muted-foreground mt-1">
        Your soonest active PassKey expires on{" "}
        <span className="text-foreground font-medium">{formatted}</span>. Publish or
        renew before it lapses.
      </p>
    </div>
  );
};
