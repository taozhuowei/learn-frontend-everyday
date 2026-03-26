import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppState } from '../context/AppStateContext'

export function SettingsRedirectPage() {
  const navigate = useNavigate()
  const { openSettingsPanel } = useAppState()

  useEffect(() => {
    openSettingsPanel()
    navigate('/', { replace: true })
  }, [navigate, openSettingsPanel])

  return null
}
