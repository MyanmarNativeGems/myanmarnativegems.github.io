import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { Button } from '../components/common/Button'
import { Container } from '../components/common/Container'
import { siteConfig } from '../config/site'
import { useGems } from '../hooks/useGems'
import {
  submitInquiry,
  type InquiryDraft,
  type InquiryResult,
} from '../lib/inquiry'
import { formatCarat } from '../lib/utils'
import type { Gem } from '../types/gem'

interface FormValues {
  name: string
  email: string
  phone: string
  gemNo: string
  message: string
}

type FormErrors = Partial<Record<'name' | 'email' | 'message', string>>

function gemOptionLabel(gem: Gem): string {
  const carat = gem.carat !== undefined ? ` (${formatCarat(gem.carat)})` : ''
  return `${gem.gemType} No. ${gem.no}${carat}`
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {}
  if (!values.name.trim()) errors.name = 'Please enter your name.'
  if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!values.message.trim()) errors.message = 'Please enter a message.'
  return errors
}

const inputClasses =
  'w-full border border-line bg-ivory px-4 py-3 text-sm placeholder:text-ink-soft/70 focus:border-ink focus:outline-none aria-[invalid=true]:border-ruby'

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="mt-2 text-sm text-ruby">
          {error}
        </p>
      )}
    </div>
  )
}

export function ContactPage() {
  const [searchParams] = useSearchParams()
  const { gems } = useGems()
  const preselectedNo = searchParams.get('gem') ?? ''

  const [values, setValues] = useState<FormValues>({
    name: '',
    email: '',
    phone: '',
    gemNo: preselectedNo,
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [result, setResult] = useState<InquiryResult | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedGem = gems.find((gem) => gem.no === values.gemNo)
  const preselectedGem = gems.find((gem) => gem.no === preselectedNo)

  const setValue = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setResult(null)
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const draft: InquiryDraft = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      gemLabel: selectedGem
        ? gemOptionLabel(selectedGem)
        : values.gemNo
          ? `Stone No. ${values.gemNo}`
          : '',
      message: values.message.trim(),
    }
    setIsSubmitting(true)
    try {
      setResult(await submitInquiry(draft))
    } finally {
      setIsSubmitting(false)
    }
  }

  const startOver = () => {
    setValues({ name: '', email: '', phone: '', gemNo: '', message: '' })
    setErrors({})
    setResult(null)
  }

  return (
    <div className="py-14 md:py-20">
      <Container className="grid gap-12 md:grid-cols-12 md:gap-16">
        <header className="md:col-span-5">
          <h1 className="font-serif text-4xl font-medium md:text-5xl">
            Gemstone Inquiry
          </h1>
          <p className="mt-4 leading-relaxed text-ink-soft">
            Tell us which stone interests you, or describe what you are
            looking for. We answer every inquiry personally.
          </p>
          {preselectedGem && (
            <p className="mt-6 border-l-2 border-gold pl-4 text-sm text-ink-soft">
              Regarding: {gemOptionLabel(preselectedGem)}
            </p>
          )}
          <p className="mt-6 text-sm text-ink-soft">
            Prefer email? Write to us directly at{' '}
            <a
              href={`mailto:${siteConfig.email}`}
              className="underline decoration-gold underline-offset-4 transition-colors duration-200 hover:text-ruby"
            >
              {siteConfig.email}
            </a>
          </p>
        </header>

        <form
          className="space-y-6 md:col-span-7"
          onSubmit={(event) => void onSubmit(event)}
          noValidate
        >
          <Field label="Name" htmlFor="inquiry-name" error={errors.name}>
            <input
              id="inquiry-name"
              type="text"
              autoComplete="name"
              value={values.name}
              onChange={(event) => setValue('name', event.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'inquiry-name-error' : undefined}
              className={inputClasses}
            />
          </Field>

          <Field label="Email" htmlFor="inquiry-email" error={errors.email}>
            <input
              id="inquiry-email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(event) => setValue('email', event.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={
                errors.email ? 'inquiry-email-error' : undefined
              }
              className={inputClasses}
            />
          </Field>

          <Field label="Phone (optional)" htmlFor="inquiry-phone">
            <input
              id="inquiry-phone"
              type="tel"
              autoComplete="tel"
              value={values.phone}
              onChange={(event) => setValue('phone', event.target.value)}
              className={inputClasses}
            />
          </Field>

          <Field label="Gemstone" htmlFor="inquiry-gem">
            <select
              id="inquiry-gem"
              value={values.gemNo}
              onChange={(event) => setValue('gemNo', event.target.value)}
              className={inputClasses}
            >
              <option value="">General inquiry</option>
              {preselectedNo && !preselectedGem && (
                <option value={preselectedNo}>
                  Stone No. {preselectedNo}
                </option>
              )}
              {gems.map((gem) => (
                <option key={gem.no} value={gem.no}>
                  {gemOptionLabel(gem)}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Message"
            htmlFor="inquiry-message"
            error={errors.message}
          >
            <textarea
              id="inquiry-message"
              rows={6}
              value={values.message}
              onChange={(event) => setValue('message', event.target.value)}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={
                errors.message ? 'inquiry-message-error' : undefined
              }
              className={inputClasses}
            />
          </Field>

          {result?.delivered ? (
            <div className="border border-line bg-ivory-deep p-6" role="status">
              <h2 className="font-serif text-xl font-medium">
                Inquiry sent
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Thank you, {values.name.split(' ')[0] || 'there'}. We've
                received your inquiry and will reply personally, usually
                within a day or two.
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-5"
                onClick={startOver}
              >
                Send Another Inquiry
              </Button>
            </div>
          ) : result && !result.delivered ? (
            <div className="border border-line bg-ivory-deep p-6" role="status">
              <h2 className="font-serif text-xl font-medium">
                {result.attempted ? 'Something went wrong' : 'One more step'}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {result.attempted
                  ? "Your inquiry could not be sent automatically. Please use the button below to send it by email instead, and accept our apologies for the extra step."
                  : 'Sending directly from this page is not set up yet, so your inquiry is not sent automatically. The button below opens a prefilled draft in your email app; review it and press send.'}
              </p>
              <Button href={result.mailtoUrl} variant="ruby" className="mt-5">
                Open Email Draft
              </Button>
            </div>
          ) : (
            <Button type="submit" variant="ruby" disabled={isSubmitting}>
              {isSubmitting ? 'Sending…' : 'Send Inquiry'}
            </Button>
          )}
        </form>
      </Container>
    </div>
  )
}
