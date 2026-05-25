import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PassKeyListItem } from "@/features/passkeys/types";

export type PassKeyStatusCardProps = {
  hasValidPassKey: boolean;
  keys: PassKeyListItem[];
};

export const PassKeyStatusCard = ({
  hasValidPassKey,
  keys,
}: PassKeyStatusCardProps) => {
  return (
    <Card className="border-border rounded-2xl border shadow-sm">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="font-heading text-lg">PassKey status</CardTitle>
          {hasValidPassKey ? (
            <Badge className="rounded-lg">Active access</Badge>
          ) : (
            <Badge variant="destructive" className="rounded-lg">
              No active PassKey
            </Badge>
          )}
        </div>
        <CardDescription>
          Publishing non-draft listings requires an unused PassKey that has not
          expired. Each first publish consumes one PassKey.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {keys.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No PassKeys are linked to your account yet. Redeem a code below or ask
            an administrator to assign one.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {keys.map((k) => {
              const now = new Date();
              const expired = new Date(k.expiresAt) <= now;
              const used = Boolean(k.usedAt);
              const stateLabel = used
                ? "Used"
                : !k.isActive
                  ? "Inactive"
                  : expired
                    ? "Expired"
                    : "Active";
              return (
                <li
                  key={k.id}
                  className="border-border flex flex-col gap-1 rounded-xl border bg-muted/30 px-3 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-foreground font-mono text-xs tracking-wide">
                      {k.codeMasked}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Expires {new Date(k.expiresAt).toLocaleDateString()}
                      {used && k.usedAt
                        ? ` · Used ${new Date(k.usedAt).toLocaleDateString()}`
                        : null}
                    </p>
                  </div>
                  <Badge variant="outline" className="w-fit rounded-lg capitalize">
                    {stateLabel}
                  </Badge>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
