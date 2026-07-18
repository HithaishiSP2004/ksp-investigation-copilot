import { RelationshipNode, RelationshipLink } from "../types";
import { CaseService } from "@/features/cases/services/case-service";
import { EvidenceService } from "@/features/evidence/services/evidence-service";
import { IntelligenceService } from "@/features/intelligence/services/intelligence-service";

export class RelationshipRepository {
  static async getGraphData(caseId: number): Promise<{ nodes: RelationshipNode[]; links: RelationshipLink[] }> {
    const nodes: RelationshipNode[] = [];
    const links: RelationshipLink[] = [];

    // 1. Fetch Case details
    const caseDetails = await CaseService.getCaseById(caseId);
    if (!caseDetails) {
      return { nodes, links };
    }

    const caseNodeId = "case-" + caseDetails.id;
    nodes.push({
      id: caseNodeId,
      label: caseDetails.crimeNo,
      type: "CASE",
      description: caseDetails.briefFacts,
      metadata: {
        caseNo: caseDetails.caseNo,
        status: caseDetails.caseStatus,
        priority: caseDetails.priority,
        station: caseDetails.stationName,
      },
    });

    // 2. Fetch Persons (Victims & Suspects)
    const victims = caseDetails.victims || [];
    victims.forEach((vic) => {
      const vicNodeId = "person-vic-" + vic.id;
      nodes.push({
        id: vicNodeId,
        label: vic.name,
        type: "PERSON",
        description: "Victim/Complainant. " + (vic.description || ""),
        metadata: {
          age: vic.age,
          contact: vic.contact,
          injuryType: vic.injuryType,
        },
      });

      // Link to Case
      links.push({
        id: "link-case-vic-" + vic.id,
        source: caseNodeId,
        target: vicNodeId,
        relationshipType: "VICTIM_IN_CASE",
        confidence: 1.0,
        reviewStatus: "VERIFIED",
        createdAt: caseDetails.createdAt,
      });
    });

    const suspects = caseDetails.suspects || [];
    suspects.forEach((sus) => {
      const susNodeId = "person-sus-" + sus.id;
      nodes.push({
        id: susNodeId,
        label: sus.name,
        type: "PERSON",
        description: "Suspect/Accused. " + (sus.description || ""),
        metadata: {
          age: sus.age,
          contact: sus.contact,
          status: sus.status,
        },
      });

      // Link to Case
      links.push({
        id: "link-case-sus-" + sus.id,
        source: caseNodeId,
        target: susNodeId,
        relationshipType: "ACCUSED_IN_CASE",
        confidence: 1.0,
        reviewStatus: "VERIFIED",
        createdAt: caseDetails.createdAt,
      });
    });

    // 3. Fetch Evidence items for this case
    const evidenceList = await EvidenceService.getEvidenceByCase(caseId);
    for (const ev of evidenceList) {
      const evNodeId = "evidence-" + ev.id;
      nodes.push({
        id: evNodeId,
        label: ev.evidenceNo,
        type: "EVIDENCE",
        description: ev.title + " (" + ev.evidenceType + ")",
        metadata: {
          fileName: ev.fileName,
          status: ev.status,
          hash: ev.fileHash,
        },
      });

      // Link to Case
      links.push({
        id: "link-case-ev-" + ev.id,
        source: caseNodeId,
        target: evNodeId,
        relationshipType: "EVIDENCE_IN_CASE",
        confidence: 1.0,
        reviewStatus: "VERIFIED",
        createdAt: ev.createdAt,
      });

      // 4. Fetch Intelligence Record for this evidence
      const intelRecord = IntelligenceService.getLatestRecord(ev.id);
      if (intelRecord) {
        // Render extracted entities
        intelRecord.entities.forEach((entity) => {
          // Check if entity is accepted
          const isAccepted = entity.reviewStatus === "ACCEPTED";
          const isRejected = entity.reviewStatus === "REJECTED";
          
          if (isRejected) return; // Skip rejected entities in visual graph

          const entityNodeId = "entity-" + entity.id;
          nodes.push({
            id: entityNodeId,
            label: entity.value,
            type: "ENTITY",
            description: entity.type + " extracted from " + ev.evidenceNo,
            metadata: {
              type: entity.type,
              confidence: entity.confidence,
              method: entity.extractionMethod,
              reviewStatus: entity.reviewStatus,
            },
          });

          // Link Entity to Evidence
          links.push({
            id: "link-ev-ent-" + entity.id,
            source: evNodeId,
            target: entityNodeId,
            relationshipType: "EXTRACTED_FROM",
            confidence: entity.confidence,
            sourceIntelId: intelRecord.id,
            supportingEvidenceNo: ev.evidenceNo,
            reviewStatus: isAccepted ? "VERIFIED" : "PENDING",
            createdAt: entity.extractedAt,
          });

          // Connect entity to Complainant or Suspect if names match
          const matchingSuspect = suspects.find(s => s.name.toLowerCase().includes(entity.value.toLowerCase()) || entity.value.toLowerCase().includes(s.name.toLowerCase()));
          if (matchingSuspect && entity.type === "PERSON") {
            links.push({
              id: "link-sus-ent-" + entity.id,
              source: "person-sus-" + matchingSuspect.id,
              target: entityNodeId,
              relationshipType: "IDENTIFIED_AS_SUSPECT",
              confidence: 0.95,
              supportingEvidenceNo: ev.evidenceNo,
              reviewStatus: "VERIFIED",
              createdAt: entity.extractedAt,
            });
          }

          const matchingVictim = victims.find(v => v.name.toLowerCase().includes(entity.value.toLowerCase()) || entity.value.toLowerCase().includes(v.name.toLowerCase()));
          if (matchingVictim && entity.type === "PERSON") {
            links.push({
              id: "link-vic-ent-" + entity.id,
              source: "person-vic-" + matchingVictim.id,
              target: entityNodeId,
              relationshipType: "IDENTIFIED_AS_VICTIM",
              confidence: 0.95,
              supportingEvidenceNo: ev.evidenceNo,
              reviewStatus: "VERIFIED",
              createdAt: entity.extractedAt,
            });
          }
        });

        // Render inferred relationships between entities
        intelRecord.relationships.forEach((rel) => {
          const fromNodeExists = nodes.some(n => n.id === "entity-" + rel.fromEntityId);
          const toNodeExists = nodes.some(n => n.id === "entity-" + rel.toEntityId);
          
          if (fromNodeExists && toNodeExists) {
            links.push({
              id: "link-rel-" + rel.id,
              source: "entity-" + rel.fromEntityId,
              target: "entity-" + rel.toEntityId,
              relationshipType: rel.relationshipType,
              confidence: rel.confidence,
              sourceIntelId: intelRecord.id,
              supportingEvidenceNo: ev.evidenceNo,
              reviewStatus: "PENDING",
              createdAt: intelRecord.analyzedAt,
            });
          }
        });
      }
    }

    return { nodes, links };
  }
}
