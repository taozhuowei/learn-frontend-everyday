import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { problems } from '../generated/problems'

const HomePage = lazy(() =>
  import('../pages/HomePage').then((module) => ({ default: module.HomePage })),
)
const ExamEntryPage = lazy(() =>
  import('../pages/ExamEntryPage').then((module) => ({ default: module.ExamEntryPage })),
)
const ExamSessionPage = lazy(() =>
  import('../pages/ExamSessionPage').then((module) => ({ default: module.ExamSessionPage })),
)
const ExamResultPage = lazy(() =>
  import('../pages/ExamResultPage').then((module) => ({ default: module.ExamResultPage })),
)
const LearnPage = lazy(() =>
  import('../pages/LearnPage').then((module) => ({ default: module.LearnPage })),
)
const LibraryPage = lazy(() =>
  import('../pages/LibraryPage').then((module) => ({ default: module.LibraryPage })),
)
const LibraryDetailPage = lazy(() =>
  import('../pages/LibraryDetailPage').then((module) => ({ default: module.LibraryDetailPage })),
)
const TheoryPage = lazy(() =>
  import('../pages/TheoryPage').then((module) => ({ default: module.TheoryPage })),
)
const SettingsRedirectPage = lazy(() =>
  import('../pages/SettingsRedirectPage').then((module) => ({
    default: module.SettingsRedirectPage,
  })),
)
const NotFoundPage = lazy(() =>
  import('../pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })),
)

const firstProblemId = problems[0]?.id ?? 'map'

function RouteLoadingFallback() {
  return (
    <div aria-live="polite" className="route-loading-screen" role="status">
      <section className="panel route-loading-panel">
        <span className="panel-title">Loading page...</span>
        <p className="panel-description">
          Route modules are loading on demand to keep the main bundle small.
        </p>
      </section>
    </div>
  )
}

export function AppRoutes() {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/exam" element={<ExamEntryPage />} />
        <Route path="/exam/session" element={<ExamSessionPage />} />
        <Route path="/exam/result" element={<ExamResultPage />} />
        <Route path="/learn" element={<Navigate replace to={`/learn/${firstProblemId}`} />} />
        <Route path="/learn/:problemId" element={<LearnPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/library/:problemId" element={<LibraryDetailPage />} />
        <Route path="/theory" element={<TheoryPage />} />
        <Route path="/theory/:slug" element={<TheoryPage />} />
        <Route path="/settings" element={<SettingsRedirectPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
