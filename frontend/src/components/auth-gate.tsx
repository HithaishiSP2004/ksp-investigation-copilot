"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/auth-context";
import { LoginView } from "@/features/auth/login-view";

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent SSR/Client hydration mismatches by ensuring consistent initial client render
  if (!mounted || isLoading) {
    return <LoginView />;
  }

  if (!isAuthenticated || !user) {
    return <LoginView />;
  }

  return <>{children}</>;
}
