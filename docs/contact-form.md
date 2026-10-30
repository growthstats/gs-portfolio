# Contact Form

`ContactForm` (`src/ui/modules/contactPlaceholderForm.tsx`) posts to `POST /api/contact`, which:

1. Validates the payload with `contactFormSchema` (`src/lib/contactForm.ts`).
2. Drops bot submissions that fill the hidden `fax` honeypot field (responds `200` so bots don't adapt).
3. In parallel:
   - **Logs** the lead to the Google Sheet through an Apps Script web app (`CONTACT_APPS_SCRIPT_URL`).
   - **Emails** the team through [Resend](https://resend.com), with `Reply-To` set to the visitor's address.
4. Responds `200` if at least one of the two captured the lead, or `502` if both failed so the visitor sees an error and can retry. Failures of either channel are logged to the function logs.

Leads are deliberately kept out of Sanity: everyone with Studio access could read them, and the free plan has no private datasets or per-document permissions. The sheet is shared only with the people who should see leads.

## Environment variables

Set for **Production** and **Preview** in Vercel, and in `.env` for local development:

| Variable                  | Example                                             | Notes                                                       |
| ------------------------- | --------------------------------------------------- | ----------------------------------------------------------- |
| `RESEND_API_KEY`          | `re_…`                                              | Sending-only key scoped to the `send.growthstats.io` domain |
| `CONTACT_FROM_EMAIL`      | `GrowthStats Website <website@send.growthstats.io>` | Must be on a domain verified in Resend                      |
| `CONTACT_TO_EMAIL`        | `info@growthstats.io`                               | Comma-separate for multiple recipients                      |
| `CONTACT_APPS_SCRIPT_URL` | `https://script.google.com/macros/s/…/exec`         | Web app URL of the sheet's Apps Script deployment           |

Use a separate Resend key (or a test recipient) and a copy of the sheet locally, so test submissions don't reach the team inbox or the real lead sheet.

## Google Sheet (Apps Script)

The sheet only stores leads; email goes through Resend. The script must **not** send mail itself, or every lead is emailed twice.

1. In the "GS Website Leads" sheet (`Leads` tab, Apps Script project of the same name), set row 1 headers: `timestamp`, `name`, `email`, `phone`, `message`, `sourcePath`, `website`.
2. `Extensions` → `Apps Script`, and replace the code with:

   ```javascript
   const SHEET_NAME = 'Leads'

   function doPost(e) {
     try {
       const data = JSON.parse(e.postData.contents || '{}')
       const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
       sheet.appendRow([
         new Date().toISOString(),
         asText(data.name),
         asText(data.email),
         asText(data.phone),
         asText(data.message),
         asText(data.sourcePath),
         asText(data.website),
       ])
       return json({ ok: true })
     } catch (error) {
       return json({ ok: false, error: String(error) })
     }
   }

   // Sheets treats values starting with = + - @ as formulas: phone numbers like +91… show #ERROR!,
   // and visitor input like =IMPORTXML(…) would run. A leading apostrophe stores them as plain text.
   function asText(value) {
     const text = String(value || '')
     return /^[=+\-@]/.test(text) ? "'" + text : text
   }

   function json(body) {
     return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
       ContentService.MimeType.JSON,
     )
   }
   ```

3. Deploy as a web app — Execute as: **Me**, Who has access: **Anyone**.
   To update an existing deployment without changing its URL, use `Deploy` → `Manage deployments` → edit → **Version: New version**.

`asText` matters: without it, phone numbers like `+91 …` were stored as formulas (`#ERROR!`), and form input starting with `=` would be evaluated in the sheet.

Apps Script answers HTTP `200` even when the script fails, so the route treats the call as successful only when the body is `{ "ok": true }`.

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
4. Confirm a new row in the sheet, including `sourcePath` and `website`, and that no second email arrived from Apps Script.
