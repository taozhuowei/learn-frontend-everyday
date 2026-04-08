import { useEffect } from 'react'
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom'
import { AppStateProvider } from './context/AppStateContext'
import './index.css'
import { AppRoutes } from './route/AppRoutes'

const router_basename =
  import.meta.env.BASE_URL === '/' ? '/' : import.meta.env.BASE_URL.replace(/\/$/, '')

/**
 * Restores SPA routing after GitHub Pages 404 redirect.
 * 404.html redirects /learn to /?p=/learn, this component reads the query param
 * and navigates to the actual route.
 */
function RouteRestorer() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const redirectPath = params.get('p')

    if (redirectPath) {
      // Build new search string without the 'p' parameter
      const newParams = new URLSearchParams(location.search)
      newParams.delete('p')
      const newSearch = newParams.toString()

      // Navigate to the restored path, preserving other query params
      navigate(
        {
          pathname: redirectPath,
          search: newSearch ? `?${newSearch}` : '',
        },
        { replace: true },
      )
    }
  }, [location, navigate])

  return null
}

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
        <RouteRestorer />
        <AppRoutes />
      </BrowserRouter>
    </AppStateProvider>
  )
}

export default App
