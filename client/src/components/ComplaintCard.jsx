import { useState } from "react";
import MapPreview from "./MapPreview";

function ComplaintCard({ complaint, distance, showDistance = false }) {
  const [expanded, setExpanded] = useState(false);

  const getStatusClass = (status) => {
    switch (status) {
      case "submitted": return "status-submitted";
      case "in_review": return "status-in_review";
      case "resolved": return "status-resolved";
      case "rejected": return "status-rejected";
      default: return "";
    }
  };

  const formatStatus = (status) => {
    return status.replace("_", " ");
  };

  const handleCardClick = (e) => {
    // Prevent expansion when clicking on buttons or links inside
    if (e.target.tagName === "BUTTON" || e.target.tagName === "A") return;
    setExpanded(!expanded);
  };

  const openGoogleMaps = () => {
    if (complaint.lat && complaint.lng) {
      window.open(`https://www.google.com/maps?q=${complaint.lat},${complaint.lng}`, "_blank");
    }
  };

  return (
    <div className="card" style={{ cursor: "pointer" }} onClick={handleCardClick}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
        <span className={`status-flair ${getStatusClass(complaint.status)}`}>
          {formatStatus(complaint.status)}
        </span>
        <h3 className="card-title" style={{ margin: 0 }}>{complaint.title}</h3>
      </div>

      {showDistance && distance !== undefined && distance !== null && (
        <p style={{ fontSize: "13px", color: "#718096", marginBottom: "8px" }}>
          📍 {distance.toFixed(1)} km away
        </p>
      )}

      <p className="card-text">{complaint.description}</p>

      {complaint.image_url && (
        <img
          className="card-image"
          src={complaint.image_url}
          alt="complaint evidence"
        />
      )}

      {expanded && (
        <div style={{ marginTop: "16px" }} onClick={(e) => e.stopPropagation()}>
          {complaint.lat && complaint.lng ? (
            <>
              <MapPreview lat={complaint.lat} lng={complaint.lng} height="180px" />
              {complaint.locationName && (
                <p
                  style={{ marginTop: "8px", fontSize: "14px", color: "#2b6cb0", textDecoration: "underline", cursor: "pointer" }}
                  onClick={openGoogleMaps}
                >
                  📌 {complaint.locationName}
                </p>
              )}
              {!complaint.locationName && (
                <button
                  onClick={openGoogleMaps}
                  style={{ marginTop: "8px", fontSize: "13px", background: "none", color: "#1E2A38", border: "1px solid #e2e8f0", padding: "4px 8px" }}
                >
                  Open in Google Maps
                </button>
              )}
            </>
          ) : (
            <p style={{ fontSize: "13px", color: "#a0aec0" }}>No location data</p>
          )}
        </div>
      )}

      {complaint.authority_response_text && (
        <div style={{ marginTop: "12px", padding: "12px", background: "#f8fafc", borderRadius: "8px" }}>
          <strong>Authority response:</strong> {complaint.authority_response_text}
        </div>
      )}
      {complaint.authority_image_url && (
        <img
          className="card-image"
          src={complaint.authority_image_url}
          alt="authority resolution"
          style={{ marginTop: "8px" }}
        />
      )}
    </div>
  );
}

export default ComplaintCard;