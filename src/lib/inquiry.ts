import { siteConfig } from '../config/site'

export interface InquiryDraft {
  name: string
  email: string
  phone: string
  gemLabel: string
  message: string
}

export interface InquiryResult {
  /** True only when the submission backend actually accepted the inquiry. */
  delivered: boolean
  /**
   * True once a real network submission was attempted (endpoint configured).
   * Lets the UI distinguish "not set up yet" from "we tried and it failed."
   */
  attempted: boolean
  /** Prefilled mailto link so the visitor can send via their own email app. */
  mailtoUrl: string
}

export function buildInquiryMailto(draft: InquiryDraft): string {
  const subject = draft.gemLabel
    ? `Gemstone inquiry: ${draft.gemLabel}`
    : 'Gemstone inquiry'
  const lines = [
    `Name: ${draft.name}`,
    `Email: ${draft.email}`,
    draft.phone ? `Phone: ${draft.phone}` : '',
    draft.gemLabel ? `Gemstone: ${draft.gemLabel}` : '',
    '',
    draft.message,
  ].filter((line, index) => line !== '' || index >= 4)

  const params = new URLSearchParams({
    subject,
    body: lines.join('\n'),
  })
  return `mailto:${siteConfig.email}?${params.toString().replace(/\+/g, '%20')}`
}

function devWarn(...args: unknown[]): void {
  if (import.meta.env?.DEV) {
    console.warn('[Myanmar Native Gems inquiry]', ...args)
  }
}

/**
 * Google Apps Script Web App URL that appends inquiries to a Google Sheet.
 * See scripts/google-apps-script/inquiry-to-sheet.gs for the script to
 * deploy, and README.md's "Inquiry form" section for setup. Unset in dev
 * unless .env.local defines it (copy env.example); unset in production
 * until the VITE_INQUIRY_ENDPOINT_URL repository variable is set.
 */
const ENDPOINT_URL = import.meta.env.VITE_INQUIRY_ENDPOINT_URL as
  | string
  | undefined

/**
 * Submission seam for the inquiry form.
 *
 * Without an endpoint configured, this never claims delivery: it returns a
 * prefilled mailto link and the UI is honest about handing off to the
 * visitor's own email app. Once VITE_INQUIRY_ENDPOINT_URL points at a
 * deployed Apps Script Web App, submissions POST there and land as a new
 * row in the Sheet; the UI already handles the not-configured, delivered,
 * and failed-attempt cases.
 *
 * The body is sent as application/x-www-form-urlencoded (not JSON) so the
 * browser treats it as a CORS-simple request. A JSON body would trigger a
 * preflight OPTIONS request, which Apps Script Web Apps do not answer.
 */
export async function submitInquiry(
  draft: InquiryDraft,
): Promise<InquiryResult> {
  const mailtoUrl = buildInquiryMailto(draft)

  if (!ENDPOINT_URL) {
    return { delivered: false, attempted: false, mailtoUrl }
  }

  try {
    const response = await fetch(ENDPOINT_URL, {
      method: 'POST',
      body: new URLSearchParams({
        name: draft.name,
        email: draft.email,
        phone: draft.phone,
        gemstone: draft.gemLabel,
        message: draft.message,
      }),
    })
    if (!response.ok) {
      devWarn(`Inquiry endpoint responded with status ${response.status}.`)
      return { delivered: false, attempted: true, mailtoUrl }
    }
    const data: unknown = await response.json().catch(() => null)
    const delivered =
      Boolean(data) &&
      typeof data === 'object' &&
      (data as { ok?: unknown }).ok === true
    if (!delivered) devWarn('Inquiry endpoint did not confirm delivery:', data)
    return { delivered, attempted: true, mailtoUrl }
  } catch (error) {
    devWarn('Inquiry submission failed:', error)
    return { delivered: false, attempted: true, mailtoUrl }
  }
}
