import { inputClasses } from "@/features/search/utils/inputClasses";

export const PriceRangeFilter = ({
  defaultMin = "",
  defaultMax = "",
}: {
  defaultMin?: string;
  defaultMax?: string;
}) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <label htmlFor="catalog-min-price" className="text-sm font-medium">
          Min price (USD)
        </label>
        <input
          id="catalog-min-price"
          name="minPrice"
          inputMode="numeric"
          placeholder="0"
          defaultValue={defaultMin}
          className={inputClasses}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="catalog-max-price" className="text-sm font-medium">
          Max price (USD)
        </label>
        <input
          id="catalog-max-price"
          name="maxPrice"
          inputMode="numeric"
          placeholder="No max"
          defaultValue={defaultMax}
          className={inputClasses}
        />
      </div>
    </div>
  );
};
