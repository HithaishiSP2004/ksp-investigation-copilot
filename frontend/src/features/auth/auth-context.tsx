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

const loadCDNScript = (resolve: (value: { autoInitialized: boolean }) => void) => {
  const cdnScript = document.createElement("script");
  cdnScript.src = "https://static.zoho-cdn.com/catalyst/sdk/js/3.0.0/catalystWebSDK.js";
  cdnScript.async = true;

  cdnScript.onload = () => {
    console.log("Catalyst CDN SDK fallback loaded successfully.");
    resolve({ autoInitialized: false });
  };

  cdnScript.onerror = () => {
    console.warn("Failed to load Catalyst CDN SDK fallback.");
    resolve({ autoInitialized: false });
  };

  document.head.appendChild(cdnScript);
};

const loadCatalystScript = (): Promise<{ autoInitialized: boolean }> => {
  return new Promise((resolve) => {
    const win = typeof window !== "undefined" ? (window as unknown as CustomWindow) : null;
    if (!win) {
      resolve({ autoInitialized: false });
      return;
    }

    if (win.catalyst) {
      resolve({ autoInitialized: false });
      return;
    }

    // Explicitly detect Zoho Catalyst Slate hosting, Client Hosting, or AppSail domains
    const isCatalystHosted = 
      win.location.hostname.endsWith(".onslate.com") || win.location.hostname === "onslate.com" ||
      win.location.hostname.endsWith(".onslate.in") || win.location.hostname === "onslate.in" ||
      win.location.hostname.endsWith(".onslate.eu") || win.location.hostname === "onslate.eu" ||
      win.location.hostname.endsWith(".catalystserverless.com") || win.location.hostname === "catalystserverless.com" ||
      win.location.hostname.endsWith(".catalystappsail.com") || win.location.hostname === "catalystappsail.com";

    const script = document.createElement("script");
    script.async = true;

    if (isCatalystHosted) {
      console.log("Catalyst hosting environment detected. Loading Hosted SDK...");
      script.src = "/__catalyst/sdk/init.js";
      script.onload = () => {
        if (win.catalyst) {
          console.log("Catalyst Hosted SDK loaded and auto-initialized successfully.");
          resolve({ autoInitialized: true });
        } else {
          console.warn("Hosted SDK loaded but win.catalyst is not defined. Attempting CDN fallback.");
          document.head.removeChild(script);
          loadCDNScript(resolve);
        }
      };
      script.onerror = () => {
        console.warn("Failed to load Hosted SDK. Attempting CDN fallback.");
        document.head.removeChild(script);
        loadCDNScript(resolve);
      };
    } else {
      console.log("Local/External environment detected. Loading CDN SDK...");
      script.src = "https://static.zoho-cdn.com/catalyst/sdk/js/3.0.0/catalystWebSDK.js";
      script.onload = () => {
        console.log("Catalyst CDN SDK loaded successfully.");
        resolve({ autoInitialized: false });
      };
      script.onerror = () => {
        console.warn("Failed to load Catalyst CDN SDK (offline mode).");
        resolve({ autoInitialized: false });
      };
    }

    document.head.appendChild(script);
  });
};

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
  const [authMode, setAuthMode] = useState<"catalyst" | "mock">(
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
      // Catalyst Session Recovery with dynamic loader
      loadCatalystScript().then(async ({ autoInitialized }) => {
        if (!active) return;
        
        const win = typeof window !== "undefined" ? (window as unknown as CustomWindow) : null;
        if (win && win.catalyst) {
          try {
            // Initialize the Web SDK with credentials only if it wasn't auto-initialized
            if (!autoInitialized && win.catalyst.init) {
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
          console.warn("Catalyst Web SDK failed to load. Falling back to Mock authentication mode.");
          if (active) {
            queueMicrotask(() => {
              setAuthMode("mock");
            });
          }
        }
      });
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
