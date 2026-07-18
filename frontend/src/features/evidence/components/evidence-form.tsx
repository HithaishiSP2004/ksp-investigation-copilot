"use client";

import React, { useState } from "react";
import { CaseDetailsUI } from "@/features/cases/types";
import { EvidenceMaster, EvidenceType } from "../types";
import { useLocale } from "@/lib/locales-provider";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/auth-context";
import { StorageService } from "@/lib/services/storage-service";
import { MapPin, FileUp, ShieldCheck } from "lucide-react";

interface EvidenceFormProps {
  cases: CaseDetailsUI[];
  onClose: () => void;
  onSuccess: (record: EvidenceMaster) => void;
  onRegisterSubmit: (data: Omit<EvidenceMaster, "id" | "createdAt" | "updatedAt" | "evidenceNo" | "fileHash">) => Promise<EvidenceMaster | null>;
}

export function EvidenceForm({
  cases,
  onClose,
  onSuccess,
  onRegisterSubmit
}: EvidenceFormProps) {
  const { t } = useLocale();
  const { user } = useAuth();

  // Form States
  const [selectedCaseId, setSelectedCaseId] = useState<number | "">("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [evidenceType, setEvidenceType] = useState<EvidenceType>("DOCUMENT");
  const [collectionDate, setCollectionDate] = useState(new Date().toISOString().substring(0, 10));
  const [collectionTime, setCollectionTime] = useState("12:00");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setFormError(null);
    }
  };

  const validateKarnatakaCoords = (lat: number, lon: number): boolean => {
    return lat >= 11.0 && lat <= 19.0 && lon >= 74.0 && lon <= 79.0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedCaseId) {
      setFormError("Please select a related case file.");
      return;
    }
    if (!title.trim() || !description.trim()) {
      setFormError("Title and Description are required fields.");
      return;
    }
    if (!latitude || !longitude) {
      setFormError("Seizure GPS coordinates are required.");
      return;
    }

    const latNum = parseFloat(latitude);
    const lonNum = parseFloat(longitude);
    if (isNaN(latNum) || isNaN(lonNum) || !validateKarnatakaCoords(latNum, lonNum)) {
      setFormError("GPS Coordinates must lie within Karnataka State boundaries (Lat: 11.0 to 19.0, Lon: 74.0 to 79.0).");
      return;
    }

    // Physical evidence doesn't strictly need a digital file upload
    const requiresFile = ["DOCUMENT", "IMAGE", "VIDEO", "AUDIO"].includes(evidenceType);
    if (requiresFile && !selectedFile) {
      setFormError("Please select a physical/digital evidence file to upload.");
      return;
    }

    setUploading(true);
    try {
      let fileName = "physical_specimen";
      let fileSize = 0;
      let mimeType = "application/octet-stream";

      if (selectedFile) {
        // Upload via provider-agnostic StorageService
        const uploadResult = await StorageService.registerUpload(selectedFile);
        fileName = uploadResult.fileName;
        fileSize = uploadResult.fileSize;
        mimeType = uploadResult.mimeType;
      }

      const caseDetails = cases.find(c => c.id === Number(selectedCaseId));
      if (!caseDetails || !user) {
        throw new Error("Missing session parameters.");
      }

      const tags = tagsInput
        .split(",")
        .map(t => t.trim().toLowerCase())
        .filter(t => t.length > 0);

      const record = await onRegisterSubmit({
        caseId: Number(selectedCaseId),
        crimeNo: caseDetails.crimeNo,
        title: title.trim(),
        description: description.trim(),
        evidenceType,
        status: "SECURED",
        collectionDate,
        collectionTime,
        latitude: latNum,
        longitude: lonNum,
        collectorName: `${user.firstName} ${user.lastName}`,
        collectorKgid: user.kgid,
        fileSize,
        mimeType,
        fileName,
        tags
      });

      if (record) {
        alert(t("evSuccessUpload"));
        onSuccess(record);
      } else {
        setFormError("Failed to register evidence.");
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to upload or record forensic assets.";
      setFormError(errMsg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-xs text-left">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-1.5">
          <ShieldCheck className="h-5.5 w-5.5 text-primary" />
          {t("evFormTitle")}
        </h2>
        <p className="text-muted-foreground font-semibold">
          Securely ingest a new forensic asset into the DEMS vault.
        </p>
      </div>

      <hr className="border-border/60" />

      {formError && (
        <div className="p-3.5 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive font-bold">
          {formError}
        </div>
      )}

      {/* Case Selector */}
      <div className="space-y-1.5">
        <label className="font-bold text-secondary-foreground uppercase">
          {t("evFormSelectCase")} *
        </label>
        <select
          value={selectedCaseId}
          disabled={uploading}
          onChange={(e) => setSelectedCaseId(e.target.value ? Number(e.target.value) : "")}
          className="flex h-9 w-full rounded border border-border bg-card px-2.5 py-1 focus:outline-none"
        >
          <option value="">Select FIR...</option>
          {cases.map((c) => (
            <option key={c.id} value={c.id}>
              {c.crimeNo} — {c.briefFacts.substring(0, 40)}...
            </option>
          ))}
        </select>
      </div>

      {/* Metadata Grids */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="font-bold text-secondary-foreground uppercase">Asset Title *</label>
          <input
            type="text"
            required
            disabled={uploading}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Mule Bank Log PDF"
            className="h-9 w-full rounded border border-border bg-background px-3 focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        {/* Evidence Type */}
        <div className="space-y-1.5">
          <label className="font-bold text-secondary-foreground uppercase">
            {t("evFormType")} *
          </label>
          <select
            value={evidenceType}
            disabled={uploading}
            onChange={(e) => setEvidenceType(e.target.value as EvidenceType)}
            className="flex h-9 w-full rounded border border-border bg-card px-2.5 py-1 focus:outline-none"
          >
            <option value="DOCUMENT">Document</option>
            <option value="IMAGE">Image</option>
            <option value="VIDEO">Video</option>
            <option value="AUDIO">Audio</option>
            <option value="PHYSICAL">Physical Specimen</option>
            <option value="DEVICE">Device / Hardware</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="font-bold text-secondary-foreground uppercase">Seizure Description *</label>
        <textarea
          rows={3}
          required
          disabled={uploading}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Details on modus operandi extraction, device condition, suspect recovery..."
          className="w-full rounded border border-border bg-background p-3 focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* Collection Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/20 border border-border/60 p-4 rounded-xl">
        <div className="space-y-1.5">
          <label className="font-bold text-secondary-foreground uppercase">Seizure Date *</label>
          <input
            type="date"
            required
            disabled={uploading}
            value={collectionDate}
            onChange={(e) => setCollectionDate(e.target.value)}
            className="h-9 w-full rounded border border-border bg-background px-3 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-secondary-foreground uppercase">Seizure Time *</label>
          <input
            type="time"
            required
            disabled={uploading}
            value={collectionTime}
            onChange={(e) => setCollectionTime(e.target.value)}
            className="h-9 w-full rounded border border-border bg-background px-3 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-secondary-foreground uppercase flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            Seizure Latitude *
          </label>
          <input
            type="number"
            step="any"
            required
            disabled={uploading}
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="e.g., 12.9716"
            className="h-9 w-full rounded border border-border bg-background px-3 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-secondary-foreground uppercase flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            Seizure Longitude *
          </label>
          <input
            type="number"
            step="any"
            required
            disabled={uploading}
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="e.g., 77.5946"
            className="h-9 w-full rounded border border-border bg-background px-3 focus:outline-none"
          />
        </div>
      </div>

      {/* File Ingestion */}
      {["DOCUMENT", "IMAGE", "VIDEO", "AUDIO"].includes(evidenceType) && (
        <div className="space-y-1.5">
          <label className="font-bold text-secondary-foreground uppercase">
            {t("evFormFile")} *
          </label>
          <div className="border border-border border-dashed rounded-xl p-6 bg-background relative flex flex-col items-center justify-center text-center">
            <input
              type="file"
              disabled={uploading}
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <FileUp className="h-8 w-8 text-muted-foreground/60 mb-2" />
            {selectedFile ? (
              <div className="space-y-0.5">
                <p className="font-bold text-foreground">{selectedFile.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB — {selectedFile.type || "application/octet-stream"}
                </p>
              </div>
            ) : (
              <div className="space-y-0.5">
                <p className="font-bold text-muted-foreground">{t("evFormFilePlaceholder")}</p>
                <p className="text-[10px] text-muted-foreground/60">PDF, JPG, PNG, WAV, MP4 (Max size: 50MB)</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Identification Tags */}
      <div className="space-y-1.5">
        <label className="font-bold text-secondary-foreground uppercase">Identification Tags</label>
        <input
          type="text"
          disabled={uploading}
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="e.g., mule_wallet, phishing, screenshot (comma separated)"
          className="h-9 w-full rounded border border-border bg-background px-3 focus:outline-none"
        />
      </div>

      <hr className="border-border/60" />

      {/* Submission Actions */}
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={onClose}
          className="h-9 px-5 font-bold"
        >
          {t("formCancelButton")}
        </Button>
        <Button
          type="submit"
          disabled={uploading}
          className="h-9 px-5 font-bold"
        >
          {uploading ? "Ingesting Specimen..." : "Ingest Forensic Asset"}
        </Button>
      </div>
    </form>
  );
}
