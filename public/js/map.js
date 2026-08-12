document.addEventListener("DOMContentLoaded", () => {
  const mapElement = document.getElementById("map");
  if (!mapElement) return;

  // Retrieve coordinates and listing details passed via data attributes
  const lat = parseFloat(mapElement.dataset.lat);
  const lng = parseFloat(mapElement.dataset.lng);
  const title = mapElement.dataset.title || "Listing Location";
  const location = mapElement.dataset.location || "";

  if (isNaN(lat) || isNaN(lng)) {
    console.warn("Map initialization skipped: Invalid coordinates.");
    return;
  }

  // Initialize Leaflet map centered at [latitude, longitude]
  const map = L.map("map", {
    center: [lat, lng],
    zoom: 12,
    scrollWheelZoom: false,
  });

  // OpenStreetMap Tile Layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Add marker
  const marker = L.marker([lat, lng]).addTo(map);

  // Bind Popup with listing info
  marker.bindPopup(`
    <div style="font-family: sans-serif; text-align: center; padding: 4px;">
      <h6 style="margin: 0 0 4px 0; font-weight: 600; color: #fe424d;">${title}</h6>
      <p style="margin: 0; font-size: 13px; color: #555;">Exact location provided after booking</p>
      <small style="color: #777;">${location}</small>
    </div>
  `).openPopup();
});
