import { inputClasses } from "@/features/search/utils/inputClasses";

const OPTIONS = [
  { value: "", label: "Any type" },
  { value: "house", label: "House" },
  { value: "apartment", label: "Apartment" },
  { value: "rental", label: "Rental" },
  { value: "commercial", label: "Commercial" },
  { value: "land", label: "Land" },
] as const;

export const PropertyTypeFilter = ({
  defaultValue = "",
}: {
  defaultValue?: string;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="catalog-type" className="text-sm font-medium">
        Property type
      </label>
      <select
        id="catalog-type"
        name="type"
        defaultValue={defaultValue}
        className={inputClasses}
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value || "any"} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
