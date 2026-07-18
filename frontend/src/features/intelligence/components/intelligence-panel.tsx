"use client";

import React, { useState, useEffect } from "react";
import { useIntelligence } from "../hooks/use-intelligence";
import { useLocale } from "@/lib/locales-provider";
import {
  IntelligenceRecord,
  ExtractedEntity,
  EntityRelationship,
  EntityType,
  AiReviewStatus,
} from "../types";
import { EvidenceMaster } from "@/features/evidence/types";
import {
  Brain,
  ScanText,
  Users,
  Network,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface IntelligencePanelProps {
  evidence: EvidenceMaster;
}

type PanelTab = "ocr" | "entities" | "summary" | "relations";

function ConfidenceBadge({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const color =
    pct >= 90
      ? "text-green-600 bg-green-50 border-green-200"
      : pct >= 75
      ? "text-amber-600 bg-amber-50 border-amber-200"
      : "text-red-600 bg-red-50 border-red-200";
  return (
    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${color}`}>
      {pct}%
    </span>
  );
}

function ReviewBadge({
  status,
  labels,
}: {
  status: AiReviewStatus;
  labels: { pending: string; accepted: string; rejected: string };
}) {
  const styles: Record<AiReviewStatus, string> = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    ACCEPTED: "bg-green-50 text-green-700 border-green-200",
    REJECTED: "bg-red-50 text-red-700 border-red-200",
  };
  const icons: Record<AiReviewStatus, React.ReactNode> = {
    PENDING: <Clock className="h-2.5 w-2.5" />,
    ACCEPTED: <CheckCircle className="h-2.5 w-2.5" />,
    REJECTED: <XCircle className="h-2.5 w-2.5" />,
  };
  const text: Record<AiReviewStatus, string> = {
    PENDING: labels.pending,
    ACCEPTED: labels.accepted,
    REJECTED: labels.rejected,
  };
  return (
    <span
      className={`flex items-center gap-1 text-[8px] font-bold px-1.5 py-0.5 rounded border ${styles[status]}`}
    >
      {icons[status]}
      {text[status]}
    </span>
  );
}

export function IntelligencePanel({
  evidence,
}: IntelligencePanelProps) {
  const { t } = useLocale();
  const {
    intelligenceRecord,
    isAnalyzing,
    error,
    analyzeEvidence,
    reviewEntity,
    refreshRecord,
  } = useIntelligence();

  const [activeTab, setActiveTab] = useState<PanelTab>("entities");
  const [expandedOcr, setExpandedOcr] = useState(false);

  // Load cached record when the selected evidence asset changes
  useEffect(() => {
    refreshRecord(evidence.id);
  }, [evidence.id, refreshRecord]);

  const entityTypeLabel = (type: EntityType): string => {
    const key = `entityType${type}` as Parameters<typeof t>[0];
    return t(key);
  };

  const entityTypeColor = (type: EntityType): string => {
    const colors: Record<EntityType, string> = {
      PERSON: "bg-blue-50 text-blue-700 border-blue-200",
      PHONE: "bg-purple-50 text-purple-700 border-purple-200",
      VEHICLE: "bg-orange-50 text-orange-700 border-orange-200",
      ADDRESS: "bg-teal-50 text-teal-700 border-teal-200",
      EMAIL: "bg-indigo-50 text-indigo-700 border-indigo-200",
      ORGANIZATION: "bg-rose-50 text-rose-700 border-rose-200",
      DATE: "bg-cyan-50 text-cyan-700 border-cyan-200",
      TIME: "bg-sky-50 text-sky-700 border-sky-200",
      CURRENCY: "bg-emerald-50 text-emerald-700 border-emerald-200",
      IDENTITY_NUMBER: "bg-yellow-50 text-yellow-700 border-yellow-200",
    };
    return colors[type] ?? "bg-muted text-muted-foreground border-border";
  };

  const handleReview = async (entityId: string, status: AiReviewStatus) => {
    await reviewEntity(entityId, status);
  };

  const tabs: { id: PanelTab; label: string; icon: React.ReactNode }[] = [
    { id: "entities", label: t("intelTabEntities"), icon: <Users className="h-3.5 w-3.5" /> },
    { id: "ocr", label: t("intelTabOcr"), icon: <ScanText className="h-3.5 w-3.5" /> },
    { id: "summary", label: t("intelTabSummary"), icon: <FileText className="h-3.5 w-3.5" /> },
    { id: "relations", label: t("intelTabRelations"), icon: <Network className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="flex flex-col h-full bg-muted/10 border-l border-border overflow-hidden">
      {/* Panel Header */}
      <div className="p-4 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary shrink-0" />
          <h3 className="font-bold text-sm text-foreground">{t("intelPanelTitle")}</h3>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1 font-medium truncate">
          {evidence.evidenceNo} · {evidence.title}
        </p>
      </div>

      {/* Analyse Button or Status */}
      <div className="px-4 py-3 border-b border-border shrink-0">
        {isAnalyzing ? (
          <div className="flex items-center gap-2 text-xs text-primary font-semibold animate-pulse">
            <Cpu className="h-3.5 w-3.5 animate-spin" />
            {t("intelAnalyzing")}
          </div>
        ) : error ? (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-destructive font-semibold">
              <AlertTriangle className="h-3.5 w-3.5" />
              {t("intelErrorFailed")}
            </div>
            <Button
              size="sm"
              variant="outline"
              className="w-full h-8 text-xs font-bold"
              onClick={() =>
                analyzeEvidence(evidence.id, evidence.mimeType, evidence.fileName)
              }
            >
              {t("intelAnalyzeBtn")}
            </Button>
          </div>
        ) : intelligenceRecord ? (
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground font-semibold">
              v{intelligenceRecord.version} ·{" "}
              {new Date(intelligenceRecord.analyzedAt).toLocaleString()}
            </span>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-[10px] font-bold text-primary"
              onClick={() =>
                analyzeEvidence(evidence.id, evidence.mimeType, evidence.fileName)
              }
            >
              Re-analyse
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            className="w-full h-8 text-xs font-bold gap-1.5"
            onClick={() =>
              analyzeEvidence(evidence.id, evidence.mimeType, evidence.fileName)
            }
          >
            <Brain className="h-3.5 w-3.5" />
            {t("intelAnalyzeBtn")}
          </Button>
        )}
      </div>

      {/* Tab Bar */}
      {intelligenceRecord && !isAnalyzing && (
        <>
          <div className="flex border-b border-border shrink-0 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 px-3 py-2.5 text-[10px] font-bold whitespace-nowrap transition-colors cursor-pointer border-b-2 ${
                  activeTab === tab.id
                    ? "border-primary text-primary bg-primary/5"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTab === "ocr" && (
              <OcrTab
                record={intelligenceRecord}
                expanded={expandedOcr}
                onToggle={() => setExpandedOcr((v) => !v)}
                t={t}
              />
            )}
            {activeTab === "entities" && (
              <EntitiesTab
                record={intelligenceRecord}
                onReview={handleReview}
                entityTypeLabel={entityTypeLabel}
                entityTypeColor={entityTypeColor}
                t={t}
              />
            )}
            {activeTab === "summary" && (
              <SummaryTab record={intelligenceRecord} t={t} />
            )}
            {activeTab === "relations" && (
              <RelationsTab
                record={intelligenceRecord}
                entityTypeLabel={entityTypeLabel}
                t={t}
              />
            )}
          </div>
        </>
      )}

      {/* Empty state */}
      {!intelligenceRecord && !isAnalyzing && !error && (
        <div className="flex-1 flex items-center justify-center p-6">
          <p className="text-xs text-muted-foreground font-semibold text-center">
            {t("intelNoRecord")}
          </p>
        </div>
      )}

      {/* Analyzing skeleton */}
      {isAnalyzing && (
        <div className="flex-1 p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-8 rounded bg-muted/60 animate-pulse"
              style={{ width: `${70 + (i % 3) * 10}%` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Sub-panel: OCR Console ────────────────────────────────────────────────

function OcrTab({
  record,
  expanded,
  onToggle,
  t,
}: {
  record: IntelligenceRecord;
  expanded: boolean;
  onToggle: () => void;
  t: ReturnType<typeof useLocale>["t"];
}) {
  const { ocrResult } = record;
  return (
    <div className="space-y-3">
      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
        {t("intelOcrTitle")}
      </h4>

      {/* Provider metadata */}
      <div className="flex flex-wrap gap-2 text-[9px]">
        <span className="px-2 py-0.5 rounded bg-muted border border-border font-semibold">
          {t("intelOcrProvider")}: {ocrResult.provider}
        </span>
        <ConfidenceBadge value={ocrResult.confidence} />
        <span className="px-2 py-0.5 rounded bg-muted border border-border font-semibold">
          {t("intelOcrProcessed")}: {new Date(ocrResult.processedAt).toLocaleTimeString()}
        </span>
      </div>

      {/* OCR Text (expandable) */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div
          className={`text-[10px] font-mono text-foreground p-3 leading-relaxed whitespace-pre-wrap ${
            expanded ? "" : "max-h-40 overflow-hidden"
          }`}
        >
          {ocrResult.rawText}
        </div>
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-1 py-1.5 border-t border-border text-[10px] text-muted-foreground hover:text-foreground font-semibold cursor-pointer bg-muted/30 hover:bg-muted/60 transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-3 w-3" /> Collapse
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3" /> Expand
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Sub-panel: Entity Roster ──────────────────────────────────────────────

function EntitiesTab({
  record,
  onReview,
  entityTypeLabel,
  entityTypeColor,
  t,
}: {
  record: IntelligenceRecord;
  onReview: (id: string, status: AiReviewStatus) => Promise<void>;
  entityTypeLabel: (type: EntityType) => string;
  entityTypeColor: (type: EntityType) => string;
  t: ReturnType<typeof useLocale>["t"];
}) {
  const [reviewing, setReviewing] = useState<string | null>(null);

  const handleReview = async (entity: ExtractedEntity, status: AiReviewStatus) => {
    if (entity.reviewStatus === status) return;
    setReviewing(entity.id);
    await onReview(entity.id, status);
    setReviewing(null);
  };

  if (record.entities.length === 0) {
    return (
      <p className="text-xs text-muted-foreground font-semibold">{t("intelEntitiesNone")}</p>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
        {t("intelEntitiesTitle")} ({record.entities.length})
      </h4>
      <div className="space-y-2">
        {record.entities.map((entity) => (
          <div
            key={entity.id}
            className="bg-card border border-border rounded-lg p-3 space-y-2"
          >
            {/* Entity header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <span
                  className={`inline-block text-[8px] font-bold px-1.5 py-0.5 rounded border mb-1 ${entityTypeColor(entity.type)}`}
                >
                  {entityTypeLabel(entity.type)}
                </span>
                <p className="text-xs font-bold text-foreground break-words">
                  {entity.value}
                </p>
              </div>
              <ReviewBadge
                status={entity.reviewStatus}
                labels={{
                  pending: t("intelReviewPending"),
                  accepted: t("intelReviewAccepted"),
                  rejected: t("intelReviewRejected"),
                }}
              />
            </div>

            {/* Confidence + Method */}
            <div className="flex items-center gap-2 text-[9px] text-muted-foreground font-medium">
              <ConfidenceBadge value={entity.confidence} />
              <span>{entity.extractionMethod}</span>
            </div>

            {/* Officer Review Controls */}
            {entity.reviewStatus === "PENDING" && (
              <div className="flex gap-1.5 pt-1 border-t border-border/40">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={reviewing === entity.id}
                  className="flex-1 h-6 text-[10px] font-bold text-green-700 border-green-200 hover:bg-green-50"
                  onClick={() => handleReview(entity, "ACCEPTED")}
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {t("intelReviewAccept")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={reviewing === entity.id}
                  className="flex-1 h-6 text-[10px] font-bold text-red-700 border-red-200 hover:bg-red-50"
                  onClick={() => handleReview(entity, "REJECTED")}
                >
                  <XCircle className="h-3 w-3 mr-1" />
                  {t("intelReviewReject")}
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Sub-panel: AI Summary ─────────────────────────────────────────────────

function SummaryTab({
  record,
  t,
}: {
  record: IntelligenceRecord;
  t: ReturnType<typeof useLocale>["t"];
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          {t("intelSummaryTitle")}
        </h4>
        <p className="text-xs text-foreground leading-relaxed bg-card border border-border rounded-lg p-3">
          {record.analysisSummary}
        </p>
      </div>

      {/* Labels */}
      {record.aiLabels.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            {t("intelSummaryLabels")}
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {record.aiLabels.map((label) => (
              <span
                key={label}
                className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[9px] font-bold"
              >
                {label.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-card border border-border rounded-lg p-3 space-y-0.5">
          <p className="text-[9px] text-muted-foreground font-semibold uppercase">
            {t("intelSummaryOverallConf")}
          </p>
          <ConfidenceBadge value={record.overallConfidence} />
        </div>
        <div className="bg-card border border-border rounded-lg p-3 space-y-0.5">
          <p className="text-[9px] text-muted-foreground font-semibold uppercase">
            {t("intelSummaryVersion")}
          </p>
          <p className="text-xs font-bold text-foreground">v{record.version}</p>
        </div>
      </div>

      {/* Provider attribution */}
      <div className="text-[9px] text-muted-foreground font-medium flex items-center gap-1 border-t border-border/60 pt-2">
        <Brain className="h-3 w-3" />
        {record.provider} · {new Date(record.analyzedAt).toLocaleString()}
      </div>
    </div>
  );
}

// ─── Sub-panel: Relationships ──────────────────────────────────────────────

function RelationsTab({
  record,
  entityTypeLabel,
  t,
}: {
  record: IntelligenceRecord;
  entityTypeLabel: (type: EntityType) => string;
  t: ReturnType<typeof useLocale>["t"];
}) {
  const entityById = Object.fromEntries(
    record.entities.map((e) => [e.id, e])
  );

  if (record.relationships.length === 0) {
    return (
      <p className="text-xs text-muted-foreground font-semibold">{t("intelRelationsNone")}</p>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
        {t("intelRelationsTitle")} ({record.relationships.length})
      </h4>
      <div className="space-y-2">
        {record.relationships.map((rel: EntityRelationship) => {
          const from = entityById[rel.fromEntityId];
          const to = entityById[rel.toEntityId];
          if (!from || !to) return null;
          return (
            <div
              key={rel.id}
              className="bg-card border border-border rounded-lg p-3 space-y-1.5"
            >
              <div className="flex items-center gap-2 flex-wrap text-[10px]">
                <span className="font-bold text-foreground truncate max-w-[80px]">
                  {from.value}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[8px] font-bold border border-primary/20 whitespace-nowrap">
                  {rel.relationshipType.replace(/_/g, " ")}
                </span>
                <span className="font-bold text-foreground truncate max-w-[80px]">
                  {to.value}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[9px] text-muted-foreground">
                <span>
                  {entityTypeLabel(from.type)} → {entityTypeLabel(to.type)}
                </span>
                <ConfidenceBadge value={rel.confidence} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
