"use client";

import type { Day } from "@/types/itinerary";

function getBounds(days: Day[]) {
  const points = days.flatMap((day) => day.slots.map((slot) => slot.location));

  if (points.length === 0) {
    return { left: 139.67, right: 139.84, top: 35.75, bottom: 35.61 };
  }

  const lats = points.map((point) => point.lat);
  const lngs = points.map((point) => point.lng);

  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const latPadding = Math.max((maxLat - minLat) * 0.4, 0.02);
  const lngPadding = Math.max((maxLng - minLng) * 0.4, 0.02);

  return {
    left: minLng - lngPadding,
    right: maxLng + lngPadding,
    top: maxLat + latPadding,
    bottom: minLat - latPadding,
  };
}

export default function MapView({ days }: { days: Day[] }) {
  const firstDaySlots = days[0]?.slots ?? [];
  const bounds = getBounds(days);

  const bbox = `${bounds.left},${bounds.bottom},${bounds.right},${bounds.top}`;
  const embedSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
    bbox,
  )}&layer=mapnik`;
  const mapLink = `https://www.openstreetmap.org/?bbox=${encodeURIComponent(
    bbox,
  )}&mlat=${firstDaySlots[0]?.location.lat ?? 35.6812}&mlon=${firstDaySlots[0]?.location.lng ?? 139.7671}#map=12/${
    firstDaySlots[0]?.location.lat ?? 35.6812
  }/${firstDaySlots[0]?.location.lng ?? 139.7671}`;

  return (
    <div className="map-shell">
      <iframe
        title="OpenStreetMap"
        src={embedSrc}
        className="osm-frame"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />

      <div className="map-route-list">
        {firstDaySlots.map((slot, index) => (
          <a
            key={slot.title}
            href={`https://www.openstreetmap.org/?mlat=${slot.location.lat}&mlon=${slot.location.lng}#map=15/${slot.location.lat}/${slot.location.lng}`}
            target="_blank"
            rel="noreferrer"
            className={index === 0 ? "active" : ""}
          >
            {index + 1}. {slot.title}
          </a>
        ))}
      </div>

      <a href={mapLink} target="_blank" rel="noreferrer" className="osm-credit">
        OpenStreetMap에서 크게 보기 ↗
      </a>
    </div>
  );
}
