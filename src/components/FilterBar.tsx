"use client";

type DietFilter = "all" | "vegan" | "vegetarian" | "non_veg";
type PrepFilter = "all" | "quick" | "medium" | "slow";

export function FilterBar({
  diet,
  prep,
  query,
  onDietChange,
  onPrepChange,
  onQueryChange
}: {
  diet: DietFilter;
  prep: PrepFilter;
  query: string;
  onDietChange: (v: DietFilter) => void;
  onPrepChange: (v: PrepFilter) => void;
  onQueryChange: (v: string) => void;
}) {
  const dietOptions: { value: DietFilter; label: string }[] = [
    { value: "all", label: "All diets" },
    { value: "vegan", label: "🌱 Vegan" },
    { value: "vegetarian", label: "🥦 Vegetarian" },
    { value: "non_veg", label: "🍗 Non‑Veg" }
  ];

  const prepOptions: { value: PrepFilter; label: string }[] = [
    { value: "all", label: "Any time" },
    { value: "quick", label: "⚡ Quick" },
    { value: "medium", label: "🕐 Medium" },
    { value: "slow", label: "🍲 Slow" }
  ];

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-db-border bg-db-surfaceSoft p-3 text-xs sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="flex flex-wrap gap-2">
        {dietOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onDietChange(opt.value)}
            className={`rounded-full px-3 py-1 transition-colors duration-150 ${
              diet === opt.value
                ? "bg-db-accent text-white shadow-sm"
                : "bg-db-surface text-db-textMuted hover:bg-db-accentSoft hover:text-db-textMain"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <div className="flex gap-2">
          {prepOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onPrepChange(opt.value)}
              className={`rounded-full px-3 py-1 transition-colors duration-150 ${
                prep === opt.value
                  ? "bg-db-accentSoft text-db-accentStrong"
                  : "bg-db-surface text-db-textMuted hover:bg-db-accentSoft hover:text-db-textMain"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search by ingredient or title…"
          className="w-full rounded-lg border border-db-border bg-white px-3 py-1.5 text-xs text-db-textMain outline-none ring-db-accent/60 focus:ring-1 sm:w-52"
        />
      </div>
    </div>
  );
}

