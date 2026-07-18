"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type OfficerUser = {
  kgid: string;
  firstName: string;
  lastName: string;
  rank: string;
  designation: string;
  stationName: string;
  districtName: string;
  role: "investigator" | "supervisor";
};

interface CatalystAuthUser {
  user_id?: string;
  first_name?: string;
  last_name?: string;
  email_id?: string;
}

interface CatalystInstance {
  init?: (config: { project_id?: string; client_id?: string; auth_domain?: string }) => void;
  auth?: {
    getCurrentUser(): Promise<CatalystAuthUser | null>;
    signOut(): Promise<void>;
  };
}

interface CustomWindow extends Window {
  catalyst?: CatalystInstance;
}

type AuthContextType = {
  user: OfficerUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (kgid: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  authMode: "catalyst" | "mock";
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<OfficerUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Set authMode state during initialization to avoid setState in useEffect
  const [authMode] = useState<"catalyst" | "mock">(
    process.env.NEXT_PUBLIC_CATALYST_PROJECT_ID === "mock_project_id" ? "mock" : "catalyst"
  );

  useEffect(() => {
    let active = true;
    const isMock = authMode === "mock";

    if (isMock) {
      // Mock Session Recovery
      const savedUser = localStorage.getItem("ksp_officer_user");
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          queueMicrotask(() => {
            if (active) setUser(parsed);
          });
        } catch {
          localStorage.removeItem("ksp_officer_user");
        }
      }
      queueMicrotask(() => {
        if (active) setIsLoading(false);
      });
    } else {
      // Catalyst Session Recovery
      let attempts = 0;
      const maxAttempts = 30; // 3 seconds timeout
      
      const interval = setInterval(async () => {
        const win = typeof window !== "undefined" ? (window as unknown as CustomWindow) : null;
        if (win && win.catalyst) {
          clearInterval(interval);
          try {
            // Initialize the Web SDK with credentials from environmental configuration
            if (win.catalyst.init) {
              win.catalyst.init({
                project_id: process.env.NEXT_PUBLIC_CATALYST_PROJECT_ID,
                client_id: process.env.NEXT_PUBLIC_CATALYST_CLIENT_ID,
                auth_domain: process.env.NEXT_PUBLIC_CATALYST_AUTH_DOMAIN
              });
            }

            const auth = win.catalyst.auth;
            if (auth) {
              const currentUser = await auth.getCurrentUser();
              if (currentUser && active) {
                // Map the profile details to the application's unified Officer model
                queueMicrotask(() => {
                  setUser({
                    kgid: currentUser.user_id || "123456",
                    firstName: currentUser.first_name || "Officer",
                    lastName: currentUser.last_name || "",
                    rank: "Sub-Inspector",
                    designation: "Investigating Officer",
                    stationName: "Bengaluru Cyber Crime PS",
                    districtName: "Bengaluru City",
                    role: currentUser.user_id === "999999" ? "supervisor" : "investigator",
                  });
                });
              } else if (active) {
                queueMicrotask(() => {
                  setUser(null);
                });
              }
            }
          } catch (err) {
            console.warn("No active Catalyst session found:", err);
            if (active) {
              queueMicrotask(() => {
                setUser(null);
              });
            }
          } finally {
            if (active) {
              queueMicrotask(() => {
                setIsLoading(false);
              });
            }
          }
        } else {
          attempts++;
          if (attempts >= maxAttempts) {
            clearInterval(interval);
            console.error("Catalyst Web SDK script failed to load. Halting session recovery.");
            if (active) {
              queueMicrotask(() => {
                setUser(null);
                setIsLoading(false);
              });
            }
          }
        }
      }, 100);

      return () => {
        clearInterval(interval);
        active = false;
      };
    }

    return () => {
      active = false;
    };
  }, [authMode]);

  const login = async (kgid: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (authMode === "catalyst") {
        // Under Hosted Authentication, redirect the user to the Catalyst-managed login endpoint
        const redirectUrl = process.env.NEXT_PUBLIC_CATALYST_AUTH_DOMAIN
          ? `https://${process.env.NEXT_PUBLIC_CATALYST_AUTH_DOMAIN}/__catalyst/auth/login`
          : "/__catalyst/auth/login";
        window.location.href = redirectUrl;
        return true;
      }

      // Mock login handling (only available when authMode is "mock")
      if (kgid === "123456" && password === "password") {
        const mockUser: OfficerUser = {
          kgid,
          firstName: "Ramesh",
          lastName: "Kumar",
          rank: "Sub-Inspector",
          designation: "Investigating Officer",
          stationName: "Bengaluru Cyber Crime PS",
          districtName: "Bengaluru City",
          role: "investigator",
        };
        setUser(mockUser);
        localStorage.setItem("ksp_officer_user", JSON.stringify(mockUser));
        setIsLoading(false);
        return true;
      } else if (kgid === "999999" && password === "password") {
        const mockUser: OfficerUser = {
          kgid,
          firstName: "Kiran",
          lastName: "Reddy",
          rank: "DSP",
          designation: "Superintendent of Police",
          stationName: "KSP District Headquarters",
          districtName: "Bengaluru City",
          role: "supervisor",
        };
        setUser(mockUser);
        localStorage.setItem("ksp_officer_user", JSON.stringify(mockUser));
        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return false;
    } catch (err) {
      console.error("Login attempt error:", err);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    if (authMode === "catalyst") {
      try {
        const win = typeof window !== "undefined" ? (window as unknown as CustomWindow) : null;
        if (win && win.catalyst && win.catalyst.auth) {
          // Signout from Catalyst session
          await win.catalyst.auth.signOut();
        }
      } catch (err) {
        console.error("Error signing out from Catalyst:", err);
      }
    }
    setUser(null);
    localStorage.removeItem("ksp_officer_user");
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, authMode }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
