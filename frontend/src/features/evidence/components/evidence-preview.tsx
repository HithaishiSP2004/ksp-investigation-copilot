"use client";

import React from "react";
import { EvidenceMaster } from "../types";
import { useLocale } from "@/lib/locales-provider";
import { 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Music, 
  Cpu, 
  Eye
} from "lucide-react";

interface EvidencePreviewProps {
  evidence: EvidenceMaster;
}

export function EvidencePreview({ evidence }: EvidencePreviewProps) {
  const { t } = useLocale();

  const renderPreviewContent = () => {
    switch (evidence.evidenceType) {
      case "IMAGE":
        return (
          <div className="w-full h-full min-h-[300px] flex flex-col justify-between bg-zinc-950 text-zinc-100 rounded-xl overflow-hidden relative border border-border/80">
            {/* CCTV Overlay details */}
            <div className="absolute top-4 left-4 z-10 bg-black/75 px-3 py-1.5 rounded text-[10px] font-mono border border-zinc-800 space-y-0.5">
              <div>CAMERA: CAM-04 INTERSECTION</div>
              <div>DATE: {evidence.collectionDate}</div>
              <div>TIME: {evidence.collectionTime}:00</div>
              <div className="text-emerald-400">STATUS: SECURED STREAM</div>
            </div>

            {/* Simulated camera view reticle */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <div className="border border-white w-24 h-24 rounded-full flex items-center justify-center">
                <div className="bg-white w-2 h-2 rounded-full" />
              </div>
            </div>

            {/* Visual content fallback canvas */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-zinc-900 to-zinc-950">
              <ImageIcon className="h-16 w-16 text-emerald-500/50 mb-4 animate-pulse" />
              <p className="text-sm font-semibold tracking-wider uppercase">{evidence.fileName}</p>
              <p className="text-xs text-zinc-500 font-mono mt-1">SIMULATED FORENSIC IMAGE FRAME</p>
            </div>
            
            <div className="bg-zinc-900 px-4 py-3 border-t border-zinc-800 text-[10px] text-zinc-400 flex items-center justify-between">
              <span>MIME: {evidence.mimeType}</span>
              <span className="font-mono text-zinc-500">{evidence.fileHash.substring(0, 16)}...</span>
            </div>
          </div>
        );

      case "DOCUMENT":
        return (
          <div className="w-full h-full min-h-[300px] flex flex-col justify-between bg-card text-foreground rounded-xl border border-border overflow-hidden">
            {/* Mock PDF Document viewer container */}
            <div className="p-4 bg-muted/30 border-b border-border flex items-center justify-between text-xs font-semibold text-secondary-foreground">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-amber-500" />
                <span>{evidence.fileName}</span>
              </div>
              <span className="text-[10px] bg-muted px-2 py-0.5 rounded">Page 1 of 1</span>
            </div>

            <div className="flex-1 p-8 overflow-y-auto space-y-4 max-h-[400px] bg-muted/10 font-serif leading-relaxed">
              <div className="max-w-xl mx-auto bg-background p-8 border border-border shadow-sm rounded space-y-6 text-xs text-foreground/80">
                {/* Header Title */}
                <div className="text-center font-bold uppercase tracking-wider border-b border-double border-border/80 pb-4 text-foreground">
                  Official Requisition Report
                </div>
                
                {/* Body Details */}
                <div className="space-y-4 text-[11px]">
                  <p>
                    <strong>Subject:</strong> Investigation under FIR No. {evidence.crimeNo}.
                  </p>
                  <p>
                    This document represents forensic metadata collected in relation to the referenced case ledger. All records are cataloged in the Karnataka State Police Vault.
                  </p>
                  <p className="italic bg-muted/30 p-2.5 rounded border border-border/40">
                    &quot;{evidence.description}&quot;
                  </p>
                  <p>
                    The authenticity of this document is verified by SHA-256 signature hashes and chain of custody logs. Modifications to this journal require authorized officer credentials.
                  </p>
                </div>

                <div className="flex justify-between items-end pt-8 text-[9px] text-muted-foreground font-sans font-semibold">
                  <div>
                    <p>REGISTERED BY:</p>
                    <p className="text-foreground uppercase mt-0.5">{evidence.collectorName}</p>
                    <p>KGID: {evidence.collectorKgid}</p>
                  </div>
                  <div className="text-right">
                    <p>VAULT LOCATION ID:</p>
                    <p className="text-foreground mt-0.5">SECURE-LOCKER-01</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted/30 px-4 py-3 border-t border-border text-[10px] text-muted-foreground flex items-center justify-between font-semibold">
              <span>Size: {(evidence.fileSize / 1024).toFixed(1)} KB</span>
              <span className="font-mono text-muted-foreground/60">{evidence.fileHash}</span>
            </div>
          </div>
        );

      case "VIDEO":
        return (
          <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-zinc-950 text-zinc-300 rounded-xl p-8 border border-zinc-800 text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-500 border border-sky-500/20">
              <Video className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-zinc-100">{evidence.title}</p>
              <p className="text-xs text-zinc-500">Video playback interface is deactivated in standard console.</p>
            </div>
            <span className="px-3 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400">
              MIME: {evidence.mimeType}
            </span>
          </div>
        );

      case "AUDIO":
        return (
          <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-card text-foreground rounded-xl p-8 border border-border text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-500 border border-violet-500/20">
              <Music className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-bold">{evidence.title}</p>
              <p className="text-xs text-muted-foreground">Audio recording voice stream.</p>
              
              {/* Simulated soundwave graphics */}
              <div className="flex justify-center items-center gap-1 h-6">
                {[1, 2, 3, 4, 5, 4, 3, 2, 3, 4, 5, 3, 2, 4, 5, 2, 1].map((h, i) => (
                  <span 
                    key={i} 
                    className="w-0.5 bg-violet-500/60 rounded-full transition-all duration-300"
                    style={{ height: `${h * 4}px` }} 
                  />
                ))}
              </div>
            </div>
            <span className="px-3 py-1 rounded bg-muted border border-border text-[10px] font-mono text-secondary-foreground">
              Size: {(evidence.fileSize / 1024).toFixed(1)} KB
            </span>
          </div>
        );

      case "DEVICE":
      case "PHYSICAL":
      default:
        return (
          <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-card text-foreground rounded-xl p-8 border border-border text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
              <Cpu className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold">{evidence.title}</p>
              <p className="text-xs text-muted-foreground">Physical asset secured in police station lockers.</p>
            </div>
            <div className="px-4 py-2.5 bg-muted/40 border border-border rounded-lg text-[11px] text-secondary-foreground space-y-1 text-left inline-block">
              <div><strong>Asset Class:</strong> {evidence.evidenceType}</div>
              <div><strong>Status:</strong> {evidence.status.replace("_", " ")}</div>
              <div><strong>Locker Coordinates:</strong> {evidence.latitude}, {evidence.longitude}</div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col space-y-4 bg-card border border-border rounded-xl p-6 h-full overflow-y-auto">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 border-b border-border/80">
        <div className="space-y-1">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            {evidence.evidenceType} Asset
          </span>
          <h2 className="text-lg font-bold text-foreground">
            {evidence.title}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase font-mono">
            {evidence.evidenceNo}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">
          Asset Description
        </h3>
        <p className="text-xs text-foreground bg-muted/20 border border-border p-3.5 rounded-lg leading-relaxed font-medium">
          {evidence.description}
        </p>
      </div>

      {/* Main Preview Container */}
      <div className="space-y-2">
        <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
          <Eye className="h-3.5 w-3.5" />
          {t("evTitlePreview")}
        </h3>
        <div className="w-full">
          {renderPreviewContent()}
        </div>
      </div>
    </div>
  );
}
