import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PriceText } from "@/components/shared/PriceText";

const COMMISSION_RATE = 0.05;
const COMMISSION_PERCENT_LABEL = `${COMMISSION_RATE * 100}%`;

export type RevenueSummaryProps = {
  totalPriceVolume: number;
  sspPriceVolume: number;
  sspNonRentalMarketValue: number;
};

export const RevenueSummary = ({
  totalPriceVolume,
  sspPriceVolume,
  sspNonRentalMarketValue,
}: RevenueSummaryProps) => {
  const commissionEstimate = Math.round(totalPriceVolume * COMMISSION_RATE);
  const sspCommissionEstimate = Math.round(sspPriceVolume * COMMISSION_RATE);

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <Card className="border-border rounded-2xl border shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading text-lg">Gross listing volume</CardTitle>
          <CardDescription>
            Sum of all stored listing prices (not transactional revenue). Useful as a
            directional GMV proxy.
          </CardDescription>
        </CardHeader>
        <div className="px-6 pb-6">
          <PriceText
            amount={totalPriceVolume}
            className="font-heading text-foreground text-3xl font-semibold"
          />
        </div>
      </Card>
      <Card className="border-border rounded-2xl border shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading text-lg">Commission estimate</CardTitle>
          <CardDescription>
            Placeholder at {COMMISSION_PERCENT_LABEL} of gross volume until billing rules are
            wired to real transactions.
          </CardDescription>
        </CardHeader>
        <div className="px-6 pb-6">
          <PriceText
            amount={commissionEstimate}
            className="font-heading text-foreground text-3xl font-semibold"
          />
        </div>
      </Card>
      <Card className="border-border rounded-2xl border shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading text-lg">SSP commission estimate</CardTitle>
          <CardDescription>
            {COMMISSION_PERCENT_LABEL} of gross volume for listings priced in South Sudanese
            pounds (SSP) only.
          </CardDescription>
        </CardHeader>
        <div className="px-6 pb-6">
          <PriceText
            amount={sspCommissionEstimate}
            listingCurrency="SSP"
            className="font-heading text-foreground text-3xl font-semibold"
          />
        </div>
      </Card>
      <Card className="border-border rounded-2xl border shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading text-lg">SSP market value</CardTitle>
          <CardDescription>
            Total listed value in South Sudanese pounds (SSP), excluding for-rent and
            rented listings (sales and other non-rental statuses only).
          </CardDescription>
        </CardHeader>
        <div className="px-6 pb-6">
          <PriceText
            amount={sspNonRentalMarketValue}
            listingCurrency="SSP"
            className="font-heading text-foreground text-3xl font-semibold"
          />
        </div>
      </Card>
    </div>
  );
};
