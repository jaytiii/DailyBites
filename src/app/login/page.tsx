"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/db";

export default function LoginPage() {
  const { user, isLoading } = db.useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isLoading && user) {
    router.replace("/");
  }

  const handleSendCode = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      await db.auth.sendMagicCode({ email });
      setMessage("Check your email for a 6-digit code.");
      setStep("code");
    } catch (err: any) {
      setError(err?.body?.message || "Something went wrong sending the code.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyCode = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      await db.auth.signInWithMagicCode({ email, code });
      setMessage("Welcome back to DailyBite!");
      router.replace("/");
    } catch (err: any) {
      setError(err?.body?.message || "Invalid code, please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
      <h1 className="text-2xl font-semibold tracking-tight">Log in</h1>
      <p className="text-sm text-slate-300">
        DailyBite uses magic codes. No passwords, just a code sent to your
        email.
      </p>

      {step === "email" && (
        <form onSubmit={handleSendCode} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm text-slate-200" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/60 focus:ring-2"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center rounded-lg bg-emerald-500 px-3 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
          >
            {submitting ? "Sending code..." : "Send magic code"}
          </button>
        </form>
      )}

      {step === "code" && (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm text-slate-200" htmlFor="code">
              6-digit code
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none ring-emerald-500/60 focus:ring-2"
              placeholder="123456"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center rounded-lg bg-emerald-500 px-3 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
          >
            {submitting ? "Signing you in..." : "Sign in"}
          </button>
          <button
            type="button"
            onClick={() => setStep("email")}
            className="w-full text-xs text-slate-300 underline-offset-2 hover:underline"
          >
            Use a different email
          </button>
        </form>
      )}

      {message && (
        <p className="text-xs text-emerald-300" role="status">
          {message}
        </p>
      )}
      {error && (
        <p className="text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}

