"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";

export function StartupCheck() {
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    // Validate required environment configuration
    // During local development, fallback values are tolerated.
    // In production, missing variables trigger warning prompts.
    const isProduction = process.env.NODE_ENV === "production";
    const catalystProjId = process.env.NEXT_PUBLIC_CATALYST_PROJECT_ID;

    if (isProduction && (!catalystProjId || catalystProjId === "mock_project_id")) {
      queueMicrotask(() => {
        setWarning(
          "Production Readiness Alert: Zoho Catalyst configuration project ID is missing or set to mock. " +
          "Please specify NEXT_PUBLIC_CATALYST_PROJECT_ID in your deployment settings."
        );
      });
    }
  }, []);

  if (!warning) return null;

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-600 px-4 py-2.5 text-xs font-semibold flex items-center justify-between gap-3 animate-slide-down shrink-0">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
        <span>{warning}</span>
      </div>
      <button 
        onClick={() => setWarning(null)}
        className="text-amber-500 hover:text-amber-700 cursor-pointer"
        aria-label="Dismiss warning"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
