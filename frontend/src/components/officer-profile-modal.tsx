"use client";

import React from "react";
import Image from "next/image";
import { useAuth } from "@/features/auth/auth-context";
import { useLocale } from "@/lib/locales-provider";
import { Button } from "@/components/ui/button";
import {
  X,
  BadgeCheck,
  Building2,
  Phone,
  Mail,
  Award,
  LogOut,
  Languages,
  Sun,
  Moon,
  Lock,
} from "lucide-react";

interface OfficerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export function OfficerProfileModal({
  isOpen,
  onClose,
  theme,
  onToggleTheme,
}: OfficerProfileModalProps) {
  const { user, logout } = useAuth();
  const { t, locale, setLocale } = useLocale();

  if (!isOpen || !user) return null;

  const isKannada = locale === "kn";
  const appName = isKannada ? "ತಳವಾರ" : "TALAARI";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl text-foreground animate-scale-up">

        {/* Header Government Banner */}
        <div className="relative bg-gradient-to-r from-blue-900/40 via-primary/20 to-amber-500/10 p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0">
              <Image
                src="/talaari-logo.png"
                alt="TALAARI Emblem"
                width={40}
                height={40}
                style={{ width: "auto", height: "auto" }}
                className="object-contain drop-shadow-md"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-serif font-extrabold tracking-wider text-amber-400 uppercase">
                  {appName} OS
                </span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold uppercase">
                  {t("profileVerifiedIo")}
                </span>
              </div>
              <h2 className="text-sm font-bold text-foreground">
                {t("profileTitle")}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Profile Details Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">

          {/* Officer Main Badge */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/80">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-extrabold text-lg shadow-md ring-2 ring-primary/40">
              {user.firstName[0]}
              {user.lastName[0]}
              <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-card">
                <BadgeCheck className="h-3 w-3" />
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-foreground truncate">
                  {user.firstName} {user.lastName}
                </h3>
                <span className="font-mono text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  KGID: {user.kgid}
                </span>
              </div>
              <p className="text-xs font-semibold text-primary mt-0.5">
                {t(user.role === "investigator" ? "roleInvestigator" : "roleSuperintendent")}
              </p>
              <p className="text-[10.5px] text-muted-foreground font-medium truncate">
                {user.stationName || "Bengaluru City Police"} — {user.districtName || "Crime Branch CCRB"}
              </p>
            </div>
          </div>

          {/* Security Clearance & Station Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-muted/20 border border-border/60 space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground font-bold text-[10px] uppercase">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                <span>{t("profileStationUnit")}</span>
              </div>
              <p className="font-semibold text-foreground text-xs">{user.stationName || "CCRB Cyber Crime Vault"}</p>
            </div>

            <div className="p-3 rounded-lg bg-muted/20 border border-border/60 space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground font-bold text-[10px] uppercase">
                <Lock className="h-3.5 w-3.5 text-amber-500" />
                <span>{t("profileSecurityClearance")}</span>
              </div>
              <p className="font-mono font-bold text-amber-500 text-xs">TOP SECRET // LEVEL-5</p>
            </div>

            <div className="p-3 rounded-lg bg-muted/20 border border-border/60 space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground font-bold text-[10px] uppercase">
                <Mail className="h-3.5 w-3.5 text-primary" />
                <span>{t("profileOfficialEmail")}</span>
              </div>
              <p className="font-mono text-foreground text-xs truncate">
                {user.firstName?.toLowerCase()}.{user.lastName?.toLowerCase()}@ksp.gov.in
              </p>
            </div>

            <div className="p-3 rounded-lg bg-muted/20 border border-border/60 space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground font-bold text-[10px] uppercase">
                <Phone className="h-3.5 w-3.5 text-primary" />
                <span>{t("profileEncryptedComms")}</span>
              </div>
              <p className="font-mono text-foreground text-xs">+91 98450 {user.kgid?.slice(-5) || "12345"}</p>
            </div>
          </div>

          {/* Active Performance Statistics */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
            <h4 className="text-[10.5px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-primary" />
              <span>{t("profileActiveCommand")}</span>
            </h4>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-2 rounded-lg bg-card border border-border">
                <span className="block text-lg font-extrabold text-foreground font-mono">12</span>
                <span className="text-[9.5px] text-muted-foreground font-semibold">{t("profileActiveFirs")}</span>
              </div>
              <div className="p-2 rounded-lg bg-card border border-border">
                <span className="block text-lg font-extrabold text-foreground font-mono">48</span>
                <span className="text-[9.5px] text-muted-foreground font-semibold">{t("profileEvidences")}</span>
              </div>
              <div className="p-2 rounded-lg bg-card border border-border">
                <span className="block text-lg font-extrabold text-emerald-500 font-mono">100%</span>
                <span className="text-[9.5px] text-muted-foreground font-semibold">{t("profileVerified")}</span>
              </div>
            </div>
          </div>

          {/* Quick Controls & Preferences */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocale(locale === "en" ? "kn" : "en")}
              className="flex-1 h-9 text-xs font-bold cursor-pointer"
            >
              <Languages className="h-4 w-4 mr-1.5 text-primary" />
              <span>{isKannada ? t("profileSwitchToEnglish") : t("profileSwitchToKannada")}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onToggleTheme}
              className="flex-1 h-9 text-xs font-bold cursor-pointer"
            >
              {theme === "light" ? (
                <>
                  <Moon className="h-4 w-4 mr-1.5 text-primary" />
                  <span>{t("profileDarkMode")}</span>
                </>
              ) : (
                <>
                  <Sun className="h-4 w-4 mr-1.5 text-amber-400" />
                  <span>{t("profileLightMode")}</span>
                </>
              )}
            </Button>
          </div>

          {/* Logout Action */}
          <Button
            variant="destructive"
            size="sm"
            onClick={logout}
            className="w-full h-9 text-xs font-bold cursor-pointer"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span>{t("logoutTooltip")}</span>
          </Button>

        </div>
      </div>
    </div>
  );
}
