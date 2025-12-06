// src/sanity/lib/image.ts
import imageUrlBuilder from '@sanity/image-url'
import { client } from '@/sanity/lib/client'

const builder = imageUrlBuilder(client)

/**
 * Return a builder for a Sanity image asset.
 * The parameter type is inferred from builder.image to avoid `any`.
 */
export function urlFor(image: Parameters<typeof builder.image>[0]) {
  return builder.image(image)
}
