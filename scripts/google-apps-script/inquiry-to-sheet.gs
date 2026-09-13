/**
 * Google Apps Script Web App: receives Contact-page inquiries from
 * https://myanmarnativegems.github.io/#/contact and appends each one as a
 * row in this spreadsheet's first sheet:
 * https://docs.google.com/spreadsheets/d/1PZNkqc-qDf2PrdA5sHi-aRXEpGlmrkBRvqvUPccDn2s/edit
 *
 * Column order matches the sheet's existing headers exactly:
 * Date | Name | Email | Phone | Gemstone | Message
 * Date is stamped server-side (the moment the script runs), not sent by
 * the browser, so it isn't affected by a visitor's local clock.
 *
 * This file is not deployed automatically — Apps Script has no public API
 * for that. One-time setup, done once by whoever can edit the Sheet:
 *
 *   1. Go to https://script.google.com -> New project. (If your Sheet's
 *      Extensions menu already shows "Apps Script", that also works and
 *      skips step 3 below — this script targets the Sheet by its ID
 *      either way, so it behaves identically as a standalone project or
 *      one opened from the Sheet's Extensions menu.)
 *   2. Delete the placeholder code in Code.gs and paste this file's
 *      contents in its place. Give the project a name (top left) if
 *      prompted, e.g. "Myanmar Native Gems inquiries".
 *   3. Only if you started from script.google.com (not from the Sheet's
 *      Extensions menu): the account running this script still needs
 *      edit access to the Sheet. If it's not already the owner, open the
 *      Sheet -> Share -> add that account as an Editor first.
 *   4. Deploy -> New deployment -> gear icon -> Web app.
 *        Execute as:      Me
 *        Who has access:  Anyone
 *      Click Deploy, authorize when prompted (click through the
 *      "Google hasn't verified this app" warning -> Advanced -> Go to
 *      [project name] -> Allow; this is expected for a script you wrote
 *      yourself), then copy the "Web app URL" (it ends in /exec).
 *   5. Set that URL as VITE_INQUIRY_ENDPOINT_URL:
 *        - locally, in .env.local (see env.example)
 *        - in production, as a repository variable of the same name
 *          (Settings -> Secrets and variables -> Actions -> Variables),
 *          read by .github/workflows/deploy.yml
 *
 * If you edit this script later: Deploy -> Manage deployments -> pencil
 * icon -> "New version" -> Deploy. The /exec URL stays the same, so
 * nothing needs to change on the site's side.
 */

const SPREADSHEET_ID = '1PZNkqc-qDf2PrdA5sHi-aRXEpGlmrkBRvqvUPccDn2s'
const HEADERS = ['Date', 'Name', 'Email', 'Phone', 'Gemstone', 'Message']

function doPost(e) {
  try {
    const params = (e && e.parameter) || {}
    if (!params.name || !params.email || !params.message) {
      return jsonResponse({ ok: false, error: 'Missing required field.' })
    }

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID)
    getInquirySheet(spreadsheet).appendRow([
      todayDate(spreadsheet),
      params.name,
      params.email,
      params.phone || '',
      params.gemstone || '',
      params.message,
    ])

    return jsonResponse({ ok: true })
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error) })
  }
}

/** Visiting the /exec URL directly (a GET request) confirms it's live. */
function doGet() {
  return jsonResponse({ ok: true, message: 'Inquiry endpoint is live.' })
}

/**
 * Targets the spreadsheet's first sheet, where the existing
 * Date/Name/Email/Phone/Gemstone/Message columns already live. Adds the
 * header row only if the sheet is completely empty (a fresh copy of it).
 */
function getInquirySheet(spreadsheet) {
  const sheet = spreadsheet.getSheets()[0]
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS)
    sheet.setFrozenRows(1)
  }
  return sheet
}

/**
 * Today's date, in the spreadsheet's own timezone, as a plain date (no
 * time component) so the "Date" column reads as a date, not a timestamp.
 */
function todayDate(spreadsheet) {
  const formatted = Utilities.formatDate(
    new Date(),
    spreadsheet.getSpreadsheetTimeZone(),
    'yyyy-MM-dd',
  )
  return new Date(formatted)
}

function jsonResponse(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON,
  )
}
