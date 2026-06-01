import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  GripVertical,
} from "lucide-react";
import api from "../../services/api";
import ConfirmModal from "../common/ConfirmModal";

const EMPTY = { question: "", answer: "", sort_order: 0 };

export default function GuideManager() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const fetchGuides = async () => {
    try {
      const { data } = await api.get("/api/admin/guides");
      setGuides(data ?? []);
    } catch {
      setToast({ message: "Failed to load guides", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGuides(); }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const startCreate = () => {
    setEditing("new");
    setForm({ ...EMPTY, sort_order: guides.length + 1 });
  };

  const startEdit = (g) => {
    setEditing(g.id);
    setForm({ question: g.question, answer: g.answer, sort_order: g.sort_order });
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({ ...EMPTY });
  };

  const handleSave = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      showToast("Question and answer are required", "error");
      return;
    }
    setSaving(true);
    try {
      if (editing === "new") {
        const { data: created } = await api.post("/api/admin/guides", form);
        setGuides((prev) => [...prev, created].sort((a, b) => a.sort_order - b.sort_order));
        showToast("Guide created");
      } else {
        const { data: updated } = await api.put(`/api/admin/guides/${editing}`, form);
        setGuides((prev) => prev.map((g) => (g.id === editing ? updated : g)));
        showToast("Guide updated");
      }
      cancelEdit();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to save guide", "error");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (g) => {
    setConfirmAction({
      title: "Delete Guide",
      message: `Delete "${g.question}"?`,
      confirmLabel: "Delete",
      confirmVariant: "danger",
      onConfirm: async () => {
        try {
          await api.delete(`/api/admin/guides/${g.id}`);
          setGuides((prev) => prev.filter((x) => x.id !== g.id));
          showToast("Guide deleted");
        } catch (err) {
          showToast(err.response?.data?.message || "Failed to delete guide", "error");
        }
        setConfirmAction(null);
      },
      onCancel: () => setConfirmAction(null),
    });
  };

  const toggleActive = async (g) => {
    try {
      const { data: updated } = await api.put(`/api/admin/guides/${g.id}`, {
        is_active: !g.is_active,
      });
      setGuides((prev) => prev.map((x) => (x.id === g.id ? updated : x)));
      showToast(updated.is_active ? "Guide activated" : "Guide deactivated");
    } catch {
      showToast("Failed to update guide", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text">Guide Management</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Create and manage guide entries displayed to all users.
          </p>
        </div>
        <button
          onClick={startCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition"
        >
          <Plus size={16} />
          Add Guide
        </button>
      </div>

      {/* Create/Edit Form */}
      {editing && (
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-text">
            {editing === "new" ? "New Guide" : "Edit Guide"}
          </h3>
          <div className="grid gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-text-secondary">Question</label>
              <input
                value={form.question}
                onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))}
                className="input-field w-full"
                placeholder="e.g. How does evaluation work?"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text-secondary">Answer</label>
              <textarea
                value={form.answer}
                onChange={(e) => setForm((p) => ({ ...p, answer: e.target.value }))}
                className="input-field w-full min-h-[100px] resize-y"
                placeholder="Detailed answer..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-text-secondary">Sort Order</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm((p) => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))}
                  className="input-field w-24"
                  min="0"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl bg-primary-600 px-5 py-2 text-sm font-medium text-white hover:bg-primary-700 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={cancelEdit}
              className="rounded-xl border border-border bg-surface px-5 py-2 text-sm font-medium text-text-secondary hover:bg-surface-muted transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Guide List */}
      <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        {guides.length === 0 && (
          <div className="py-12 text-center text-text-secondary text-sm">
            No guides yet. Click "Add Guide" to create one.
          </div>
        )}
        {guides.map((g) => {
          const isEditing = editing === g.id;
          return (
            <div key={g.id} className="group">
              <div className="flex items-start justify-between gap-4 px-6 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-muted text-xs font-bold text-text-secondary shrink-0">
                      {g.sort_order}
                    </span>
                    <h4 className={`text-sm font-semibold text-text ${!g.is_active ? "line-through opacity-50" : ""}`}>
                      {g.question}
                    </h4>
                    {!g.is_active && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-600 dark:bg-red-900/30 dark:text-red-400">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className={`mt-1.5 text-sm leading-6 text-text-secondary line-clamp-2 ${!g.is_active ? "opacity-50" : ""}`}>
                    {g.answer}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => startEdit(g)}
                    className="rounded-lg p-2 text-text-secondary hover:bg-surface-muted hover:text-text"
                    title="Edit"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => toggleActive(g)}
                    className={`rounded-lg p-2 transition ${
                      g.is_active
                        ? "text-text-secondary hover:bg-surface-muted"
                        : "text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                    }`}
                    title={g.is_active ? "Deactivate" : "Activate"}
                  >
                    {g.is_active ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
                  </button>
                  <button
                    onClick={() => confirmDelete(g)}
                    className="rounded-lg p-2 text-text-secondary hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed right-5 bottom-5 z-50">
          <div className={`flex items-center gap-3 rounded-2xl border bg-surface px-4 py-3 shadow-xl ${
            toast.type === "success" ? "border-emerald-200 text-emerald-700" : "border-red-200 text-red-700"
          }`}>
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmAction && <ConfirmModal {...confirmAction} />}
    </div>
  );
}
