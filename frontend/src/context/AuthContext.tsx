import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import * as api from '../api'
import { JwtTokenDto, UserDto } from '../api/openapi'

interface AuthContextType {
  // We defined the user type in `index.d.ts`, but it's
  // a simple object with email, name and password.
  user?: UserDto
  loading: boolean
  error?: any
  login: (email: string, password: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

// Export the provider as we need to wrap the entire app with it
export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<UserDto>()
  const [token, setToken] = useState<string>()
  const [error, setError] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true)

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (error) setError(null)
  }, [error, location.pathname])

  useEffect(() => {
    api
      .getCurrentUser()
      .then((user) => setUser(user))
      .catch((_error) => {
        //
      })
      .finally(() => setLoadingInitial(false))
  }, [])

  const login = useCallback(
    (publicAddress: string, nonce: string) => {
      setLoading(true)

      api
        .login({ publicAddress, nonce } as UserDto)
        .then((jwt: JwtTokenDto) => {
          setToken(jwt.token)
          setUser(user)
          navigate('/')
        })
        .catch((error: Error) => setError(error))
        .finally(() => setLoading(false))
    },
    [navigate]
  )

  const logout = useCallback(() => {
    api.logout().then(() => setUser(undefined))
  }, [])

  const memoedValue = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      logout
    }),
    [user, loading, error, login, logout]
  )

  return <AuthContext.Provider value={memoedValue}>{!loadingInitial && children}</AuthContext.Provider>
}

export default function useAuth() {
  return useContext(AuthContext)
}
