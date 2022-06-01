import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import * as api from '../api'
import { JwtTokenDto, NonceDto, UserDto } from '../api/openapi'
import useWeb3 from './Web3Context'
import useToast from './ToastContext'

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

function getCookieToken(): string | null {
  const name = 'token='
  const decodedCookie = decodeURIComponent(document.cookie)
  const ca = decodedCookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  return null
}

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<UserDto>()
  const [token, setToken] = useState<string>()
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [signaturePending, setSignaturePending] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()

  const { account, provider, setAccount } = useWeb3()
  const ctoken = useMemo(() => getCookieToken(), [])

  // useEffect(() => {
  //   // account reset
  //   if (account) return
  //   if (!user && !token) return
  //   console.log('no accout, reset user')
  //   setUser(undefined)
  //   setToken(undefined)
  // }, [account, token, user])

  useEffect(() => {
    if (token || user) return
    if (signaturePending) return
    if (!account || !provider) return
    if (error) return
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
          .then((jwt: JwtTokenDto) => {
            setToken(jwt.token)
            document.cookie = `token=${jwt.token};expires=${new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)};path=/`
          })
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
  }, [account, error, provider, setAccount, signaturePending, token, user])

  useEffect(() => {
    if (!ctoken) return
    setToken(ctoken)
  }, [ctoken])

  useEffect(() => {
    if (!token) return
    if (token === api.getToken()) return
    api.setToken(token)
  }, [token])

  useEffect(() => {
    if (error) return
    if (user) return
    if (!token) return
    if (loading) return
    setLoading(true)
    api
      .getCurrentUser()
      .then((user: UserDto) => {
        setUser(user)
      })
      .catch((e) => {
        // skip if JWT expired
        if (e.code && e.code !== 401) {
          setError(e)
        }
        setToken(undefined)
        setUser(undefined)
      })
      .finally(() => setLoading(false))
  }, [error, loading, token, user])

  const logout = useCallback(() => {
    setToken(undefined)
  }, [])

  const requireAuth = useCallback(() => {
    if (user) return
    const destination = location.pathname === CONNECT_PAGE ? '/' : `${location.pathname}${location.search}`
    navigate(`${CONNECT_PAGE}${REDIR_QUERY}${destination}`)
  }, [location.pathname, location.search, navigate, user])

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
