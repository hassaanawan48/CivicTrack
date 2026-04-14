import { Link, useLocation, useNavigate } from "react-router-dom";
import { useRole } from "../context/RoleContext";

function Sidebar({ filterStatus, onFilterChange }) {
  const { role } = useRole();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleFilterClick = (status) => {
    if (onFilterChange) {
      onFilterChange(status);
    }
    // Optionally navigate to dashboard if not already there
    if (role === "authority" || role === "admin") {
      if (location.pathname !== "/admin") {
        navigate("/admin");
      }
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-title">CivicTrack</div>

      <div className="sidebar-section">
        
        <div className="sidebar-links">
          {role === "citizen" && (
            <>
              <Link
                className={isActive("/citizen") ? "active-link" : ""}
                to="/citizen"
              >
                My Complaints
              </Link>
              <Link
                className={isActive("/citizen/create") ? "active-link" : ""}
                to="/citizen/create"
              >
                Create Complaint
              </Link>
            </>
          )}

          {(role === "authority" || role === "admin") && (
            <>
              <Link
                className={isActive("/admin") ? "active-link" : ""}
                to="/admin"
              >
                All Complaints
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Filter sections only for authority/admin */}
      {(role === "authority" || role === "admin") && (
        <div className="sidebar-section">
          <div className="sidebar-section-header">Filter by Status</div>
          <div className="sidebar-links">
            <button
              className={`filter-link ${filterStatus === "submitted" ? "active-filter" : ""}`}
              onClick={() => handleFilterClick("submitted")}
            >
              New Complaints
            </button>
            <button
              className={`filter-link ${filterStatus === "in_review" ? "active-filter" : ""}`}
              onClick={() => handleFilterClick("in_review")}
            >
              In‑Review
            </button>
            <button
              className={`filter-link ${filterStatus === "resolved" ? "active-filter" : ""}`}
              onClick={() => handleFilterClick("resolved")}
            >
              Resolved
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;