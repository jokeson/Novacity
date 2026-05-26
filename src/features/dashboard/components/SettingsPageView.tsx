import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PersonName } from "@/components/shared/PersonName";
import { formatPersonName } from "@/lib/formatPersonName";
import type { UserRole } from "@/types/user";

import { UserAvatarUpload } from "./UserAvatarUpload";

export type SettingsPageViewProps = {
  name: string;
  email: string;
  phone: string;
  image: string;
  role: UserRole;
};

export const SettingsPageView = ({
  name,
  email,
  phone,
  image,
  role,
}: SettingsPageViewProps) => {
  const displayName =
    name.trim().length > 0 ? formatPersonName(name) : "Not set";

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="border-border rounded-2xl border shadow-sm transition-shadow duration-300 hover:shadow-md lg:col-span-1">
        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="font-heading text-xl tracking-tight">Profile</CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            How you appear across the platform. Click your photo to choose a new
            image, then save.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6 pt-2 max-md:text-center">
          <UserAvatarUpload
            key={`${image}`}
            displayName={displayName}
            email={email}
            initialImageUrl={image}
          />
          <div className="border-border w-full border-t pt-4 text-center max-md:px-2">
            {name.trim() ? (
              <PersonName
                name={name}
                centerOnMobile
                as="p"
                className="text-foreground font-medium"
              />
            ) : (
              <p className="text-foreground font-medium">Not set</p>
            )}
            <p className="text-muted-foreground mt-1 text-sm">{email}</p>
            <p className="text-muted-foreground mt-2 text-xs capitalize">Role: {role}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border rounded-2xl border shadow-sm transition-shadow duration-300 hover:shadow-md lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-heading text-xl tracking-tight">Account details</CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            Overview of your stored account record. Name and phone editing will ship
            in a later phase.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-muted/30 px-4 py-3 shadow-sm max-md:col-span-2 max-md:text-center">
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              Full name
            </p>
            {name.trim() ? (
              <PersonName
                name={name}
                centerOnMobile
                as="p"
                className="text-foreground mt-1 text-sm font-medium"
              />
            ) : (
              <p className="text-foreground mt-1 text-sm font-medium">Not set</p>
            )}
          </div>
          <div className="rounded-2xl border border-border bg-muted/30 px-4 py-3 shadow-sm">
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              Email
            </p>
            <p className="text-foreground mt-1 break-all text-sm font-medium">{email}</p>
          </div>
          <div className="rounded-2xl border border-border bg-muted/30 px-4 py-3 sm:col-span-2">
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              Phone
            </p>
            <p className="text-foreground mt-1 text-sm font-medium">
              {phone.trim() ? phone : "—"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
