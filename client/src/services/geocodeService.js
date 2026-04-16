// Reverse geocode using Nominatim (OpenStreetMap)
// Rate limits apply: 1 request per second. For production, consider a caching layer.
export const reverseGeocode = async (lat, lng) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
  const response = await fetch(url, {
    headers: {
      'Accept-Language': 'en', // prefer English results
    },
  });
  const data = await response.json();
  return data.display_name || 'Unknown location';
};