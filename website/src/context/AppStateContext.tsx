import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react'
import { problems } from '../generated/problems'
import type { ProblemRecord } from '../types/content'
import type { ExamConfig, ExamResult, ExamSession, SubmittedProblemResult } from '../types/exam'
import { DEFAULT_EXAM_CONFIG, buildExamResult, clampConfig, createExamSession } from '../utils/exam'

interface AppState {
  settings: ExamConfig
  session: ExamSession | null
  sessionDeadline: number | null
  result: ExamResult | null
  settingsDrawerOpen: boolean
  isMobile: boolean
}

type AppAction =
  | { type: 'updateSettings'; payload: ExamConfig }
  | { type: 'startExam'; payload: { session: ExamSession; deadline: number } }
  | { type: 'updateAnswer'; payload: { problemId: string; code: string } }
  | { type: 'setCurrentIndex'; payload: number }
  | { type: 'setSubmission'; payload: SubmittedProblemResult }
  | { type: 'finishExam'; payload: ExamResult }
  | { type: 'clearExam' }
  | { type: 'syncRemainingSeconds'; payload: number }
  | { type: 'setSettingsDrawerOpen'; payload: boolean }
  | { type: 'setIsMobile'; payload: boolean }

interface AppContextValue {
  state: AppState
  categories: Array<{ id: string; label: string }>
  getProblemById: (problemId: string) => ProblemRecord | undefined
  updateSettings: (nextConfig: ExamConfig) => void
  startExam: (problemIds: string[]) => void
  updateAnswer: (problemId: string, code: string) => void
  setCurrentIndex: (nextIndex: number) => void
  setSubmission: (result: SubmittedProblemResult) => void
  finishExam: () => void
  clearExam: () => void
  syncRemainingSeconds: () => void
  openSettingsPanel: () => void
  closeSettingsPanel: () => void
  toggleSettingsPanel: () => void
}

const EXAM_SESSION_STORAGE_KEY = 'cf_exam_session_v1'

function loadPersistedExamState(): Pick<AppState, 'session' | 'sessionDeadline'> {
  try {
    const raw = localStorage.getItem(EXAM_SESSION_STORAGE_KEY)
    if (!raw) return { session: null, sessionDeadline: null }
    const parsed = JSON.parse(raw) as Pick<AppState, 'session' | 'sessionDeadline'>
    if (!parsed.sessionDeadline || parsed.sessionDeadline <= Date.now()) {
      localStorage.removeItem(EXAM_SESSION_STORAGE_KEY)
      return { session: null, sessionDeadline: null }
    }
    return parsed
  } catch {
    return { session: null, sessionDeadline: null }
  }
}

const initialState: AppState = {
  settings: { ...DEFAULT_EXAM_CONFIG },
  session: null,
  sessionDeadline: null,
  result: null,
  settingsDrawerOpen: false,
  isMobile: false,
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'updateSettings':
      return {
        ...state,
        settings: action.payload,
      }
    case 'startExam':
      return {
        ...state,
        session: action.payload.session,
        sessionDeadline: action.payload.deadline,
        result: null,
      }
    case 'updateAnswer':
      if (!state.session) {
        return state
      }

      return {
        ...state,
        session: {
          ...state.session,
          answers: {
            ...state.session.answers,
            [action.payload.problemId]: action.payload.code,
          },
        },
      }
    case 'setCurrentIndex':
      if (!state.session || state.session.currentIndex === action.payload) {
        return state
      }

      return {
        ...state,
        session: {
          ...state.session,
          currentIndex: action.payload,
        },
      }
    case 'setSubmission':
      if (!state.session) {
        return state
      }

      return {
        ...state,
        session: {
          ...state.session,
          submittedMap: {
            ...state.session.submittedMap,
            [action.payload.problemId]: action.payload,
          },
        },
      }
    case 'finishExam':
      return {
        ...state,
        session: null,
        sessionDeadline: null,
        result: action.payload,
      }
    case 'clearExam':
      return {
        ...state,
        session: null,
        sessionDeadline: null,
        result: null,
      }
    case 'syncRemainingSeconds':
      if (!state.session || state.session.remainingSeconds === action.payload) {
        return state
      }

      return {
        ...state,
        session: {
          ...state.session,
          remainingSeconds: action.payload,
        },
      }
    case 'setSettingsDrawerOpen':
      if (state.settingsDrawerOpen === action.payload) {
        return state
      }

      return {
        ...state,
        settingsDrawerOpen: action.payload,
      }
    case 'setIsMobile':
      if (state.isMobile === action.payload) {
        return state
      }

      return {
        ...state,
        isMobile: action.payload,
      }
    default:
      return state
  }
}

const AppStateContext = createContext<AppContextValue | null>(null)

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    ...loadPersistedExamState(),
    isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false,
  })
  const stateRef = useRef(state)

  useEffect(() => {
    const handleResize = () => {
      dispatch({ type: 'setIsMobile', payload: window.innerWidth < 768 })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (state.session && state.sessionDeadline) {
      localStorage.setItem(
        EXAM_SESSION_STORAGE_KEY,
        JSON.stringify({ session: state.session, sessionDeadline: state.sessionDeadline }),
      )
    } else {
      localStorage.removeItem(EXAM_SESSION_STORAGE_KEY)
    }
  }, [state.session, state.sessionDeadline])

  useEffect(() => {
    stateRef.current = state
  }, [state])

  const categories = useMemo(
    () =>
      Array.from(
        new Map(problems.map((problem) => [problem.categoryId, problem.categoryName])).entries(),
      ).map(([id, label]) => ({ id, label })),
    [],
  )
  const executableProblemCount = useMemo(
    () => problems.filter((problem) => problem.executionMode !== 'local').length,
    [],
  )

  const getProblemById = useCallback((problemId: string) => {
    return problems.find((problem) => problem.id === problemId)
  }, [])

  const updateSettings = useCallback(
    (nextConfig: ExamConfig) => {
      dispatch({
        type: 'updateSettings',
        payload: clampConfig(nextConfig, categories.length, executableProblemCount),
      })
    },
    [categories.length, executableProblemCount],
  )

  const startExam = useCallback((problemIds: string[]) => {
    const { session, deadline } = createExamSession(problemIds, problems, stateRef.current.settings)
    dispatch({
      type: 'startExam',
      payload: { session, deadline },
    })
  }, [])

  const updateAnswer = useCallback((problemId: string, code: string) => {
    dispatch({
      type: 'updateAnswer',
      payload: { problemId, code },
    })
  }, [])

  const setCurrentIndex = useCallback((nextIndex: number) => {
    dispatch({
      type: 'setCurrentIndex',
      payload: nextIndex,
    })
  }, [])

  const setSubmission = useCallback((result: SubmittedProblemResult) => {
    dispatch({
      type: 'setSubmission',
      payload: result,
    })
  }, [])

  const finishExam = useCallback(() => {
    const currentState = stateRef.current
    if (!currentState.session) {
      return
    }

    dispatch({
      type: 'finishExam',
      payload: buildExamResult(
        currentState.session,
        currentState.settings.passingScore,
        currentState.session.problemIds.length,
      ),
    })
  }, [])

  const clearExam = useCallback(() => {
    dispatch({ type: 'clearExam' })
  }, [])

  const syncRemainingSeconds = useCallback(() => {
    const currentState = stateRef.current
    if (!currentState.session || !currentState.sessionDeadline) {
      return
    }

    const remainingSeconds = Math.max(
      0,
      Math.ceil((currentState.sessionDeadline - Date.now()) / 1000),
    )
    startTransition(() => {
      dispatch({
        type: 'syncRemainingSeconds',
        payload: remainingSeconds,
      })
    })
  }, [])

  const openSettingsPanel = useCallback(() => {
    dispatch({
      type: 'setSettingsDrawerOpen',
      payload: true,
    })
  }, [])

  const closeSettingsPanel = useCallback(() => {
    dispatch({
      type: 'setSettingsDrawerOpen',
      payload: false,
    })
  }, [])

  const toggleSettingsPanel = useCallback(() => {
    dispatch({
      type: 'setSettingsDrawerOpen',
      payload: !stateRef.current.settingsDrawerOpen,
    })
  }, [])

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      categories,
      getProblemById,
      updateSettings,
      startExam,
      updateAnswer,
      setCurrentIndex,
      setSubmission,
      finishExam,
      clearExam,
      syncRemainingSeconds,
      openSettingsPanel,
      closeSettingsPanel,
      toggleSettingsPanel,
    }),
    [
      categories,
      clearExam,
      closeSettingsPanel,
      finishExam,
      getProblemById,
      openSettingsPanel,
      setCurrentIndex,
      setSubmission,
      startExam,
      state,
      syncRemainingSeconds,
      toggleSettingsPanel,
      updateAnswer,
      updateSettings,
    ],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider')
  }

  return context
}
