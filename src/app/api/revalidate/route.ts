import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse, type NextRequest } from 'next/server'

const SANITY_REVALIDATE_SECRET = process.env.SANITY_REVALIDATE_SECRET

type SanityWebhookBody = {
  _type?: string
  slug?: { current?: string }
  transaction?: { documentIds?: string[] }
}

export async function POST(req: NextRequest) {
  if (!SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Missing revalidate secret' }, { status: 500 })
  }

  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  const body = (await req.json().catch(() => undefined)) as SanityWebhookBody | undefined
  if (!body) return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 })

  const tags = new Set<string>(['sanity'])

  const docType = body?._type || body?.transaction?.documentIds?.[0]?.split('.')[1]
  if (docType) tags.add(`sanity:${docType}`)

  tags.forEach((tag) => revalidateTag(tag))

  // If you have paths to revalidate, add them here. Example:
  // if (docType === 'page' && body?.slug?.current) revalidatePath(`/${body.slug.current}`)
  revalidatePath('/')

  return NextResponse.json({ revalidated: true, tags: Array.from(tags) })
}
