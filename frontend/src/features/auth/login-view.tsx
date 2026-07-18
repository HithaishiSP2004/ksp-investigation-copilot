"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useAuth } from "./auth-context";
import { useLocale } from "@/lib/locales-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Eye, EyeOff, Languages } from "lucide-react";

export function LoginView() {
  const { login, isLoading: authLoading } = useAuth();
  const { t, locale, setLocale } = useLocale();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Validation Schema using Zod
  const loginSchema = zod.object({
    kgid: zod
      .string()
      .min(1, { message: t("requiredKgid") })
      .regex(/^\d{6}$/, { message: "KGID must be exactly 6 digits" }),
    password: zod.string().min(1, { message: t("requiredPassword") }),
  });

  type LoginFormValues = zod.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      kgid: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setErrorMsg(null);
    const success = await login(data.kgid, data.password);
    if (!success) {
      setErrorMsg(t("invalidCredentials"));
    }
  };

  const toggleLanguage = () => {
    setLocale(locale === "en" ? "kn" : "en");
  };

  const loading = authLoading || isSubmitting;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 transition-all-custom">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLanguage}
          className="flex items-center gap-2 border-border"
          aria-label={t("languageToggleTooltip")}
        >
          <Languages className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold text-xs text-secondary-foreground">
            {locale === "en" ? "ಕನ್ನಡ (KN)" : "English (EN)"}
          </span>
        </Button>
      </div>

      <div className="w-full max-w-md space-y-8 bg-card border border-border rounded-xl p-8 shadow-xl transition-all-custom">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Shield className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {t("loginTitle")}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground font-medium">
              {t("loginSubtitle")}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-border"></div>
          <span className="flex-shrink mx-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
            {t("officerSignIn")}
          </span>
          <div className="flex-grow border-t border-border"></div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* KGID Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="kgid"
              className="text-xs font-semibold text-secondary-foreground"
            >
              {t("kgidLabel")}
            </label>
            <Input
              id="kgid"
              type="text"
              maxLength={6}
              disabled={loading}
              placeholder={t("kgidPlaceholder")}
              className={`border-border ${
                errors.kgid ? "border-destructive focus-visible:ring-destructive" : ""
              }`}
              {...register("kgid")}
            />
            {errors.kgid && (
              <p className="text-[11px] font-semibold text-destructive">
                {errors.kgid.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-xs font-semibold text-secondary-foreground"
            >
              {t("passwordLabel")}
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                disabled={loading}
                placeholder={t("passwordPlaceholder")}
                className={`pr-10 border-border ${
                  errors.password
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] font-semibold text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full font-bold h-10 mt-2"
            disabled={loading}
          >
            {loading ? t("authenticating") : t("loginButton")}
          </Button>

          {/* Informational Help */}
          <p className="text-center text-[11px] text-muted-foreground font-medium pt-2">
            {t("forgotPassword")}
          </p>
        </form>

        {/* Demo Helper box */}
        <div className="p-3 bg-muted rounded-md border border-border text-[10px] space-y-1 text-muted-foreground font-medium">
          <p className="font-semibold text-secondary-foreground text-xs">
            Quick Demo Login Info:
          </p>
          <p>• Investigating Officer: <strong className="text-foreground">123456</strong> / <strong className="text-foreground">password</strong></p>
          <p>• Superintendent: <strong className="text-foreground">999999</strong> / <strong className="text-foreground">password</strong></p>
        </div>
      </div>
    </div>
  );
}
