"use client";

import React, { useState } from "react";
import { useLocale } from "@/lib/locales-provider";
import { Network, User, Smartphone, Car, CreditCard, FileText, ArrowRight, Zap, ShieldCheck } from "lucide-react";

interface KnowledgeGraphWidgetProps {
  onExpandGraph?: () => void;
}

export function KnowledgeGraphWidget({ onExpandGraph }: KnowledgeGraphWidgetProps) {
  const { t } = useLocale();
  const [selectedEntityId, setSelectedEntityId] = useState<string>("E1");

  // Rich intelligence relational nodes
  const entities = [
    {
      id: "E1",
      label: "Kiran Kumar",
      subtitle: "Primary Suspect",
      category: "SUSPECT",
      icon: User,
      relationToHub: "Target Entity",
      matchScore: 98,
      color: "border-destructive/60 bg-destructive/10 text-destructive",
      badgeColor: "bg-destructive text-white",
      gridPos: "col-span-2 row-span-1",
    },
    {
      id: "E2",
      label: "IMEI 86349204...",
      subtitle: "Tower Overlap Match",
      category: "PHONE_IMEI",
      icon: Smartphone,
      relationToHub: "Shared SIM (96% Conf.)",
      matchScore: 96,
      color: "border-primary/50 bg-primary/10 text-primary",
      badgeColor: "bg-primary text-white",
    },
    {
      id: "E3",
      label: "KA-01-MJ-8891",
      subtitle: "Whitefield CCTV Sighting",
      category: "VEHICLE",
      icon: Car,
      relationToHub: "MO Match (88% Conf.)",
      matchScore: 88,
      color: "border-amber-500/50 bg-amber-500/10 text-amber-500",
      badgeColor: "bg-amber-500 text-white",
    },
    {
      id: "E4",
      label: "HDFC A/C ...4920",
      subtitle: "Mule Wire Transfer",
      category: "ACCOUNT",
      icon: CreditCard,
      relationToHub: "Bank Link (92% Conf.)",
      matchScore: 92,
      color: "border-emerald-500/50 bg-emerald-500/10 text-emerald-500",
      badgeColor: "bg-emerald-500 text-white",
    },
    {
      id: "E5",
      label: "FIR-2026-001",
      subtitle: "Cyber Theft File",
      category: "CASE_FILE",
      icon: FileText,
      relationToHub: "Linked Case (100%)",
      matchScore: 100,
      color: "border-purple-500/50 bg-purple-500/10 text-purple-500",
      badgeColor: "bg-purple-500 text-white",
    },
  ];

  const activeEntity = entities.find((e) => e.id === selectedEntityId) || entities[0];

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4 relative overflow-hidden flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-accent/10 border border-accent/25 flex items-center justify-center text-accent shrink-0">
            <Network className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-foreground tracking-tight">
                {t("cmdZoneGraph")}
              </h3>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-accent/15 text-accent border border-accent/30 uppercase tracking-widest">
                GNN v2.4
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium">
              Syndicate Pattern Matrix • 5 Linked Entities Identified
            </p>
          </div>
        </div>

        <button
          onClick={onExpandGraph}
          className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer"
        >
          <span>{t("cmdInspectGraph")}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Relational Entity Grid Layout */}
      <div className="space-y-3">
        {/* Primary Target Node Header Card */}
        <div
          onClick={() => setSelectedEntityId("E1")}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
            selectedEntityId === "E1"
              ? "bg-destructive/10 border-destructive/60 ring-2 ring-destructive/30 shadow-sm"
              : "bg-card border-border hover:border-destructive/40"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-full bg-destructive/20 border border-destructive/40 flex items-center justify-center text-destructive font-bold shrink-0">
              <User className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-xs text-foreground truncate">
                  Kiran Kumar
                </h4>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-destructive text-white uppercase tracking-wider">
                  Target Suspect
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground font-medium truncate">
                Central Node • Linked to 4 Criminal Intelligence Outlets
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-destructive/15 text-destructive text-xs font-bold shrink-0 border border-destructive/20">
            <Zap className="h-3 w-3 fill-current" />
            <span>98% Relational Strength</span>
          </div>
        </div>

        {/* Linked Entities Satellite Cards (2x2 Clean Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {entities.slice(1).map((ent) => {
            const Icon = ent.icon;
            const isSelected = selectedEntityId === ent.id;

            return (
              <div
                key={ent.id}
                onClick={() => setSelectedEntityId(ent.id)}
                className={`p-3 rounded-lg border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? `${ent.color} ring-2 ring-primary/40 shadow-sm`
                    : "bg-card/70 border-border/80 hover:border-primary/40 hover:bg-card"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`p-1.5 rounded-md border shrink-0 ${ent.color}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-bold text-xs text-foreground truncate">
                      {ent.label}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border shrink-0">
                    {ent.matchScore}%
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground border-t border-border/50 pt-1.5">
                  <span className="truncate">{ent.subtitle}</span>
                  <span className="text-primary font-bold shrink-0">{ent.relationToHub}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Entity Summary Card */}
      <div className="p-3 rounded-lg bg-muted/40 border border-border flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
          <span className="font-semibold text-muted-foreground truncate">
            Inspecting Entity: <strong className="text-foreground">{activeEntity.label}</strong> ({activeEntity.subtitle})
          </span>
        </div>

        <button
          onClick={onExpandGraph}
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
        >
          <span>Full Analysis</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
