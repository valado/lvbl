import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import * as authService from '@/services/auth'
import type { AuthCredentials } from '@/types/api'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
}

interface AuthContextValue extends AuthState {
  signIn: (creds: AuthCredentials) => Promise<void>
  signUp: (creds: AuthCredentials) => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuthProvider(): AuthContextValue {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  })

  useEffect(() => {
    authService.getSession().then(session => {
      setState({
        user: session?.user ?? null,
        session: session ?? null,
        loading: false,
      })
    })

    const { data: { subscription } } = authService.onAuthStateChange((session) => {
      const typedSession = session as Session | null
      setState({
        user: typedSession?.user ?? null,
        session: typedSession,
        loading: false,
      })
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = useCallback(async (creds: AuthCredentials) => {
    const { session } = await authService.signIn(creds)
    setState({ user: session?.user ?? null, session, loading: false })
  }, [])

  const signUp = useCallback(async (creds: AuthCredentials) => {
    await authService.signUp(creds)
  }, [])

  const signOut = useCallback(async () => {
    await authService.signOut()
    setState({ user: null, session: null, loading: false })
  }, [])

  return { ...state, signIn, signUp, signOut }
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
