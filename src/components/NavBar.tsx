"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { db } from "@/lib/db";

const navItems = [
  { href: "/", label: "Feed" },
  { href: "/log", label: "Log a meal" },
  { href: "/journal", label: "My journal" }
];

export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = db.useAuth();

  const handleSignOut = async () => {
    await db.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="border-b border-db-border bg-db-surface/80 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-baseline gap-1">
          <span className="text-lg font-semibold tracking-tight text-db-textMain">
            DailyBite
          </span>
          <span className="text-xs text-db-textMuted">beta</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <div className="hidden gap-3 sm:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1 transition-colors duration-200 ${
                  pathname === item.href
                    ? "bg-db-accent text-white shadow-sm"
                    : "text-db-textMuted hover:bg-db-accentSoft hover:text-db-textMain"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          {!isLoading && !user && (
            <Link
              href="/login"
              className="rounded-full bg-db-accent px-3 py-1 text-sm font-medium text-white shadow-sm transition-transform duration-150 hover:-translate-y-0.5 hover:bg-db-accentStrong"
            >
              Log in
            </Link>
          )}
          {!isLoading && user && (
            <div className="flex items-center gap-2">
              <Link
                href={`/u/${user.id}`}
                className="hidden text-xs text-db-textMuted sm:inline"
              >
                {user.email || "My profile"}
              </Link>
              <button
                onClick={handleSignOut}
                className="rounded-full border border-db-border px-3 py-1 text-xs text-db-textMuted transition-colors duration-150 hover:bg-db-surfaceSoft"
              >
                Sign out
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

