import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getAllComplaints } from "../../services/authorityService";
import { useNavigate } from "react-router-dom";

function AuthorityDashboard() {
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();
  const { filterStatus } = useOutletContext();

  useEffect(() => {
    const fetch = async () => {
      const data = await getAllComplaints();
      setComplaints(data);
    };
    fetch();
  }, []);

  const filteredComplaints = complaints.filter(
    (c) => c.status === filterStatus
  );

  return (
    <div>
      <div className="dashboard-header">
        <h1>Authority Dashboard</h1>
        <div className="badge">
          {filteredComplaints.length} complaints
        </div>
      </div>

      {filteredComplaints.length === 0 ? (
        <div className="empty-state">
          No complaints with status "{filterStatus.replace('_', ' ')}"
        </div>
      ) : (
        filteredComplaints.map((c) => (
          <div className="card" key={c.id}>
            <h3 className="card-title">{c.title}</h3>
            <p className="card-status">Status: {c.status}</p>
            <p className="card-text">{c.description?.substring(0, 120)}...</p>
            <button onClick={() => navigate(`/admin/review/${c.id}`)}>
              Review Complaint
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default AuthorityDashboard;