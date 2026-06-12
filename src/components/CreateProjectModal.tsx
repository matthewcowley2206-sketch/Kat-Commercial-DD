"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { copy } from "@/lib/copy";

const STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];
const PROPERTY_TYPES = [
  { value: "office", label: "Office" },
  { value: "retail", label: "Retail" },
  { value: "industrial", label: "Industrial" },
  { value: "mixed_use", label: "Mixed use" },
  { value: "hospitality", label: "Hospitality" },
  { value: "healthcare", label: "Healthcare" },
  { value: "other", label: "Other" },
];

export function CreateProjectModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (projectId: string) => void;
}) {
  const { toast } = useToast();
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    propertyAddress: "",
    propertyType: "office",
    state: "NSW",
    purchasePrice: "",
  });

  useEffect(() => {
    firstInputRef.current?.focus();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          purchasePrice: form.purchasePrice
            ? parseFloat(form.purchasePrice)
            : undefined,
        }),
      });

      if (!res.ok) throw new Error("Failed to create project");
      const project = await res.json();
      toast(copy.create.success, "success");
      onCreated(project.id);
      onClose();
    } catch {
      toast(copy.create.error, "error");
    } finally {
      setLoading(false);
    }
  };

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
        aria-labelledby="create-project-title"
        aria-describedby="create-project-desc"
        className="max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:max-w-lg sm:rounded-3xl"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-brand-600">
              {copy.create.subtitle}
            </p>
            <h2 id="create-project-title" className="mt-1 text-xl font-bold text-slate-900">
              {copy.create.title}
            </h2>
            <p id="create-project-desc" className="mt-1 text-sm text-slate-500">
              {copy.journey.hints.setup}
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

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="project-name" className="mb-1.5 block text-sm font-medium text-slate-800">
              {copy.create.fields.name.label}
            </label>
            <input
              ref={firstInputRef}
              id="project-name"
              className="input"
              required
              autoComplete="off"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={copy.create.fields.name.placeholder}
              aria-describedby="project-name-hint"
            />
            <p id="project-name-hint" className="field-hint">
              {copy.create.fields.name.hint}
            </p>
          </div>

          <div>
            <label htmlFor="project-address" className="mb-1.5 block text-sm font-medium text-slate-800">
              {copy.create.fields.address.label}
            </label>
            <input
              id="project-address"
              className="input"
              required
              autoComplete="street-address"
              value={form.propertyAddress}
              onChange={(e) => setForm({ ...form, propertyAddress: e.target.value })}
              placeholder={copy.create.fields.address.placeholder}
              aria-describedby="project-address-hint"
            />
            <p id="project-address-hint" className="field-hint">
              {copy.create.fields.address.hint}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="property-type" className="mb-1.5 block text-sm font-medium text-slate-800">
                {copy.create.fields.type.label}
              </label>
              <select
                id="property-type"
                className="input"
                value={form.propertyType}
                onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
                aria-describedby="property-type-hint"
              >
                {PROPERTY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <p id="property-type-hint" className="field-hint">
                {copy.create.fields.type.hint}
              </p>
            </div>
            <div>
              <label htmlFor="property-state" className="mb-1.5 block text-sm font-medium text-slate-800">
                {copy.create.fields.state.label}
              </label>
              <select
                id="property-state"
                className="input"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                aria-describedby="property-state-hint"
              >
                {STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <p id="property-state-hint" className="field-hint">
                {copy.create.fields.state.hint}
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="purchase-price" className="mb-1.5 block text-sm font-medium text-slate-800">
              {copy.create.fields.price.label}
              <span className="ml-1 font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id="purchase-price"
              className="input"
              type="number"
              min="0"
              inputMode="numeric"
              value={form.purchasePrice}
              onChange={(e) => setForm({ ...form, purchasePrice: e.target.value })}
              placeholder={copy.create.fields.price.placeholder}
              aria-describedby="purchase-price-hint"
            />
            <p id="purchase-price-hint" className="field-hint">
              {copy.create.fields.price.hint}
            </p>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button type="button" className="btn-secondary w-full sm:w-auto" onClick={onClose}>
              {copy.create.cancel}
            </button>
            <button type="submit" className="btn-primary w-full sm:w-auto" disabled={loading} aria-busy={loading}>
              {loading ? copy.create.submitting : copy.create.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
