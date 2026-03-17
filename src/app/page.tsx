"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/db";
import { FilterBar } from "@/components/FilterBar";
import { MealCard, type Meal } from "@/components/MealCard";

type DietFilter = "all" | "vegan" | "vegetarian" | "non_veg";
type PrepFilter = "all" | "quick" | "medium" | "slow";

export default function FeedPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = db.useAuth();

  if (!authLoading && !user) {
    router.replace("/login");
  }

  const { isLoading, error, data } = db.useQuery({
    meals: {
      $: {
        order: { createdAt: "desc" }
      }
    }
  } as any);

  const [diet, setDiet] = useState<DietFilter>("all");
  const [prep, setPrep] = useState<PrepFilter>("all");
  const [query, setQuery] = useState("");

  const meals = ((data as any)?.meals || []) as Meal[];

  const filteredMeals = meals.filter((meal) => {
    if (diet !== "all" && meal.dietLabel !== diet) return false;
    if (prep !== "all" && meal.prepTime !== prep) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      const haystack = `${meal.title} ${meal.notes || ""} ${
        (meal as any).ingredients || ""
      }`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  return (
    <section className="space-y-5">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-db-textMain">
          See what real people are eating
        </h1>
        <p className="text-sm text-db-textMain">
          Log your meals, share simple recipes, and get inspired by friends
          cooking real food every day.
        </p>
      </header>

      <FilterBar
        diet={diet}
        prep={prep}
        query={query}
        onDietChange={setDiet}
        onPrepChange={setPrep}
        onQueryChange={setQuery}
      />

      {isLoading && (
        <p className="text-sm text-db-textMuted">Loading today&apos;s bites…</p>
      )}
      {error && (
        <p className="text-sm text-red-400">
          Something went wrong loading the feed.
        </p>
      )}

      {!isLoading && filteredMeals.length === 0 && (
        <div className="rounded-xl border border-dashed border-db-border bg-db-surfaceSoft p-6 text-sm text-db-textMuted">
          <p className="font-medium text-db-textMain">
            Your plate is empty today.
          </p>
          <p className="mt-1">
            Be the first to log a meal and inspire the next DailyBite.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {filteredMeals.map((meal) => (
          <MealCard key={meal.id} meal={meal} />
        ))}
      </div>
    </section>
  );
}

