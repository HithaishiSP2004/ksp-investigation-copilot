"use client";

import React, { useState } from "react";
import { useAuth } from "@/features/auth/auth-context";
import { useLocale } from "@/lib/locales-provider";
import { LoginView } from "@/features/auth/login-view";
import { LayoutShell } from "@/components/layout-shell";
import { DashboardView } from "@/features/cases/components/dashboard-view";
import { CaseWorkspace } from "@/features/cases/components/case-workspace";
import { CaseForm } from "@/features/cases/components/case-form";
import { EvidenceWorkspace } from "@/features/evidence/components/evidence-workspace";
import { ShieldCheck, Sparkles, X } from "lucide-react";
import { TimelineView } from "@/features/knowledge/components/timeline-view";
import { CopilotView } from "@/features/knowledge/components/copilot-view";
import { ReportsView } from "@/features/knowledge/components/reports-view";

export default function HomePage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { t } = useLocale();

  // Navigation tab routing state
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
  
  // Dashboard case creation modal trigger
  const [isNewCaseOpen, setIsNewCaseOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground transition-all-custom">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest animate-pulse">
            Verifying secure console session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <LoginView />;
  }

  return (
    <LayoutShell activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="space-y-6 animate-fade-in">
        {/* Dynamic header welcome banner (only shown on dashboard view) */}
        {activeTab === "dashboard" && (
          <div className="p-6 bg-card border border-border rounded-xl shadow-sm relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 z-10">
              <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                Welcome, {user.firstName} {user.lastName}
                <Sparkles className="h-5 w-5 text-accent animate-pulse" />
              </h1>
              <p className="text-sm font-semibold text-muted-foreground">
                {t(user.role === "investigator" ? "roleInvestigator" : "roleSuperintendent")} • {user.stationName} ({user.districtName})
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider self-start sm:self-center">
              <ShieldCheck className="h-4 w-4" />
              <span>Secure Officer Session</span>
            </div>
          </div>
        )}

        {/* Dynamic panel rendering */}
        {activeTab === "dashboard" && (
          <DashboardView
            onNavigateToCases={(id) => {
              setSelectedCaseId(id || null);
              setActiveTab("cases");
            }}
            onOpenCreateModal={() => {
              setIsNewCaseOpen(true);
            }}
          />
        )}

        {activeTab === "cases" && (
          <CaseWorkspace
            initialSelectedCaseId={selectedCaseId}
            onClearNavigation={() => setSelectedCaseId(null)}
            onSelectCase={setSelectedCaseId}
          />
        )}

        {activeTab === "evidence" && (
          <EvidenceWorkspace />
        )}

        {activeTab === "timeline" && (
          <TimelineView initialCaseId={selectedCaseId} onCaseChange={setSelectedCaseId} />
        )}

        {activeTab === "copilot" && (
          <CopilotView initialCaseId={selectedCaseId} onCaseChange={setSelectedCaseId} />
        )}

        {activeTab === "reports" && (
          <ReportsView initialCaseId={selectedCaseId} onCaseChange={setSelectedCaseId} />
        )}

        {activeTab === "settings" && (
          <div className="h-[40vh] flex flex-col items-center justify-center border border-border border-dashed rounded-xl bg-card">
            <h3 className="text-sm font-bold text-foreground capitalize">
              {activeTab} Module Coming Soon
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              This settings console will be wired in a later sprint.
            </p>
          </div>
        )}
      </div>

      {/* Case Creation Modal triggered from Dashboard quick action */}
      {isNewCaseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border w-full max-w-2xl rounded-xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto relative animate-scale-up">
            <button
              onClick={() => setIsNewCaseOpen(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <CaseForm 
              onClose={() => setIsNewCaseOpen(false)} 
              onSuccess={() => {
                setIsNewCaseOpen(false);
                setActiveTab("cases");
              }} 
            />
          </div>
        </div>
      )}
    </LayoutShell>
  );
}
