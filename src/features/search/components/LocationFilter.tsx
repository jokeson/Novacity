import { inputClasses } from "@/features/search/utils/inputClasses";

export const LocationFilter = ({
  defaultValue = "",
}: {
  defaultValue?: string;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="catalog-location" className="text-sm font-medium">
        Location
      </label>
      <input
        id="catalog-location"
        name="location"
        type="text"
        defaultValue={defaultValue}
        placeholder="City, area, landmark"
        autoComplete="address-level2"
        className={inputClasses}
      />
    </div>
  );
};
