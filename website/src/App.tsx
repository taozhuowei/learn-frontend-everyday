import { useEffect } from 'react'
import { HashRouter } from 'react-router-dom'
import { AppStateProvider } from './context/AppStateContext'
import './index.css'
import { AppRoutes } from './route/AppRoutes'

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
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppStateProvider>
  )
}

export default App
