import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { Button } from '../components/common/Button'
import { Container } from '../components/common/Container'
import { siteConfig } from '../config/site'
import { useGems } from '../hooks/useGems'
import { usePageMeta } from '../hooks/usePageMeta'
import {
  submitInquiry,
  type InquiryDraft,
  type InquiryResult,
} from '../lib/inquiry'
import { formatCarat } from '../lib/utils'
import { translateGemType } from '../i18n/gemTypes'
import type { Locale } from '../i18n'
import type { Gem } from '../types/gem'

interface FormValues {
  name: string
  email: string
  phone: string
  gemNo: string
  message: string
}

type FormErrors = Partial<Record<'name' | 'email' | 'message', string>>

function gemOptionLabel(gem: Gem, t: TFunction, locale: Locale): string {
  const carat = gem.carat !== undefined ? ` (${formatCarat(gem.carat)})` : ''
  const type = translateGemType(gem.gemType, locale)
  return `${type} ${t('gem.noLabel')} ${gem.no}${carat}`
}

function validate(values: FormValues, t: TFunction): FormErrors {
  const errors: FormErrors = {}
  if (!values.name.trim()) errors.name = t('contact.validation.name')
  if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) {
    errors.email = t('contact.validation.email')
  }
  if (!values.message.trim()) errors.message = t('contact.validation.message')
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
  const { t, i18n } = useTranslation()
  const locale = i18n.language as Locale
  usePageMeta(t('meta.contact.title'), t('meta.contact.description'))
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
    const nextErrors = validate(values, t)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const draft: InquiryDraft = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      gemLabel: selectedGem
        ? gemOptionLabel(selectedGem, t, locale)
        : values.gemNo
          ? t('gem.stoneNoPrefix', { no: values.gemNo })
          : '',
      message: values.message.trim(),
    }
    const subject = draft.gemLabel
      ? t('contact.mailto.subjectWithGem', { gemLabel: draft.gemLabel })
      : t('contact.mailto.subjectGeneral')
    const labels = {
      name: t('contact.mailto.name'),
      email: t('contact.mailto.email'),
      phone: t('contact.mailto.phone'),
      gemstone: t('contact.mailto.gemstone'),
    }
    setIsSubmitting(true)
    try {
      setResult(await submitInquiry(draft, subject, labels))
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
            {t('contact.title')}
          </h1>
          <p className="mt-4 leading-relaxed text-ink-soft">
            {t('contact.subtitle')}
          </p>
          {preselectedGem && (
            <p className="mt-6 border-l-2 border-gold pl-4 text-sm text-ink-soft">
              {t('contact.regarding', {
                gemLabel: gemOptionLabel(preselectedGem, t, locale),
              })}
            </p>
          )}
          <p className="mt-6 text-sm text-ink-soft">
            {t('contact.preferEmail')}{' '}
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
          <Field
            label={t('contact.form.name')}
            htmlFor="inquiry-name"
            error={errors.name}
          >
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

          <Field
            label={t('contact.form.email')}
            htmlFor="inquiry-email"
            error={errors.email}
          >
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

          <Field label={t('contact.form.phone')} htmlFor="inquiry-phone">
            <input
              id="inquiry-phone"
              type="tel"
              autoComplete="tel"
              value={values.phone}
              onChange={(event) => setValue('phone', event.target.value)}
              className={inputClasses}
            />
          </Field>

          <Field label={t('contact.form.gemstone')} htmlFor="inquiry-gem">
            <select
              id="inquiry-gem"
              value={values.gemNo}
              onChange={(event) => setValue('gemNo', event.target.value)}
              className={inputClasses}
            >
              <option value="">{t('contact.form.generalInquiry')}</option>
              {preselectedNo && !preselectedGem && (
                <option value={preselectedNo}>
                  {t('gem.stoneNoPrefix', { no: preselectedNo })}
                </option>
              )}
              {gems.map((gem) => (
                <option key={gem.no} value={gem.no}>
                  {gemOptionLabel(gem, t, locale)}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label={t('contact.form.message')}
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
                {t('contact.success.title')}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {t('contact.success.body', {
                  name:
                    values.name.split(' ')[0] ||
                    t('contact.success.fallbackName'),
                })}
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-5"
                onClick={startOver}
              >
                {t('contact.success.sendAnother')}
              </Button>
            </div>
          ) : result && !result.delivered ? (
            <div className="border border-line bg-ivory-deep p-6" role="status">
              <h2 className="font-serif text-xl font-medium">
                {result.attempted
                  ? t('contact.failed.title')
                  : t('contact.notConfigured.title')}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {result.attempted
                  ? t('contact.failed.body')
                  : t('contact.notConfigured.body')}
              </p>
              <Button href={result.mailtoUrl} variant="ruby" className="mt-5">
                {t('contact.openEmailDraft')}
              </Button>
            </div>
          ) : (
            <Button type="submit" variant="ruby" disabled={isSubmitting}>
              {isSubmitting
                ? t('contact.form.sending')
                : t('contact.form.sendInquiry')}
            </Button>
          )}
        </form>
      </Container>
    </div>
  )
}
