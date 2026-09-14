import { lazy, Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router'
import { useTranslation } from 'react-i18next'
import { SiteLayout } from './components/layout/SiteLayout'
import { gemstoneCategories } from './config/gemstones'
import { HomePage } from './pages/HomePage'
import { GemsPage } from './pages/GemsPage'
import { GemstonePage } from './pages/GemstonePage'
import { GemDetailPage } from './pages/GemDetailPage'
import { EducationPage } from './pages/EducationPage'
import { ContactPage } from './pages/ContactPage'
import { NotFoundPage } from './pages/NotFoundPage'

// The Markdown renderer is heavy; keep it out of the main bundle.
const ContentPage = lazy(() =>
  import('./pages/ContentPage').then((module) => ({
    default: module.ContentPage,
  })),
)

/**
 * HashRouter keeps deep links working on GitHub Pages static hosting.
 * To move to path-based URLs later (Cloudflare Pages, Vercel, ...), swap
 * HashRouter for BrowserRouter here and add a host-level SPA fallback.
 */
export default function App() {
  const { t } = useTranslation()

  return (
    <HashRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="gems" element={<GemsPage />} />
          {gemstoneCategories.map((category) => (
            <Route
              key={category.slug}
              path={category.slug}
              element={<GemstonePage category={category} />}
            />
          ))}
          <Route path="gem/:no" element={<GemDetailPage />} />
          <Route path="education" element={<EducationPage />} />
          <Route
            path="education/:slug"
            element={
              <Suspense fallback={<div className="min-h-[60vh]" />}>
                <ContentPage collection="education" />
              </Suspense>
            }
          />
          <Route
            path="about"
            element={
              <Suspense fallback={<div className="min-h-[60vh]" />}>
                <ContentPage
                  collection="pages"
                  slug="our-story"
                  metaTitle={t('meta.about.title')}
                />
              </Suspense>
            }
          />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
