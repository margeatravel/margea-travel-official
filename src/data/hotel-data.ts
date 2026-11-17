/**
 * Hotel data layer — single source of truth for hotel-specific configuration.
 * Designed to be reusable for future hotels; currently configured for Ana y Jose.
 */

export interface RoomTypeConfig {
  /** Matches the child property title in the DB */
  name: string;
  /** Bed configuration label shown in UI */
  bedConfig: string;
  /** Total units of this type in the hotel */
  totalUnits: number;
  /** Category for filtering */
  category: 'room' | 'suite' | 'villa';
}

/** Room-type metadata keyed by property title (matches DB) */
export const ROOM_TYPE_CONFIG: Record<string, RoomTypeConfig> = {
  'Manglar': {
    name: 'Manglar',
    bedConfig: '1 King Bed',
    totalUnits: 8,
    category: 'room',
  },
  'Charming Garden View': {
    name: 'Charming Garden View',
    bedConfig: '1 King Bed',
    totalUnits: 6,
    category: 'room',
  },
  'Superior Garden View': {
    name: 'Superior Garden View',
    bedConfig: '1 King Bed + Sofa Bed',
    totalUnits: 4,
    category: 'suite',
  },
  'Charming Ocean View': {
    name: 'Charming Ocean View',
    bedConfig: '1 King Bed',
    totalUnits: 3,
    category: 'room',
  },
  'Feelings Ocean View': {
    name: 'Feelings Ocean View',
    bedConfig: '1 King Bed',
    totalUnits: 3,
    category: 'suite',
  },
  'Two Bedroom Suite Jungle View': {
    name: 'Two Bedroom Suite Jungle View',
    bedConfig: '2 King Beds',
    totalUnits: 2,
    category: 'suite',
  },
  'Villa Cobá': {
    name: 'Villa Cobá',
    bedConfig: '2 King Beds + Full Kitchen',
    totalUnits: 1,
    category: 'villa',
  },
};

/**
 * Simulate availability for a room type given check-in/out dates.
 * Uses a deterministic seed so results are consistent for the same search.
 */
export function simulateAvailability(
  roomName: string,
  checkIn: string,
  checkOut: string
): { available: number; urgency: boolean } {
  const config = ROOM_TYPE_CONFIG[roomName];
  if (!config) return { available: 0, urgency: false };

  const seed = `${roomName}-${checkIn}-${checkOut}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const pseudo = Math.abs(hash);

  if (pseudo % 100 < 15) return { available: 0, urgency: false };

  const available = (pseudo % config.totalUnits) + 1;
  const urgency = available <= 1;

  return { available, urgency };
}

/** Calculate number of nights between two date strings */
export function calculateNights(checkIn: string, checkOut: string): number {
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const diff = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(diff, 1);
}

export type RoomCategory = 'all' | 'room' | 'suite' | 'villa';
