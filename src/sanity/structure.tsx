import { structureTool, type StructureBuilder } from 'sanity/structure'
import { group, directory } from 'sanitypress-utils'
import { VscFiles, VscServerProcess, VscWarning } from 'react-icons/vsc'
import type { ComponentType } from 'react'
import { DEFAULT_LANG, siteDocumentId, supportedLanguages } from '@/lib/i18n'

/** The document is in `$lang`. Documents from before the migration have no language and are English. */
const IN_LANGUAGE = 'coalesce(language, $defaultLang) == $lang'

/**
 * A translatable type, one list per language with the default language first,
 * then every language together for searching across them.
 * Each language's "+" creates a document in that language.
 */
const byLanguage = (S: StructureBuilder, type: string, title: string, icon?: ComponentType) => {
  const item = S.listItem()
    .id(type)
    .title(title)
    .child(
      S.list()
        .id(type)
        .title(title)
        .items([
          ...supportedLanguages.map(({ id: lang, title: langTitle }) =>
            S.listItem()
              .id(`${type}-${lang}`)
              .title(langTitle)
              .schemaType(type)
              .child(
                S.documentTypeList(type)
                  .id(`${type}-${lang}`)
                  .title(`${title} (${langTitle})`)
                  .filter(`_type == $type && ${IN_LANGUAGE}`)
                  .params({ type, lang, defaultLang: DEFAULT_LANG })
                  .initialValueTemplates([S.initialValueTemplateItem(`${type}-${lang}`)]),
              ),
          ),
          S.divider(),
          S.documentTypeListItem(type).id(`${type}-all`).title('All languages'),
        ]),
    )

  return icon ? item.icon(icon) : item
}

/** Types whose documents should exist in every language. */
const missingTranslationTypes = [
  { type: 'page', title: 'Pages' },
  { type: 'blog.post', title: 'Blog posts' },
]

/**
 * Default-language documents with no translation in a language, per language and type.
 * Drafts are matched by their published ID, which is what translation metadata references.
 */
const missingTranslations = (S: StructureBuilder) =>
  S.listItem()
    .id('missing-translations')
    .title('Missing translations')
    .icon(VscWarning)
    .child(
      S.list()
        .title('Missing translations')
        .items(
          supportedLanguages
            .filter(({ id }) => id !== DEFAULT_LANG)
            .map(({ id: lang, title: langTitle }) =>
              S.listItem()
                .id(`missing-${lang}`)
                .title(langTitle)
                .child(
                  S.list()
                    .title(`Missing in ${langTitle}`)
                    .items(
                      missingTranslationTypes.map(({ type, title }) =>
                        S.listItem()
                          .id(`missing-${lang}-${type}`)
                          .title(title)
                          .schemaType(type)
                          .child(
                            S.documentTypeList(type)
                              .id(`missing-${lang}-${type}`)
                              .title(`${title} missing in ${langTitle}`)
                              .filter(
                                `_type == $type && coalesce(language, $defaultLang) == $defaultLang
                                && count(*[_type == "translation.metadata"
                                  && references(string::split(^._id, "drafts.")[-1])
                                  && $lang in translations[].language]) == 0`,
                              )
                              .params({ type, lang, defaultLang: DEFAULT_LANG })
                              .canHandleIntent(() => false),
                          ),
                      ),
                    ),
                ),
            ),
        ),
    )

/** One site settings singleton per language. */
const siteSettings = (S: StructureBuilder) =>
  S.listItem()
    .id('site-settings')
    .title('Site settings')
    .icon(VscServerProcess)
    .child(
      S.list()
        .title('Site settings')
        .items(
          supportedLanguages.map(({ id: language, title }) => {
            const documentId = siteDocumentId(language)

            return S.listItem()
              .id(documentId)
              .title(title)
              .icon(VscServerProcess)
              .child(
                S.editor()
                  .id(documentId)
                  .title(`Site settings (${title})`)
                  .schemaType('site')
                  .documentId(documentId)
                  .initialValueTemplate(`site-${language}`),
              )
          }),
        ),
    )

export const structure = structureTool({
  structure: (S) =>
    S.list()
      .title('Content')
      .items([
        siteSettings(S),
        S.divider(),

        byLanguage(S, 'page', 'All pages', VscFiles),
        // customize page directories
        group(S, 'Directories', [
          directory(S, 'docs', { maxLevel: 1 }).title('Docs'),
          directory(S, 'docs/modules').title('Docs › Modules'),
        ]),

        byLanguage(S, 'global-module', 'Global modules'),
        S.divider(),

        byLanguage(S, 'blog.post', 'Blog posts'),
        byLanguage(S, 'blog.category', 'Blog categories'),
        S.divider(),

        byLanguage(S, 'navigation', 'Navigation'),
        S.documentTypeListItem('redirect').title('Redirects'),
        missingTranslations(S),

        group(S, 'Miscellaneous', [
          S.documentTypeListItem('announcement').title('Announcements'),
          S.documentTypeListItem('logo').title('Logos'),
          S.documentTypeListItem('person').title('People'),
          S.documentTypeListItem('pricing').title('Pricing tiers'),
          S.documentTypeListItem('reputation'),
          byLanguage(S, 'testimonial', 'Testimonials'),
        ]),
      ]),
})
