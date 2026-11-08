import { Img, type ImgSource } from '@/ui/Img'
import { GoPerson } from 'react-icons/go'
import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'
import LocalizedLink from '@/ui/LocalizedLink'
import { filterHref } from './filterHref'

/** The author fields the blog reads. */
export type AuthorValue = {
  _id?: string
  name?: string | null
  slug?: { current?: string } | null
  image?: ImgSource | null
}

export default function Authors({
  authors,
  skeleton,
  linked,
  className,
  ...props
}: {
  authors?: AuthorValue[] | null
  skeleton?: boolean
  linked?: boolean
} & ComponentProps<'ul'>) {
  if (!authors?.length && !skeleton) return null

  return (
    <ul className={cn('m-0 list-none p-0', className)} {...props}>
      {authors?.map((author) => (
        <Author author={author} key={author._id ?? author.name} linked={linked} />
      ))}

      {skeleton && <Author />}
    </ul>
  )
}

function Author({ author, linked }: { author?: AuthorValue; linked?: boolean }) {
  const content = (
    <>
      <span className="grid aspect-square w-[1.7em] shrink-0 place-content-center overflow-hidden rounded-full bg-accent/3">
        {author?.image ? (
          <Img
            className="aspect-square"
            image={author.image}
            width={60}
            alt={author.name ?? undefined}
          />
        ) : (
          <GoPerson className="text-xl text-accent/20" />
        )}
      </span>

      <span>{author?.name}</span>
    </>
  )

  const props = {
    className: cn('flex items-center gap-[.5ch] hover:underline', !linked && 'pointer-events-none'),
    children: content,
  }

  return (
    <li>
      {linked ? (
        <LocalizedLink href={filterHref('author', author?.slug?.current)} {...props} />
      ) : (
        <div {...props} />
      )}
    </li>
  )
}
