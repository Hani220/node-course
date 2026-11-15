/* global document, mapboxgl */

const mapElement = document.getElementById("map");

if (mapElement) {
  const locations = JSON.parse(mapElement.dataset.locations);
  const accessToken = mapElement.dataset.mapboxToken;

  if (!accessToken || accessToken === "your_mapbox_public_token") {
    throw new Error("MAPBOX_ACCESS_TOKEN is missing or invalid.");
  }

  mapboxgl.accessToken = accessToken;

  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    scrollZoom: false,
  });

  map.addControl(new mapboxgl.NavigationControl(), "top-right");

  locations.forEach((location) => {
    const marker = document.createElement("div");
    marker.className = "marker";

    const mapMarker = new mapboxgl.Marker({
      element: marker,
      anchor: "bottom",
    })
      .setLngLat(location.coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 30 }).setHTML(
          `<p class="mapbox-popup">Day ${location.day}: ${location.description}</p>`,
        ),
      );

    mapMarker.addTo(map);
    mapMarker.togglePopup();
  });

  const bounds = new mapboxgl.LngLatBounds();
  locations.forEach((location) => bounds.extend(location.coordinates));
  map.fitBounds(bounds, {
    padding: { top: 100, bottom: 100, left: 100, right: 100 },
    maxZoom: 12,
  });
}
