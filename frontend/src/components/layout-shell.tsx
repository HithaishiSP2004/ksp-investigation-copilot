"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/features/auth/auth-context";
import { useLocale } from "@/lib/locales-provider";
import { Button } from "@/components/ui/button";
import { OfficerProfileModal } from "./officer-profile-modal";
import {
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
  Bell,
  UserCheck
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
  const [profileOpen, setProfileOpen] = useState(false);

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

  const isKannada = locale === "kn";
  const appName = isKannada ? "ತಳವಾರ" : "TALAARI";
  const appSubtitle = isKannada ? "AI ತನಿಖಾ ಕನ್ಸೋಲ್" : "AI INVESTIGATION CONSOLE";

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
        <div className="flex h-16 items-center gap-3 px-5 border-b border-border">
          <div className="relative h-9 w-9 shrink-0 flex items-center justify-center">
            <Image
              src="/talaari-logo.png"
              alt="TALAARI Official Logo"
              width={36}
              height={36}
              priority
              style={{ width: "auto", height: "auto" }}
              className="object-contain drop-shadow-sm"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="font-serif font-extrabold text-base leading-none tracking-wider bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent truncate uppercase">
              {appName}
            </h1>
            <span className="text-[9.5px] font-bold text-muted-foreground uppercase tracking-wider font-mono pt-1 truncate">
              {appSubtitle}
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

        {/* Sidebar Footer User Profile Button */}
        {user && (
          <div className="p-3 border-t border-border bg-muted/30">
            <button
              onClick={() => setProfileOpen(true)}
              className="flex w-full items-center gap-3 p-2 rounded-lg hover:bg-muted/80 transition-colors text-left group cursor-pointer border border-transparent hover:border-border"
              title={t("profileTitle")}
            >
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-extrabold text-sm ring-1 ring-primary/30 group-hover:scale-105 transition-transform">
                {user.firstName[0]}
                {user.lastName[0]}
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-[10px] text-muted-foreground truncate leading-none mt-0.5">
                  {t(user.role === "investigator" ? "roleInvestigator" : "roleSuperintendent")}
                </p>
              </div>
              <UserCheck className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </button>
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

          {/* Action Tools (Language, Theme, Notification, Profile, Logout) */}
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

            {/* Officer Profile Modal Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setProfileOpen(true)}
              title={t("profileTitle")}
              className="h-9 w-9 rounded-md hover:bg-primary/10 hover:text-primary"
            >
              <UserCheck className="h-4 w-4" />
            </Button>

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

      {/* Interactive Officer Profile Modal */}
      <OfficerProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    </div>
  );
}
