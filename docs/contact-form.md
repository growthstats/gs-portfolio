# Contact Form

`ContactForm` (`src/ui/modules/contactPlaceholderForm.tsx`) posts to `POST /api/contact`, which:

1. Validates the payload with `contactFormSchema` (`src/lib/contactForm.ts`).
2. Drops bot submissions that fill the hidden `website` honeypot field (responds `200` so bots don't adapt).
3. Emails the team through [Resend](https://resend.com), with `Reply-To` set to the visitor's address.
4. Responds `200` once Resend accepts the email, or `502` if the send fails so the visitor sees an error and can retry.

Leads are **not** stored anywhere else — the notification email is the only record. They are deliberately kept out of Sanity: everyone with Studio access could read them, and the free plan has no private datasets or per-document permissions. Resend keeps a copy of each sent email in its dashboard for the plan's retention period.

## Environment variables

Set for **Production** and **Preview** in Vercel, and in `.env` for local development:

| Variable             | Example                                             | Notes                                                       |
| -------------------- | --------------------------------------------------- | ----------------------------------------------------------- |
| `RESEND_API_KEY`     | `re_…`                                              | Sending-only key scoped to the `send.growthstats.io` domain |
| `CONTACT_FROM_EMAIL` | `GrowthStats Website <website@send.growthstats.io>` | Must be on a domain verified in Resend                      |
| `CONTACT_TO_EMAIL`   | `info@growthstats.io`                               | Comma-separate for multiple recipients                      |

Use a separate Resend key (or a test recipient) locally so test submissions don't reach the team inbox.

## Resend domain setup

Send from the `send.growthstats.io` subdomain so Resend's SPF/DKIM stays separate from Google Workspace mail on the root domain.

1. Resend → Domains → Add `send.growthstats.io` (region `us-east-1`, open/click tracking off).
2. Add the DNS records Resend shows at the DNS host (Hostinger). Names are relative to `growthstats.io`; `send.send` is Resend's return-path subdomain under the sending domain:

   | Type  | Name                     | Value                                                 |
   | ----- | ------------------------ | ----------------------------------------------------- |
   | TXT   | `resend._domainkey.send` | DKIM public key from the Resend dashboard             |
   | MX    | `send.send`              | `feedback-smtp.us-east-1.amazonses.com` (priority 10) |
   | TXT   | `send.send`              | `v=spf1 include:amazonses.com ~all`                   |
   | CNAME | `rsend.send`             | `send.forge.rmta.net`                                 |

3. Wait for Resend to show the domain as verified, then create a sending-only API key for it.

## Root-domain email health (Google Workspace)

Separate from Resend, but it affects whether `info@growthstats.io` mail is delivered and trusted:

- SPF on `growthstats.io` must include Google: `v=spf1 include:_spf.google.com ~all`.
- Enable DKIM in Admin console → Apps → Google Workspace → Gmail → Authenticate email, and publish the `google._domainkey` record.
- `info@growthstats.io` must exist (user, alias or Google Group). A group needs "Who can post" set to **Anyone on the web** to accept external mail.

## Test

1. Submit the form on `/contact`.
2. Confirm the email arrives at `CONTACT_TO_EMAIL`, and that replying goes to the visitor.
3. Check the send in the Resend dashboard (Emails) shows `delivered`.
