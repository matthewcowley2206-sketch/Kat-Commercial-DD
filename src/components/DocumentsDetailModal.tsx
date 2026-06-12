"use client";

import { useEffect, useRef } from "react";
import { X, ChevronRight, FileText, AlertCircle } from "lucide-react";
import { getDocumentTypeMeta } from "@/lib/regulations/engine";
import { copy } from "@/lib/copy";
import { formatDate, formatFileSize } from "@/lib/utils";
import type { DashboardData, DocumentType } from "@/types";

interface DocumentsDetailModalProps {
  documents: DashboardData["documents"];
  onClose: () => void;
  onAddDocuments: () => void;
}

export function DocumentsDetailModal({
  documents,
  onClose,
  onAddDocuments,
}: DocumentsDetailModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const detail = copy.dashboard.detail.documents;

  useEffect(() => {
    dialogRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const filesByType = documents.files.reduce(
    (acc, file) => {
      if (!acc[file.type]) acc[file.type] = [];
      acc[file.type].push(file);
      return acc;
    },
    {} as Record<DocumentType, typeof documents.files>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="documents-detail-title"
        aria-describedby="documents-detail-desc"
        tabIndex={-1}
        className="flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-w-lg sm:rounded-3xl"
      >
        <div className="shrink-0 border-b border-slate-100 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-brand-600">
                {copy.dashboard.sections.documents}
              </p>
              <h2 id="documents-detail-title" className="mt-1 text-xl font-bold text-slate-900">
                {detail.title}
              </h2>
              <p id="documents-detail-desc" className="mt-2 text-sm leading-relaxed text-slate-600">
                {detail.intro}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost !min-h-[44px] !min-w-[44px] !p-2"
              aria-label={copy.a11y.closeDialog}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-5">
            {documents.total > 0 ? (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-slate-900">
                  {detail.onFile}{" "}
                  <span className="font-normal text-slate-500">
                    ({detail.fileCount(documents.total)})
                  </span>
                </h3>
                <ul className="space-y-4" role="list">
                  {(Object.entries(filesByType) as [DocumentType, typeof documents.files][]).map(
                    ([type, files]) => {
                      const meta = getDocumentTypeMeta(type);
                      return (
                        <li key={type}>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            {meta.label}
                          </p>
                          <ul className="space-y-2" role="list">
                            {files.map((file) => (
                              <li
                                key={file.id}
                                className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2.5"
                              >
                                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden />
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-medium text-slate-800">
                                    {file.fileName}
                                  </p>
                                  <p className="mt-0.5 text-xs text-slate-500">
                                    {formatFileSize(file.fileSize)} · {detail.uploadedAt}{" "}
                                    {formatDate(file.uploadedAt)}
                                  </p>
                                </div>
                              </li>
                            ))}
                          </ul>
                          <p className="mt-1.5 text-xs text-slate-500">{meta.description}</p>
                        </li>
                      );
                    }
                  )}
                </ul>
              </div>
            ) : (
              <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                {detail.noFiles}
              </p>
            )}

            {documents.missing.length > 0 && (
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <AlertCircle className="h-4 w-4 text-amber-500" aria-hidden />
                  {detail.stillNeeded}{" "}
                  <span className="font-normal text-slate-500">
                    ({documents.missing.length})
                  </span>
                </h3>
                <ul className="space-y-2" role="list">
                  {documents.missing.map((type) => {
                    const meta = getDocumentTypeMeta(type);
                    return (
                      <li
                        key={type}
                        className="rounded-xl border border-amber-100 bg-amber-50/50 px-4 py-3"
                      >
                        <p className="text-sm font-medium text-amber-900">{meta.label}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-amber-800">
                          {meta.description}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            className="btn-primary w-full"
            onClick={() => {
              onClose();
              onAddDocuments();
            }}
          >
            {detail.viewUpload}
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
