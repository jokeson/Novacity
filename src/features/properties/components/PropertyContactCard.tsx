import { InterestedClientModal } from "@/features/interested-clients/components/InterestedClientModal";
import { PropertyContactPhone } from "@/features/properties/components/PropertyContactPhone";
import { PropertyMapLink } from "@/features/properties/components/PropertyMapLink";

export type PropertyContactCardProps = {
  slug: string;
  propertyId: string;
  ownerId: string;
  propertyTitle?: string;
  location: string;
  address: string;
  phone: string;
};

export const PropertyContactCard = ({
  slug,
  propertyId,
  ownerId,
  propertyTitle,
  location,
  address,
  phone,
}: PropertyContactCardProps) => {
  return (
    <aside className="border-border bg-card flex flex-col gap-4 rounded-2xl border p-5 shadow-sm">
      <div>
        <h2 className="font-heading text-foreground text-lg font-semibold tracking-tight">
          Contact & location
        </h2>
        <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
          Reach out with questions or request a tour. The lister is notified when you
          express interest.
        </p>
      </div>
      <div className="text-muted-foreground flex flex-col gap-1.5 text-sm">
        <PropertyContactPhone phone={phone} />
      </div>
      <PropertyMapLink location={location} address={address} />
      <InterestedClientModal
        slug={slug}
        propertyId={propertyId}
        ownerId={ownerId}
        propertyTitle={propertyTitle}
      />
    </aside>
  );
};
