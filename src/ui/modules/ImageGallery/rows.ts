export type GalleryImage = {
  _key?: string
  asset?: unknown
  alt?: string
  caption?: string
  lqip?: string | null
}

export type GalleryRow = { _key?: string; images?: (GalleryImage | null)[] | null }

/**
 * The rows worth rendering: images without an asset and rows left empty are
 * dropped. With `alternate`, every second row scrolls the other way.
 */
export function galleryRows(rows: GalleryRow[] | null | undefined, alternate?: boolean) {
  return (rows ?? [])
    .map((row) => ({
      key: row._key,
      images: (row.images ?? []).filter((image): image is GalleryImage => Boolean(image?.asset)),
    }))
    .filter(({ images }) => images.length > 0)
    .map((row, index) => ({ ...row, reverse: Boolean(alternate) && index % 2 === 1 }))
}
