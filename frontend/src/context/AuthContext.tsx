import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import * as api from '../api'
import { JwtTokenDto, NonceDto, UserDto } from '../api/openapi'
import useWeb3 from './Web3Context'

export const CONNECT_PAGE = '/connect'
export const REDIR_QUERY = '?redirect='

interface AuthContextType {
  // We defined the user type in `index.d.ts`, but it's
  // a simple object with email, name and password.
  user?: UserDto
  loading: boolean
  error?: any
  resetError: () => void
  logout: () => void
  token?: string
  requireAuth: () => void
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<UserDto>()
  const [token, setToken] = useState<string>()
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [signaturePending, setSignaturePending] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()

  const { account, provider, setAccount } = useWeb3()

  useEffect(() => {
    // account reset
    if (account) return
    if (!user) return
    setUser(undefined)
  }, [account, user])

  useEffect(() => {
    if (signaturePending) return
    if (!account || !provider) {
      return
    }
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
      .catch((e: any) => {
        // user denied
        if (e.code === 4001) {
          console.warn('signature denied')
          setError('Please confirm the signature on your wallet to continue.')
          return
        }
        setError(e.message)
        console.error('failed to load account', e)
      })
    // .finally(() => {})
  }, [account, provider, setAccount, signaturePending])

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

  const requireAuth = useCallback(() => {
    if (user) return
    const destination = location.pathname === CONNECT_PAGE ? '/' : location.pathname
    navigate(`${CONNECT_PAGE}${REDIR_QUERY}${destination}`)
  }, [location.pathname, navigate, user])

  const memoedValue = useMemo(
    () => ({
      user,
      loading,
      error,
      logout,
      token,
      requireAuth,
      resetError: () => {
        setError(undefined)
        setSignaturePending(false)
      }
    }),
    [user, loading, error, logout, token, requireAuth]
  )

  return <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
}

export default function useAuth() {
  return useContext(AuthContext)
}
