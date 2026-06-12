"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Shield,
  FileText,
  Activity,
  ArrowLeft,
  RefreshCw,
  Gauge,
} from "lucide-react";
import { CompletionRing } from "@/components/CompletionRing";
import { OverviewMetricCard } from "@/components/OverviewMetricCard";
import { getComplianceSummary } from "@/lib/compliance/summary";
import { getDocumentsSummary } from "@/lib/documents/summary";
import { ComplianceDetailModal } from "@/components/ComplianceDetailModal";
import { DocumentsDetailModal } from "@/components/DocumentsDetailModal";
import { useRealtime } from "@/hooks/useRealtime";
import { useToast } from "@/components/ui/Toast";
import { LiveRegion } from "@/components/ui/LiveRegion";
import { JourneyStepper } from "@/components/JourneyStepper";
import { TourGuide } from "@/components/TourGuide";
import { RiskGauge } from "@/components/RiskGauge";
import { RiskBreakdown } from "@/components/RiskBreakdown";
import { WorkflowProgress } from "@/components/WorkflowProgress";
import { ChecklistTable } from "@/components/ChecklistTable";
import { DocumentUpload } from "@/components/DocumentUpload";
import { LenderReadinessPanel } from "@/components/LenderReadinessPanel";
import { MilestoneStrip } from "@/components/MilestoneStrip";
import { isDemoProject } from "@/lib/demo/constants";
import { setOnboardingFlag } from "@/lib/onboarding/storage";
import { copy } from "@/lib/copy";
import { getRiskSummary } from "@/lib/risk/summary";
import { getJourneyContext, type JourneyStep } from "@/lib/journey";
import {
  formatCurrency,
  formatDate,
  getAuditActionLabel,
  getRiskBadgeClass,
  humanize,
} from "@/lib/utils";
import type { DashboardData } from "@/types";

type Tab = "overview" | "checklist" | "audit";

export function ProjectDashboard({
  initialData,
  checklistItems,
}: {
  initialData: DashboardData;
  checklistItems: Array<{
    id: string;
    regulationId: string;
    category: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    notes: string | null;
  }>;
}) {
  const { toast } = useToast();
  const uploadRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState(initialData);
  const [checklist, setChecklist] = useState(checklistItems);
  const [running, setRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [liveMessage, setLiveMessage] = useState("");
  const [showComplianceDetail, setShowComplianceDetail] = useState(false);
  const [showDocumentsDetail, setShowDocumentsDetail] = useState(false);

  const journey = getJourneyContext(data);

  useEffect(() => {
    if (isDemoProject(data.project.name)) {
      setOnboardingFlag("viewed-demo");
    }
  }, [data.project.name]);

  const refresh = useCallback(async () => {
    const [dashRes, checkRes] = await Promise.all([
      fetch(`/api/projects/${data.project.id}`),
      fetch(`/api/checklist/${data.project.id}`),
    ]);
    if (dashRes.ok) setData(await dashRes.json());
    if (checkRes.ok) setChecklist(await checkRes.json());
  }, [data.project.id]);

  useRealtime(data.project.id, () => {
    refresh();
    setLiveMessage(copy.a11y.liveUpdates);
  });

  const runWorkflow = async () => {
    setRunning(true);
    try {
      const res = await fetch("/api/workflow/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: data.project.id }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Analysis failed");
      }
      await refresh();
      setActiveTab("checklist");
      toast("Analysis complete. Your checklist is ready to review.", "success");
      setLiveMessage("Analysis complete. Checklist ready.");
    } catch (error) {
      toast(
        error instanceof Error ? error.message : "Analysis failed. Please try again.",
        "error"
      );
    } finally {
      setRunning(false);
    }
  };

  const handleGuideAction = (step: JourneyStep) => {
    switch (step) {
      case "setup":
      case "upload":
        setActiveTab("overview");
        setTimeout(() => {
          uploadRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
        break;
      case "analyse":
        runWorkflow();
        break;
      case "review":
        setActiveTab("checklist");
        break;
      case "complete":
        setActiveTab("audit");
        break;
    }
  };

  const handleTabKeyDown = (e: React.KeyboardEvent, tabs: Tab[], index: number) => {
    let next = index;
    if (e.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    else return;

    e.preventDefault();
    setActiveTab(tabs[next]);
    document.getElementById(`tab-${tabs[next]}`)?.focus();
  };

  const { project, checklist: summary, documents, workflow, risk, lenderReadiness } = data;
  const riskSummary = getRiskSummary(project.riskScore, project.riskLevel, risk, summary);
  const complianceSummary = getComplianceSummary(summary);
  const documentsSummary = getDocumentsSummary(documents);
  const tabs: Tab[] = ["overview", "checklist", "audit"];

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
      <LiveRegion message={liveMessage} />

      {/* Header */}
      <header className="mb-6">
        <Link
          href="/"
          className="btn-ghost -ml-2 mb-3 !min-h-[40px] !px-2 text-sm text-slate-500"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {copy.dashboard.back}
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-balance text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {project.name}
            </h1>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              {project.propertyAddress}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              {project.state} · {humanize(project.propertyType)}
              {project.purchasePrice && ` · ${formatCurrency(project.purchasePrice)}`}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className={getRiskBadgeClass(project.riskLevel)}>
              {humanize(project.riskLevel)}
            </span>
            <span className="badge bg-slate-100 text-slate-700">
              {humanize(project.status)}
            </span>
          </div>
        </div>
      </header>

      {/* Journey progress */}
      <section className="mb-5 card !p-4 sm:!p-5" aria-label="Your progress">
        <JourneyStepper
          currentStep={journey.step}
          onStepClick={(step) => handleGuideAction(step)}
        />
      </section>

      {isDemoProject(project.name) && (
        <div className="mb-5 rounded-2xl border border-brand-200 bg-brand-50/60 px-4 py-3 text-sm text-brand-800">
          <span className="font-semibold">{copy.home.demoBanner.badge} project — </span>
          {copy.home.demoBanner.body}
        </div>
      )}

      {/* Tour guide */}
      <div className="mb-6">
        <TourGuide
          context={journey}
          onAction={handleGuideAction}
          actionLoading={running && journey.step === "analyse"}
        />
      </div>

      <MilestoneStrip data={data} />

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Project sections"
        className="tab-list mb-6"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab}
            id={`tab-${tab}`}
            role="tab"
            type="button"
            aria-selected={activeTab === tab}
            aria-controls={`panel-${tab}`}
            data-state={activeTab === tab ? "active" : "inactive"}
            tabIndex={activeTab === tab ? 0 : -1}
            className="tab-trigger"
            onClick={() => setActiveTab(tab)}
            onKeyDown={(e) => handleTabKeyDown(e, tabs, index)}
          >
            <span className="flex flex-col items-center gap-0.5">
              <span>{copy.dashboard.tabs[tab]}</span>
              <span className="hidden text-[10px] font-normal text-slate-400 lg:inline">
                {copy.dashboard.tabHints[tab]}
              </span>
            </span>
          </button>
        ))}
      </div>

      {/* Overview panel */}
      <div
        id="panel-overview"
        role="tabpanel"
        aria-labelledby="tab-overview"
        hidden={activeTab !== "overview"}
        className={activeTab !== "overview" ? "hidden" : undefined}
      >
        <LenderReadinessPanel readiness={lenderReadiness} />

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          <OverviewMetricCard
            title={copy.dashboard.sections.risk}
            icon={Gauge}
            summary={riskSummary.summary}
            drivers={riskSummary.drivers}
          >
            <RiskGauge score={project.riskScore} level={project.riskLevel} />
          </OverviewMetricCard>

          <OverviewMetricCard
            title={copy.dashboard.sections.compliance}
            icon={Shield}
            badge={<span className={complianceSummary.badge.className}>{complianceSummary.badge.label}</span>}
            summary={complianceSummary.summary}
            drivers={complianceSummary.drivers}
            onClick={() => setShowComplianceDetail(true)}
            ariaLabel={`${copy.dashboard.sections.compliance}. ${complianceSummary.badge.label}. ${copy.dashboard.detail.tapToExplore}`}
          >
            <CompletionRing
              value={complianceSummary.completionPercent}
              displayValue={`${complianceSummary.completionPercent}%`}
              subLabel="verified"
              strokeColor={complianceSummary.ringColor}
            />
            {summary.total > 0 && (
              <div className="mt-4 grid w-full grid-cols-4 gap-1.5">
                {[
                  { value: summary.total, label: "Total", className: "bg-slate-50 text-slate-700" },
                  { value: summary.compliant, label: "Done", className: "bg-green-50 text-green-800" },
                  { value: summary.inReview, label: "Review", className: "bg-blue-50 text-blue-800" },
                  { value: summary.nonCompliant, label: "Issues", className: "bg-red-50 text-red-800" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={`rounded-xl px-2 py-2 text-center ${stat.className}`}
                  >
                    <p className="text-sm font-bold tabular-nums">{stat.value}</p>
                    <p className="text-[10px] font-medium opacity-80">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}
          </OverviewMetricCard>

          <OverviewMetricCard
            title={copy.dashboard.sections.documents}
            icon={FileText}
            badge={<span className={documentsSummary.badge.className}>{documentsSummary.badge.label}</span>}
            summary={documentsSummary.summary}
            drivers={documentsSummary.drivers}
            onClick={() => setShowDocumentsDetail(true)}
            ariaLabel={`${copy.dashboard.sections.documents}. ${documentsSummary.badge.label}. ${copy.dashboard.detail.tapToExplore}`}
          >
            <CompletionRing
              value={documentsSummary.completionPercent}
              displayValue={String(documents.total)}
              subLabel="files uploaded"
              strokeColor={documentsSummary.ringColor}
            />
          </OverviewMetricCard>

          <section className="card lg:col-span-2" aria-labelledby="risk-breakdown-heading">
            <h2 id="risk-breakdown-heading" className="mb-4 text-sm font-semibold text-slate-900">
              {copy.dashboard.sections.riskBreakdown}
            </h2>
            {risk ? (
              <RiskBreakdown categories={risk.categories} />
            ) : (
              <p className="py-10 text-center text-sm text-slate-500">
                {copy.dashboard.empty.risk}
              </p>
            )}
          </section>

          <section className="card" aria-labelledby="workflow-heading">
            <h2 id="workflow-heading" className="mb-4 text-sm font-semibold text-slate-900">
              {copy.dashboard.sections.workflow}
            </h2>
            <WorkflowProgress stages={workflow.stages} />
            <button
              type="button"
              className="btn-secondary mt-4 w-full"
              onClick={runWorkflow}
              disabled={running}
              aria-busy={running}
            >
              {running ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" aria-hidden />
                  {copy.dashboard.running}
                </>
              ) : (
                copy.dashboard.runAnalysis
              )}
            </button>
          </section>

          <section className="card lg:col-span-1" ref={uploadRef}>
            <DocumentUpload
              id="upload-section"
              projectId={project.id}
              missingTypes={documents.missing}
              onUpload={refresh}
            />
          </section>

          <section className="card lg:col-span-2" aria-labelledby="activity-heading">
            <h2 id="activity-heading" className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Activity className="h-4 w-4 text-slate-400" aria-hidden />
              {copy.dashboard.sections.activity}
            </h2>
            <ul className="space-y-2" role="list">
              {data.recentActivity.length === 0 ? (
                <li className="text-sm text-slate-500">{copy.dashboard.empty.activity}</li>
              ) : (
                data.recentActivity.map((log) => (
                  <li
                    key={log.id}
                    className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800">
                        {getAuditActionLabel(log.action)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {log.actor} · {formatDate(log.createdAt)}
                      </p>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </section>
        </div>
      </div>

      {/* Checklist panel */}
      <div
        id="panel-checklist"
        role="tabpanel"
        aria-labelledby="tab-checklist"
        hidden={activeTab !== "checklist"}
        className={activeTab !== "checklist" ? "hidden" : undefined}
      >
        <section className="card">
          <h2 className="mb-1 text-base font-semibold text-slate-900">
            {copy.dashboard.sections.checklist}
          </h2>
          <p className="mb-6 text-sm text-slate-500">{copy.journey.hints.review}</p>
          {checklist.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-500">
              {copy.dashboard.empty.checklist}
            </p>
          ) : (
            <ChecklistTable
              items={checklist}
              projectId={project.id}
              onUpdate={refresh}
            />
          )}
        </section>
      </div>

      {/* Audit panel */}
      <div
        id="panel-audit"
        role="tabpanel"
        aria-labelledby="tab-audit"
        hidden={activeTab !== "audit"}
        className={activeTab !== "audit" ? "hidden" : undefined}
      >
        <AuditTrail projectId={project.id} />
      </div>

      {showComplianceDetail && (
        <ComplianceDetailModal
          summary={summary}
          checklistItems={checklist}
          onClose={() => setShowComplianceDetail(false)}
          onViewChecklist={() => setActiveTab("checklist")}
        />
      )}

      {showDocumentsDetail && (
        <DocumentsDetailModal
          documents={documents}
          onClose={() => setShowDocumentsDetail(false)}
          onAddDocuments={() => {
            setActiveTab("overview");
            setTimeout(() => {
              uploadRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
          }}
        />
      )}
    </div>
  );
}

function AuditTrail({ projectId }: { projectId: string }) {
  const [auditData, setAuditData] = useState<{
    logs: Array<{
      id: string;
      action: string;
      actor: string;
      details: string;
      hash: string;
      createdAt: string;
    }>;
    chainVerification: { valid: boolean; totalEntries: number };
  } | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/audit/${projectId}`);
    if (res.ok) setAuditData(await res.json());
  }, [projectId]);

  useEffect(() => {
    load();
  }, [load]);

  if (!auditData) {
    return (
      <div className="card py-12 text-center" role="status">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-brand-600" aria-hidden />
        <p className="mt-4 text-sm text-slate-500">{copy.dashboard.empty.audit}</p>
      </div>
    );
  }

  return (
    <section className="card" aria-labelledby="audit-heading">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="audit-heading" className="text-base font-semibold text-slate-900">
            {copy.dashboard.sections.audit}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{copy.journey.hints.complete}</p>
        </div>
        <span
          className={`badge self-start ${
            auditData.chainVerification.valid
              ? "bg-green-100 text-green-900"
              : "bg-red-100 text-red-900"
          }`}
        >
          {auditData.chainVerification.valid
            ? copy.audit.valid
            : copy.audit.invalid}
          {" · "}
          {copy.audit.entries(auditData.chainVerification.totalEntries)}
        </span>
      </div>
      <ol className="space-y-3" role="list">
        {auditData.logs.map((log) => (
          <li
            key={log.id}
            className="rounded-2xl border border-slate-200 p-4 font-mono text-xs"
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
              <span className="font-sans text-sm font-medium text-slate-800">
                {getAuditActionLabel(log.action)}
              </span>
              <time className="font-sans text-slate-400" dateTime={log.createdAt}>
                {formatDate(log.createdAt)}
              </time>
            </div>
            <p className="mt-2 font-sans text-slate-500">By {log.actor}</p>
            <p className="mt-1 break-all text-slate-400" aria-label="Integrity hash">
              #{log.hash.slice(0, 20)}…
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
