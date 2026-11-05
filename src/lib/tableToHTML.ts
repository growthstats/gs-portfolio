import { escapeHTML, toHTML } from '@portabletext/to-html'
import type { Table } from '@/sanity/sanity.types'

/** A Portable Text table as HTML, for the RSS feed. */
export default function tableToHTML({ caption, headerRows = 0, rows = [] }: Table) {
  const row = (cells: NonNullable<(typeof rows)[number]['cells']>, tag: 'th' | 'td') =>
    `<tr>${cells.map((cell) => `<${tag}>${toHTML(cell.value ?? [])}</${tag}>`).join('')}</tr>`

  const head = rows.slice(0, headerRows).map((r) => row(r.cells ?? [], 'th'))
  const body = rows.slice(headerRows).map((r) => row(r.cells ?? [], 'td'))

  return [
    '<table>',
    caption && `<caption>${escapeHTML(caption)}</caption>`,
    head.length && `<thead>${head.join('')}</thead>`,
    body.length && `<tbody>${body.join('')}</tbody>`,
    '</table>',
  ]
    .filter(Boolean)
    .join('')
}
