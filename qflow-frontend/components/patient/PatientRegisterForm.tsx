"use client";

import { useMemo, useState } from "react";
import { postJson } from "../../lib/qflow-api";

type SubmitStatus =
  | { kind: "idle" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

export interface PatientDTO {
  name: string;
  address: string;
  age: number;
  contactNumber: string;
}

const initialForm: PatientDTO = {
  name: "",
  address: "",
  age: 0,
  contactNumber: "",
};

export function PatientRegisterForm() {
  const [form, setForm] = useState<PatientDTO>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>({ kind: "idle" });

  const canSubmit = useMemo(() => {
    return (
      form.name.trim().length > 0 &&
      form.address.trim().length > 0 &&
      Number.isFinite(form.age) &&
      form.age > 0 &&
      form.contactNumber.trim().length > 0 &&
      !isSubmitting
    );
  }, [form, isSubmitting]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ kind: "idle" });

    const payload: PatientDTO = {
      name: form.name.trim(),
      address: form.address.trim(),
      age: Number(form.age),
      contactNumber: form.contactNumber.trim(),
    };

    setIsSubmitting(true);
    try {
      await postJson<unknown>("/api/patients/register", payload);
      setForm(initialForm);
      setStatus({ kind: "success", message: "Patient registered successfully." });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed.";
      setStatus({ kind: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-8 text-center">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200">
            QFlow • Patient Registration
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Register a Patient
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Enter patient details to add them to the queue.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-lg shadow-slate-200/50 backdrop-blur dark:border-slate-800 dark:bg-slate-950/60 dark:shadow-none sm:p-8">
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g., Jane Doe"
                required
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none ring-0 transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50"
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={form.address}
                onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                placeholder="Street, City, State"
                required
                rows={3}
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Age
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min={1}
                  step={1}
                  value={Number.isFinite(form.age) ? form.age : 0}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, age: e.target.valueAsNumber }))
                  }
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50"
                />
              </div>

              <div>
                <label
                  htmlFor="contactNumber"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Contact Number
                </label>
                <input
                  id="contactNumber"
                  name="contactNumber"
                  type="tel"
                  value={form.contactNumber}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, contactNumber: e.target.value }))
                  }
                  placeholder="e.g., +1 555 123 4567"
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50"
                />
              </div>
            </div>

            {status.kind !== "idle" && (
              <div
                className={
                  status.kind === "success"
                    ? "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200"
                    : "rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200"
                }
                role="status"
                aria-live="polite"
              >
                {status.message}
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              {isSubmitting && (
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                  aria-hidden="true"
                />
              )}
              {isSubmitting ? "Loading..." : "Register"}
            </button>

            <p className="text-center text-xs text-slate-500 dark:text-slate-400">
              Backend endpoint:{" "}
              <span className="font-mono">/api/patients/register</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
