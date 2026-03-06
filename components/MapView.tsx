"use client";

import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef } from "react";

import type { Day } from "@/types/itinerary";

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
      const center = firstSlot ? firstSlot.location : { lat: 35.6812, lng: 139.7671 };

      const map = new window.google.maps.Map(mapRef.current as HTMLElement, {
        center,
        zoom: 12,
      });

      const path: google.maps.LatLngLiteral[] = [];

      days.forEach((day) => {
        day.slots.forEach((slot) => {
          const position = slot.location;
          path.push(position);

          new window.google.maps.Marker({
            position,
            map,
            title: slot.title,
          });
        });
      });

      if (path.length > 1) {
        new window.google.maps.Polyline({
          path,
          map,
          strokeColor: "#1d4ed8",
          strokeOpacity: 0.8,
          strokeWeight: 3,
        });
      }
    });
  }, [days]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;}
