"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { CaseDetailsUI, CaseMaster, CaseStatus, CasePriority } from "../types";
import { useCases } from "../hooks/use-cases";
import { useLocale } from "@/lib/locales-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface CaseFormProps {
  caseRecord?: CaseDetailsUI | null; // If provided, we are editing. Otherwise, creating.
  onClose: () => void;
  onSuccess: (record: CaseDetailsUI) => void;
}

export function CaseForm({ caseRecord, onClose, onSuccess }: CaseFormProps) {
  const { createCase, updateCase, lookupData } = useCases();
  const { t } = useLocale();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Validation Schema using Zod
  const caseSchema = zod.object({
    caseCategoryId: zod.coerce.number().min(1, { message: t("formRequiredField") }),
    gravityOffenceId: zod.coerce.number().min(1, { message: t("formRequiredField") }),
    crimeMajorHeadId: zod.coerce.number().min(1, { message: t("formRequiredField") }),
    crimeMinorHeadId: zod.coerce.number().min(1, { message: t("formRequiredField") }),
    policeStationId: zod.coerce.number().min(1, { message: t("formRequiredField") }),
    policePersonId: zod.coerce.number().min(1, { message: t("formRequiredField") }),
    caseStatus: zod.string().min(1, { message: t("formRequiredField") }),
    priority: zod.string().min(1, { message: t("formRequiredField") }),
    briefFacts: zod.string().min(10, { message: "Brief facts must be at least 10 characters long" }),
    incidentFromDate: zod.string().min(1, { message: t("formRequiredField") }),
    incidentToDate: zod.string().min(1, { message: t("formRequiredField") }),
    infoReceivedPSDate: zod.string().min(1, { message: t("formRequiredField") }),
    latitude: zod.coerce
      .number()
      .min(11, { message: "Latitude must be within Karnataka region (11.0 to 19.0)" })
      .max(19, { message: "Latitude must be within Karnataka region (11.0 to 19.0)" }),
    longitude: zod.coerce
      .number()
      .min(74, { message: "Longitude must be within Karnataka region (74.0 to 79.0)" })
      .max(79, { message: "Longitude must be within Karnataka region (74.0 to 79.0)" }),
  });

  type CaseFormValues = zod.infer<typeof caseSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CaseFormValues>({
    resolver: zodResolver(caseSchema) as never,
    defaultValues: {
      caseCategoryId: 1,
      gravityOffenceId: 2,
      crimeMajorHeadId: 10,
      crimeMinorHeadId: 101,
      policeStationId: 6,
      policePersonId: 1,
      caseStatus: "UNDER_INVESTIGATION",
      priority: "MEDIUM",
      briefFacts: "",
      incidentFromDate: "",
      incidentToDate: "",
      infoReceivedPSDate: "",
      latitude: 12.9716,
      longitude: 77.5946,
    },
  });

  // Populate form if editing
  useEffect(() => {
    if (caseRecord) {
      setValue("caseCategoryId", caseRecord.caseCategoryId);
      setValue("gravityOffenceId", caseRecord.gravityOffenceId);
      setValue("crimeMajorHeadId", caseRecord.crimeMajorHeadId);
      setValue("crimeMinorHeadId", caseRecord.crimeMinorHeadId);
      setValue("policeStationId", caseRecord.policeStationId);
      setValue("policePersonId", caseRecord.policePersonId);
      setValue("caseStatus", caseRecord.caseStatus);
      setValue("priority", caseRecord.priority);
      setValue("briefFacts", caseRecord.briefFacts);
      
      // Trim dates to YYYY-MM-DDThh:mm format for input type="datetime-local"
      const formatDate = (isoStr: string) => {
        if (!isoStr) return "";
        return isoStr.substring(0, 16);
      };
      
      setValue("incidentFromDate", formatDate(caseRecord.incidentFromDate));
      setValue("incidentToDate", formatDate(caseRecord.incidentToDate));
      setValue("infoReceivedPSDate", formatDate(caseRecord.infoReceivedPSDate));
      setValue("latitude", caseRecord.latitude);
      setValue("longitude", caseRecord.longitude);
    }
  }, [caseRecord, setValue]);

  const onSubmit = async (data: CaseFormValues) => {
    setErrorMsg(null);
    try {
      let result: CaseDetailsUI | null = null;
      
      const payload: Omit<CaseMaster, "id" | "createdAt" | "updatedAt" | "caseNo" | "crimeNo"> = {
        ...data,
        caseStatus: data.caseStatus as CaseStatus,
        priority: data.priority as CasePriority,
        // Format inputs back to standard ISO
        crimeRegisteredDate: new Date(data.infoReceivedPSDate).toISOString(),
        incidentFromDate: new Date(data.incidentFromDate).toISOString(),
        incidentToDate: new Date(data.incidentToDate).toISOString(),
        infoReceivedPSDate: new Date(data.infoReceivedPSDate).toISOString()
      };

      if (caseRecord) {
        // Edit flow
        result = await updateCase(caseRecord.id, payload);
      } else {
        // Create flow
        result = await createCase(payload);
      }

      if (result) {
        onSuccess(result);
      } else {
        setErrorMsg("Failed to process transaction. Please check input parameters.");
      }
    } catch {
      setErrorMsg("An unexpected connection error occurred.");
    }
  };

  const loading = isSubmitting;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="text-base font-bold text-foreground">
          {caseRecord ? t("formEditTitle") : t("formCreateTitle")}
        </h2>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Case Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-secondary-foreground">
              {t("wsTableCategory")}
            </label>
            <select
              disabled={loading}
              className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              {...register("caseCategoryId")}
            >
              {lookupData.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.caseCategoryId && (
              <p className="text-[11px] font-semibold text-destructive">{errors.caseCategoryId.message}</p>
            )}
          </div>

          {/* Gravity Offence */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-secondary-foreground">
              {t("wsTableGravity")}
            </label>
            <select
              disabled={loading}
              className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              {...register("gravityOffenceId")}
            >
              {lookupData.gravities.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Major Crime Head */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-secondary-foreground">
              {t("wsTableMajorHead")}
            </label>
            <select
              disabled={loading}
              className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              {...register("crimeMajorHeadId")}
            >
              {lookupData.crimeHeads.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.name}
                </option>
              ))}
            </select>
          </div>

          {/* Minor Crime Head */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-secondary-foreground">
              {t("wsTableMinorHead")}
            </label>
            <select
              disabled={loading}
              className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              {...register("crimeMinorHeadId")}
            >
              {lookupData.crimeSubHeads.map((csh) => (
                <option key={csh.id} value={csh.id}>
                  {csh.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Unit / Police Station */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-secondary-foreground">
              {t("wsTableStation")}
            </label>
            <select
              disabled={loading}
              className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              {...register("policeStationId")}
            >
              {lookupData.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* Assigned Officer */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-secondary-foreground">
              {t("wsTableOfficer")}
            </label>
            <select
              disabled={loading}
              className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              {...register("policePersonId")}
            >
              {lookupData.employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.firstName} {e.lastName} ({e.rank})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-secondary-foreground">
              {t("wsTableStatus")}
            </label>
            <select
              disabled={loading}
              className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              {...register("caseStatus")}
            >
              <option value="UNDER_INVESTIGATION">Under Investigation</option>
              <option value="CHARGE_SHEETED">Charge Sheeted</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          {/* Priority */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-secondary-foreground">
              {t("wsTablePriority")}
            </label>
            <select
              disabled={loading}
              className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              {...register("priority")}
            >
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>

        {/* Date Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-secondary-foreground">
              {t("formIncidentFrom")}
            </label>
            <Input
              type="datetime-local"
              disabled={loading}
              className={errors.incidentFromDate ? "border-destructive" : ""}
              {...register("incidentFromDate")}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-secondary-foreground">
              {t("formIncidentTo")}
            </label>
            <Input
              type="datetime-local"
              disabled={loading}
              className={errors.incidentToDate ? "border-destructive" : ""}
              {...register("incidentToDate")}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-secondary-foreground">
              {t("formReceivedDate")}
            </label>
            <Input
              type="datetime-local"
              disabled={loading}
              className={errors.infoReceivedPSDate ? "border-destructive" : ""}
              {...register("infoReceivedPSDate")}
            />
          </div>
        </div>

        {/* Coordinates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-secondary-foreground">
              {t("formLatitude")} (11.0 to 19.0)
            </label>
            <Input
              type="number"
              step="0.0001"
              disabled={loading}
              className={errors.latitude ? "border-destructive" : ""}
              {...register("latitude")}
            />
            {errors.latitude && (
              <p className="text-[10px] font-semibold text-destructive">{errors.latitude.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-secondary-foreground">
              {t("formLongitude")} (74.0 to 79.0)
            </label>
            <Input
              type="number"
              step="0.0001"
              disabled={loading}
              className={errors.longitude ? "border-destructive" : ""}
              {...register("longitude")}
            />
            {errors.longitude && (
              <p className="text-[10px] font-semibold text-destructive">{errors.longitude.message}</p>
            )}
          </div>
        </div>

        {/* Brief Facts */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-secondary-foreground">
            {t("wsBriefFacts")}
          </label>
          <textarea
            disabled={loading}
            rows={4}
            placeholder={t("formFactsPlaceholder")}
            className={`flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 ${
              errors.briefFacts ? "border-destructive focus-visible:ring-destructive" : ""
            }`}
            {...register("briefFacts")}
          />
          {errors.briefFacts && (
            <p className="text-[11px] font-semibold text-destructive">{errors.briefFacts.message}</p>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            {t("formCancelButton")}
          </Button>
          <Button type="submit" disabled={loading} className="flex items-center gap-1.5 font-bold">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("formSaveButton")}
          </Button>
        </div>
      </form>
    </div>
  );
}
