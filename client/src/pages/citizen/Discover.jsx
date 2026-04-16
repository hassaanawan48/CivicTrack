import { useEffect, useState } from "react";
import { getAllComplaints } from "../../services/complaintService";
import ComplaintCard from "../../components/ComplaintCard";

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function reverseGeocode(lat, lng) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );
    const data = await response.json();
    return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (error) {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}

function Discover() {
  const [complaints, setComplaints] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllComplaints();
        const withLocationNames = await Promise.all(
          data.map(async (c) => {
            if (c.lat && c.lng && !c.locationName) {
              const name = await reverseGeocode(c.lat, c.lng);
              return { ...c, locationName: name };
            }
            return c;
          })
        );
        setComplaints(withLocationNames);
      } catch (err) {
        console.error("Failed to fetch complaints", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported. Sorting by most recent.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        setLocationError("Location access denied. Sorting by most recent.");
        console.warn(err);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  const processedComplaints = () => {
    let filtered = [...complaints];
    if (filterStatus !== "all") {
      filtered = filtered.filter(c => c.status === filterStatus);
    }

    const withDistance = filtered.map(c => {
      let distance = null;
      if (userLocation && c.lat != null && c.lng != null) {
        distance = getDistance(userLocation.lat, userLocation.lng, c.lat, c.lng);
      }
      return { ...c, distance };
    });

    if (userLocation) {
      withDistance.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    } else {
      withDistance.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    return withDistance;
  };

  const displayedComplaints = processedComplaints();

  if (loading) return <div className="page-content">Loading complaints...</div>;

  return (
    <div className="page-content">
      <div className="dashboard-header">
        <h1>Discover Complaints</h1>
        <div className="badge">{displayedComplaints.length} found</div>
      </div>

      {locationError && (
        <p style={{ color: "#e67e22", marginBottom: "16px" }}>{locationError}</p>
      )}

      <div style={{ marginBottom: "24px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {["all", "submitted", "in_review", "resolved", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            style={{
              background: filterStatus === status ? "#1E2A38" : "#e2e8f0",
              color: filterStatus === status ? "white" : "#1E2A38",
            }}
          >
            {status === "all" ? "All" : status.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      {displayedComplaints.length === 0 ? (
        <div className="empty-state">No complaints match the filter.</div>
      ) : (
        displayedComplaints.map((c) => (
          <ComplaintCard key={c.id} complaint={c} distance={c.distance} showDistance={true} />
        ))
      )}
    </div>
  );
}

export default Discover;