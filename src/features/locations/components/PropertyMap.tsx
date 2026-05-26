"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { PropertyMapHoverCard } from "@/features/locations/components/PropertyMapHoverCard";
import type { PropertyMapPin, PropertyMapViewport } from "@/features/locations/types/locationMap";
import {
  computeMapHoverCardPosition,
  type MapHoverCardPosition,
} from "@/features/locations/utils/computeMapHoverCardPosition";
import { cn } from "@/lib/utils";

import "leaflet/dist/leaflet.css";

export type PropertyMapProps = {
  pins: PropertyMapPin[];
  viewport: PropertyMapViewport;
  className?: string;
};

const HOVER_CARD_HIDE_DELAY_MS = 140;

const createGoldMarkerIcon = (L: typeof import("leaflet")) =>
  L.divIcon({
    className: "novacity-map-marker-icon",
    html: '<span class="novacity-map-marker-icon__dot" aria-hidden="true"></span>',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
  });

export const PropertyMap = ({ pins, viewport, className }: PropertyMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const hoveredPinRef = useRef<PropertyMapPin | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  const [hoveredPin, setHoveredPin] = useState<PropertyMapPin | null>(null);
  const [cardPosition, setCardPosition] = useState<MapHoverCardPosition | null>(null);

  const clearHideTimeout = useCallback(() => {
    if (hideTimeoutRef.current !== null) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  const updateCardPositionForPin = useCallback((pin: PropertyMapPin) => {
    const map = mapRef.current;
    const container = containerRef.current;
    if (!map || !container) {
      return;
    }

    const point = map.latLngToContainerPoint([pin.lat, pin.lng]);
    setCardPosition(
      computeMapHoverCardPosition(
        point.x,
        point.y,
        container.offsetWidth,
        container.offsetHeight,
      ),
    );
  }, []);

  const showCardForPin = useCallback(
    (pin: PropertyMapPin) => {
      clearHideTimeout();
      hoveredPinRef.current = pin;
      setHoveredPin(pin);
      updateCardPositionForPin(pin);
    },
    [clearHideTimeout, updateCardPositionForPin],
  );

  const scheduleHideCard = useCallback(() => {
    clearHideTimeout();
    hideTimeoutRef.current = setTimeout(() => {
      hoveredPinRef.current = null;
      setHoveredPin(null);
      setCardPosition(null);
    }, HOVER_CARD_HIDE_DELAY_MS);
  }, [clearHideTimeout]);

  const showCardForPinRef = useRef(showCardForPin);
  const scheduleHideCardRef = useRef(scheduleHideCard);
  showCardForPinRef.current = showCardForPin;
  scheduleHideCardRef.current = scheduleHideCard;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    let disposed = false;
    let mapListenersCleanup: (() => void) | undefined;

    const initMap = async (): Promise<void> => {
      const L = (await import("leaflet")).default;
      if (disposed || !containerRef.current) {
        return;
      }

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      const map = L.map(container, {
        center: [viewport.center.lat, viewport.center.lng],
        zoom: viewport.defaultZoom,
        scrollWheelZoom: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const markerIcon = createGoldMarkerIcon(L);
      const bounds = L.latLngBounds([
        [viewport.bounds.south, viewport.bounds.west],
        [viewport.bounds.north, viewport.bounds.east],
      ]);

      for (const pin of pins) {
        const marker = L.marker([pin.lat, pin.lng], { icon: markerIcon });
        marker.on("mouseover", () => {
          showCardForPinRef.current(pin);
        });
        marker.on("mouseout", () => {
          scheduleHideCardRef.current();
        });
        marker.on("click", () => {
          router.push(`/properties/${pin.slug}`);
        });
        marker.addTo(map);
        bounds.extend([pin.lat, pin.lng]);
      }

      if (pins.length > 1) {
        map.fitBounds(bounds, { padding: [48, 48], maxZoom: 15 });
      } else if (pins.length === 1) {
        map.setView([pins[0].lat, pins[0].lng], Math.min(viewport.defaultZoom + 1, 14));
      }

      const handleMapViewChange = () => {
        const pin = hoveredPinRef.current;
        if (!pin) {
          return;
        }
        updateCardPositionForPin(pin);
      };

      map.on("move", handleMapViewChange);
      map.on("zoom", handleMapViewChange);
      mapListenersCleanup = () => {
        map.off("move", handleMapViewChange);
        map.off("zoom", handleMapViewChange);
      };

      mapRef.current = map;
    };

    void initMap();

    return () => {
      disposed = true;
      mapListenersCleanup?.();
      mapRef.current?.remove();
      mapRef.current = null;
      hoveredPinRef.current = null;
      setHoveredPin(null);
      setCardPosition(null);
    };
  }, [pins, router, viewport, updateCardPositionForPin]);

  useEffect(
    () => () => {
      clearHideTimeout();
    },
    [clearHideTimeout],
  );

  return (
    <div
      className={cn(
        "border-border relative rounded-2xl border shadow-sm",
        className,
      )}
    >
      <div className="relative overflow-visible rounded-2xl">
        <div
          ref={containerRef}
          className="bg-muted/40 novacity-map-canvas h-[min(58vh,420px)] w-full min-h-[220px] overflow-hidden rounded-2xl sm:min-h-[260px] sm:h-[min(62vh,520px)] md:min-h-[300px] md:h-[min(68vh,600px)] lg:min-h-[320px] lg:h-[min(72vh,680px)]"
          role="application"
          aria-label={viewport.ariaLabel}
        />
        {hoveredPin && cardPosition ? (
          <PropertyMapHoverCard
            pin={hoveredPin}
            position={cardPosition}
            onPointerEnter={clearHideTimeout}
            onPointerLeave={scheduleHideCard}
          />
        ) : null}
      </div>
      <p className="text-muted-foreground border-border bg-background/95 relative z-[1] mx-3 mt-3 rounded-xl border px-3 py-2 text-xs leading-relaxed sm:mx-3 sm:max-w-md">
        {viewport.mapHint}
      </p>
    </div>
  );
};
