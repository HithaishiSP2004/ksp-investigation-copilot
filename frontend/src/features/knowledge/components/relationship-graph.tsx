"use client";

import React, { useState, useRef, useEffect } from "react";
import { RenderNode, RenderLink } from "../adapters/graph-adapter";
import { ZoomIn, ZoomOut, Maximize2, Eye, HelpCircle } from "lucide-react";

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
      // Find SVG container bounding rect
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      // Map screen coordinates back to SVG layout space (accounting for pan & zoom)
      const mouseX = (e.clientX - rect.left - pan.x) / zoom;
      const mouseY = (e.clientY - rect.top - pan.y) / zoom;

      // Update node position
      setNodes((prevNodes) =>
        prevNodes.map((n) => (n.id === draggedNodeId ? { ...n, x: mouseX, y: mouseY } : n))
      );

      // Re-route links to follow updated coordinates
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

  // Wheel zoom
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
      <div className="flex-1 h-full relative bg-muted/5">
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

        {/* Legend */}
        <div className="absolute left-4 bottom-4 z-10 flex flex-wrap gap-3 bg-card/90 backdrop-blur border border-border p-2.5 rounded-lg shadow-sm text-[10px] font-semibold text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            <span>FIR Case</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span>People</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span>Evidence</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
            <span>AI Entity</span>
          </div>
        </div>

        <svg
          className="w-full h-full cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onClick={handleBackgroundClick}
        >
          {/* Grid background for structural context */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border/40" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Master zoom/pan translation group */}
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* 1. Connections/Links */}
            {links.map((link) => (
              <GraphLink key={link.id} link={link} />
            ))}

            {/* 2. Nodes */}
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
        <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-border bg-card p-5 shrink-0 flex flex-col justify-between h-full">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <Eye className="h-4 w-4 text-primary" />
              <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Inspect Node</h4>
            </div>

            <div className="space-y-2">
              <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                {selectedNode.type}
              </span>
              <h3 className="font-bold text-sm text-foreground break-all">{selectedNode.label}</h3>
              <p className="text-xs text-secondary-foreground leading-relaxed bg-muted/20 p-2.5 rounded-lg border border-border/40">
                {selectedNode.description}
              </p>
            </div>

            {selectedNode.metadata && (
              <div className="space-y-2 pt-2">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase">Node Attributes</span>
                <div className="space-y-1 text-xs">
                  {Object.entries(selectedNode.metadata).map(([key, val]) => (
                    <div key={key} className="flex justify-between items-baseline gap-2 py-0.5 border-b border-border/20">
                      <span className="text-muted-foreground capitalize">{key.replace(/_/g, " ")}:</span>
                      <span className="font-semibold text-foreground truncate max-w-[120px]">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="text-[10px] text-muted-foreground flex items-center gap-1 border-t border-border/40 pt-3 mt-4">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Drag nodes to organize visualization layout.</span>
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
  const borderStyle = isSelected
    ? "stroke-primary stroke-[3px] filter drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]"
    : "stroke-background stroke-[1.5px]";

  return (
    <g
      transform={`translate(${node.x}, ${node.y})`}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <circle
        r={node.size + 4}
        fill="transparent"
        className="group-hover:stroke-primary/20 group-hover:stroke-[3px] transition-all"
      />
      <circle
        r={node.size}
        fill={node.color}
        data-node-id={node.id}
        className={`transition-all ${borderStyle} focus:ring-2 focus:ring-primary focus:outline-none`}
        tabIndex={0}
        aria-label={`${node.type} node: ${node.label}`}
      />
      <text
        y={node.size + 14}
        textAnchor="middle"
        className="text-[9px] font-bold fill-foreground filter drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] pointer-events-none"
      >
        {node.label}
      </text>
    </g>
  );
});
GraphNode.displayName = "GraphNode";

const GraphLink = React.memo(({ link }: { link: RenderLink }) => {
  return (
    <g className="group">
      <line
        x1={link.x1}
        y1={link.y1}
        x2={link.x2}
        y2={link.y2}
        className={`stroke-[1.5px] transition-colors ${
          link.reviewStatus === "REJECTED"
            ? "stroke-red-300 stroke-dasharray-[4,4]"
            : link.reviewStatus === "VERIFIED"
            ? "stroke-primary"
            : "stroke-muted-foreground/40 stroke-dasharray-[2,2]"
        }`}
      />
      <circle
        cx={(link.x1 + link.x2) / 2}
        cy={(link.y1 + link.y2) / 2}
        r={8}
        fill="var(--card)"
        className="stroke-border stroke-[0.5px] cursor-help opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <title>{link.relationshipType} ({Math.round(link.confidence * 100)}% Conf)</title>
    </g>
  );
});
GraphLink.displayName = "GraphLink";
