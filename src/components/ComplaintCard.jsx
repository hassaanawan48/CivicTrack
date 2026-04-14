function ComplaintCard({ complaint }) {
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

  return (
    <div className="card">
      <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
        <span className={`status-flair ${getStatusClass(complaint.status)}`}>
          {formatStatus(complaint.status)}
        </span>
        <h3 className="card-title" style={{ margin: 0 }}>{complaint.title}</h3>
      </div>

      <p className="card-text">{complaint.description}</p>

      {complaint.image_url && (
        <img
          className="card-image"
          src={complaint.image_url}
          alt="complaint evidence"
        />
      )}

      {/* If authority response exists (for resolved/rejected) */}
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