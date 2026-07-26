"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useAuth } from "../auth-context";
import { useLocale } from "@/lib/locales-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Languages, ShieldCheck, Cpu } from "lucide-react";
import { KspEmblemSvg } from "./ksp-emblem-svg";

const loginSchema = zod.object({
  kgid: zod
    .string()
    .min(1, { message: "KGID is required" })
    .regex(/^\d{6}$/, { message: "KGID must be exactly 6 digits" }),
  password: zod.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = zod.infer<typeof loginSchema>;

interface IntegratedAuthModuleProps {
  onAuthStart?: () => void;
  onAuthSuccess?: () => void;
}

export function IntegratedAuthModule({ onAuthStart, onAuthSuccess }: IntegratedAuthModuleProps) {
  const { login } = useAuth();
  const { t, locale, setLocale } = useLocale();

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { kgid: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setErrorMsg(null);
    setIsSubmittingLogin(true);
    onAuthStart?.();

    try {
      const success = await login(data.kgid, data.password);
      if (success) {
        onAuthSuccess?.();
      } else {
        setErrorMsg(t("invalidCredentials"));
      }
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  const handleQuickLogin = (kgid: string) => {
    setValue("kgid", kgid);
    setValue("password", "password");
  };

  const loading = isSubmitting || isSubmittingLogin;

  return (
    <div className="w-full max-w-md mx-auto space-y-4 animate-scale-up z-20">

      {/* Official KSP Emblem & State Identity Header with Frosted Dark Contrast Badge */}
      <KspEmblemSvg showTitle={true} className="h-20 w-20 sm:h-24 sm:w-24" />

      {/* Integrated Auth Module Box */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">

        {/* Top Telemetry Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-5">
          <div className="flex items-center gap-2 text-slate-200">
            <ShieldCheck className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-200">
              {t("officerSignIn")}
            </span>
          </div>

          {/* Language Toggle Switcher (EN <-> KN) */}
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => setLocale(locale === "en" ? "kn" : "en")}
            className="text-xs font-mono text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 border border-amber-500/30 h-7 px-2.5 rounded-lg cursor-pointer transition-colors"
          >
            <Languages className="h-3.5 w-3.5 mr-1 text-amber-400" />
            <span>{locale === "en" ? "ಕನ್ನಡ (KN)" : "English (EN)"}</span>
          </Button>
        </div>

        {/* Loading Overlay Spinner */}
        {loading && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm z-30 flex flex-col items-center justify-center space-y-3">
            <div className="h-7 w-7 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest animate-pulse">
              <Cpu className="h-3.5 w-3.5" />
              <span>{t("authenticating")}</span>
            </div>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
          {errorMsg && (
            <div className="p-2.5 rounded bg-red-950/80 border border-red-800/80 text-red-300 text-xs font-mono font-semibold">
              {errorMsg}
            </div>
          )}

          {/* KGID Field */}
          <div className="space-y-1">
            <label htmlFor="kgid" className="text-xs font-mono text-slate-300 uppercase tracking-wider">
              {t("kgidLabel")}
            </label>
            <Input
              id="kgid"
              type="text"
              inputMode="numeric"
              maxLength={6}
              disabled={loading}
              placeholder={t("kgidPlaceholder")}
              className="bg-slate-950/90 border-slate-700 text-slate-100 font-mono focus-visible:ring-amber-500"
              {...register("kgid")}
            />
            {errors.kgid && (
              <p className="text-[11px] font-mono text-red-400">{errors.kgid.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label htmlFor="password" className="text-xs font-mono text-slate-300 uppercase tracking-wider">
              {t("passwordLabel")}
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                disabled={loading}
                placeholder={t("passwordPlaceholder")}
                className="bg-slate-950/90 border-slate-700 text-slate-100 font-mono focus-visible:ring-amber-500 pr-10"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                disabled={loading}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] font-mono text-red-400">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full font-mono font-bold h-10 mt-2 bg-amber-600 hover:bg-amber-500 text-slate-950 cursor-pointer transition-colors"
          >
            {loading ? t("authenticating") : t("authorizeConsole")}
          </Button>
        </form>

        {/* Quick Demo Logins Helper */}
        <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-400 space-y-1">
          <p className="font-bold text-amber-400 uppercase tracking-wider">{t("quickDemoAccess")}</p>
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleQuickLogin("123456")}
              className="px-2.5 py-1 rounded bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer transition-colors"
            >
              {t("roleInvestigator")} (123456)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("999999")}
              className="px-2.5 py-1 rounded bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer transition-colors"
            >
              {t("roleSuperintendent")} (999999)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
