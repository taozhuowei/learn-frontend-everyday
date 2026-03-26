import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppStateProvider } from './context/AppStateContext'
import './index.css'
import { AppRoutes } from './route/AppRoutes'

const router_basename =
  import.meta.env.BASE_URL === '/' ? '/' : import.meta.env.BASE_URL.replace(/\/$/, '')

function App() {
  useEffect(() => {
    void Promise.all([
      import('./generated/knowledge'),
      import('./generated/problems'),
      import('./generated/test-manifest'),
    ]).then(([knowledgeModule, problemModule, testManifestModule]) => {
      window.__PRACTICE_DEBUG__ = {
        problems: problemModule.problems,
        knowledgeArticles: knowledgeModule.knowledgeArticles,
        generatedTestManifest: testManifestModule.generatedTestManifest as NonNullable<
          Window['__PRACTICE_DEBUG__']
        >['generatedTestManifest'],
      }
    })
  }, [])

  return (
    <AppStateProvider>
      <BrowserRouter basename={router_basename}>
        <AppRoutes />
      </BrowserRouter>
    </AppStateProvider>
  )
}

export default App
