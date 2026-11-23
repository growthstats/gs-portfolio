# Contact Form

`ContactForm` (`src/ui/modules/contactPlaceholderForm.tsx`) posts to `POST /api/contact`, which:

1. Validates the payload with the schema from `createContactFormSchema` (`src/lib/contactForm.ts`), built with default-language messages; the form builds the same schema with the page language's messages.
2. Drops bot submissions that fill the hidden `fax` honeypot field (responds `200` so bots don't adapt).
3. Posts the lead to an Apps Script web app (`CONTACT_APPS_SCRIPT_URL`) bound to the leads Google Sheet. The script:
   - **logs** the lead as a new row, and
   - **emails** the team with `MailApp`, from the Workspace account that deployed the script, with `Reply-To` set to the visitor's address.
4. If the script did not confirm the email (`emailed: true`), **falls back** to emailing the team through [Resend](https://resend.com).
5. Responds `200` if the lead was logged or emailed by either channel, or `502` if nothing captured it, so the visitor sees an error and can retry. Every failure is logged to the function logs.

### Why the email comes from Apps Script

Until 2026-11, Resend sent every notification from `website@send.growthstats.io`. Resend reported each one as `delivered`, but Gmail filed them in spam: the sending domain was new, sent a handful of mails a month, sent from Amazon SES servers while claiming our own domain, and several leads were sales pitches. Mail sent by Apps Script comes from a Google Workspace account on `growthstats.io` to a Workspace inbox, which Gmail trusts. Resend stays as the fallback so a lead is still emailed when the script fails or hits its daily quota (1,500 recipients a day on Workspace).

Leads are deliberately kept out of Sanity: everyone with Studio access could read them, and the free plan has no private datasets or per-document permissions. The sheet is shared only with the people who should see leads.

## Environment variables

Set for **Production** and **Preview** in Vercel, and in `.env` for local development:

| Variable                  | Example                                             | Notes                                                       |
| ------------------------- | --------------------------------------------------- | ----------------------------------------------------------- |
| `RESEND_API_KEY`          | `re_…`                                              | Sending-only key scoped to the `send.growthstats.io` domain |
| `CONTACT_FROM_EMAIL`      | `GrowthStats Website <website@send.growthstats.io>` | Must be on a domain verified in Resend                      |
| `CONTACT_TO_EMAIL`        | `info@growthstats.io`                               | Fallback recipients; comma-separate for several             |
| `CONTACT_APPS_SCRIPT_URL` | `https://script.google.com/macros/s/…/exec`         | Web app URL of the sheet's Apps Script deployment           |

Use a separate Resend key (or a test recipient) and a copy of the sheet locally, so test submissions don't reach the team inbox or the real lead sheet.

## Google Sheet (Apps Script)

The script logs the lead and sends the notification email. Recipients live in a script property, not in the request: the web app is open to anyone with its URL, so taking recipients from the request would let anyone send mail through it.

1. In the "GS Website Leads" sheet (`Leads` tab, Apps Script project of the same name), set row 1 headers: `timestamp`, `name`, `email`, `phone`, `message`, `sourcePath`, `website`.
2. `Extensions` → `Apps Script` → Project Settings → **Script Properties**: add `NOTIFY_TO` = `info@growthstats.io` (comma-separate for several). Leave it unset in test copies of the sheet so they don't email the team.
3. Replace the code with:

   ```javascript
   const SHEET_NAME = 'Leads'
   const SENDER_NAME = 'GrowthStats Website'

   function doPost(e) {
     let data
     try {
       data = JSON.parse(e.postData.contents || '{}')
     } catch (error) {
       return json({ ok: false, emailed: false, error: 'Invalid JSON: ' + error })
     }

     const result = { ok: false, emailed: false }

     // Log and email independently, so one failing never stops the other.
     try {
       SpreadsheetApp.getActiveSpreadsheet()
         .getSheetByName(SHEET_NAME)
         .appendRow([
           new Date().toISOString(),
           asText(data.name),
           asText(data.email),
           asText(data.phone),
           asText(data.message),
           asText(data.sourcePath),
           asText(data.website),
         ])
       result.ok = true
     } catch (error) {
       result.logError = String(error)
     }

     try {
       notifyTeam(data)
       result.emailed = true
     } catch (error) {
       result.emailError = String(error)
     }

     return json(result)
   }

   function notifyTeam(data) {
     const to = PropertiesService.getScriptProperties().getProperty('NOTIFY_TO')
     if (!to) throw new Error('NOTIFY_TO script property is not set')

     const rows = [
       ['Name', data.name],
       ['Email', data.email],
       ['Phone', data.phone],
       ['Website', data.website],
       ['Submitted from', data.sourcePath],
     ].filter(([, value]) => value)

     MailApp.sendEmail({
       to: to,
       replyTo: String(data.email || ''),
       name: SENDER_NAME,
       subject: '[Website lead] ' + String(data.name || 'New enquiry'),
       body:
         rows.map(([label, value]) => label + ': ' + value).join('\n') +
         '\n\n' +
         String(data.message || ''),
       htmlBody:
         rows
           .map(
             ([label, value]) => '<p><strong>' + label + ':</strong> ' + escapeHtml(value) + '</p>',
           )
           .join('') +
         '<p><strong>Message:</strong><br>' +
         escapeHtml(data.message).replace(/\n/g, '<br>') +
         '</p>',
     })
   }

   // Sheets treats values starting with = + - @ as formulas: phone numbers like +91… show #ERROR!,
   // and visitor input like =IMPORTXML(…) would run. A leading apostrophe stores them as plain text.
   function asText(value) {
     const text = String(value || '')
     return /^[=+\-@]/.test(text) ? "'" + text : text
   }

   function escapeHtml(value) {
     return String(value || '')
       .replace(/&/g, '&amp;')
       .replace(/</g, '&lt;')
       .replace(/>/g, '&gt;')
       .replace(/"/g, '&quot;')
       .replace(/'/g, '&#39;')
   }

   function json(body) {
     return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
       ContentService.MimeType.JSON,
     )
   }
   ```

4. Run `notifyTeam` once from the editor with test data (or deploy) and approve the "Send email as you" permission.
5. Deploy as a web app — Execute as: **Me**, Who has access: **Anyone**. The email is sent from the account shown under "Execute as" (currently `atharva.m@growthstats.io`).
   To update an existing deployment without changing its URL, use `Deploy` → `Manage deployments` → edit → **Version: New version**.

`asText` matters: without it, phone numbers like `+91 …` were stored as formulas (`#ERROR!`), and form input starting with `=` would be evaluated in the sheet.

Apps Script answers HTTP `200` even when the script fails, so the route trusts only the `ok` (logged) and `emailed` flags in the body. An older script that answers `{ "ok": true }` without `emailed` still works: the route then emails through Resend.

## Resend domain setup (fallback)

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

## Keep lead mail out of spam

On top of sending from Workspace, a Workspace admin should:

- Admin console → Apps → Google Workspace → Gmail → **Spam, phishing and malware** → **Approved senders**: add `send.growthstats.io` with "Bypass spam filters" on and "Do not bypass if authentication is not present" on, so the Resend fallback reaches the inbox too.
- If `info@` is a Google Group: Groups → info → Settings → **Spam message handling** → "Post suspicious messages to the group", and check its pending queue.
- In each recipient's Gmail, a filter on `subject:"[Website lead]"` → **Never send it to Spam**.

## Test

1. Submit the form on `/contact`.
2. Confirm the email lands in the **Inbox** (not Spam) of `NOTIFY_TO`, comes from the Apps Script account, and that replying goes to the visitor.
3. Confirm a new row in the sheet, including `sourcePath` and `website`.
4. Confirm only one email arrived, and that the Resend dashboard (Emails) shows **no** new send. A Resend send means the script did not email; check the function logs for `Contact: Apps Script responded`.
