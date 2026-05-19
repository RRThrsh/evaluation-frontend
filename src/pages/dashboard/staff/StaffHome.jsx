import { useEffect, useState } from "react";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { sanitizeInput } from "../../../utils/sanitize";
import StaffHeader from "../../../components/staff/StaffHeader";
import SubmitForm from "../../../components/staff/SubmitForm";
import SubmissionsList from "../../../components/staff/SubmissionsList";
import DetailModal from "../../../components/staff/DetailModal";
import ConfirmModal from "../../../components/common/ConfirmModal";

export default function StaffHome() {
  const { user } = useAuth();
  const [studentNumber, setStudentNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingEvals, setLoadingEvals] = useState(true);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [selectedEval, setSelectedEval] = useState(null);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [sendingPdf, setSendingPdf] = useState(false);
  const [sendSuccess, setSendSuccess] = useState("");

  const fetchEvaluations = () => {
    api.get("/api/staff/evaluations")
      .then((data) => setEvaluations(data.data ?? []))
      .catch(() => {})
      .finally(() => setLoadingEvals(false));
  };

  useEffect(() => { fetchEvaluations(); }, []);

  const handleSubmitClick = (e) => {
    e.preventDefault();
    if (!studentNumber.trim()) return;
    setConfirmSubmit(true);
  };

  const handleSendPdf = async (studentNumberToSend, closeAfter) => {
    setSendingPdf(true);
    setSendSuccess("");
    setError("");
    try {
      await api.post("/api/staff/evaluate/send-pdf", { student_number: sanitizeInput(studentNumberToSend) });
      setSendSuccess("PDF sent to student email");
      if (closeAfter) closeAfter();
    } catch (err) {
      setError(err.message);
    } finally {
      setSendingPdf(false);
    }
  };

  const handleConfirmSubmit = async () => {
    setConfirmSubmit(false);
    setSubmitting(true);
    setError("");
    setResult(null);
    try {
      const data = await api.post("/api/staff/evaluate", { student_number: sanitizeInput(studentNumber) });
      setResult(data.data);
      const evals = await api.get("/api/staff/evaluations");
      setEvaluations(evals.data ?? []);
      setStudentNumber("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <StaffHeader />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SubmitForm
            studentNumber={studentNumber}
            setStudentNumber={setStudentNumber}
            submitting={submitting}
            error={error}
            result={result}
            sendSuccess={sendSuccess}
            onSubmit={handleSubmitClick}
          />

          <SubmissionsList evaluations={evaluations} onSelect={(ev) => {
            if (!ev.staff_viewed_at) {
              api.patch(`/api/staff/evaluations/${ev.id}/viewed`).catch(() => {});
              setEvaluations(prev => prev.map(e => e.id === ev.id ? { ...e, staff_viewed_at: new Date().toISOString() } : e));
            }
            setSelectedEval(ev);
          }} />
        </div>
      </div>

      {selectedEval && (
        <DetailModal
          evalData={selectedEval}
          onClose={() => setSelectedEval(null)}
          onSendPdf={() => handleSendPdf(selectedEval.student_number, () => setSelectedEval(null))}
          sendingPdf={sendingPdf}
        />
      )}

      {confirmSubmit && (
        <ConfirmModal
          title="Confirm Submission"
          message={<>Are you sure you want to submit an evaluation request for <strong>{studentNumber}</strong>?</>}
          confirmLabel="Yes"
          onConfirm={handleConfirmSubmit}
          onCancel={() => setConfirmSubmit(false)}
        />
      )}
    </div>
  );
}
