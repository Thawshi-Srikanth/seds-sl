"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";
import "leaflet/dist/leaflet.css";

export interface MapLocationItem {
  name: string;
  city?: string;
  latitude: number;
  longitude: number;
  isPrimary?: boolean;
}

interface SriLankaDarkMapProps {
  locations?: MapLocationItem[];
}

export function SriLankaDarkMap({ locations }: SriLankaDarkMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const [isMounted, setIsMounted] = useState(false);

  const defaultLocation: MapLocationItem = {
    name: "Galle Face Green",
    city: "Colombo 03",
    latitude: 6.9237882,
    longitude: 79.8449324,
    isPrimary: true,
  };

  const activeLocations =
    locations && locations.length > 0 ? locations : [defaultLocation];
  const primaryLoc =
    activeLocations.find((l) => l.isPrimary) || activeLocations[0];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !mapContainerRef.current || mapInstanceRef.current)
      return;

    // Dynamically import Leaflet on client side
    import("leaflet").then((L) => {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const centerCoords: [number, number] = [
        primaryLoc.latitude,
        primaryLoc.longitude,
      ];

      // Initialize Leaflet Map
      const map = L.map(mapContainerRef.current, {
        center: centerCoords,
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
        dragging: true,
        scrollWheelZoom: false,
      });

      mapInstanceRef.current = map;

      // Add CartoDB Dark Matter Tile Layer
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
          subdomains: "abcd",
        },
      ).addTo(map);

      // Render markers for ALL locations in database
      activeLocations.forEach((loc) => {
        const markerCoords: [number, number] = [loc.latitude, loc.longitude];

        const customIcon = L.divIcon({
          className: "custom-leaflet-marker",
          html: `
            <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
              <div style="position: absolute; width: 24px; height: 24px; border-radius: 50%; background: ${
                loc.isPrimary
                  ? "rgba(37, 99, 235, 0.4)"
                  : "rgba(56, 189, 248, 0.3)"
              }; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              <div style="position: absolute; width: 12px; height: 12px; border-radius: 50%; background: ${
                loc.isPrimary ? "#2563eb" : "#38bdf8"
              }; border: 2px solid #ffffff; box-shadow: 0 0 10px ${
                loc.isPrimary ? "#2563eb" : "#38bdf8"
              };"></div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker(markerCoords, { icon: customIcon }).addTo(map);

        if (loc.name) {
          marker.bindTooltip(
            `<div style="font-family: monospace; font-size: 11px; font-weight: bold; padding: 2px 4px;">${loc.name} ${
              loc.city ? `(${loc.city})` : ""
            }</div>`,
            { permanent: false, direction: "top" },
          );
        }
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mapInstanceRef.current as any).remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isMounted, activeLocations, primaryLoc]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mapInstanceRef.current as any).zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mapInstanceRef.current as any).zoomOut();
    }
  };

  return (
    <div className="relative w-full h-full min-h-[380px] md:min-h-[440px] bg-[#090b10] border border-border/60 overflow-hidden select-none">
      {/* Extended Bleeding Hairline Guide Lines */}
      <div className="absolute -left-8 -right-8 top-0 border-t border-border/60 pointer-events-none z-20" />
      <div className="absolute -left-8 -right-8 bottom-0 border-b border-border/60 pointer-events-none z-20" />
      <div className="absolute -top-8 -bottom-8 left-0 border-l border-border/60 pointer-events-none z-20" />
      <div className="absolute -top-8 -bottom-8 right-0 border-r border-border/60 pointer-events-none z-20" />

      {/* Leaflet Map Container */}
      <div
        ref={mapContainerRef}
        className="w-full h-full min-h-[380px] md:min-h-[440px] z-10"
      />

      {/* Custom Theme Zoom Controls */}
      <div className="absolute bottom-4 right-4 z-30 flex flex-col border border-border/60 divide-y divide-border/60 bg-background/90 backdrop-blur-md">
        <button
          type="button"
          onClick={handleZoomIn}
          className="p-2 hover:bg-muted/20 text-foreground transition-colors cursor-pointer"
          title="Zoom In"
        >
          <Plus className="size-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="p-2 hover:bg-muted/20 text-foreground transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <Minus className="size-4" />
        </button>
      </div>
    </div>
  );
}
