/**
 * Strict city mapping utility for property filtering.
 * Each property belongs to exactly ONE city based on its location field.
 * Order matters - more specific matches checked first.
 */

export type CitySlug = 'akumal' | 'tulum' | 'playa-del-carmen' | 'cancun' | 'puerto-morelos' | 'isla-mujeres';

const normalize = (str: string): string => 
  str.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .trim();

/**
 * Determines which city a property belongs to based on its title and location.
 * Returns null if no match found.
 */
export function getPropertyCity(title: string, location: string): CitySlug | null {
  const normalizedTitle = normalize(title);
  const normalizedLocation = normalize(location);
  const combined = `${normalizedTitle} ${normalizedLocation}`;

  // Order matters: check more specific/unique keywords first
  
  // Isla Mujeres - check first (unique name)
  if (combined.includes('isla mujeres') || combined.includes('isla-mujeres')) {
    return 'isla-mujeres';
  }

  // Puerto Morelos - check before other cities
  if (combined.includes('puerto morelos') || combined.includes('puerto-morelos')) {
    return 'puerto-morelos';
  }

  // Akumal - unique name
  if (combined.includes('akumal')) {
    return 'akumal';
  }

  // Playa del Carmen - check for "playa del carmen", "playa", "playacar", "mayakoba"
  // Mayakoba is in the Playa del Carmen area
  if (
    combined.includes('playa del carmen') ||
    combined.includes('playa-del-carmen') ||
    combined.includes('playacar') ||
    combined.includes('mayakoba') ||
    combined.includes('lagunas de mayakoba')
  ) {
    return 'playa-del-carmen';
  }

  // Tulum - unique name
  if (combined.includes('tulum')) {
    return 'tulum';
  }

  // Cancun - check last (most generic name that could overlap)
  // Includes "cancun hotel zone"
  if (combined.includes('cancun') || combined.includes('cancún')) {
    return 'cancun';
  }

  return null;
}

/**
 * Filters properties for a specific city.
 * Returns only properties that strictly belong to that city.
 */
export function filterPropertiesByCity<T extends { title: string; location: string }>(
  properties: T[],
  citySlug: CitySlug
): T[] {
  return properties.filter(prop => getPropertyCity(prop.title, prop.location) === citySlug);
}

/**
 * Custom property sorting: specific properties at top/bottom, rest in middle.
 * - "Luxury Oceanfront" and "Casa Azanik" at top (priority 1)
 * - "Relaxing Home with Private Pool" at bottom (priority 3)
 * - All others in middle (priority 2)
 */
export function sortPropertiesByPriority<T extends { title: string }>(properties: T[]): T[] {
  const getPriority = (title: string): number => {
    const normalizedTitle = normalize(title);
    
    // Highest priority - Casa Azanik always first
    if (normalizedTitle.includes('casa azanik')) {
      return 0;
    }
    
    // Second priority - Luxury Oceanfront
    if (normalizedTitle.includes('luxury oceanfront')) {
      return 1;
    }
    
    // Bottom priority - show last
    if (normalizedTitle.includes('relaxing home') && normalizedTitle.includes('private pool')) {
      return 3;
    }
    
    // Default - middle
    return 2;
  };

  return [...properties].sort((a, b) => getPriority(a.title) - getPriority(b.title));
}
