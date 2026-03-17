"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { id } from "@instantdb/react";
import { db } from "@/lib/db";

type MealType = "breakfast" | "lunch" | "dinner" | "snack";
type DietLabel = "vegan" | "vegetarian" | "non_veg";
type PrepTime = "quick" | "medium" | "slow";

export default function LogMealPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = db.useAuth();

  if (!authLoading && !user) {
    router.replace("/login");
  }

  const [mealType, setMealType] = useState<MealType>("lunch");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [dietLabel, setDietLabel] = useState<DietLabel>("vegan");
  const [prepTime, setPrepTime] = useState<PrepTime>("quick");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setError(null);
    const hasRecipe = Boolean(ingredients.trim().length || steps.trim().length);

    try {
      const mealId = id();

      await db.transact(
        db.tx.meals[mealId].update({
          userId: user.id,
          title,
          mealType,
          date: new Date(date),
          notes: notes || null,
          dietLabel,
          prepTime,
          ingredients: ingredients || null,
          steps: steps || null,
          hasRecipe,
          createdAt: new Date()
        })
      );
      router.push("/journal");
    } catch (err: any) {
      setError(
        err?.body?.message ||
          "We couldn't save this meal. Please try again in a moment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const mealTypes: { value: MealType; label: string }[] = [
    { value: "breakfast", label: "Breakfast" },
    { value: "lunch", label: "Lunch" },
    { value: "dinner", label: "Dinner" },
    { value: "snack", label: "Snack" }
  ];

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Log a meal</h1>
        <p className="text-sm text-slate-300">
          Capture what you actually ate today. Simple notes, optional recipe,
          no pressure.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border border-db-border bg-white p-5 shadow-sm"
      >
        <div className="space-y-2">
          <p className="text-xs font-medium text-db-textMain">Meal type</p>
          <div className="flex flex-wrap gap-2">
            {mealTypes.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setMealType(opt.value)}
                className={`rounded-full px-3 py-1 text-xs transition-colors duration-150 ${
                  mealType === opt.value
                    ? "bg-emerald-200 text-db-textMain"
                    : "bg-emerald-50 text-db-textMuted hover:bg-emerald-100"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs text-db-textMain" htmlFor="title">
              Meal title
            </label>
            <input
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Chickpea stir fry, avocado toast…"
              className="w-full rounded-lg border border-db-border bg-white px-3 py-2 text-sm text-db-textMain outline-none ring-db-accent/40 focus:ring-1"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-db-textMain" htmlFor="date">
              Date
            </label>
            <input
              id="date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-db-border bg-white px-3 py-2 text-sm text-db-textMain outline-none ring-db-accent/40 focus:ring-1"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-db-textMain" htmlFor="notes">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Added extra chilli, swapped rice for quinoa…"
            className="w-full rounded-lg border border-db-border bg-white px-3 py-2 text-sm text-db-textMain outline-none ring-db-accent/40 focus:ring-1"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs text-db-textMain">Diet label</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setDietLabel("vegan")}
                className={`rounded-full px-3 py-1 text-xs transition-colors duration-150 ${
                  dietLabel === "vegan"
                    ? "bg-emerald-200 text-db-textMain"
                    : "bg-emerald-50 text-db-textMuted hover:bg-emerald-100"
                }`}
              >
                🌱 Vegan
              </button>
              <button
                type="button"
                onClick={() => setDietLabel("vegetarian")}
                className={`rounded-full px-3 py-1 text-xs transition-colors duration-150 ${
                  dietLabel === "vegetarian"
                    ? "bg-lime-200 text-db-textMain"
                    : "bg-lime-50 text-db-textMuted hover:bg-lime-100"
                }`}
              >
                🥦 Vegetarian
              </button>
              <button
                type="button"
                onClick={() => setDietLabel("non_veg")}
                className={`rounded-full px-3 py-1 text-xs transition-colors duration-150 ${
                  dietLabel === "non_veg"
                    ? "bg-orange-200 text-db-textMain"
                    : "bg-orange-50 text-db-textMuted hover:bg-orange-100"
                }`}
              >
                🍗 Non‑Veg
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-db-textMain">Prep time</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setPrepTime("quick")}
                className={`rounded-full px-3 py-1 text-xs transition-colors duration-150 ${
                  prepTime === "quick"
                    ? "bg-sky-200 text-db-textMain"
                    : "bg-sky-50 text-db-textMuted hover:bg-sky-100"
                }`}
              >
                ⚡ Quick (&lt; 15 min)
              </button>
              <button
                type="button"
                onClick={() => setPrepTime("medium")}
                className={`rounded-full px-3 py-1 text-xs transition-colors duration-150 ${
                  prepTime === "medium"
                    ? "bg-sky-200 text-db-textMain"
                    : "bg-sky-50 text-db-textMuted hover:bg-sky-100"
                }`}
              >
                🕐 Medium (~30 min)
              </button>
              <button
                type="button"
                onClick={() => setPrepTime("slow")}
                className={`rounded-full px-3 py-1 text-xs transition-colors duration-150 ${
                  prepTime === "slow"
                    ? "bg-sky-200 text-db-textMain"
                    : "bg-sky-50 text-db-textMuted hover:bg-sky-100"
                }`}
              >
                🍲 Slow (weekend project)
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-2 rounded-lg border border-db-border bg-sky-50 p-3">
          <p className="text-xs font-medium text-db-textMain">
            Optional recipe card
          </p>
          <p className="text-xs text-db-textMuted">
            Keep it casual. A short ingredient list and a few simple steps are
            perfect.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs text-db-textMain" htmlFor="ingredients">
                Ingredients
              </label>
              <textarea
                id="ingredients"
                rows={4}
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder={"Chickpeas\nGarlic\nSpinach\nOlive oil\nChilli flakes"}
                className="w-full rounded-lg border border-db-border bg-white px-3 py-2 text-xs text-db-textMain outline-none ring-db-accent/40 focus:ring-1"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-db-textMain" htmlFor="steps">
                Steps
              </label>
              <textarea
                id="steps"
                rows={4}
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                placeholder={"1. Sauté garlic.\n2. Add chickpeas.\n3. Stir in spinach.\n4. Finish with lemon."}
                className="w-full rounded-lg border border-db-border bg-white px-3 py-2 text-xs text-db-textMain outline-none ring-db-accent/40 focus:ring-1"
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-400" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center rounded-lg bg-db-accent px-3 py-2 text-sm font-medium text-white shadow-sm transition-transform duration-150 hover:-translate-y-0.5 hover:bg-db-accentStrong disabled:opacity-60"
        >
          {submitting ? "Saving your meal…" : "Save meal"}
        </button>
      </form>
    </section>
  );
}

