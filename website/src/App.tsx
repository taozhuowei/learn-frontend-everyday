import { useEffect } from 'react'
import { HashRouter } from 'react-router-dom'
import { AppStateProvider } from './context/AppStateContext'
import './index.css'
import { AppRoutes } from './route/AppRoutes'

function App() {
  return (
    <AppStateProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppStateProvider>
  )
}

export default App
