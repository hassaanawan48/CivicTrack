import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon issue in Leaflet with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Helper to set map view when coordinates change
function MapViewUpdater({ center }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

function MapPreview({ lat, lng, height = "200px", zoom = 15 }) {
  if (lat == null || lng == null) {
    return <div style={{ height, background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>No location data</div>;
  }

  const position = [lat, lng];

  return (
    <div style={{ height, width: "100%", borderRadius: "8px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
      <MapContainer
        center={position}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
        dragging={true}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} />
        <MapViewUpdater center={position} />
      </MapContainer>
    </div>
  );
}

export default MapPreview;