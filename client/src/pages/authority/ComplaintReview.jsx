import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../api/supabaseClient";
import {
  updateComplaintStatus,
  resolveComplaint,
} from "../../services/authorityService";
import MapPreview from "../../components/MapPreview";

async function reverseGeocode(lat, lng) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );
    const data = await response.json();
    return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}

function ComplaintReview() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmation, setConfirmation] = useState({ type: "", message: "" });
  const [responseText, setResponseText] = useState("");
  const [responseImage, setResponseImage] = useState(null);
  const [locationName, setLocationName] = useState("");

  useEffect(() => {
    const fetchComplaint = async () => {
      const { data } = await supabase
        .from("complaints")
        .select("*")
        .eq("id", id)
        .single();
      setComplaint(data);
      if (data?.lat && data?.lng) {
        const name = await reverseGeocode(data.lat, data.lng);
        setLocationName(name);
      }
      setLoading(false);
    };
    fetchComplaint();
  }, [id]);

  const showConfirmation = (type, message) => {
    setConfirmation({ type, message });
    setTimeout(() => setConfirmation({ type: "", message: "" }), 5000);
  };

  const handleMarkInReview = async () => {
    setActionLoading(true);
    try {
      await updateComplaintStatus(id, "in_review", complaint.user_id);
      showConfirmation("success", "Complaint marked as In Review");
      const { data } = await supabase
        .from("complaints")
        .select("*")
        .eq("id", id)
        .single();
      setComplaint(data);
    } catch (error) {
      showConfirmation("error", "Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!responseText.trim()) {
      showConfirmation("error", "Resolution description is required");
      return;
    }
    if (!responseImage) {
      showConfirmation("error", "Resolution image is required");
      return;
    }
    setActionLoading(true);
    try {
      const filePath = `authority/${Date.now()}-${responseImage.name}`;
      await supabase.storage.from("complaint-media").upload(filePath, responseImage);
      const { data: urlData } = supabase.storage.from("complaint-media").getPublicUrl(filePath);
      const imageUrl = urlData.publicUrl;

      await resolveComplaint(id, {
        text: responseText,
        image_url: imageUrl,
        user_id: complaint.user_id,
      });
      showConfirmation("success", "Complaint resolved successfully");
      const { data } = await supabase.from("complaints").select("*").eq("id", id).single();
      setComplaint(data);
      setResponseText("");
      setResponseImage(null);
    } catch (error) {
      showConfirmation("error", "Failed to resolve complaint");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!responseText.trim()) {
      showConfirmation("error", "Rejection reason is required");
      return;
    }
    setActionLoading(true);
    try {
      await updateComplaintStatus(id, "rejected", complaint.user_id);
      await supabase.from("complaints").update({ authority_response_text: responseText }).eq("id", id);
      showConfirmation("success", "Complaint rejected");
      const { data } = await supabase.from("complaints").select("*").eq("id", id).single();
      setComplaint(data);
      setResponseText("");
    } catch (error) {
      showConfirmation("error", "Failed to reject complaint");
    } finally {
      setActionLoading(false);
    }
  };

  const openGoogleMaps = () => {
    if (complaint?.lat && complaint?.lng) {
      window.open(`https://www.google.com/maps?q=${complaint.lat},${complaint.lng}`, "_blank");
    }
  };

  if (loading) return <div className="page-content">Loading...</div>;
  if (!complaint) return <div className="page-content">Complaint not found</div>;

  const isSubmitted = complaint.status === "submitted";
  const isInReview = complaint.status === "in_review";
  const isResolved = complaint.status === "resolved";
  const isRejected = complaint.status === "rejected";

  return (
    <div className="page-content">
      <h1>Review Complaint</h1>

      {confirmation.message && (
        <div className={`confirmation-message confirmation-${confirmation.type}`}>
          {confirmation.message}
        </div>
      )}

      <div className="card">
        <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
          <span className={`status-flair status-${complaint.status}`}>
            {complaint.status.replace("_", " ")}
          </span>
          <h2 style={{ margin: 0 }}>{complaint.title}</h2>
        </div>

        <p className="card-text">{complaint.description}</p>

        {complaint.image_url && (
          <img
            className="card-image"
            src={complaint.image_url}
            alt="Complaint evidence"
            style={{ maxWidth: "300px" }}
          />
        )}

        {/* Location Map */}
        {complaint.lat && complaint.lng && (
          <div style={{ marginTop: "20px" }}>
            <h3>Complaint Location</h3>
            <MapPreview lat={complaint.lat} lng={complaint.lng} height="220px" />
            <p
              style={{ marginTop: "8px", fontSize: "14px", color: "#2b6cb0", textDecoration: "underline", cursor: "pointer" }}
              onClick={openGoogleMaps}
            >
              📌 {locationName}
            </p>
          </div>
        )}
      </div>

      {isSubmitted && (
        <div className="review-actions">
          <button onClick={handleMarkInReview} disabled={actionLoading} style={{ width: "auto" }}>
            {actionLoading ? "Processing..." : "Mark as In Review"}
          </button>
        </div>
      )}

      {isInReview && (
        <div className="review-actions">
          <h3>Take Action</h3>
          <div style={{ marginBottom: "16px" }}>
            <label className="required-field"><strong>Response Description</strong></label>
            <textarea rows="4" value={responseText} onChange={(e) => setResponseText(e.target.value)} placeholder="Explain the action taken..." required />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label className="required-field"><strong>Upload Resolution Image</strong></label>
            <input type="file" accept="image/*" onChange={(e) => setResponseImage(e.target.files[0])} />
            <p style={{ fontSize: "13px", color: "#718096", marginTop: "4px" }}>Required for resolution</p>
          </div>
          <div className="button-group">
            <button onClick={handleResolve} disabled={actionLoading} style={{ background: "#2ECC71" }}>
              {actionLoading ? "Processing..." : "Resolve Complaint"}
            </button>
            <button onClick={handleReject} disabled={actionLoading} style={{ background: "#E74C3C" }}>
              {actionLoading ? "Processing..." : "Reject Complaint"}
            </button>
          </div>
          <p style={{ fontSize: "13px", marginTop: "8px" }}><span className="required-field"></span> Required for resolution</p>
        </div>
      )}

      {(isResolved || isRejected) && (
        <div className="review-actions">
          <p>This complaint has been {complaint.status}. No further actions available.</p>
          {complaint.authority_response_text && <p><strong>Response:</strong> {complaint.authority_response_text}</p>}
          {complaint.authority_image_url && (
            <img src={complaint.authority_image_url} alt="Resolution" style={{ maxWidth: "300px", marginTop: "16px", borderRadius: "8px" }} />
          )}
        </div>
      )}
    </div>
  );
}

export default ComplaintReview;