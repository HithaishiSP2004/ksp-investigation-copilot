"use client";

import React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#060911] text-slate-100 min-h-screen flex items-center justify-center p-6 font-mono">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-6 text-center space-y-4 shadow-2xl">
          <div className="inline-flex p-3 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-slate-100">Console Session Error</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {error?.message || "An unexpected system error occurred."}
          </p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded transition-colors cursor-pointer"
          >
            Reload Console
          </button>
        </div>
      </body>
    </html>
  );
}
