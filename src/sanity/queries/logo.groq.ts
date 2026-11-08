import { defineQuery } from 'next-sanity'

/** Every logo, for a logo list that doesn't pick its own. */
export const LOGOS_QUERY = defineQuery(`*[_type == 'logo']|order(name)`)
