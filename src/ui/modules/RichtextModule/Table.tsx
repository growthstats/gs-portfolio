import PortableText from '@/ui/PortableText'
import type { Table as TableValue } from '@/sanity/sanity.types'

export default function Table({ value }: Readonly<{ value?: TableValue }>) {
  const rows = value?.rows ?? []
  if (!rows.length) return null

  const headerCount = Math.max(0, Math.min(value?.headerRows ?? 0, rows.length))
  const headerRows = rows.slice(0, headerCount)
  const bodyRows = rows.slice(headerCount)

  return (
    // Scrolls inside the content column instead of widening the page on narrow screens.
    <div className="max-w-full overflow-x-auto">
      <table data-pt-table className="w-full border-collapse text-start text-sm">
        {value?.caption && (
          <caption className="caption-bottom pt-2 text-start text-xs text-ink/60">
            {value.caption}
          </caption>
        )}

        {headerRows.length > 0 && (
          <thead className="border-b-2 border-ink/20">
            {headerRows.map((row) => (
              <tr key={row._key}>
                {row.cells?.map((cell) => (
                  <th
                    key={cell._key}
                    scope="col"
                    className="min-w-32 p-3 text-start align-bottom font-bold"
                  >
                    <PortableText value={cell.value ?? []} />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
        )}

        {bodyRows.length > 0 && (
          <tbody>
            {bodyRows.map((row) => (
              <tr key={row._key} className="border-b border-ink/10">
                {row.cells?.map((cell) => (
                  <td key={cell._key} className="min-w-32 p-3 align-top">
                    <PortableText value={cell.value ?? []} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  )
}
