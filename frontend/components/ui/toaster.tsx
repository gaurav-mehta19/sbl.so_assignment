'use client';

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        classNames: {
          toast: "rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl",
          title: "text-slate-900 dark:text-white font-medium",
          description: "text-slate-600 dark:text-slate-400",
          success: "border-emerald-200 dark:border-emerald-800",
          error: "border-red-200 dark:border-red-800",
          warning: "border-amber-200 dark:border-amber-800",
          info: "border-blue-200 dark:border-blue-800",
        },
      }}
    />
  );
}
