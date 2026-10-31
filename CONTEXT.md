# Growth Stats website — glossary

The Growth Stats marketing site: Next.js frontend, Sanity CMS (Studio at `/admin`), deployed on Vercel.

## Languages

- **Language**: a site language, identified by its code (`en`, `de`). English is the **default language**.
- **Supported language**: listed in `src/lib/i18n.ts`, so the code can render it.
- **Enabled language**: a supported language that is live, set by `NEXT_PUBLIC_ENABLED_LANGUAGES`. A supported but disabled language 404s.
- **Prefix**: the first URL segment for a non-default language (`/de/...`). English has no prefix.
- **Translation**: a separate Sanity document in another language, linked to its English original by `translation.metadata`. Not a field on the English document.
- **Fallback**: rendering the English document under a prefixed URL when no published translation exists. A fallback page canonicalises to the English URL.
- **UI strings**: text that lives in code rather than Sanity, held in `src/i18n/dictionaries/<lang>.ts`. Avoid calling these "translations", which means Sanity documents.
- **Draft translation**: an AI-made translation saved as a Sanity draft, not yet proofread or published.

## Contact form

- **Lead**: one contact form submission. It is emailed to info@ via Resend and logged as a row in the Leads Google Sheet.
- **Honeypot**: the hidden `fax` field. A submission that fills it is dropped silently.
