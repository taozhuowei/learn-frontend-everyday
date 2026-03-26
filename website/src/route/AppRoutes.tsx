import { Suspense, lazy } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
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
        <Route element={<Outlet />} path="">
          <Route element={<HomePage />} index />
          <Route element={<ExamEntryPage />} path="exam" />
          <Route element={<ExamSessionPage />} path="exam/session" />
          <Route element={<ExamResultPage />} path="exam/result" />
          <Route element={<Navigate replace to={`/learn/${firstProblemId}`} />} path="learn" />
          <Route element={<LearnPage />} path="learn/:problemId" />
          <Route element={<LibraryPage />} path="library" />
          <Route element={<LibraryDetailPage />} path="library/:problemId" />
          <Route element={<TheoryPage />} path="theory" />
          <Route element={<TheoryPage />} path="theory/:slug" />
          <Route element={<SettingsRedirectPage />} path="settings" />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
