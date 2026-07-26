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
      PERSON: "#f43f5e", // Rose
      EVIDENCE: "#10b981", // Emerald
      ENTITY: "#a855f7", // Purple
    };

    const nodeSizes: Record<string, number> = {
      CASE: 32,
      PERSON: 24,
      EVIDENCE: 24,
      ENTITY: 18,
    };

    const personNodes = nodes.filter(n => n.type === "PERSON");
    const evidenceNodes = nodes.filter(n => n.type === "EVIDENCE");
    const entityNodes = nodes.filter(n => n.type === "ENTITY");

    let personIndex = 0;
    let evidenceIndex = 0;
    let entityIndex = 0;

    const renderNodes: RenderNode[] = [];

    nodes.forEach((node) => {
      let x = cx;
      let y = cy;

      if (node.type === "CASE") {
        x = cx;
        y = cy;
      } else if (node.type === "PERSON") {
        // Space person nodes on inner ring (radius 210px) with 45-degree angle offset
        const total = Math.max(personNodes.length, 1);
        const angle = (personIndex * 2 * Math.PI) / total + Math.PI / 4;
        x = cx + 210 * Math.cos(angle);
        y = cy + 180 * Math.sin(angle);
        personIndex++;
      } else if (node.type === "EVIDENCE") {
        // Space evidence nodes on middle ring (radius 300px)
        const total = Math.max(evidenceNodes.length, 1);
        const angle = (evidenceIndex * 2 * Math.PI) / total - Math.PI / 3;
        x = cx + 300 * Math.cos(angle);
        y = cy + 220 * Math.sin(angle);
        evidenceIndex++;
      } else if (node.type === "ENTITY") {
        // Space entity nodes on outer ring (radius 380px)
        const total = Math.max(entityNodes.length, 1);
        const angle = (entityIndex * 2 * Math.PI) / total + Math.PI / 6;
        x = cx + 380 * Math.cos(angle);
        y = cy + 260 * Math.sin(angle);
        entityIndex++;
      }

      renderNodes.push({
        id: node.id,
        label: node.label,
        type: node.type,
        x,
        y,
        size: nodeSizes[node.type] || 20,
        color: nodeColors[node.type] || "#71717a",
        description: node.description,
        metadata: node.metadata,
      });
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
