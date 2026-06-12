"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { copy } from "@/lib/copy";

interface DeleteProjectModalProps {
  project: { id: string; name: string };
  onClose: () => void;
  onDeleted: (projectId: string) => void;
}

export function DeleteProjectModal({
  project,
  onClose,
  onDeleted,
}: DeleteProjectModalProps) {
  const { toast } = useToast();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dialogRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, loading]);

  const handleDelete = async () => {
    setLoading(true);

    try {
      const res = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
      let data: { error?: string } = {};
      try {
        data = await res.json();
      } catch {
        throw new Error(copy.home.delete.error);
      }

      if (!res.ok) {
        throw new Error(data.error ?? copy.home.delete.error);
      }

      toast(copy.home.delete.success(project.name), "success");
      onDeleted(project.id);
      onClose();
    } catch (error) {
      toast(
        error instanceof Error ? error.message : copy.home.delete.error,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="presentation"
      onClick={(e) => {
        if (!loading && e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-project-title"
        aria-describedby="delete-project-desc"
        tabIndex={-1}
        className="max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:max-w-md sm:rounded-3xl"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id="delete-project-title" className="text-xl font-bold text-slate-900">
              {copy.home.delete.title}
            </h2>
            <p id="delete-project-desc" className="mt-2 text-sm leading-relaxed text-slate-600">
              {copy.home.delete.body(project.name)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="btn-ghost !min-h-[44px] !min-w-[44px] !p-2"
            aria-label={copy.a11y.closeDialog}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="btn-secondary w-full sm:w-auto"
            onClick={onClose}
            disabled={loading}
          >
            {copy.home.delete.cancel}
          </button>
          <button
            type="button"
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-red-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? copy.home.delete.deleting : copy.home.delete.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}
