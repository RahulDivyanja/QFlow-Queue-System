"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { postJson } from "../lib/qflow-api";

type TokenValue = string | number;

function extractToken(data: unknown): TokenValue | null {
  if (data == null) return null;

  if (typeof data === "string" || typeof data === "number") {
    return data;
  }

  if (typeof data === "object") {
    const record = data as Record<string, unknown>;
    const candidates = [
      record.tokenNumber,
      record.token,
      record.number,
      record.id,
      record.value,
    ];
    for (const c of candidates) {
      if (typeof c === "string" || typeof c === "number") return c;
    }
  }

  return null;
}

export default function HomePage() {
  const [userName, setUserName] = useState("");
  const [token, setToken] = useState<TokenValue | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => userName.trim().length > 0 && !isLoading,
    [userName, isLoading]
  );

  async function generateToken() {
    setError(null);
    setToken(null);

    const payload = { userName: userName.trim() };
    if (!payload.userName) {
      setError("Please enter your name.");
      return;
    }

    setIsLoading(true);
    try {
      const parsed = await postJson<unknown>("/tokens", payload);

      const extracted = extractToken(parsed);
      if (extracted == null) {
        throw new Error("Token generated, but response format was unexpected.");
      }

      setToken(extracted);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate token.");
    } finally {
      setIsLoading(false);
    }
  }

  function reset() {
    setUserName("");
    setToken(null);
    setError(null);
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-indigo-50 via-white to-slate-50 px-4 py-12 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto w-full max-w-5xl">
        <header className="text-center">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/70 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200">
            QFlow • Queue Management
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
            Skip the Line with QFlow
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
            Get your token in seconds and wait smarter. Clean, fast, and built for
            modern clinics.
          </p>
        </header>

        <main className="mt-10 flex items-center justify-center">
          <section className="w-full max-w-xl">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-lg shadow-slate-200/50 backdrop-blur dark:border-slate-800 dark:bg-slate-950/60 dark:shadow-none sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                    Get Your Token
                  </h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Enter your name to receive a token number.
                  </p>
                </div>
                <Link
                  href="/patient/register"
                  className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                >
                  Patient Registration
                </Link>
              </div>

              {!token ? (
                <div className="mt-6 space-y-4">
                  <div>
                    <label
                      htmlFor="userName"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                    >
                      Enter your name
                    </label>
                    <input
                      id="userName"
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="e.g., John Smith"
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50"
                    />
                  </div>

                  {error && (
                    <div
                      className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200"
                      role="alert"
                    >
                      {error}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={generateToken}
                    disabled={!canSubmit}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading && (
                      <span
                        className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
                        aria-hidden="true"
                      />
                    )}
                    {isLoading ? "Loading..." : "Generate Token"}
                  </button>

                  <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                    Endpoint: <span className="font-mono">POST /tokens</span>
                  </p>
                </div>
              ) : (
                <div className="mt-8">
                  {error && (
                    <div
                      className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200"
                      role="alert"
                    >
                      {error}
                    </div>
                  )}

                  <div className="relative overflow-hidden rounded-2xl border border-indigo-200 bg-linear-to-b from-indigo-600 to-blue-600 p-6 text-white shadow-lg shadow-indigo-200/60 dark:border-indigo-900/40 dark:shadow-none">
                    <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                    <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm/6 text-white/80">Your Token</p>
                        <p className="mt-2 text-5xl font-bold tracking-tight motion-safe:animate-pulse">
                          {token}
                        </p>
                        <p className="mt-2 text-sm text-white/80">
                          Please keep this number ready.
                        </p>
                      </div>
                      <div className="hidden sm:block">
                        <div className="rounded-2xl bg-white/10 px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
                            QFlow Ticket
                          </p>
                          <p className="mt-1 text-sm text-white/80">
                            {userName.trim()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={reset}
                        className="inline-flex flex-1 items-center justify-center rounded-xl bg-white/15 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                      >
                        Get Another Token
                      </button>
                      <Link
                        href="/patient/register"
                        className="inline-flex flex-1 items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                      >
                        Register Patient
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
