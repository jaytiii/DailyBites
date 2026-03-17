import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { NavBar } from "@/components/NavBar";

export const metadata: Metadata = {
  title: "DailyBite",
  description: "A social meal journal for real everyday cooking."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-db-bg text-db-textMain">
        <NavBar />
        <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-4xl flex-col gap-6 px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}

