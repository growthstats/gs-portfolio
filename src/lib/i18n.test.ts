import { describe, expect, it } from 'vitest'
import {
  isEnabledLanguage,
  isSupportedLanguage,
  localizeHref,
  localizePath,
  parseEnabledLanguages,
  parseLangFromPath,
  siteDocumentId,
} from './i18n'

describe('parseEnabledLanguages', () => {
  it('defaults to English', () => {
    expect(parseEnabledLanguages()).toEqual(['en'])
    expect(parseEnabledLanguages('')).toEqual(['en'])
  })

  it('always includes English', () => {
    expect(parseEnabledLanguages('de')).toEqual(['en', 'de'])
  })

  it('ignores unknown codes, whitespace, case and duplicates', () => {
    expect(parseEnabledLanguages(' DE , fr,de,,xx')).toEqual(['en', 'de'])
  })
})

describe('isSupportedLanguage / isEnabledLanguage', () => {
  it('knows the supported languages', () => {
    expect(isSupportedLanguage('en')).toBe(true)
    expect(isSupportedLanguage('de')).toBe(true)
    expect(isSupportedLanguage('fr')).toBe(false)
    expect(isSupportedLanguage(undefined)).toBe(false)
  })

  it('enables only English when NEXT_PUBLIC_ENABLED_LANGUAGES is unset', () => {
    expect(isEnabledLanguage('en')).toBe(true)
    expect(isEnabledLanguage('de')).toBe(false)
  })
})

describe('parseLangFromPath', () => {
  it('splits off a supported prefix', () => {
    expect(parseLangFromPath('/de/services')).toEqual({ lang: 'de', path: '/services' })
    expect(parseLangFromPath('/en/blog/a-post')).toEqual({ lang: 'en', path: '/blog/a-post' })
  })

  it('maps a bare prefix to the root', () => {
    expect(parseLangFromPath('/de')).toEqual({ lang: 'de', path: '/' })
    expect(parseLangFromPath('/de/')).toEqual({ lang: 'de', path: '/' })
  })

  it('leaves unprefixed paths alone', () => {
    expect(parseLangFromPath('/')).toEqual({ path: '/' })
    expect(parseLangFromPath('/services')).toEqual({ path: '/services' })
    expect(parseLangFromPath('/design')).toEqual({ path: '/design' })
    expect(parseLangFromPath('/fr/services')).toEqual({ path: '/fr/services' })
  })
})

describe('localizePath', () => {
  it('leaves English unprefixed', () => {
    expect(localizePath('/services', 'en')).toBe('/services')
    expect(localizePath('/', 'en')).toBe('/')
    expect(localizePath('/services')).toBe('/services')
  })

  it('prefixes other languages', () => {
    expect(localizePath('/services', 'de')).toBe('/de/services')
    expect(localizePath('/blog/a-post', 'de')).toBe('/de/blog/a-post')
    expect(localizePath('/', 'de')).toBe('/de')
  })
})

describe('localizeHref', () => {
  it('leaves English unprefixed', () => {
    expect(localizeHref('/services', 'en')).toBe('/services')
    expect(localizeHref('/?a=1')).toBe('/?a=1')
  })

  it('prefixes the path and keeps the query or hash', () => {
    expect(localizeHref('/services', 'de')).toBe('/de/services')
    expect(localizeHref('/services#faq', 'de')).toBe('/de/services#faq')
    expect(localizeHref('/?a=1#b', 'de')).toBe('/de?a=1#b')
    expect(localizeHref('/#top', 'de')).toBe('/de#top')
  })

  it('leaves non-path hrefs alone', () => {
    expect(localizeHref('https://example.com/services', 'de')).toBe('https://example.com/services')
    expect(localizeHref('//cdn.example.com/a', 'de')).toBe('//cdn.example.com/a')
    expect(localizeHref('mailto:hi@example.com', 'de')).toBe('mailto:hi@example.com')
    expect(localizeHref('#top', 'de')).toBe('#top')
  })
})

describe('siteDocumentId', () => {
  it('keeps the English site settings at `site`', () => {
    expect(siteDocumentId('en')).toBe('site')
  })

  it('suffixes other languages', () => {
    expect(siteDocumentId('de')).toBe('site-de')
  })
})
