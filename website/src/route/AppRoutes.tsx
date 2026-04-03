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
const TheoryListPage = lazy(() =>
  import('../pages/TheoryListPage').then((module) => ({ default: module.TheoryListPage })),
)
const TheoryArticlePage = lazy(() =>
  import('../pages/TheoryArticlePage').then((module) => ({ default: module.TheoryArticlePage })),
)
const NotFoundPage = lazy(() =>
  import('../pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })),
)

const firstProblemId =
  problems.find((p) => p.executionMode !== 'local')?.id ?? problems[0]?.id ?? ''

function RouteLoadingFallback() {
  return (
    <div aria-live="polite" role="status" className="flex items-center justify-center h-screen">
      <section className="bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 flex flex-col gap-2">
        <span className="text-sm font-semibold text-[var(--color-ink)]">加载中...</span>
        <p className="text-xs text-[var(--color-ink-tertiary)] m-0">
          正在按需加载页面模块，请稍候。
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
          <Route element={<TheoryListPage />} path="theory" />
          <Route element={<TheoryArticlePage />} path="theory/:slug" />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
