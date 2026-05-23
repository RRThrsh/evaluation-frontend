import { useState } from "react";
import api from "../../services/api";
import { usePermissions } from "../../context/PermissionContext";
import SvgIcon from "../common/SvgIcon";
import SkeletonRows from "./SkeletonRows";
import DeleteModal from "./DeleteModal";
import { sanitizeObject } from "../../utils/sanitize";

const SENSITIVE_TABLES = ["users"];

function formatCell(value) {
  if (value === null || value === undefined) return <span className="italic text-slate-300">null</span>;
  if (typeof value === "boolean") return <span className={`badge ${value ? "badge-green" : "badge-red"}`}>{value ? "true" : "false"}</span>;
  if (typeof value === "number") return <span className="font-semibold text-primary-600">{value}</span>;
  if (typeof value === "object") return <span className="text-slate-400">{JSON.stringify(value).slice(0, 60)}</span>;
  return <span className="text-slate-700">{String(value)}</span>;
}

export default function DatabaseViewer({ selectedTable, tableData, tableLoading, onLoadTable }) {
  const pkColumn = tableData?.pkColumn || "id";
  const { can } = usePermissions();
  const [deleting, setDeleting] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const showToast = (message, type = "success") => { setToast({ message, type }); setTimeout(() => setToast(null), 3000); };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await api.delete(`/api/admin/tables/${deleteTarget.tableName}/${deleteTarget.rowId}`); showToast("Record deleted successfully"); setDeleteTarget(null); onLoadTable(deleteTarget.tableName); }
    catch (err) { showToast(err.message, "error"); }
    finally { setDeleting(false); }
  };

  const handleEditSave = async () => {
    if (!editRow) return;
    setSaving(true);
    try { await api.put(`/api/admin/tables/${selectedTable}/${editRow[pkColumn]}`, sanitizeObject(editFormData)); showToast("Record updated successfully"); setEditRow(null); onLoadTable(selectedTable); }
    catch (err) { showToast(err.message, "error"); }
    finally { setSaving(false); }
  };

  if (!selectedTable) {
    return (
      <div className="card flex flex-col items-center justify-center py-24 text-center">
        <div className="rounded-3xl bg-slate-100 p-5"><SvgIcon path="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7" className="w-10 h-10 text-slate-400" /></div>
        <h3 className="mt-5 text-lg font-bold text-slate-700">No Table Selected</h3>
        <p className="mt-2 text-sm text-slate-400">Choose a table from the sidebar</p>
      </div>
    );
  }

  if (tableLoading) {
    return <div className="card p-6"><table className="w-full"><tbody><SkeletonRows columns={5} rows={8} /></tbody></table></div>;
  }

  if (!tableData) return null;

  return (
    <>
      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="badge badge-blue">{selectedTable}</div>
            <div className="badge badge-gray">{tableData.totalRows} rows</div>
            {SENSITIVE_TABLES.includes(selectedTable) && <div className="badge badge-amber">Protected</div>}
          </div>
        </div>
        <div className="overflow-auto max-h-[650px]">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50 backdrop-blur-xl">
              <tr>
                {tableData.columns.map((col) => (
                  <th key={col} className="whitespace-nowrap border-b border-slate-200 px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">{col}</th>
                ))}
                {can("database.manage") && <th className="border-b border-slate-200 px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Action</th>}
              </tr>
            </thead>
            <tbody>
              {tableData.rows.map((row, i) => (
                <tr key={row[pkColumn] ?? i} className="group border-b border-slate-100 transition hover:bg-slate-50">
                  {tableData.columns.map((col) => (
                    <td key={col} className="max-w-[240px] truncate whitespace-nowrap px-5 py-4 text-slate-700">{formatCell(row[col])}</td>
                  ))}
                  {can("database.manage") && (
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setEditRow(row); setEditFormData({ ...row }); }} className="btn btn-ghost btn-sm text-amber-500"><SvgIcon path="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteTarget({ tableName: selectedTable, rowId: row[pkColumn] })} className="btn btn-ghost btn-sm text-red-400"><SvgIcon path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} tableName={deleteTarget?.tableName} rowId={deleteTarget?.rowId} deleting={deleting} />

      {editRow && (
        <div className="modal-overlay items-start pt-10 pb-10 overflow-y-auto" onClick={() => setEditRow(null)}>
          <div className="modal-content max-w-2xl p-0" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-primary-50 p-2.5 text-primary-600"><SvgIcon path="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" className="w-4 h-4" /></div>
                <div><h3 className="text-sm font-bold text-slate-900">Edit Row</h3><p className="text-xs text-slate-400">{selectedTable}</p></div>
              </div>
              <button onClick={() => setEditRow(null)} className="btn btn-ghost btn-sm text-slate-400"><SvgIcon path="M6 18L18 6M6 6l12 12" className="w-4 h-4" /></button>
            </div>
            <div className="px-6 py-5 space-y-3 max-h-[65vh] overflow-y-auto">
              {tableData.columns.filter((col) => !(selectedTable === "users" && col === "password_hash")).map((col) => (
                <div key={col} className="flex items-start gap-4 rounded-2xl bg-slate-50 px-4 py-3">
                  <span className="w-40 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-500 pt-0.5">{col === "role" && selectedTable === "users" ? "Role (Admin only)" : col}</span>
                  {col === "id" || (selectedTable === "users" && col !== "role") ? (
                    <span className="text-sm text-slate-800 break-all">{formatCell(editRow[col])}</span>
                  ) : col === "role" && selectedTable === "users" ? (
                    <select value={editFormData[col] ?? ""} onChange={(e) => setEditFormData((prev) => ({ ...prev, [col]: e.target.value }))} className="input-field flex-1">
                      <option value="evaluator">evaluator</option>
                      <option value="admin">admin</option>
                    </select>
                  ) : (
                    <input type="text" value={editFormData[col] ?? ""} onChange={(e) => setEditFormData((prev) => ({ ...prev, [col]: e.target.value }))} className="input-field flex-1" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button onClick={() => setEditRow(null)} className="btn btn-secondary btn-md" disabled={saving}>Cancel</button>
              <button onClick={handleEditSave} disabled={saving} className="btn btn-primary btn-md">{saving ? "Saving..." : "Save Changes"}</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed top-5 right-5 z-50">
          <div className={`flex items-center gap-3 rounded-2xl border px-5 py-4 shadow-2xl backdrop-blur-xl ${toast.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>
            <SvgIcon path={toast.type === "success" ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} className="w-5 h-5" />
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}
    </>
  );
}
