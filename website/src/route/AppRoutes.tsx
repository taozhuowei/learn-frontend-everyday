import { Suspense, lazy } from 'react'
import { Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { LoadingPanel } from '../components/LoadingPanel'
import { HomePage } from '../pages/HomePage'

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

const PageWrapper = ({
  children,
  direction = 'vertical',
}: {
  children: React.ReactNode
  direction?: 'horizontal' | 'vertical'
}) => (
  <motion.div
    initial={{
      opacity: 0,
      x: direction === 'horizontal' ? 10 : 0,
      y: direction === 'vertical' ? 10 : 0,
    }}
    animate={{ opacity: 1, x: 0, y: 0 }}
    exit={{
      opacity: 0,
      x: direction === 'horizontal' ? -10 : 0,
      y: direction === 'vertical' ? -10 : 0,
    }}
    transition={{ duration: 0.2, ease: 'easeOut' }}
    className="h-full w-full"
  >
    {children}
  </motion.div>
)

export function AppRoutes() {
  const location = useLocation()

  return (
    <Suspense fallback={<LoadingPanel className="h-screen" />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route element={<Outlet />} path="">
            <Route index element={<HomePage />} />
            <Route
              path="exam"
              element={
                <PageWrapper>
                  <ExamEntryPage />
                </PageWrapper>
              }
            />
            <Route
              path="exam/session"
              element={
                <PageWrapper>
                  <ExamSessionPage />
                </PageWrapper>
              }
            />
            <Route
              path="exam/result"
              element={
                <PageWrapper>
                  <ExamResultPage />
                </PageWrapper>
              }
            />
            <Route
              path="learn"
              element={
                <PageWrapper>
                  <LearnListPage />
                </PageWrapper>
              }
            />
            <Route
              path="learn/:problemId"
              element={
                <PageWrapper direction="horizontal">
                  <LearnPage />
                </PageWrapper>
              }
            />
            <Route
              path="theory"
              element={
                <PageWrapper>
                  <TheoryListPage />
                </PageWrapper>
              }
            />
            <Route
              path="theory/:slug"
              element={
                <PageWrapper>
                  <TheoryArticlePage />
                </PageWrapper>
              }
            />
          </Route>
          <Route
            path="*"
            element={
              <PageWrapper>
                <NotFoundPage />
              </PageWrapper>
            }
          />
        </Routes>
      </AnimatePresence>
    </Suspense>
  )
}
