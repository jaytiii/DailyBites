"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { id } from "@instantdb/react";
import { db } from "@/lib/db";

export default function SeedMealsPage() {
  const router = useRouter();
  const { user, isLoading } = db.useAuth();
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    if (!user) return;
    setLoading(true);
    setStatus(null);
    setError(null);

    const today = new Date();
    const d = (offsetDays: number) => {
      const copy = new Date(today);
      copy.setDate(copy.getDate() - offsetDays);
      return copy;
    };

    const meals = [
      {
        title: "Chickpea Stir Fry",
        mealType: "lunch",
        date: d(0),
        notes: "Added extra chilli and a squeeze of lemon.",
        dietLabel: "vegan",
        prepTime: "quick",
        ingredients:
          "Chickpeas (canned, drained)\nGarlic\nSpinach\nSoy sauce\nChilli flakes",
        steps:
          "1. Sauté garlic in olive oil.\n2. Add chickpeas and soy sauce, cook 3–4 minutes.\n3. Stir in spinach until wilted.\n4. Finish with chilli flakes and lemon."
      },
      {
        title: "Avocado Toast with Egg",
        mealType: "breakfast",
        date: d(1),
        notes: "Simple weekday breakfast, very filling.",
        dietLabel: "vegetarian",
        prepTime: "quick",
        ingredients:
          "Sourdough bread\nAvocado\nEgg\nLemon\nSalt & pepper",
        steps:
          "1. Toast bread.\n2. Mash avocado with lemon, salt, pepper.\n3. Fry or poach egg.\n4. Spread avocado on toast, top with egg."
      },
      {
        title: "One-Pan Salmon and Veg",
        mealType: "dinner",
        date: d(2),
        notes: "Sheet-pan dinner, minimal cleanup.",
        dietLabel: "non_veg",
        prepTime: "medium",
        ingredients:
          "Salmon fillet\nBroccoli florets\nCherry tomatoes\nOlive oil\nGarlic\nSalt\nPepper",
        steps:
          "1. Preheat oven to 200°C / 400°F.\n2. Toss veg with olive oil, garlic, salt, pepper on tray.\n3. Place salmon on top, season.\n4. Bake 15–18 minutes."
      },
      {
        title: "Yogurt Berry Bowl",
        mealType: "snack",
        date: d(0),
        notes: "Afternoon snack instead of chips.",
        dietLabel: "vegetarian",
        prepTime: "quick",
        ingredients:
          "Greek yogurt\nMixed berries\nGranola\nHoney",
        steps:
          "1. Add yogurt to bowl.\n2. Top with berries and granola.\n3. Drizzle with honey."
      },
      {
        title: "Veggie Pasta Bake",
        mealType: "dinner",
        date: d(3),
        notes: "Weekend batch cook, leftovers for 2 days.",
        dietLabel: "vegetarian",
        prepTime: "slow",
        ingredients:
          "Pasta\nMarinara sauce\nZucchini\nBell pepper\nMozzarella cheese\nOlive oil\nItalian herbs",
        steps:
          "1. Boil pasta until just undercooked.\n2. Sauté chopped veg in olive oil.\n3. Mix pasta, veg, and sauce in baking dish.\n4. Top with mozzarella and bake until bubbly."
      },
      {
        title: "Lentil Buddha Bowl",
        mealType: "lunch",
        date: d(4),
        notes: "Good desk lunch, high protein.",
        dietLabel: "vegan",
        prepTime: "medium",
        ingredients:
          "Cooked lentils\nBrown rice or quinoa\nRoasted sweet potato\nKale\nTahini dressing",
        steps:
          "1. Add rice/quinoa to bowl as base.\n2. Top with lentils, sweet potato, and kale.\n3. Drizzle with tahini dressing."
      }
    ];

    try {
      await db.transact(
        meals.map((meal) =>
          db.tx.meals[id()].update({
            userId: user.id,
            title: meal.title,
            mealType: meal.mealType,
            date: meal.date,
            notes: meal.notes,
            dietLabel: meal.dietLabel,
            prepTime: meal.prepTime,
            ingredients: meal.ingredients,
            steps: meal.steps,
            hasRecipe: Boolean(meal.ingredients || meal.steps),
            createdAt: new Date()
          })
        )
      );
      setStatus("Seeded 6 example meals into your account.");
      router.push("/journal");
    } catch (err: any) {
      setError(
        err?.body?.message ||
          err?.message ||
          "We couldn't seed the meals. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="text-sm text-slate-300">
        Checking your DailyBite account…
      </section>
    );
  }

  if (!user) {
    return (
      <section className="text-sm text-slate-300">
        Please log in first, then visit this page again to seed example meals.
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Seed example meals
        </h1>
        <p className="text-sm text-slate-300">
          This will add 6 example meals to your DailyBite journal so you can
          explore the feed, profiles, and journal views.
        </p>
      </header>

      <button
        type="button"
        onClick={handleSeed}
        disabled={loading}
        className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
      >
        {loading ? "Seeding meals…" : "Add 6 example meals"}
      </button>

      {status && <p className="text-xs text-emerald-300">{status}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </section>
  );
}

