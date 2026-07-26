"use client";

import React, { useState } from "react";
import { useLocale } from "@/lib/locales-provider";
import { Navigation, Layers, Shield, Eye, Flame, Radar, Crosshair, MapPin } from "lucide-react";

interface SpatialMapWidgetProps {
  onSelectCoordinates?: (lat: number, lng: number) => void;
}

export function SpatialMapWidget({ onSelectCoordinates }: SpatialMapWidgetProps) {
  const { t } = useLocale();
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState<string>("INC-1");

  // Realistic incident spatial points in Bengaluru jurisdiction
  const incidents = [
    {
      id: "INC-1",
      crimeNo: "FIR-2026-001",
      title: "Cyber Theft Scene (MG Road)",
      sector: "Central Sector 01",
      coords: "12.9716° N, 77.5946° E",
      lat: 12.9716,
      lng: 77.5946,
      x: 48,
      y: 42,
      priority: "CRITICAL",
      type: "Crime Scene",
    },
    {
      id: "INC-2",
      crimeNo: "FIR-2026-014",
      title: "CCTV Tower Dump (Indiranagar)",
      sector: "East Sector 04",
      coords: "12.9784° N, 77.6408° E",
      lat: 12.9784,
      lng: 77.6408,
      x: 72,
      y: 30,
      priority: "HIGH",
      type: "Tower Trace",
    },
    {
      id: "INC-3",
      crimeNo: "FIR-2026-008",
      title: "ATM Skimming Hotspot (Koramangala)",
      sector: "South-East Sector 02",
      coords: "12.9352° N, 77.6245° E",
      lat: 12.9352,
      lng: 77.6245,
      x: 62,
      y: 70,
      priority: "HIGH",
      type: "Hotspot",
    },
    {
      id: "INC-4",
      crimeNo: "PATROL-04",
      title: "Active Patrol Unit 04 (Jayanagar)",
      sector: "South Sector 03",
      coords: "12.9250° N, 77.5938° E",
      lat: 12.9250,
      lng: 77.5938,
      x: 35,
      y: 75,
      priority: "NORMAL",
      type: "Patrol Unit",
    },
  ];

  const currentIncident = incidents.find((i) => i.id === selectedIncident) || incidents[0];

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4 relative overflow-hidden flex flex-col justify-between">
      {/* HUD Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shrink-0">
            <Radar className="h-5 w-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-foreground tracking-tight">
                {t("cmdZoneSpatial")}
              </h3>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-primary/15 text-primary border border-primary/30 uppercase tracking-widest">
                LIVE HUD
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium">
              Bengaluru Command Radar • Sector Grid 12.97° N, 77.59° E
            </p>
          </div>
        </div>

        {/* Map Layer Micro-Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer border ${
              showHeatmap
                ? "bg-amber-500/15 text-amber-500 border-amber-500/30 shadow-xs"
                : "bg-muted/40 text-muted-foreground border-border hover:bg-muted"
            }`}
          >
            <Flame className="h-3 w-3" />
            <span>{t("cmdMapHeatmap")}</span>
          </button>

          <button
            onClick={() => setShowHotspots(!showHotspots)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer border ${
              showHotspots
                ? "bg-primary/15 text-primary border-primary/30 shadow-xs"
                : "bg-muted/40 text-muted-foreground border-border hover:bg-muted"
            }`}
          >
            <Layers className="h-3 w-3" />
            <span>{t("cmdMapHotspots")}</span>
          </button>
        </div>
      </div>

      {/* Radar Map HUD Display */}
      <div className="relative h-72 w-full rounded-lg bg-slate-950 border border-slate-800 overflow-hidden shadow-inner flex flex-col justify-between p-3 select-none">
        {/* Radar Tactical Background Mesh */}
        <div className="absolute inset-0 pointer-events-none opacity-25 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* Concentric Radar Sonar Range Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 rounded-full border border-blue-500/20" />
          <div className="w-48 h-48 rounded-full border border-blue-500/20 absolute" />
          <div className="w-32 h-32 rounded-full border border-blue-500/20 absolute" />
          <div className="w-16 h-16 rounded-full border border-blue-500/30 absolute" />
          {/* Axis Crosshairs */}
          <div className="w-full h-px bg-blue-500/20 absolute" />
          <div className="h-full w-px bg-blue-500/20 absolute" />
        </div>

        {/* Sweeping Radar Beam */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30 origin-center animate-[spin_8s_linear_infinite]"
          style={{
            background: "conic-gradient(from 0deg at 50% 50%, rgba(59, 130, 246, 0.4) 0deg, transparent 60deg, transparent 360deg)",
          }}
        />

        {/* Heatmap Threat Density Gradient Layer */}
        {showHeatmap && (
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <div className="absolute top-[25%] left-[45%] w-36 h-36 rounded-full bg-destructive blur-3xl" />
            <div className="absolute top-[45%] left-[60%] w-28 h-28 rounded-full bg-amber-500 blur-2xl" />
          </div>
        )}

        {/* HUD Top Corner Bearings */}
        <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-1">
            <Crosshair className="h-3 w-3 text-primary animate-pulse" />
            <span>RADAR ACTIVE // KSP-HQ</span>
          </div>
          <span>RANGE: 15.0 KM</span>
        </div>

        {/* Incident Spatial HUD Pins */}
        <div className="absolute inset-0 z-10 pointer-events-auto">
          {incidents.map((inc) => {
            const isSelected = selectedIncident === inc.id;

            return (
              <div
                key={inc.id}
                onClick={() => {
                  setSelectedIncident(inc.id);
                  onSelectCoordinates?.(inc.lat, inc.lng);
                }}
                style={{ left: `${inc.x}%`, top: `${inc.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              >
                {/* Ping animation for critical pins */}
                {inc.priority === "CRITICAL" && (
                  <span className="absolute -inset-2 rounded-full bg-destructive/40 animate-ping opacity-75" />
                )}

                {/* Tactical Pin Card */}
                <div
                  className={`relative flex items-center gap-1.5 px-2 py-1 rounded-md border text-[10px] font-bold shadow-md transition-all ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-white ring-2 ring-primary/40 scale-110 z-30"
                      : inc.priority === "CRITICAL"
                      ? "bg-destructive text-destructive-foreground border-destructive/60 hover:scale-105"
                      : "bg-slate-900/90 text-slate-200 border-slate-700 hover:bg-slate-800 hover:scale-105"
                  }`}
                >
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate max-w-[90px]">{inc.crimeNo}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom HUD Detailed Incident Info Box */}
        <div className="relative z-20 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-lg p-2.5 flex items-center justify-between text-xs text-slate-100 shadow-xl">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <div className="h-7 w-7 rounded bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0 font-mono text-[10px] font-bold">
              GPS
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[11px] text-white truncate">
                  {currentIncident.title}
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-destructive/20 text-destructive border border-destructive/30 uppercase">
                  {currentIncident.priority}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono truncate">
                {currentIncident.sector} • {currentIncident.coords}
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectCoordinates?.(currentIncident.lat, currentIncident.lng)}
            className="px-2.5 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90 text-[10px] font-bold shrink-0 flex items-center gap-1 cursor-pointer transition-all shadow-xs"
          >
            <Eye className="h-3 w-3" />
            <span>Focus Sector</span>
          </button>
        </div>
      </div>
    </div>
  );
}
