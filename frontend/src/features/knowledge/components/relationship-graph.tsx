"use client";

import React, { useState, useRef, useEffect } from "react";
import { RenderNode, RenderLink } from "../adapters/graph-adapter";
import { ZoomIn, ZoomOut, Maximize2, Eye, HelpCircle, Shield, User, FileText, Cpu } from "lucide-react";

interface RelationshipGraphProps {
  nodes: RenderNode[];
  links: RenderLink[];
}

export function RelationshipGraph({ nodes: initialNodes, links: initialLinks }: RelationshipGraphProps) {
  // State for panning and zooming
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [selectedNode, setSelectedNode] = useState<RenderNode | null>(null);
  const [nodes, setNodes] = useState<RenderNode[]>(initialNodes);
  const [links, setLinks] = useState<RenderLink[]>(initialLinks);

  // Dragging states
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync state with props
  useEffect(() => {
    queueMicrotask(() => {
      setNodes(initialNodes);
      setLinks(initialLinks);
      setSelectedNode(null);
    });
  }, [initialNodes, initialLinks]);

  // Handle zoom controls
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.1, 2.5));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.4));
  const handleZoomReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Mouse/Touch Panning & Dragging Handlers
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    const target = e.target as SVGElement;
    const nodeId = target.getAttribute("data-node-id");

    if (nodeId) {
      setDraggedNodeId(nodeId);
    } else {
      setIsPanning(true);
      panStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (draggedNodeId) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const mouseX = (e.clientX - rect.left - pan.x) / zoom;
      const mouseY = (e.clientY - rect.top - pan.y) / zoom;

      setNodes((prevNodes) =>
        prevNodes.map((n) => (n.id === draggedNodeId ? { ...n, x: mouseX, y: mouseY } : n))
      );

      setLinks((prevLinks) =>
        prevLinks.map((l) => {
          if (l.source === draggedNodeId) {
            return { ...l, x1: mouseX, y1: mouseY };
          }
          if (l.target === draggedNodeId) {
            return { ...l, x2: mouseX, y2: mouseY };
          }
          return l;
        })
      );
    } else if (isPanning) {
      setPan({
        x: e.clientX - panStart.current.x,
        y: e.clientY - panStart.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    setDraggedNodeId(null);
    setIsPanning(false);
  };

  const handleNodeClick = (node: RenderNode, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNode(node);
  };

  const handleBackgroundClick = () => {
    setSelectedNode(null);
  };

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const zoomFactor = 0.05;
    const direction = e.deltaY < 0 ? 1 : -1;
    setZoom((z) => Math.max(0.4, Math.min(2.5, z + direction * zoomFactor)));
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 flex flex-col md:flex-row bg-card border border-border rounded-xl overflow-hidden shadow-sm h-[650px] relative select-none"
    >
      {/* SVG Canvas Area */}
      <div className="flex-1 h-full relative bg-zinc-950">
        {/* Floating Zoom Controls */}
        <div className="absolute left-4 top-4 z-10 flex flex-col gap-1.5 bg-card/90 backdrop-blur border border-border p-1.5 rounded-lg shadow-sm">
          <button
            onClick={handleZoomIn}
            className="p-1.5 hover:bg-muted text-foreground rounded transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 hover:bg-muted text-foreground rounded transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={handleZoomReset}
            className="p-1.5 hover:bg-muted text-foreground rounded transition-colors cursor-pointer"
            title="Recenter"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        {/* Tactical Legend */}
        <div className="absolute left-4 bottom-4 z-10 flex flex-wrap gap-3 bg-card/90 backdrop-blur border border-border p-2.5 rounded-lg shadow-sm text-[10px] font-semibold text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500 ring-2 ring-blue-500/20" />
            <span className="text-foreground">FIR Case</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-rose-500/20" />
            <span className="text-foreground">People</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
            <span className="text-foreground">Evidence</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-purple-500 ring-2 ring-purple-500/20" />
            <span className="text-foreground">AI Entity</span>
          </div>
        </div>

        <svg
          viewBox="0 0 800 500"
          className="w-full h-full cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onClick={handleBackgroundClick}
        >
          {/* Tactical Pattern Defs */}
          <defs>
            <pattern id="tacticalGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#27272a" strokeWidth="0.5" />
            </pattern>
            <filter id="glowBlue" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid Background & Tactical Radar Crosshairs */}
          <rect width="100%" height="100%" fill="url(#tacticalGrid)" />
          <circle cx="400" cy="250" r="140" fill="none" stroke="#27272a" strokeWidth="1" strokeDasharray="4,4" />
          <circle cx="400" cy="250" r="230" fill="none" stroke="#18181b" strokeWidth="1" />
          <line x1="400" y1="0" x2="400" y2="500" stroke="#18181b" strokeWidth="1" />
          <line x1="0" y1="250" x2="800" y2="250" stroke="#18181b" strokeWidth="1" />

          {/* Master zoom/pan translation group */}
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* 1. Connections/Links */}
            {links.map((link) => (
              <GraphLink key={link.id} link={link} />
            ))}

            {/* 2. Tactical Nodes */}
            {nodes.map((node) => (
              <GraphNode
                key={node.id}
                node={node}
                isSelected={selectedNode?.id === node.id}
                onClick={(e) => handleNodeClick(node, e)}
              />
            ))}
          </g>
        </svg>
      </div>

      {/* Slide-out Context Inspector Panel */}
      {selectedNode && (
        <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-border bg-card p-5 shrink-0 flex flex-col justify-between h-full shadow-lg animate-in slide-in-from-right">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <Eye className="h-4 w-4 text-primary" />
              <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Inspect Entity Node</h4>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                  {selectedNode.type}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">ID: {selectedNode.id}</span>
              </div>
              <h3 className="font-bold text-base text-foreground break-all">{selectedNode.label}</h3>
              <p className="text-xs text-secondary-foreground leading-relaxed bg-muted/20 p-3 rounded-xl border border-border/60 font-medium">
                {selectedNode.description}
              </p>
            </div>

            {selectedNode.metadata && (
              <div className="space-y-2 pt-2">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Node Attributes</span>
                <div className="space-y-1.5 text-xs bg-card border border-border rounded-xl p-3 shadow-xs">
                  {Object.entries(selectedNode.metadata).map(([key, val]) => (
                    <div key={key} className="flex justify-between items-baseline gap-2 py-1 border-b border-border/40 last:border-0">
                      <span className="text-muted-foreground capitalize font-semibold">{key.replace(/_/g, " ")}:</span>
                      <span className="font-mono font-bold text-foreground truncate max-w-[140px]">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 border-t border-border/60 pt-3 mt-4 font-semibold">
            <HelpCircle className="h-3.5 w-3.5 text-primary" />
            <span>Drag nodes to re-orient spatial coordinates.</span>
          </div>
        </div>
      )}
    </div>
  );
}

const GraphNode = React.memo(({
  node,
  isSelected,
  onClick,
}: {
  node: RenderNode;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
}) => {
  const getNodeColor = (type: string) => {
    switch (type) {
      case "CASE": return { bg: "#1e3a8a", border: "#3b82f6", badge: "#2563eb", text: "CASE" };
      case "PERSON": return { bg: "#881337", border: "#f43f5e", badge: "#e11d48", text: "PERSON" };
      case "EVIDENCE": return { bg: "#064e3b", border: "#10b981", badge: "#059669", text: "EVIDENCE" };
      case "ENTITY": return { bg: "#4c1d95", border: "#a855f7", badge: "#9333ea", text: "AI ENTITY" };
      default: return { bg: "#27272a", border: "#71717a", badge: "#52525b", text: type };
    }
  };

  const theme = getNodeColor(node.type);
  const cardWidth = 144;
  const cardHeight = 46;

  return (
    <g
      transform={`translate(${node.x}, ${node.y})`}
      className="group cursor-pointer"
      onClick={onClick}
    >
      {/* Outer Glow Ring on selection or hover */}
      <rect
        x={-cardWidth / 2 - 3}
        y={-cardHeight / 2 - 3}
        width={cardWidth + 6}
        height={cardHeight + 6}
        rx="11"
        fill="none"
        stroke={isSelected ? theme.border : "transparent"}
        strokeWidth="2"
        className="transition-all duration-300"
      />

      {/* Main Tactical Node Card */}
      <rect
        x={-cardWidth / 2}
        y={-cardHeight / 2}
        width={cardWidth}
        height={cardHeight}
        rx="9"
        fill="#18181b"
        stroke={theme.border}
        strokeWidth={isSelected ? "2" : "1.5"}
        data-node-id={node.id}
        className="transition-all filter drop-shadow-md group-hover:brightness-125"
      />

      {/* Header Tag Badge Pill */}
      <rect
        x={-cardWidth / 2 + 8}
        y={-cardHeight / 2 + 6}
        width="46"
        height="12"
        rx="3"
        fill={theme.badge}
      />
      <text
        x={-cardWidth / 2 + 31}
        y={-cardHeight / 2 + 15}
        textAnchor="middle"
        className="text-[7.5px] font-extrabold fill-white uppercase tracking-wider pointer-events-none font-sans"
      >
        {theme.text}
      </text>

      {/* Node Label Text */}
      <text
        x={-cardWidth / 2 + 8}
        y={-cardHeight / 2 + 34}
        className="text-[11px] font-bold fill-white pointer-events-none font-sans tracking-tight"
      >
        {node.label.length > 16 ? node.label.substring(0, 15) + "…" : node.label}
      </text>

      {/* Node Status Dot */}
      <circle
        cx={cardWidth / 2 - 12}
        cy={-cardHeight / 2 + 12}
        r="3.5"
        fill={theme.border}
        className="animate-pulse"
      />
    </g>
  );
});
GraphNode.displayName = "GraphNode";

const GraphLink = React.memo(({ link }: { link: RenderLink }) => {
  const midX = (link.x1 + link.x2) / 2;
  const midY = (link.y1 + link.y2) / 2;

  const getCleanLabel = (rel: string) => {
    switch (rel) {
      case "EVIDENCE_IN_CASE": return "EVIDENCE LINK";
      case "VICTIM_IN_CASE": return "VICTIM LINK";
      case "ACCUSED_IN_CASE": return "ACCUSED LINK";
      case "EXTRACTED_FROM": return "EXTRACTED";
      case "IDENTIFIED_AS_SUSPECT": return "SUSPECT MATCH";
      case "IDENTIFIED_AS_VICTIM": return "VICTIM MATCH";
      case "SHARED_SIM_CELL": return "SHARED SIM";
      default: return rel.replace(/_/g, " ");
    }
  };

  const badgeText = getCleanLabel(link.relationshipType);

  return (
    <g className="group">
      {/* Dynamic Link Line */}
      <line
        x1={link.x1}
        y1={link.y1}
        x2={link.x2}
        y2={link.y2}
        className={`stroke-[2px] transition-all ${
          link.reviewStatus === "REJECTED"
            ? "stroke-rose-500/60 stroke-dasharray-[4,4]"
            : link.reviewStatus === "VERIFIED"
            ? "stroke-sky-400"
            : "stroke-emerald-400/80 stroke-dasharray-[3,3]"
        }`}
      />

      {/* Relationship Label Badge */}
      <rect
        x={midX - 45}
        y={midY - 9}
        width="90"
        height="18"
        rx="5"
        fill="#09090b"
        stroke="#27272a"
        strokeWidth="1"
        className="shadow-sm"
      />
      <text
        x={midX}
        y={midY + 3}
        textAnchor="middle"
        className="text-[8.5px] font-bold fill-sky-400 font-mono tracking-wider uppercase pointer-events-none"
      >
        {badgeText}
      </text>

      <title>{link.relationshipType} ({Math.round(link.confidence * 100)}% Confidence)</title>
    </g>
  );
});
GraphLink.displayName = "GraphLink";
