import { Suspense, lazy } from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'
import { LoadingPanel } from '../components/LoadingPanel'

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
const LearnListPage = lazy(() =>
  import('../pages/LearnListPage').then((module) => ({ default: module.LearnListPage })),
)
const LearnPage = lazy(() =>
  import('../pages/LearnPage').then((module) => ({ default: module.LearnPage })),
)
const TheoryListPage = lazy(() =>
  import('../pages/TheoryListPage').then((module) => ({ default: module.TheoryListPage })),
)
const TheoryArticlePage = lazy(() =>
  import('../pages/TheoryArticlePage').then((module) => ({ default: module.TheoryArticlePage })),
)
const NotFoundPage = lazy(() =>
  import('../pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })),
)

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingPanel className="h-screen" />}>
      <Routes>
        <Route element={<Outlet />} path="">
          <Route element={<HomePage />} index />
          <Route element={<ExamEntryPage />} path="exam" />
          <Route element={<ExamSessionPage />} path="exam/session" />
          <Route element={<ExamResultPage />} path="exam/result" />
          <Route element={<LearnListPage />} path="learn" />
          <Route element={<LearnPage />} path="learn/:problemId" />
          <Route element={<TheoryListPage />} path="theory" />
          <Route element={<TheoryArticlePage />} path="theory/:slug" />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
