import { siteConfig } from '../config/site'

export interface InquiryDraft {
  name: string
  email: string
  phone: string
  gemLabel: string
  message: string
}

export interface InquiryResult {
  /** True only when a real submission backend has accepted the inquiry. */
  delivered: boolean
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

/**
 * Submission seam for the inquiry form.
 *
 * There is no backend yet, so this never claims delivery. It returns a
 * prefilled mailto link and the UI is honest about handing off to the
 * visitor's own email app. When a real service is connected (Formspree,
 * Google Apps Script, a custom API), implement the network call here and
 * return { delivered: true } on success; the form UI already handles both.
 */
export async function submitInquiry(
  draft: InquiryDraft,
): Promise<InquiryResult> {
  return { delivered: false, mailtoUrl: buildInquiryMailto(draft) }
}
