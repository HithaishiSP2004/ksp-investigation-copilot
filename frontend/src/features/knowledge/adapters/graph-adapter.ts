import { RelationshipNode, RelationshipLink } from "../types";

export interface RenderNode {
  id: string;
  label: string;
  type: string;
  x: number;
  y: number;
  size: number;
  color: string;
  description: string;
  metadata?: Record<string, unknown>;
}

export interface RenderLink {
  id: string;
  source: string;
  target: string;
  relationshipType: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  confidence: number;
  reviewStatus: string;
}

export interface GraphAdapter {
  transform(nodes: RelationshipNode[], links: RelationshipLink[], width: number, height: number): {
    renderNodes: RenderNode[];
    renderLinks: RenderLink[];
  };
}

export class SimpleSvgGraphAdapter implements GraphAdapter {
  transform(
    nodes: RelationshipNode[],
    links: RelationshipLink[],
    width: number,
    height: number
  ): { renderNodes: RenderNode[]; renderLinks: RenderLink[] } {
    const cx = width / 2;
    const cy = height / 2;

    const nodeColors: Record<string, string> = {
      CASE: "#3b82f6", // Blue
      PERSON: "#ef4444", // Red
      EVIDENCE: "#10b981", // Green
      ENTITY: "#8b5cf6", // Purple
    };

    const nodeSizes: Record<string, number> = {
      CASE: 32,
      PERSON: 24,
      EVIDENCE: 24,
      ENTITY: 18,
    };

    // Calculate layout coordinates deterministically
    const renderNodes: RenderNode[] = [];
    const nodeIndex = new Map<string, number>();

    nodes.forEach((node, idx) => {
      let x = cx;
      let y = cy;

      if (node.type === "CASE") {
        x = cx;
        y = cy;
      } else if (node.type === "PERSON") {
        // middle ring
        const angle = (idx * 2 * Math.PI) / Math.max(nodes.length - 1, 1);
        x = cx + 130 * Math.cos(angle);
        y = cy + 130 * Math.sin(angle);
      } else if (node.type === "EVIDENCE") {
        // outer ring
        const angle = (idx * 2 * Math.PI) / Math.max(nodes.length - 1, 1) + Math.PI / 4;
        x = cx + 220 * Math.cos(angle);
        y = cy + 220 * Math.sin(angle);
      } else if (node.type === "ENTITY") {
        // branch off parent evidence if possible, otherwise random outer ring
        const parentLink = links.find((l) => l.target === node.id && l.relationshipType === "EXTRACTED_FROM");
        if (parentLink) {
          const parentIdx = nodes.findIndex((n) => n.id === parentLink.source);
          const angle = (parentIdx * 2 * Math.PI) / Math.max(nodes.length - 1, 1) + (idx * Math.PI) / 8;
          x = cx + 300 * Math.cos(angle);
          y = cy + 300 * Math.sin(angle);
        } else {
          const angle = (idx * 2 * Math.PI) / Math.max(nodes.length - 1, 1) + Math.PI / 3;
          x = cx + 280 * Math.cos(angle);
          y = cy + 280 * Math.sin(angle);
        }
      }

      renderNodes.push({
        id: node.id,
        label: node.label,
        type: node.type,
        x,
        y,
        size: nodeSizes[node.type] || 20,
        color: nodeColors[node.type] || "#6b7280",
        description: node.description,
        metadata: node.metadata,
      });

      nodeIndex.set(node.id, renderNodes.length - 1);
    });

    const renderLinks: RenderLink[] = [];
    links.forEach((link) => {
      const sourceNode = renderNodes.find((n) => n.id === link.source);
      const targetNode = renderNodes.find((n) => n.id === link.target);

      if (sourceNode && targetNode) {
        renderLinks.push({
          id: link.id,
          source: link.source,
          target: link.target,
          relationshipType: link.relationshipType,
          x1: sourceNode.x,
          y1: sourceNode.y,
          x2: targetNode.x,
          y2: targetNode.y,
          confidence: link.confidence,
          reviewStatus: link.reviewStatus,
        });
      }
    });

    return { renderNodes, renderLinks };
  }
}
