"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { copy } from "@/lib/copy";
import { formatCurrency, formatDate, getStatusLabel, humanize } from "@/lib/utils";
import type { DashboardData } from "@/types";

interface ReportViewProps {
  data: DashboardData;
  checklistItems: Array<{
    category: string;
    title: string;
    status: string;
    priority: string;
    notes: string | null;
  }>;
  auditVerification: { valid: boolean; totalEntries: number };
  autoPrint?: boolean;
}

export function ReportView({
  data,
  checklistItems,
  auditVerification,
  autoPrint,
}: ReportViewProps) {
  const { project, checklist, documents, risk, lenderReadiness } = data;
  const generatedAt = new Date().toLocaleString("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  useEffect(() => {
    if (autoPrint) {
      const timer = setTimeout(() => window.print(), 400);
      return () => clearTimeout(timer);
    }
  }, [autoPrint]);

  return (
    <div className="report-root mx-auto max-w-4xl bg-white px-6 py-8 sm:px-10 sm:py-12">
      <div className="no-print mb-8 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/projects/${project.id}`}
          className="btn-ghost !min-h-[40px] !px-2 text-sm text-slate-500"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {copy.export.backToProject}
        </Link>
        <button type="button" className="btn-primary" onClick={() => window.print()}>
          <Printer className="h-4 w-4" aria-hidden />
          {copy.export.print}
        </button>
      </div>

      <header className="border-b border-slate-200 pb-6">
        <p className="text-sm font-semibold text-brand-600">{copy.app.name}</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">{copy.export.title}</h1>
        <p className="mt-2 text-lg font-semibold text-slate-800">{project.name}</p>
        <p className="mt-1 text-sm text-slate-600">{project.propertyAddress}</p>
        <p className="mt-1 text-sm text-slate-500">
          {project.state} · {humanize(project.propertyType)}
          {project.purchasePrice && ` · ${formatCurrency(project.purchasePrice)}`}
        </p>
        <p className="mt-3 text-xs text-slate-400">{copy.export.generated(generatedAt)}</p>
        <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
          {copy.export.subtitle}. {copy.legal.disclaimer.short}
        </p>
      </header>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">{copy.export.sections.summary}</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-4">
            <dt className="text-xs font-medium uppercase text-slate-500">Risk score</dt>
            <dd className="mt-1 text-2xl font-bold text-slate-900">
              {project.riskScore > 0 ? project.riskScore : "—"}
              {project.riskLevel !== "pending" && (
                <span className="ml-2 text-sm font-medium text-slate-500">
                  ({humanize(project.riskLevel)})
                </span>
              )}
            </dd>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <dt className="text-xs font-medium uppercase text-slate-500">Bankability</dt>
            <dd className="mt-1 text-2xl font-bold text-slate-900">
              {lenderReadiness.bankabilityScore > 0
                ? `${lenderReadiness.bankabilityScore}`
                : "—"}
              <span className="ml-2 text-sm font-medium text-slate-500">
                ({humanize(lenderReadiness.bankabilityLevel)})
              </span>
            </dd>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <dt className="text-xs font-medium uppercase text-slate-500">Compliance</dt>
            <dd className="mt-1 text-sm text-slate-700">
              {checklist.compliant} compliant · {checklist.nonCompliant} non-compliant ·{" "}
              {checklist.pending + checklist.inReview} outstanding
            </dd>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <dt className="text-xs font-medium uppercase text-slate-500">Documents</dt>
            <dd className="mt-1 text-sm text-slate-700">
              {documents.total} on file
              {documents.missing.length > 0 &&
                ` · ${documents.missing.length} type(s) still needed`}
            </dd>
          </div>
        </dl>
      </section>

      {risk && (
        <section className="mt-8 break-inside-avoid">
          <h2 className="text-lg font-semibold text-slate-900">{copy.export.sections.risk}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {risk.categories.map((cat) => (
              <li key={cat.category} className="flex justify-between gap-4 border-b border-slate-100 py-2">
                <span>{cat.category}</span>
                <span className="font-semibold">{cat.score}/100</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8 break-inside-avoid">
        <h2 className="text-lg font-semibold text-slate-900">{copy.export.sections.compliance}</h2>
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-500">
              <th className="py-2 pr-4">Requirement</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {checklistItems.map((item) => (
              <tr key={`${item.category}-${item.title}`} className="border-b border-slate-100">
                <td className="py-2 pr-4">
                  <span className="font-medium text-slate-900">{item.title}</span>
                  <span className="block text-xs text-slate-400">{item.category}</span>
                </td>
                <td className="py-2 pr-4">{getStatusLabel(item.status)}</td>
                <td className="py-2 text-slate-600">{item.notes ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-8 break-inside-avoid">
        <h2 className="text-lg font-semibold text-slate-900">{copy.export.sections.lender}</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          {lenderReadiness.sections.map((section) => (
            <li key={section.id} className="flex justify-between gap-4 border-b border-slate-100 py-2">
              <span>{section.label}</span>
              <span>{section.headline}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 break-inside-avoid">
        <h2 className="text-lg font-semibold text-slate-900">{copy.export.sections.documents}</h2>
        <ul className="mt-3 space-y-1 text-sm text-slate-700">
          {documents.files.length === 0 ? (
            <li>No documents uploaded</li>
          ) : (
            documents.files.map((file) => (
              <li key={file.id}>
                {file.fileName} · {humanize(file.type)} · {formatDate(file.uploadedAt)}
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="mt-8 break-inside-avoid">
        <h2 className="text-lg font-semibold text-slate-900">{copy.export.sections.audit}</h2>
        <p className="mt-2 text-sm text-slate-700">
          {auditVerification.valid ? copy.audit.valid : copy.audit.invalid} ·{" "}
          {copy.audit.entries(auditVerification.totalEntries)}
        </p>
      </section>

      <footer className="mt-10 border-t border-slate-200 pt-6 text-xs leading-relaxed text-slate-500">
        {copy.legal.disclaimer.short}
      </footer>
    </div>
  );
}
