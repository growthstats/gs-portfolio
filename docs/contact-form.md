# Contact Form

`ContactForm` (`src/ui/modules/contactPlaceholderForm.tsx`) posts to `POST /api/contact`, which:

1. Validates the payload with `contactFormSchema` (`src/lib/contactForm.ts`).
2. Drops bot submissions that fill the hidden `website` honeypot field (responds `200` so bots don't adapt).
3. In parallel:
   - **Stores** the lead in Sanity as a `contact.submission` document (Studio → _Contact submissions_).
   - **Emails** the team through [Resend](https://resend.com), with `Reply-To` set to the visitor's address.
4. Responds `200` if at least one of the two succeeded, `502` if both failed. The stored document's `notified` field records whether the email went out.

## Lead privacy

The production dataset is **public**. Leads are created with `_id: "contact-submission.<uuid>"` — Sanity only serves documents whose ID contains a `.` to authenticated requests, so leads are not readable through the public API. Never create these documents with a plain (dot-less) ID.

## Environment variables

Set for **Production** and **Preview** in Vercel, and in `.env` for local development:

| Variable                 | Example                                             | Notes                                                       |
| ------------------------ | --------------------------------------------------- | ----------------------------------------------------------- |
| `RESEND_API_KEY`         | `re_…`                                              | Sending-only key scoped to the `send.growthstats.io` domain |
| `CONTACT_FROM_EMAIL`     | `GrowthStats Website <website@send.growthstats.io>` | Must be on a domain verified in Resend                      |
| `CONTACT_TO_EMAIL`       | `info@growthstats.io`                               | Comma-separate for multiple recipients                      |
| `SANITY_API_WRITE_TOKEN` | (existing)                                          | Editor token; used to create `contact.submission` documents |

Use a separate Resend key (or a test recipient) locally so test submissions don't reach the team inbox.

## Resend domain setup

Send from the `send.growthstats.io` subdomain so Resend's SPF/DKIM stays separate from Google Workspace mail on the root domain.

1. Resend → Domains → Add `send.growthstats.io`.
2. Add the DNS records Resend shows (MX + TXT for SPF on `send`, TXT for DKIM on `resend._domainkey.send`) at the DNS host.
3. Wait for Resend to show the domain as verified, then create a sending-only API key for it.

## Root-domain email health (Google Workspace)

Separate from Resend, but it affects whether `info@growthstats.io` mail is delivered and trusted:

- SPF on `growthstats.io` must include Google: `v=spf1 include:_spf.google.com ~all`.
- Enable DKIM in Admin console → Apps → Google Workspace → Gmail → Authenticate email, and publish the `google._domainkey` record.
- `info@growthstats.io` must exist (user, alias or Google Group). A group needs "Who can post" set to **Anyone on the web** to accept external mail.

## Test

1. Submit the form on `/contact`.
2. Confirm the email arrives at `CONTACT_TO_EMAIL`, and that replying goes to the visitor.
3. Confirm a new entry under Studio → _Contact submissions_ with **Email notification sent** checked.
4. Confirm the lead is not publicly readable:
   `curl "https://<projectId>.api.sanity.io/v2024-12-01/data/query/production?query=*[_type=='contact.submission']"` returns `[]`.
