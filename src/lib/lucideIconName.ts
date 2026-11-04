/**
 * The PascalCase form of a Lucide slug (`settings-2` → `Settings2`). The Studio stores icons in
 * this form, and the frontend maps it back to the slug.
 */
export const toPascalCase = (slug: string) =>
  slug
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
