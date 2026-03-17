"use client";

import { useRouter } from "next/navigation";
import { db } from "@/lib/db";
import { MealCard, type Meal } from "@/components/MealCard";

export default function JournalPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = db.useAuth();

  if (!authLoading && !user) {
    router.replace("/login");
  }

  const query = user
    ? {
        meals: {
          $: {
            where: { userId: user.id },
            order: { date: "desc" }
          }
        }
      }
    : {};

  const { isLoading, error, data } = db.useQuery(query as any);

  const meals = ((data as any)?.meals || []) as Meal[];

  const grouped = meals.reduce(
    (acc, meal: any) => {
      const d =
        meal.date instanceof Date
          ? meal.date.toISOString().slice(0, 10)
          : "unknown";
      if (!acc[d]) acc[d] = [];
      acc[d].push(meal as Meal);
      return acc;
    },
    {} as Record<string, Meal[]>
  );

  const dates = Object.keys(grouped).sort((a, b) => (a < b ? 1 : -1));

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-db-textMain">
          My journal
        </h1>
        <p className="text-sm text-db-textMuted">
          A gentle weekly view of what you&apos;ve actually been eating.
        </p>
      </header>

      {isLoading && (
        <p className="text-sm text-db-textMuted">Gathering your past bites…</p>
      )}
      {error && (
        <p className="text-sm text-red-400">
          We couldn&apos;t load your journal.
        </p>
      )}
      {!isLoading && dates.length === 0 && (
        <div className="rounded-xl border border-dashed border-db-border bg-db-surfaceSoft p-6 text-sm text-db-textMuted">
          <p className="font-medium text-db-textMain">
            No meals logged yet this week.
          </p>
          <p className="mt-1">
            Log your first meal to see your journal fill up over time.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {dates.map((d) => (
          <div key={d} className="space-y-2">
            <div className="flex items-center justify-between text-xs text-db-textMuted">
              <span className="font-medium text-db-textMain">
                {new Date(d).toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "short",
                  day: "numeric"
                })}
              </span>
              <span className="rounded-full bg-db-surfaceSoft px-2 py-0.5 text-[11px] text-db-textMuted">
                {grouped[d].length} meal
                {grouped[d].length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="space-y-2">
              {grouped[d].map((meal) => (
                <MealRow key={meal.id} meal={meal} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function MealRow({ meal }: { meal: Meal }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Delete this meal from your journal? This cannot be undone."
      )
    ) {
      return;
    }
    await db.transact(db.tx.meals[meal.id].delete());
  };

  return (
    <div className="flex items-center gap-3 rounded-xl border border-db-border bg-white p-3 text-xs shadow-sm">
      <div className="flex-1">
        <p className="font-medium text-db-textMain">{meal.title}</p>
        <p className="text-[11px] text-db-textMuted">
          {meal.mealType} •{" "}
          {meal.createdAt instanceof Date
            ? meal.createdAt.toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit"
              })
            : ""}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {meal.hasRecipe && (
          <button
            type="button"
            onClick={() => router.push(`/meals/${meal.id}`)}
            className="rounded-full border border-db-border px-3 py-1 text-[11px] text-db-accentStrong hover:bg-db-accentSoft"
          >
            See recipe
          </button>
        )}
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-full border border-db-border px-3 py-1 text-[11px] text-db-textMuted hover:bg-db-surfaceSoft"
          >
          Delete
        </button>
      </div>
    </div>
  );
}

