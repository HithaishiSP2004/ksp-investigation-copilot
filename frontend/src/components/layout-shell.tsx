"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/auth-context";
import { useLocale } from "@/lib/locales-provider";
import { Button } from "@/components/ui/button";
import {
  Shield,
  LayoutDashboard,
  FolderOpen,
  FileText,
  Clock,
  Compass,
  FilePlus2,
  LogOut,
  Sun,
  Moon,
  Search,
  Languages,
  Menu,
  X,
  Bell
} from "lucide-react";

interface LayoutShellProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function LayoutShell({ children, activeTab = "dashboard", onTabChange }: LayoutShellProps) {
  const { user, logout } = useAuth();
  const { t, locale, setLocale } = useLocale();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Initialize theme from localStorage/system preference
  useEffect(() => {
    let active = true;
    const savedTheme = localStorage.getItem("ksp_theme") as "light" | "dark";
    if (savedTheme) {
      queueMicrotask(() => {
        if (active) setTheme(savedTheme);
      });
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      queueMicrotask(() => {
        if (active) setTheme(prefersDark ? "dark" : "light");
      });
      document.documentElement.classList.toggle("dark", prefersDark);
    }
    return () => {
      active = false;
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("ksp_theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const toggleLanguage = () => {
    setLocale(locale === "en" ? "kn" : "en");
  };

  const navItems = [
    { id: "dashboard", label: t("navDashboard"), icon: LayoutDashboard },
    { id: "cases", label: t("navCases"), icon: FolderOpen },
    { id: "evidence", label: t("navEvidence"), icon: FilePlus2 },
    { id: "timeline", label: t("navTimeline"), icon: Clock },
    { id: "copilot", label: t("navCopilot"), icon: Compass },
    { id: "reports", label: t("navReports"), icon: FileText },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground transition-all-custom">
      {/* Mobile Sidebar Backdrop */}
      {!sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(true)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* Sidebar Layout */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-card border-r border-border transition-transform duration-300 md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header Brand */}
        <div className="flex h-16 items-center gap-3 px-6 border-b border-border">
          <Shield className="h-6 w-6 text-primary" />
          <div>
            <h1 className="font-bold text-sm leading-none tracking-tight text-foreground">
              KSP COPILOT
            </h1>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              {t("officerBadge")}
            </span>
          </div>
        </div>

        {/* Sidebar Navigation Links */}
        <nav className="flex-1 space-y-1.5 px-4 py-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange?.(item.id)}
              className={`flex w-full items-center gap-3 px-4 py-2.5 rounded-md text-sm font-semibold transition-all-custom cursor-pointer ${
                activeTab === item.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-secondary-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Sidebar Footer User Info */}
        {user && (
          <div className="p-4 border-t border-border bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                {user.firstName[0]}
                {user.lastName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-foreground truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-[10px] text-muted-foreground truncate leading-none mt-0.5">
                  {t(user.role === "investigator" ? "roleInvestigator" : "roleSuperintendent")}
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Workspace Layout */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header Layout */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden border border-border"
              aria-label="Toggle Navigation Sidebar"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Header Search Field */}
            <div className="relative w-72 max-w-xs md:max-w-sm hidden sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder={t("headerSearchPlaceholder")}
                className="h-9 w-full rounded-md border border-border bg-muted/40 pl-9 pr-4 text-xs font-semibold placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all-custom"
              />
            </div>
          </div>

          {/* Action Tools (Language, Theme, Notification, Logout) */}
          <div className="flex items-center gap-2">
            {/* Language Selection */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              title={t("languageToggleTooltip")}
              aria-label="Toggle language"
              className="h-9 w-9 rounded-md"
            >
              <Languages className="h-4 w-4 text-secondary-foreground" />
            </Button>

            {/* Theme Selector */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              title={t("themeToggleTooltip")}
              aria-label="Toggle visual theme"
              className="h-9 w-9 rounded-md"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4 text-secondary-foreground" />
              ) : (
                <Sun className="h-4 w-4 text-secondary-foreground" />
              )}
            </Button>

            {/* Notification placeholder */}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifications"
              className="h-9 w-9 rounded-md relative"
            >
              <Bell className="h-4 w-4 text-secondary-foreground" />
              <span className="absolute top-2 right-2 flex h-1.5 w-1.5 rounded-full bg-accent" />
            </Button>

            <div className="h-5 w-px bg-border mx-1" />

            {/* Logout Tool */}
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              title={t("logoutTooltip")}
              aria-label="Log out of session"
              className="h-9 w-9 rounded-md hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Dynamic Workspace Container */}
        <main className="flex-1 overflow-y-auto p-8 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
