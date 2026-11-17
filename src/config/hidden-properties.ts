/**
 * Hidden properties configuration
 *
 * Properties listed here are removed from the public UI (grids, detail pages,
 * portfolios, bundles, destination cards, etc.) while their data and code
 * remain intact for easy re-integration later.
 *
 * To re-enable a property, simply remove its ID/title from the arrays below.
 */

export const HIDDEN_PROPERTY_IDS = [
  '2d517ac7-9547-483c-99cd-221455db19f2', // Casa Azanik / Villa Azanik
];

export const HIDDEN_PROPERTY_TITLES = ['casa azanik', 'villa azanik'];

export interface PropertyLike {
  id?: string;
  title?: string;
}

export function isPropertyHidden(property: PropertyLike): boolean {
  if (property.id && HIDDEN_PROPERTY_IDS.includes(property.id)) {
    return true;
  }

  const normalizedTitle = (property.title || '').toLowerCase().trim();
  if (!normalizedTitle) return false;

  return HIDDEN_PROPERTY_TITLES.some((hiddenTitle) =>
    normalizedTitle.includes(hiddenTitle)
  );
}
