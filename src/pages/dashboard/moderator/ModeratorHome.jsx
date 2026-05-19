import { useEffect, useState } from "react";
import api from "../../../services/api";
import ModeratorHeader from "../../../components/moderator/ModeratorHeader";
import RequestList from "../../../components/moderator/RequestList";
import DetailModal from "../../../components/moderator/DetailModal";

export default function ModeratorHome() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState("");
  const [editingSubjects, setEditingSubjects] = useState(false);
  const [subjectData, setSubjectData] = useState({ taken: [], available: [] });
  const [selectedSubjectToAdd, setSelectedSubjectToAdd] = useState("");

  const fetchRequests = () => {
    api.get("/api/moderator/evaluations/all")
      .then((data) => setRequests(data.data ?? data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRequests(); }, []);

  const pending = requests.filter(r => r.status === "PENDING");
  const reviewed = requests.filter(r => r.status !== "PENDING");

  const fetchStudentSubjects = async (studentId) => {
    const data = await api.get(`/api/moderator/students/${studentId}/subjects`);
    setSubjectData(data.data ?? data);
  };

  const handleAddSubject = async (studentId) => {
    if (!selectedSubjectToAdd) return;
    await api.post(`/api/moderator/students/${studentId}/subjects`, { subject_id: selectedSubjectToAdd, status: "PENDING" });
    setSelectedSubjectToAdd("");
    await fetchStudentSubjects(studentId);
  };

  const handleUpdateSubject = async (studentId, subjectRecordId, updates) => {
    await api.patch(`/api/moderator/students/${studentId}/subjects/${subjectRecordId}`, updates);
    await fetchStudentSubjects(studentId);
  };

  const handleDeleteSubject = async (studentId, subjectRecordId) => {
    await api.delete(`/api/moderator/students/${studentId}/subjects/${subjectRecordId}`);
    await fetchStudentSubjects(studentId);
  };

  const toggleEditSubjects = async (studentId) => {
    if (!editingSubjects) await fetchStudentSubjects(studentId);
    setEditingSubjects(!editingSubjects);
  };

  const handleEvaluate = async (id) => {
    setEvaluating(true);
    const data = await api.post(`/api/moderator/evaluations/${id}/evaluate`);
    setEvaluation(data.data);
    setEvaluating(false);
  };

  const handleOverride = async (id, action) => {
    setEvaluating(true);
    try {
      await api.post(`/api/moderator/evaluations/${id}/override`, { action });
      setSelectedRequest(null);
      setEvaluation(null);
      fetchRequests();
    } catch (err) {
      alert(err.message);
    } finally {
      setEvaluating(false);
    }
  };

  const handleMarkIrregular = async (id) => {
    setEvaluating(true);
    try {
      await api.post(`/api/moderator/evaluations/${id}/irregular`);
      fetchRequests();
    } catch (err) {
      alert(err.message || "Failed to mark as irregular");
    } finally {
      setEvaluating(false);
    }
  };

  const openRequest = async (req) => {
    setSelectedRequest(req);
    setEvaluation(null);
    try {
      const data = await api.get(`/api/moderator/students/${req.student_id}/evaluate`);
      if (req.evaluation_result) data.data.decision = req.status;
      setEvaluation(data.data);
    } catch {
      if (req.evaluation_result) {
        setEvaluation(typeof req.evaluation_result === "string" ? JSON.parse(req.evaluation_result) : req.evaluation_result);
      }
    }
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setEvaluation(null);
    setEditingSubjects(false);
    fetchRequests();
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <ModeratorHeader pendingCount={pending.length} />

      <main className="max-w-6xl mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-800">Evaluation Requests</h1>
            <p className="text-sm text-zinc-500">Click a request to view evaluation result</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 font-medium">{error}</div>
        )}

        {loading ? (
          <div className="text-center text-zinc-400 py-10">Loading requests...</div>
        ) : (
          <RequestList pending={pending} reviewed={reviewed} onOpen={openRequest} />
        )}
      </main>

      {selectedRequest && (
        <DetailModal
          request={selectedRequest}
          evaluation={evaluation}
          evaluating={evaluating}
          editingSubjects={editingSubjects}
          subjectData={subjectData}
          selectedSubjectToAdd={selectedSubjectToAdd}
          setSelectedSubjectToAdd={setSelectedSubjectToAdd}
          onAddSubject={handleAddSubject}
          onUpdateSubject={handleUpdateSubject}
          onDeleteSubject={handleDeleteSubject}
          onToggleEdit={() => toggleEditSubjects(selectedRequest.student_id)}
          onEvaluate={handleEvaluate}
          onMarkIrregular={handleMarkIrregular}
          onReject={(id) => handleOverride(id, "REJECTED")}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
