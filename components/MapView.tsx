"use client";

import { useEffect, useRef } from "react";
import type { Day } from "@/types/itinerary";
import styles from "./MapView.module.css";
import "leaflet/dist/leaflet.css";

export default function MapView({ days }: { days: Day[] }) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Dynamically import Leaflet (client-side only)
    import("leaflet").then((L) => {
      const firstSlot = days[0]?.slots[0];
      const center: [number, number] = firstSlot
        ? [firstSlot.location.lat, firstSlot.location.lng]
        : [35.6812, 139.7671];

      // Create map
      const map = L.map(mapRef.current!).setView(center, 12);

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const markers: L.Marker[] = [];
      const pathCoords: [number, number][] = [];

      // Add markers for each slot
      days.forEach((day) => {
        day.slots.forEach((slot) => {
          const coords: [number, number] = [slot.location.lat, slot.location.lng];
          pathCoords.push(coords);

          const marker = L.marker(coords).addTo(map);
          marker.bindPopup(
            `<div class="${styles.markerInfo}"><h3>${slot.title}</h3><p>${slot.description}</p><p class="${styles.timeInfo}">${slot.timeOfDay}</p></div>`
          );
          markers.push(marker);
        });
      });

      // Draw path if there are multiple locations
      if (pathCoords.length > 1) {
        L.polyline(pathCoords, {
          color: "#6366f1",
          weight: 3,
          opacity: 0.8,
        }).addTo(map);
      }

      // Cleanup on unmount
      return () => {
        map.remove();
      };
    });
  }, [days]);

  return (
    <div className={styles.container}>
      <div ref={mapRef} className={styles.mapContainer} />
    </div>
  );
}
