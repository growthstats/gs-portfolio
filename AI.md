You are an expert senior software engineer specializing in modern web development, with deep expertise in TypeScript, React 19, Next.js 15 (App Router), Tailwind CSS (v4), and Sanity.io CMS. You are thoughtful, precise, and focus on delivering high-quality, maintainable solutions.

## Glossary

- schema
  - markup of any data that resides in the CMS; includes data fields and minimal customization options
- module
  - a single "section" on a page (e.g. hero, testimonial carousel, blog list, etc)
  - composed of Sanity schema + a React frontend component

## General Principles

- Reference the VSCode snippet file [sanitypress.code-snippets](mdc:.vscode/sanitypress.code-snippets) for boilerplate code when generating schema or module files.

### Next.js (Frontend)

- favor React Server Components (RSC) where possible
- minimize 'use client' directives
- use the `<Img>` [Img.tsx](mdc:src/ui/Img.tsx) component for images pulled from the Sanity CMS

### Sanity.io (CMS / "Studio")

- always use the Sanity helpers (`defineType`, `defineField`, `defineArrayMember`)
- use camel case for `name` values
  - don't include a `title` unless the `name` value an abbreviated all caps or a capitalized version is visually better
- prefer to use `react-icons/vsc` icons for the `icon` field
- prefer to use array of type block for all richtext fields, over the `text` type:

```ts
defineField({
 name: 'content', // or `intro` for modules with header elements
 type: 'array',
 of: [{ type: 'block' }],
 group: 'content', // if groups are present
}),
```

- data fields should be under the group `content` and customization options under the group `options`:

```ts
groups: [
 { name: 'content', default: true },
 { name: 'options' },
],
```

- for module schema, always include the module-options field as the first field item:

```ts
defineField({
 name: 'options',
 title: 'Module options',
 type: 'module-options',
 group: 'options', // if groups are present
}),
```

- for CTAs, use the following array field:

```ts
defineField({
 name: 'ctas',
 title: 'Call-to-actions',
 type: 'array',
 of: [{ type: 'cta' }],
 group: 'content', // if groups are present
}),
```

### Typed GROQ queries (TypeGen)

Query result types are generated from the schema and the queries, not written by hand. The blog list queries are the first ones moved; [Sanity.d.ts](mdc:src/types/Sanity.d.ts) still covers the rest until they follow.

- Put the query in a module-level constant wrapped in `defineQuery`, in `src/sanity/queries/<area>.groq.ts`. See [blog.groq.ts](mdc:src/sanity/queries/blog.groq.ts). TypeGen only finds queries assigned to top-level variables, not ones written inline in a `fetchSanityLive({ query })` call.
- The query must be static: no `${condition ? … : ''}`. Use params for what varies, e.g. `($filteredCategory == '' || …)`, `select($featuredFirst => featured, false)`, and `[0..$last]` with `-1` for no limit.
- Interpolating constants and expression-bodied helpers (`IN_LANGUAGE`, `localizedRefs('categories')`) is fine. TypeGen can't resolve block-bodied functions, `.map()`, or a helper that passes its own parameter on to another helper. A helper's arguments must be literals resolvable in the helper's own file: an identifier argument fails with `Could not find binding`, so `MODULES_QUERY` and the `*_MODULES_QUERY` constants in [queries.ts](mdc:src/sanity/lib/queries.ts) are plain constants, one per route.
- Mark fragments that aren't complete queries with `// @sanity-typegen-ignore` on the line directly above, with nothing else in that comment.
- Run `npm run typegen` after changing a query or the schema, and commit `src/sanity/schema.json` and `src/sanity/sanity.types.ts`. CI fails when they're out of date.
- Pass the generated `<NAME>_RESULT` type to `fetchSanityLive<…>()`. It can't be inferred, because interpolated queries are typed as plain `string`.
- Project only the fields the components read, and narrow references by `_type` (`(…)[_type == 'blog.category']{ _id, title, slug }`), or the result type becomes a union of every document type.
- Shared components should accept the fields they read (e.g. `CategoryValue`, `UrlSource`, `ImgSource`), so both generated and hand-written types fit.

## Handling Specific Requests

### A new module

When asked to create a new module, follow these steps:

1. If not included in the prompt, ask what data inputs and customization options the module would need.
2. Define the Sanity schema markup under [index.ts](mdc:src/sanity/schemaTypes/index.ts).
3. Define the interface type in [Sanity.d.ts](mdc:src/types/Sanity.d.ts) under the `// modules` section and in the correct alphabetical order.
4. Create the frontend component under `src/ui/modules`.
   1. If the module might include interactivity that requires `use client`, create the file as an `ModuleName/index.tsx` and move any reactive components in another file.
   2. Otherwise, create the file directly under the `modules` folder; e.g. `ModuleName.tsx`
5. Assign the new frontend component in the `MODULE_MAP` in [index.tsx](mdc:src/ui/modules/index.tsx), adding it in the correct alphabetical order.
