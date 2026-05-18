import EvaluationReport from "./EvaluationReport";
import SubjectEditor from "./SubjectEditor";
import ConfirmModal from "../common/ConfirmModal";

export default function DetailModal({
  request, evaluation, evaluating, editingSubjects, subjectData, selectedSubjectToAdd,
  setSelectedSubjectToAdd, onAddSubject, onUpdateSubject, onDeleteSubject,
  onToggleEdit, onEvaluate, onMarkIrregular, onReject, onClose, confirmAction, setConfirmAction,
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-zinc-800">
            {request.status === "PENDING" ? "Student Grades Overview" : "Evaluation Report"}
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-red-500">✕</button>
        </div>

        {evaluation && <EvaluationReport evaluation={evaluation} />}
        {!evaluation && request.status === "PENDING" && (
          <div className="text-center text-zinc-400 py-10 text-sm">Loading student grades...</div>
        )}

        {/* Edit Subjects */}
        <div className="mt-4 pt-4 border-t">
          <button onClick={onToggleEdit}
            className="w-full py-2 rounded-lg text-sm font-medium bg-zinc-100 text-zinc-700 hover:bg-zinc-200 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            {editingSubjects ? "Close Subject Editor" : "Edit Student Subjects"}
          </button>
        </div>

        {editingSubjects && (
          <SubjectEditor
            subjectData={subjectData}
            selectedSubjectToAdd={selectedSubjectToAdd}
            setSelectedSubjectToAdd={setSelectedSubjectToAdd}
            onAdd={() => onAddSubject(request.student_id)}
            onUpdate={(recordId, updates) => onUpdateSubject(request.student_id, recordId, updates)}
            onDelete={(recordId) => onDeleteSubject(request.student_id, recordId)}
          />
        )}

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t flex gap-2">
          {request.status === "PENDING" ? (
            <>
              <button onClick={() => setConfirmAction({ id: request.id, action: "approve" })}
                disabled={evaluating}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:opacity-50">
                {evaluating ? "Processing..." : "Save Evaluation & Approve"}
              </button>
              {evaluation?.is_irregular_candidate && (
                <button onClick={() => setConfirmAction({ id: request.id, action: "irregular" })}
                  disabled={evaluating}
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-purple-700 disabled:opacity-50">
                  {evaluating ? "Processing..." : "Mark as Irregular"}
                </button>
              )}
              <button onClick={() => setConfirmAction({ id: request.id, action: "reject" })}
                disabled={evaluating}
                className="flex-1 bg-rose-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-rose-700 disabled:opacity-50">
                {evaluating ? "Processing..." : "Reject"}
              </button>
              <button onClick={onClose} className="px-4 py-2 text-sm text-zinc-500 hover:text-zinc-700">Close</button>
            </>
          ) : (
            <button onClick={onClose} className="w-full py-2 rounded-lg text-sm font-medium bg-zinc-100 text-zinc-700 hover:bg-zinc-200">Close</button>
          )}
        </div>
      </div>

      {confirmAction && (
        <ConfirmModal
          title="Confirm Action"
          message={`Are you sure you want to ${confirmAction.action === "approve" ? "approve" : confirmAction.action === "irregular" ? "mark as irregular" : "reject"} this evaluation?`}
          extra={confirmAction.action === "approve" ? "The student will be sent to admin for enrollment confirmation." : confirmAction.action === "irregular" ? "The student will be sent to admin as an Irregular enrollment." : ""}
          confirmLabel="Yes"
          confirmColor={confirmAction.action === "approve" ? "bg-indigo-600 hover:bg-indigo-700" : confirmAction.action === "irregular" ? "bg-purple-600 hover:bg-purple-700" : "bg-rose-600 hover:bg-rose-700"}
          onConfirm={async () => {
            try {
              const a = confirmAction.action;
              const id = confirmAction.id;
              setConfirmAction(null);
              if (a === "approve") { await onEvaluate(id); onClose(); }
              else if (a === "irregular") { await onMarkIrregular(id); onClose(); }
              else if (a === "reject") onReject(id);
            } catch (err) {
              alert(err.message || "An error occurred");
            }
          }}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </div>
  );
}
