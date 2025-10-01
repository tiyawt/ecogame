"use client";
import { useEffect, useRef, useState } from "react";

export default function MapLeaflet({
  mapId = "leaflet-map",
  center,
  accuracy,
  onPick,
  onReady,
  draggable = true,
  clickToMove = true,
}) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const LRef = useRef(null);
  const [ready, setReady] = useState(false);
  const userInteractedRef = useRef(false);
  const lastCenterRef = useRef(center);

  useEffect(() => {
    let destroyed = false;

    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      LRef.current = L;

      const el = document.getElementById(mapId);
      if (el && el._leaflet_id) el._leaflet_id = undefined;

      const pinIcon = L.divIcon({
        className: "",
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        html: `<svg width="30" height="30" viewBox="0 0 24 24" fill="none">
          <path d="M12 22s7-6.11 7-12a7 7 0 10-14 0c0 5.89 7 12 7 12z" fill="#ef4444"/>
          <circle cx="12" cy="10" r="2.8" fill="white"/>
        </svg>`,
      });

      const map = L.map(mapId, {
        center: [center.lat, center.lon],
        zoom: 15,
        zoomControl: true,
        dragging: true,
        scrollWheelZoom: true,
        touchZoom: true,
        doubleClickZoom: true,
        boxZoom: false,
        tap: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      const marker = L.marker([center.lat, center.lon], {
        draggable,
        icon: pinIcon,
      }).addTo(map);

      if (draggable) {
        marker.on("dragstart", () => {
          userInteractedRef.current = true;
        });
        marker.on("dragend", (e) => {
          const { lat, lng } = e.target.getLatLng();
          lastCenterRef.current = { lat, lon: lng };
          onPick?.(lat, lng, { cause: "drag" });
        });
      }

      if (clickToMove) {
        map.on("click", (e) => {
          const { lat, lng } = e.latlng;
          userInteractedRef.current = true;
          marker.setLatLng([lat, lng]);
          lastCenterRef.current = { lat, lon: lng };
          onPick?.(lat, lng, { cause: "click" });
        });
      }

      mapRef.current = map;
      markerRef.current = marker;

      map.whenReady(() => {
        if (!destroyed) setReady(true);
      });
      onReady?.({ map, marker });
    })();

    return () => {
      destroyed = true;
      try {
        markerRef.current?.remove?.();
        circleRef.current?.remove?.();
        mapRef.current?.off?.();
        mapRef.current?.remove?.();
        const el = document.getElementById(mapId);
        if (el && el._leaflet_id) el._leaflet_id = undefined;
      } finally {
        mapRef.current = null;
        markerRef.current = null;
        circleRef.current = null;
        LRef.current = null;
        setReady(false);
      }
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const map = mapRef.current;
    const marker = markerRef.current;
    if (!map || !marker) return;

    const last = lastCenterRef.current;
    const threshold = 0.0001;
    if (
      Math.abs(last.lat - center.lat) < threshold &&
      Math.abs(last.lon - center.lon) < threshold
    )
      return;

    lastCenterRef.current = center;

    try {
      marker.setLatLng([center.lat, center.lon]);
      if (!userInteractedRef.current) {
        requestAnimationFrame(() => {
          if (!mapRef.current || !map._loaded) return;
          const currentZoom = map.getZoom();
          const targetZoom = currentZoom < 15 ? 15 : currentZoom;
          map.flyTo([center.lat, center.lon], targetZoom, {
            duration: 0.8,
            easeLinearity: 0.25,
          });
        });
      } else {
        setTimeout(() => {
          userInteractedRef.current = false;
        }, 3000);
      }
    } catch {}
  }, [ready, center.lat, center.lon]);

  useEffect(() => {
    if (!ready) return;
    const map = mapRef.current;
    const L = LRef.current;
    if (!map || !L) return;

    circleRef.current?.remove?.();
    circleRef.current = null;

    if (Number.isFinite(accuracy) && accuracy > 0) {
      const c = L.circle([center.lat, center.lon], {
        radius: accuracy,
        color: "#3b82f6",
        weight: 2,
        fillColor: "#3b82f6",
        fillOpacity: 0.1,
        dashArray: "5, 5",
      }).addTo(map);
      circleRef.current = c;
      c.bindTooltip(`Akurasi: ±${Math.round(accuracy)}m`, {
        permanent: false,
        direction: "top",
      });
    }
  }, [accuracy, ready, center.lat, center.lon]);

  return (
    <div className="relative h-[320px] md:h-[420px] rounded-2xl overflow-hidden border border-slate-200">
      <div id={mapId} className="absolute inset-0" />
      {accuracy && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md border border-slate-200 text-xs font-medium text-slate-700">
          📍 Akurasi: ±{Math.round(accuracy)}m
        </div>
      )}
    </div>
  );
}
