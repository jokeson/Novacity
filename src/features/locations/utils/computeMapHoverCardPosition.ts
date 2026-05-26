/** Approximate hover card size for clamping inside the map frame. */
export const MAP_HOVER_CARD_SIZE = {
  width: 224,
  height: 228,
} as const;

const MAP_HOVER_CARD_PADDING = 12;
const MAP_HOVER_CARD_MARKER_GAP = 18;

export type MapHoverCardPosition = {
  left: number;
  top: number;
};

/**
 * Places the property card above the pin when possible; flips below or shifts
 * horizontally so the full card (including image) stays inside the map.
 */
export const computeMapHoverCardPosition = (
  markerX: number,
  markerY: number,
  mapWidth: number,
  mapHeight: number,
): MapHoverCardPosition => {
  const { width: cardWidth, height: cardHeight } = MAP_HOVER_CARD_SIZE;
  const pad = MAP_HOVER_CARD_PADDING;
  const gap = MAP_HOVER_CARD_MARKER_GAP;

  const maxLeft = Math.max(pad, mapWidth - cardWidth - pad);
  const maxTop = Math.max(pad, mapHeight - cardHeight - pad);

  let left = markerX - cardWidth / 2;
  let top = markerY - cardHeight - gap;

  if (top < pad) {
    top = markerY + gap;
  }

  left = Math.min(Math.max(left, pad), maxLeft);
  top = Math.min(Math.max(top, pad), maxTop);

  return { left, top };
};
