"use client";

import React from "react";

interface SpatialIntelligenceCanvasProps {
  stage: "ENV" | "AUTH" | "TRANSITION" | "COMMAND";
  className?: string;
}

export function SpatialIntelligenceCanvas({ stage, className = "" }: SpatialIntelligenceCanvasProps) {
  // Transform scale & offset based on spatial stage (Continuous Camera Depth Movement)
  let transformStyle = "scale(1) translateY(0px)";
  let opacityStyle = 0.95;

  if (stage === "AUTH") {
    transformStyle = "scale(1.02) translateY(-4px)";
    opacityStyle = 1;
  } else if (stage === "TRANSITION") {
    transformStyle = "scale(1.15) translateY(-20px)";
    opacityStyle = 1;
  } else if (stage === "COMMAND") {
    transformStyle = "scale(1.05) translateY(0px)";
    opacityStyle = 0.2;
  }

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden select-none bg-gradient-to-b from-[#060914] via-[#080e1e] to-[#04060d] ${className}`}>
      
      {/* ── Soft Ambient Volumetric Lighting ─────────────────────────────── */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] bg-amber-500/10 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[750px] h-[750px] bg-blue-600/10 rounded-full blur-[180px] pointer-events-none" />

      {/* ── Living Spatial Canvas Container ─────────────────────────────── */}
      <div 
        className="absolute inset-0 flex items-center justify-center transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: transformStyle, opacity: opacityStyle }}
      >
        {/* Very Subtle Dot Matrix Pattern */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(245, 158, 11, 0.15) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* ── Latitude / Longitude Telemetry Overlay ───────────────────────── */}
      <div className="absolute bottom-4 left-6 font-mono text-[10px] text-slate-400/80 uppercase tracking-widest flex items-center gap-4 z-10">
        <span>LAT: 12.9716° N</span>
        <span>LON: 77.5946° E</span>
        <span>KSP-INTEL-NET // SYSTEM ONLINE</span>
      </div>
    </div>
  );
}
