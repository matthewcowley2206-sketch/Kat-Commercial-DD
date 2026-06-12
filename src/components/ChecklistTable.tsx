"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { copy } from "@/lib/copy";
import { getStatusBadgeClass, getStatusLabel } from "@/lib/utils";

interface ChecklistItem {
  id: string;
  regulationId: string;
  category: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  notes: string | null;
}

export function ChecklistTable({
  items,
  projectId,
  onUpdate,
}: {
  items: ChecklistItem[];
  projectId: string;
  onUpdate: () => void;
}) {
  const { toast } = useToast();
  const [updating, setUpdating] = useState<string | null>(null);
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>(() =>
    Object.fromEntries(items.map((i) => [i.id, i.notes ?? ""]))
  );

  useEffect(() => {
    setNoteDrafts(Object.fromEntries(items.map((i) => [i.id, i.notes ?? ""])));
  }, [items]);

  const patchItem = async (
    itemId: string,
    status: string,
    notes?: string
  ): Promise<boolean> => {
    setUpdating(itemId);
    try {
      const res = await fetch(`/api/checklist/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, status, notes }),
      });
      if (!res.ok) throw new Error("Update failed");
      await onUpdate();
      return true;
    } catch {
      toast(copy.checklist.updateError, "error");
      return false;
    } finally {
      setUpdating(null);
    }
  };

  const handleStatusChange = async (itemId: string, status: string) => {
    const notes = noteDrafts[itemId];
    await patchItem(itemId, status, notes);
  };

  const handleNotesSave = async (item: ChecklistItem) => {
    const notes = noteDrafts[item.id] ?? "";
    if (notes === (item.notes ?? "")) return;
    await patchItem(item.id, item.status, notes);
  };

  const grouped = items.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, ChecklistItem[]>
  );

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([category, categoryItems]) => (
        <section key={category} aria-labelledby={`cat-${category}`}>
          <h3
            id={`cat-${category}`}
            className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500"
          >
            {category}
          </h3>

          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 md:block">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-slate-700">
                    {copy.checklist.columns.item}
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-slate-700">
                    {copy.checklist.columns.priority}
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-slate-700">
                    {copy.checklist.columns.status}
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-slate-700">
                    {copy.checklist.columns.notes}
                  </th>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-slate-700">
                    {copy.checklist.columns.action}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categoryItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-4">
                      <p className="font-medium text-slate-900">{item.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500">
                        {item.description}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`badge ${
                          item.priority === "critical"
                            ? "bg-red-100 text-red-900"
                            : item.priority === "high"
                              ? "bg-orange-100 text-orange-900"
                              : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {item.priority}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={getStatusBadgeClass(item.status)}>
                        {getStatusLabel(item.status)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <textarea
                        className="input min-h-[72px] resize-y py-2 text-sm"
                        value={noteDrafts[item.id] ?? ""}
                        placeholder={copy.checklist.notesPlaceholder}
                        disabled={updating === item.id}
                        onChange={(e) =>
                          setNoteDrafts((prev) => ({ ...prev, [item.id]: e.target.value }))
                        }
                        onBlur={() => handleNotesSave(item)}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <label className="sr-only" htmlFor={`status-${item.id}`}>
                        {copy.checklist.columns.action} for {item.title}
                      </label>
                      <select
                        id={`status-${item.id}`}
                        className="input max-w-[160px] py-2 text-sm"
                        value={item.status}
                        disabled={updating === item.id}
                        aria-busy={updating === item.id}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      >
                        {Object.entries(copy.checklist.status).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="space-y-3 md:hidden" role="list">
            {categoryItems.map((item) => (
              <li key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className={getStatusBadgeClass(item.status)}>
                    {getStatusLabel(item.status)}
                  </span>
                  <span
                    className={`badge ${
                      item.priority === "critical"
                        ? "bg-red-100 text-red-900"
                        : item.priority === "high"
                          ? "bg-orange-100 text-orange-900"
                          : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>
                <p className="font-medium text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">
                  {item.description}
                </p>
                <label
                  htmlFor={`notes-mobile-${item.id}`}
                  className="mt-4 block text-xs font-medium text-slate-600"
                >
                  {copy.checklist.columns.notes}
                </label>
                <textarea
                  id={`notes-mobile-${item.id}`}
                  className="input mt-1 min-h-[72px] resize-y"
                  value={noteDrafts[item.id] ?? ""}
                  placeholder={copy.checklist.notesPlaceholder}
                  disabled={updating === item.id}
                  onChange={(e) =>
                    setNoteDrafts((prev) => ({ ...prev, [item.id]: e.target.value }))
                  }
                  onBlur={() => handleNotesSave(item)}
                />
                <label
                  htmlFor={`status-mobile-${item.id}`}
                  className="mt-4 block text-xs font-medium text-slate-600"
                >
                  {copy.checklist.columns.action}
                </label>
                <select
                  id={`status-mobile-${item.id}`}
                  className="input mt-1"
                  value={item.status}
                  disabled={updating === item.id}
                  onChange={(e) => handleStatusChange(item.id, e.target.value)}
                >
                  {Object.entries(copy.checklist.status).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
