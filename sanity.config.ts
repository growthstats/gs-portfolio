'use client'

import pkg from './package.json'
import { defineConfig } from 'sanity'
import { projectId, dataset, apiVersion } from '@/sanity/lib/env'
import { structure } from './src/sanity/structure'
import { presentation } from './src/sanity/presentation'
import { icon, infoWidget } from 'sanitypress-utils'
import { dashboardTool, projectInfoWidget, projectUsersWidget } from '@sanity/dashboard'
import { visionTool } from '@sanity/vision'
import { codeInput } from '@sanity/code-input'
import { supportedLanguages } from '@/lib/languages'
import { documentInternationalization } from '@sanity/document-internationalization'
import { schemaTypes } from './src/sanity/schemaTypes'
import { translatableTypes } from './src/sanity/schemaTypes/utils/language'
import resolveUrl from '@/lib/resolveUrl'

const singletonTypes = new Set(['site'])

// Every template of a singleton, including the plugin's per-language ones.
const singletonTemplateIds = new Set(
  [...singletonTypes].flatMap((type) => [
    type,
    `${type}-parameterized`,
    ...supportedLanguages.map(({ id }) => `${type}-${id}`),
  ]),
)

export default defineConfig({
  title: 'GrowthStats CMS',
  icon,
  projectId,
  dataset,
  basePath: '/admin',

  plugins: [
    structure,
    presentation,
    dashboardTool({
      name: 'info',
      title: 'Info',
      widgets: [projectInfoWidget(), projectUsersWidget(), infoWidget({ version: pkg.version })],
    }),
    visionTool({ defaultApiVersion: apiVersion }),
    codeInput(),
    documentInternationalization({
      supportedLanguages,
      schemaTypes: translatableTypes,
    }),
  ],

  schema: {
    types: schemaTypes,
  },
  document: {
    // Singletons are opened from the desk only, never from a "create" menu. Their templates
    // (`site-en`, `site-de`, ...) stay registered so the desk can set the language.
    newDocumentOptions: (prev) =>
      prev.filter(({ templateId }) => !singletonTemplateIds.has(templateId)),

    // The Translations menu would create a German `site` with a random ID; `site-de` comes from the desk instead.
    unstable_languageFilter: (prev, { schemaType }) => (singletonTypes.has(schemaType) ? [] : prev),

    productionUrl: async (prev, { document }) => {
      if (['page', 'blog.post'].includes(document?._type)) {
        return resolveUrl(document as Sanity.PageBase, { base: true })
      }
      return prev
    },

    actions: (input, { schemaType }) => {
      if (singletonTypes.has(schemaType)) {
        return input.filter(
          ({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action),
        )
      }

      return input
    },
  },
})
