import { structureTool, type StructureBuilder } from 'sanity/structure'
import { group, directory } from 'sanitypress-utils'
import { VscFiles, VscServerProcess } from 'react-icons/vsc'
import { siteDocumentId, supportedLanguages } from '@/lib/languages'

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

        S.documentTypeListItem('page').title('All pages').icon(VscFiles),
        // customize page directories
        group(S, 'Directories', [
          directory(S, 'docs', { maxLevel: 1 }).title('Docs'),
          directory(S, 'docs/modules').title('Docs › Modules'),
        ]),

        S.documentTypeListItem('global-module').title('Global modules'),
        S.divider(),

        S.documentTypeListItem('blog.post').title('Blog posts'),
        S.documentTypeListItem('blog.category').title('Blog categories'),
        S.divider(),

        S.documentTypeListItem('navigation'),
        S.documentTypeListItem('redirect').title('Redirects'),

        group(S, 'Miscellaneous', [
          S.documentTypeListItem('announcement').title('Announcements'),
          S.documentTypeListItem('logo').title('Logos'),
          S.documentTypeListItem('person').title('People'),
          S.documentTypeListItem('pricing').title('Pricing tiers'),
          S.documentTypeListItem('reputation'),
          S.documentTypeListItem('testimonial').title('Testimonials'),
        ]),
      ]),
})
