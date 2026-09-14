import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import my from './locales/my.json'
import zh from './locales/zh.json'

export type Locale = 'en' | 'my' | 'zh'

export const LOCALES: Locale[] = ['en', 'my', 'zh']
export const DEFAULT_LOCALE: Locale = 'en'

/** localStorage key for the visitor's saved language choice. */
export const LANGUAGE_STORAGE_KEY = 'mng-language'

function isLocale(value: string | null): value is Locale {
  return LOCALES.includes(value as Locale)
}

/**
 * Reads the saved language choice. Defaults to English — this never
 * inspects navigator.language, per the site's language-behavior spec:
 * language only changes when a visitor explicitly picks one.
 */
function readStoredLocale(): Locale {
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
    return isLocale(stored) ? stored : DEFAULT_LOCALE
  } catch {
    // localStorage unavailable (private browsing, disabled storage, ...).
    return DEFAULT_LOCALE
  }
}

function applyDocumentLang(locale: Locale): void {
  document.documentElement.lang = locale
}

const initialLocale = readStoredLocale()
applyDocumentLang(initialLocale)

void i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      my: { translation: my },
      zh: { translation: zh },
    },
    lng: initialLocale,
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: LOCALES,
    interpolation: { escapeValue: false },
    returnEmptyString: false,
  })

// Keep <html lang> and localStorage in sync with every language change,
// including changes triggered from any page via LanguageToggle.
i18n.on('languageChanged', (language) => {
  if (!isLocale(language)) return
  applyDocumentLang(language)
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  } catch {
    // Language still switches for this session; it just won't persist.
  }
})

export default i18n
