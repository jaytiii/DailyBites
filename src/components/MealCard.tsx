"use client";

import Link from "next/link";
import { db } from "@/lib/db";

export type Meal = {
  id: string;
  title: string;
  mealType: string;
  dietLabel: string;
  prepTime: string;
  notes?: string | null;
  createdAt: Date;
  userId: string;
  hasRecipe: boolean;
};

export function MealCard({
  meal,
  showAuthor = true,
  showDate = true
}: {
  meal: Meal;
  showAuthor?: boolean;
  showDate?: boolean;
}) {
  const dietBadge =
    meal.dietLabel === "vegan"
      ? "🌱 Vegan"
      : meal.dietLabel === "vegetarian"
        ? "🥦 Vegetarian"
        : "🍗 Non‑Veg";

  const prepBadge =
    meal.prepTime === "quick"
      ? "⚡ Quick"
      : meal.prepTime === "medium"
        ? "🕐 Medium"
        : "🍲 Slow";

  const mealTypeLabel =
    meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1);

  const { data } = db.useQuery({
    $users: {
      $: {
        where: { id: meal.userId }
      }
    }
  } as any);

  const typed = data as any;
  const author = typed?.$users?.[0];

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-db-border bg-db-surface p-4 shadow-sm transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-md">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-db-textMain">
            {meal.title}
          </h3>
          <p className="text-xs text-db-textMuted">{mealTypeLabel}</p>
        </div>
        <div className="flex flex-col items-end gap-1 text-[11px]">
          <span className="rounded-full bg-db-accentSoft px-2 py-0.5 text-db-accentStrong">
            {dietBadge}
          </span>
          <span className="rounded-full bg-db-surfaceSoft px-2 py-0.5 text-db-textMuted">
            {prepBadge}
          </span>
        </div>
      </header>
      {meal.notes && (
        <p className="text-sm text-db-textMain/80">
          {meal.notes.length > 140
            ? meal.notes.slice(0, 140).trimEnd() + "…"
            : meal.notes}
        </p>
      )}
      <footer className="mt-1 flex items-center justify-between text-xs text-db-textMuted">
        <div className="flex flex-col gap-1">
          {showAuthor && author && (
            <Link href={`/u/${author.id}`} className="text-xs hover:text-db-accentStrong">
              Posted by {author.displayName || author.email || "DailyBite cook"}
            </Link>
          )}
          {showDate && (
            <span>
              {meal.createdAt instanceof Date
                ? meal.createdAt.toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })
                : ""}
            </span>
          )}
        </div>
        {meal.hasRecipe && (
          <Link
            href={`/meals/${meal.id}`}
            className="rounded-full bg-db-accentSoft px-3 py-1 text-xs font-medium text-db-accentStrong transition-colors duration-150 hover:bg-db-accent hover:text-white"
          >
            View recipe
          </Link>
        )}
      </footer>
    </article>
  );
}

