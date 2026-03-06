"use client";

import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef } from "react";
import type { Day } from "@/types/itinerary";
import styles from "./MapView.module.css";

export default function MapView({ days }: { days: Day[] }) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      mapRef.current.innerHTML = "Google Maps API 키가 설정되지 않았습니다.";
      return;
    }

    const loader = new Loader({
      apiKey,
      version: "weekly",
    });

    loader.load().then(() => {
      const firstSlot = days[0]?.slots[0];
      const center = firstSlot
        ? firstSlot.location
        : { lat: 35.6812, lng: 139.7671 };

// @ts-expect-error - Google Maps loaded dynamically
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const map = new (window as any).google.maps.Map(    mapRef.current as HTMLElement,        {
          center,
          zoom: 12,
          mapTypeControl: true,
          fullscreenControl: true,
          streetViewControl: true,
        }
      );

      const path: google.maps.LatLngLiteral[] = [];
      const infoWindows: google.maps.InfoWindow[] = [];

      days.forEach((day) => {
        day.slots.forEach((slot) => {
          const position = slot.location;
          path.push(position);

          const marker = new window.google.maps.Marker({
            position,
            map,
            title: slot.title,
            animation: window.google.maps.Animation.DROP,
          });

          const infoWindow = new window.google.maps.InfoWindow({
            content: `<div class="${styles.markerInfo}"><h3>${slot.title}</h3><p>${slot.description}</p><p class="${styles.timeInfo}">${slot.timeOfDay}</p></div>`,
          });

          marker.addListener("click", () => {
            infoWindows.forEach((iw) => iw.close());
            infoWindow.open(map, marker);
          });

          infoWindows.push(infoWindow);
        });
      });

      if (path.length > 1) {
        new window.google.maps.Polyline({
          path,
          map,
          strokeColor: "#6366f1",
          strokeOpacity: 0.8,
          strokeWeight: 3,
          geodesic: true,
        });
      }
    });
  }, [days]);

  return (
    <div className={styles.container}>
      <div ref={mapRef} className={styles.mapContainer} />
    </div>
  );
}
