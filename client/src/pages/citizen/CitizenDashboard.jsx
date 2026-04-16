import { useAuth } from "../../context/AuthContext";
import { useRealtimeComplaints } from "../../hooks/useRealtimeComplaints";
import ComplaintCard from "../../components/ComplaintCard";

function CitizenDashboard() {
  const { user } = useAuth();
  const { complaints } = useRealtimeComplaints(user?.id);

  const submittedComplaints = complaints.filter(c => c.status === "submitted");
  const inReviewComplaints = complaints.filter(c => c.status === "in_review");
  const resolvedComplaints = complaints.filter(c => c.status === "resolved");
  const rejectedComplaints = complaints.filter(c => c.status === "rejected");

  const renderSection = (title, list) => {
    if (list.length === 0) return null;
    return (
      <div className="complaints-section">
        <h2 className="section-title">
          {title}
          <span className="section-count">{list.length}</span>
        </h2>
        {list.map(c => <ComplaintCard key={c.id} complaint={c} />)}
      </div>
    );
  };

  return (
    <div>
      <div className="dashboard-header">
        <h1>My Complaints</h1>
        <div className="badge">{complaints.length} total</div>
      </div>

      {complaints.length === 0 ? (
        <div className="empty-state">
          You haven't submitted any complaints yet.
        </div>
      ) : (
        <>
          {renderSection("Submitted", submittedComplaints)}
          {renderSection("In Review", inReviewComplaints)}
          {renderSection("Resolved", resolvedComplaints)}
          {renderSection("Rejected", rejectedComplaints)}
        </>
      )}
    </div>
  );
}

export default CitizenDashboard;