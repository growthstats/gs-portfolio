import Link from 'next/link'
import { Img } from '@/ui/Img'
import { GoPerson } from 'react-icons/go'
import { BLOG_DIR } from '@/lib/env'
import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'

export default function Authors({
  authors,
  skeleton,
  linked,
  className,
  ...props
}: {
  authors?: Sanity.Person[]
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

function Author({ author, linked }: { author?: Sanity.Person; linked?: boolean }) {
  const content = (
    <>
      <span className="bg-accent/3 grid aspect-square w-[1.7em] shrink-0 place-content-center overflow-hidden rounded-full">
        {author?.image ? (
          <Img className="aspect-square" image={author.image} width={60} alt={author.name} />
        ) : (
          <GoPerson className="text-accent/20 text-xl" />
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
        <Link
          href={{
            pathname: `/${BLOG_DIR}`,
            query: { author: author?.slug?.current },
          }}
          {...props}
        />
      ) : (
        <div {...props} />
      )}
    </li>
  )
}
