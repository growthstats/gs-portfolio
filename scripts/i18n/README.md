# Translation pipeline

Export, translate, import ([ADR 0003](../../docs/adr/0003-ui-strings-and-translation-pipeline.md)). An agent drafts the translation; a native speaker at Growth Stats proofreads it in the Studio and publishes it. The scripts never publish.

Run them on the Node version in `.nvmrc` (`sanity exec` fails on newer majors). They read `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` and `SANITY_API_WRITE_TOKEN` from `.env`.

```bash
npm run i18n:export -- --lang de [--type page] [--id <id>]
# translate the files in i18n-work/de/ (below)
npm run i18n:import -- --lang de [--type page] [--id <id>] --dry-run
npm run i18n:import -- --lang de [--type page] [--id <id>]
```

`--type` and `--id` can be repeated. The import reads and checks every file before it writes anything. Without them, every translatable type (`page`, `blog.post`, `navigation`, `global-module`, `blog.category`, `testimonial`, `site`) is included.

## Export

Writes one file per published English document: `i18n-work/<lang>/<type>/<id>.json` (git-ignored). Each file is a flat map from a key, the string's path in the document, to its English text:

```json
{
  "title": "Services",
  "modules[_key==\"a1\"].intro[_key==\"b2\"].children[_key==\"c3\"].text": "Grow with "
}
```

It covers `string` and `text` fields and every Portable Text span. Images (their alt text and captions are included), URLs, slugs, references, code blocks, enum options and technical fields (anchor ids, URL parameters, icon names, alignment) are not exported. The field rules are in `strings.ts`.

Exporting again keeps a file that already holds translated strings and says so; `--force` overwrites it with fresh English. Import a finished translation before re-exporting that document.

## Translating a file (instructions for the agent)

Edit the values in place. Nothing else.

- **Keep every key exactly as it is.** Don't add, remove, reorder or merge keys. A missing key stays in English.
- **One span is one value.** A sentence can be split over several keys where part of it is bold or a link (`"Grow with "`, `"Growth Stats"`, `" today."`). Translate each piece so the joined sentence reads naturally in German, keeping the leading and trailing spaces. Move words between neighbouring pieces if German word order needs it, but never leave the bold or linked piece empty.
- **Keep brand and product names**: Growth Stats, and names of tools, platforms and clients (Google, Meta, HubSpot, ...).
- **Don't translate person names.**
- **Keep URLs, email addresses, phone numbers, placeholders** (`{name}`, `%s`, `{{ }}`) **and markup** as they are.
- **Formal "Sie"** throughout, never "du".
- **Match Growth Stats' tone**: confident, plain and benefit-led, as in the English. No literal word-for-word phrasing; write as a German marketing copywriter would.
- SEO fields (`metadata.title`, `metadata.description`) keep their length limits: about 60 and 160 characters.
- Numbers and units in German format where they are prose (`1,5 Mio.`, `24 Std.`).
- Keep the file valid JSON (escape `"` as `\"`).

## Import

For each file, rebuilds the document from the **current** English original with the translated strings, and:

- writes `drafts.<id>` with `language: '<lang>'`. The id comes from the document's `translation.metadata`, so re-running updates the same draft; a new translation gets a new id. The German site settings are always `site-de` and have no metadata ([ADR 0002](../../docs/adr/0002-translated-content-model.md)).
- creates or updates `translation.metadata` exactly as the Studio's Translations menu does (see `metadata.ts` for the plugin source it follows).
- points references to categories and testimonials at their translation where one exists. Links to pages and posts stay English: they resolve to the same slug under the language prefix.

Re-running replaces the draft, including any proofreading edits made in it, so only re-import a document before proofreading starts. Warnings list strings left in English (no key in the file) and keys the English document no longer has (it changed since the export; re-export and translate those strings again).

Always `--dry-run` first. It prints each draft and metadata change without writing.
