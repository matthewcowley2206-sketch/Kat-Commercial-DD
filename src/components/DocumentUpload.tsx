"use client";

import { useState, useRef, useId } from "react";
import { Upload, FileText, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

const DOC_TYPES = [
  { value: "financial_statement", label: "Financial statements" },
  { value: "lease_agreement", label: "Lease agreements" },
  { value: "property_valuation", label: "Property valuation" },
  { value: "environmental", label: "Environmental reports" },
  { value: "legal_compliance", label: "Legal and compliance" },
] as const;

export function DocumentUpload({
  projectId,
  missingTypes,
  onUpload,
  id,
}: {
  projectId: string;
  missingTypes: string[];
  onUpload: () => void;
  id?: string;
}) {
  const sectionId = id ?? "document-upload";
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<string>(
    missingTypes[0] ?? DOC_TYPES[0].value
  );
  const [uploading, setUploading] = useState(false);
  const [lastUpload, setLastUpload] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const typeId = useId();
  const dropzoneId = useId();

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("projectId", projectId);
      formData.append("type", selectedType);

      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Upload failed");
      }

      setLastUpload(file.name);
      toast(copy.upload.success(file.name), "success");
      onUpload();
    } catch (error) {
      toast(
        error instanceof Error ? error.message : copy.upload.error,
        "error"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <section id={sectionId} aria-labelledby={`${sectionId}-title`}>
      <h3 id={`${sectionId}-title`} className="mb-1 text-base font-semibold text-slate-900">
        {copy.upload.title}
      </h3>
      <p className="mb-4 text-sm text-slate-500">{copy.journey.hints.upload}</p>

      <div className="mb-4">
        <label htmlFor={typeId} className="mb-1.5 block text-sm font-medium text-slate-800">
          {copy.upload.typeLabel}
        </label>
        <select
          id={typeId}
          className="input"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          {DOC_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
              {missingTypes.includes(t.value) ? " — required" : ""}
            </option>
          ))}
        </select>
      </div>

      <div
        id={dropzoneId}
        role="button"
        tabIndex={0}
        aria-label={`${copy.upload.dropzone}. ${copy.upload.formats}`}
        aria-describedby={`${dropzoneId}-hint`}
        aria-busy={uploading}
        data-dragging={dragging}
        className={cn("dropzone", uploading && "pointer-events-none opacity-60")}
        onClick={() => fileRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) handleUpload(file);
        }}
      >
        <Upload className="mb-3 h-8 w-8 text-slate-400" aria-hidden />
        <p className="text-sm font-medium text-slate-800">{copy.upload.dropzone}</p>
        <p id={`${dropzoneId}-hint`} className="mt-1 text-xs text-slate-500">
          {copy.upload.formats}
        </p>
        <input
          ref={fileRef}
          type="file"
          className="sr-only"
          accept=".pdf,.xlsx,.xls,.csv,.doc,.docx"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
            e.target.value = "";
          }}
        />
      </div>

      {uploading && (
        <p className="mt-3 text-center text-sm font-medium text-brand-600" role="status">
          {copy.upload.uploading}
        </p>
      )}

      {lastUpload && !uploading && (
        <div className="mt-3 flex items-center gap-2 text-sm text-green-800" role="status">
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
          {copy.upload.success(lastUpload)}
        </div>
      )}

      {missingTypes.length > 0 && (
        <div className="mt-4 rounded-2xl bg-amber-50 p-4" role="status">
          <p className="text-sm font-medium text-amber-900">{copy.upload.missing}</p>
          <ul className="mt-2 space-y-1.5" role="list">
            {missingTypes.map((t) => (
              <li key={t} className="flex items-center gap-2 text-sm text-amber-800">
                <FileText className="h-4 w-4 shrink-0" aria-hidden />
                {DOC_TYPES.find((d) => d.value === t)?.label ?? t}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
