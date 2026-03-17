"use client";

import { useRouter, useParams } from "next/navigation";
import { db } from "@/lib/db";

function splitLines(text?: string | null): string[] {
  if (!text) return [];
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function MealDetailPage() {
  const router = useRouter();
  const params = useParams();
  const mealId = params.mealId as string;
  const { user, isLoading: authLoading } = db.useAuth();

  if (!authLoading && !user) {
    router.replace("/login");
  }

  const { isLoading, error, data } = db.useQuery({
    meals: {
      $: {
        where: { id: mealId }
      }
    }
  } as any);

  const rawData = data as any;
  const meal = rawData?.meals?.[0] as any;

  const ingredients = splitLines(meal?.ingredients);
  const steps = splitLines(meal?.steps);

  const dietBadge =
    meal?.dietLabel === "vegan"
      ? "🌱 Vegan"
      : meal?.dietLabel === "vegetarian"
        ? "🥦 Vegetarian"
        : "🍗 Non‑Veg";

  const prepBadge =
    meal?.prepTime === "quick"
      ? "⚡ Quick"
      : meal?.prepTime === "medium"
        ? "🕐 Medium"
        : "🍲 Slow";

  return (
    <section className="space-y-4">
      {isLoading && (
        <p className="text-sm text-slate-300">Loading your recipe…</p>
      )}
      {error && (
        <p className="text-sm text-red-400">
          We couldn&apos;t load this recipe.
        </p>
      )}
      {!isLoading && !meal && (
        <p className="text-sm text-slate-300">
          This meal could not be found. It may have been deleted.
        </p>
      )}
      {meal && (
        <>
          <header className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              DailyBite recipe
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              {meal.title}
            </h1>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-emerald-300">
                {dietBadge}
              </span>
              <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-sky-300">
                {prepBadge}
              </span>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-slate-200">
                {meal.mealType}
              </span>
            </div>
          </header>

          <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <h2 className="text-sm font-semibold text-slate-100">
                Ingredients
              </h2>
              {ingredients.length === 0 && (
                <p className="text-xs text-slate-300">
                  No ingredient list yet. Cook it your way and add notes in your
                  own log.
                </p>
              )}
              {ingredients.length > 0 && (
                <ul className="list-disc space-y-1 pl-5 text-sm text-slate-100">
                  {ingredients.map((line, idx) => (
                    <li key={idx}>{line}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <h2 className="text-sm font-semibold text-slate-100">Steps</h2>
              {steps.length === 0 && (
                <p className="text-xs text-slate-300">
                  No formal steps here yet. Use this as inspiration and make it
                  your own.
                </p>
              )}
              {steps.length > 0 && (
                <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-100">
                  {steps.map((line, idx) => (
                    <li key={idx}>{line}</li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

