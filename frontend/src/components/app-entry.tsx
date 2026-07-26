"use client";

import React from "react";
import { AuthGate } from "./auth-gate";

interface AppEntryProps {
  children: React.ReactNode;
}

export function AppEntry({ children }: AppEntryProps) {
  return <AuthGate>{children}</AuthGate>;
}
