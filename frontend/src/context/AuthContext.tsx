import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import * as api from '../api'
import { JwtTokenDto, NonceDto, UserDto } from '../api/openapi'
import useWeb3 from './Web3Context'

interface AuthContextType {
  // We defined the user type in `index.d.ts`, but it's
  // a simple object with email, name and password.
  user?: UserDto
  loading: boolean
  error?: any
  logout: () => void
  token?: string
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<UserDto>()
  const [token, setToken] = useState<string>()
  const [error, setError] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true)

  const location = useLocation()

  const { account, provider, setAccount } = useWeb3()

  useEffect(() => {
    if (error) setError(null)
  }, [error, location.pathname])

  useEffect(() => {
    if (!account || !provider) {
      setLoadingInitial(false)
      return
    }
    setLoadingInitial(true)
    api
      .getUserByAddress(account)
      .then(({ nonce, userId }: NonceDto) => {
        const signer = provider.getSigner(account)
        return signer
          .signMessage(nonce)
          .then((signature) =>
            api.verifySignature({ userId, nonce, signature } as NonceDto).catch((e) => {
              console.warn(`Invalid signature? ${e.stack}`)
              setAccount(undefined)
              return Promise.reject(e)
            })
          )
          .then((jwt: JwtTokenDto) => setToken(jwt.token))
      })
      .catch((_error) => {
        //
      })
      .finally(() => setLoadingInitial(false))
  }, [account, provider, setAccount])

  useEffect(() => {
    if (!token) return
    if (token === api.getToken()) return
    api.setToken(token)
    setLoading(true)
    api
      .getCurrentUser()
      .then((user: UserDto) => {
        setUser(user)
      })
      .finally(() => setLoading(false))
  }, [token])

  const logout = useCallback(() => {
    setToken(undefined)
  }, [])

  const memoedValue = useMemo(
    () => ({
      user,
      loading,
      error,
      logout,
      token
    }),
    [user, loading, error, logout, token]
  )

  return <AuthContext.Provider value={memoedValue}>{!loadingInitial && children}</AuthContext.Provider>
}

export default function useAuth() {
  return useContext(AuthContext)
}
