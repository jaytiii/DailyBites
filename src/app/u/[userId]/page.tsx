"use client";

import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/db";
import { MealCard, type Meal } from "@/components/MealCard";

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const { user: currentUser, isLoading: authLoading } = db.useAuth();

  if (!authLoading && !currentUser) {
    router.replace("/login");
  }

  const { isLoading, error, data } = db.useQuery({
    $users: {
      $: {
        where: { id: userId }
      }
    },
    meals: {
      $: {
        where: { userId },
        order: { createdAt: "desc" }
      }
    }
  } as any);

  const typed = data as any;
  const profile = typed?.$users?.[0];
  const meals = (typed?.meals || []) as Meal[];

  return (
    <section className="space-y-4">
      {isLoading && (
        <p className="text-sm text-slate-300">Loading this cook&apos;s page…</p>
      )}
      {error && (
        <p className="text-sm text-red-400">
          We couldn&apos;t load this DailyBite profile.
        </p>
      )}
      {profile && (
        <header className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-semibold text-emerald-200">
              {(profile.displayName || profile.email || "Cook")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-50">
                {profile.displayName || profile.email || "DailyBite cook"}
              </h1>
              <p className="text-xs text-slate-400">
                Sharing everyday meals with friends.
              </p>
            </div>
          </div>
          {profile.bio && (
            <p className="mt-3 text-sm text-slate-200">{profile.bio}</p>
          )}
        </header>
      )}

      {!isLoading && !profile && (
        <p className="text-sm text-slate-300">
          This profile is not available. It may have been removed.
        </p>
      )}

      {meals.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-200">
            Recent meals
          </h2>
          {meals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              showAuthor={false}
              showDate={true}
            />
          ))}
        </div>
      )}

      {!isLoading && profile && meals.length === 0 && (
        <p className="text-sm text-slate-300">
          No meals to show yet. Check back soon for fresh bites.
        </p>
      )}
    </section>
  );
}

