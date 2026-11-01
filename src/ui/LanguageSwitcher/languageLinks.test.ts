import { describe, expect, it } from 'vitest'
import { languageLinks } from './languageLinks'

const hrefs = (pathname: string) =>
  Object.fromEntries(languageLinks(pathname, ['en', 'de']).map(({ lang, href }) => [lang, href]))

describe('languageLinks', () => {
  it('links an English page to the same page in each language', () => {
    expect(hrefs('/services')).toEqual({ en: '/services', de: '/de/services' })
  })

  it('links a German page back to the unprefixed English one', () => {
    expect(hrefs('/de/blog/some-post')).toEqual({
      en: '/blog/some-post',
      de: '/de/blog/some-post',
    })
  })

  it('strips the server-side `/en` rewrite', () => {
    expect(hrefs('/en/services')).toEqual({ en: '/services', de: '/de/services' })
    expect(hrefs('/en')).toEqual({ en: '/', de: '/de' })
  })

  it('handles the home page', () => {
    expect(hrefs('/')).toEqual({ en: '/', de: '/de' })
    expect(hrefs('/de')).toEqual({ en: '/', de: '/de' })
  })

  it('lists only the given languages, in config order, with their names', () => {
    expect(languageLinks('/about', ['de', 'en'])).toEqual([
      { lang: 'en', title: 'English', href: '/about' },
      { lang: 'de', title: 'Deutsch', href: '/de/about' },
    ])
    expect(languageLinks('/about', ['en'])).toEqual([
      { lang: 'en', title: 'English', href: '/about' },
    ])
  })
})
