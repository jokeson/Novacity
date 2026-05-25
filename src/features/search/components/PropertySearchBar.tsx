import { inputClasses } from "@/features/search/utils/inputClasses";

export const PropertySearchBar = ({
  defaultValue = "",
}: {
  defaultValue?: string;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="catalog-q" className="text-sm font-medium">
        Keywords
      </label>
      <input
        id="catalog-q"
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder="Neighborhood, feature, title…"
        className={inputClasses}
        autoComplete="off"
      />
    </div>
  );
};
