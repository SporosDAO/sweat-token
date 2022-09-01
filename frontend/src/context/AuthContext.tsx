import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { SiweMessage } from 'siwe'
import { useAccount, useNetwork, useSignMessage } from 'wagmi'
import * as api from '../api'
import { JwtTokenDto, NoncePayloadDto, SiwePayloadDto, UserDto } from '../api/openapi'

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
  const [isSignin, setIsSignin] = useState(false)

  const { signMessageAsync } = useSignMessage()
  const { chain: activeChain } = useNetwork()
  const chainId = activeChain?.id
  const { address, isReconnecting, isConnected } = useAccount()

  const ctoken = useMemo(() => getCookieToken(), [])

  const signin = useCallback(() => {
    if (isSignin) return
    if (!isConnected || isReconnecting) return
    if (token || user) return
    if (signaturePending) return
    if (!chainId) return
    if (!address) return
    if (error) return

    setIsSignin(true)

    api
      .getUserByAddress(chainId, address)
      .then(({ nonce, userId }: NoncePayloadDto) => {
        // generate SIWE message
        const message = new SiweMessage({
          domain: window.location.host,
          address,
          statement: 'Sign in with Ethereum to the app.',
          uri: window.location.origin,
          version: '1',
          chainId,
          nonce
        })

        return signMessageAsync({
          message: message.prepareMessage()
        })
          .then((signature: any) =>
            api.verifySignature({ userId, message, signature } as SiwePayloadDto).catch((e) => {
              console.warn(`Invalid signature? ${e.stack}`)
              // setAccount(undefined)
              return Promise.reject(e)
            })
          )
          .then((jwt: JwtTokenDto) => {
            setToken(jwt.token)
            const expires = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // 10 days
            document.cookie = `token=${jwt.token};expires=${expires};path=/;secure`
          })
      })
      .catch((e: any) => {
        // user denied
        if (e.code === 4001) {
          console.warn('signature denied')
          setError('Please confirm the signature on your wallet to continue.')
          return
        }

        setError('Authentication failed')
        console.error('failed to load account', e)
      })
      .finally(() => {
        setIsSignin(false)
      })
    // .finally(() => {})
  }, [address, chainId, error, isConnected, isReconnecting, isSignin, signMessageAsync, signaturePending, token, user])

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
    signin()
  }, [signin, user])

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
