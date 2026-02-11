# Google Workspace Contact Form Setup

This project now submits `ContactForm` to `POST /api/contact`, and that API forwards the payload to a Google Apps Script webhook.

## 1) Create a Google Sheet

1. Create a sheet (example name: `Website Leads`).
2. Add headers in row 1:
   - `timestamp`
   - `name`
   - `email`
   - `phone`
   - `message`

## 2) Create Apps Script Web App

1. Open the sheet.
2. `Extensions` -> `Apps Script`.
3. Paste this script:

```javascript
const SHEET_NAME = 'Sheet1'
const NOTIFY_EMAIL = 'leads@yourdomain.com' // group or alias

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}')
    const { name = '', email = '', phone = '', message = '' } = data

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
    sheet.appendRow([new Date().toISOString(), name, email, phone, message])

    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: 'New Contact Form Submission',
      htmlBody:
        '<p><strong>Name:</strong> ' +
        escapeHtml(name) +
        '</p>' +
        '<p><strong>Email:</strong> ' +
        escapeHtml(email) +
        '</p>' +
        '<p><strong>Phone:</strong> ' +
        escapeHtml(phone) +
        '</p>' +
        '<p><strong>Message:</strong><br>' +
        escapeHtml(message).replace(/\n/g, '<br>') +
        '</p>',
    })

    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
      ContentService.MimeType.JSON,
    )
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(error) }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
```

4. `Deploy` -> `New deployment` -> type `Web app`.
5. Execute as: `Me`.
6. Who has access: `Anyone`.
7. Copy the Web App URL.

## 3) Configure Vercel

Set environment variable:

- `CONTACT_APPS_SCRIPT_URL=<your-web-app-url>`

Add it for both:

- `Preview`
- `Production`

Then redeploy.

## 4) Test

1. Submit the contact form from your site.
2. Confirm a new row is added to the sheet.
3. Confirm your alias/group mailbox receives a notification.
