import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getAllComplaintsAdmin } from "../../services/adminService";

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const { filterStatus } = useOutletContext();

  useEffect(() => {
    const fetch = async () => {
      const data = await getAllComplaintsAdmin();
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
        <h1>Admin Dashboard</h1>
        <div className="badge">{filteredComplaints.length} complaints</div>
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
            <p className="card-text">User: {c.user_id}</p>
            <p>{c.description?.substring(0, 100)}...</p>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminDashboard;