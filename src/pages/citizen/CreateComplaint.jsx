import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { createComplaint } from "../../services/complaintService";
import { uploadComplaintImage } from "../../services/storageService";

function CreateComplaint() {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    try {
      if (e) e.preventDefault();
      if (loading) return;

      setLoading(true);
      setMsg("");
      setMsgType("");

      if (!file || !user?.id) {
        setMsg("Missing file or user");
        setMsgType("error");
        setLoading(false);
        return;
      }

      const imageUrl = await uploadComplaintImage(file, user.id);

      await createComplaint({
        user_id: user.id,
        title,
        description,
        image_url: imageUrl,
        location: "browser-location-todo",
        status: "submitted",
      });

      setMsg("Complaint submitted successfully");
      setMsgType("success");
      setTitle("");
      setDescription("");
      setFile(null);
    } catch (err) {
      setMsg("Submission failed");
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create New Complaint</h1>

      {msg && (
        <p
          style={{
            color: msgType === "success" ? "#2f855a" : "#e53e3e",
            fontWeight: "500",
            marginBottom: "16px",
          }}
        >
          {msg}
        </p>
      )}

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Description"
        rows="5"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          opacity: loading ? 0.7 : 1,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Submitting..." : "Submit Complaint"}
      </button>
    </div>
  );
}

export default CreateComplaint;