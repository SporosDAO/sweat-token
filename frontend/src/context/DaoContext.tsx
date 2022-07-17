import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import * as api from '../api'
import { DaoDto } from '../api/openapi'

interface DaoContextType {
  dao?: DaoDto
  chainId?: string
  daoId?: string
  projectId?: string
  loading: boolean
  error?: any
  load: (name: string) => void
}

const DaoContext = createContext<DaoContextType>({} as DaoContextType)

export function DaoProvider({ children }: { children: ReactNode }): JSX.Element {
  const [dao, setDao] = useState<DaoDto>()
  const [error, setError] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true)

  const navigate = useNavigate()
  const location = useLocation()

  const { chainId, daoId, projectId } = useParams()

  // If we change page, reset the error state.
  useEffect(() => {
    if (error) setError(null)
  }, [error, location.pathname])

  useEffect(() => {
    // if (daoId === undefined) {
    //   setLoadingInitial(false)
    //   return
    // }
    // api
    //   .getDao(daoId)
    //   .then((dao) => setDao(dao))
    //   .catch((_error) => {
    //     //
    //   })
    //   .finally(() => setLoadingInitial(false))
    setLoadingInitial(false)
  }, [daoId])

  const load = useCallback(
    (daoId: string) => {
      setLoading(true)

      api
        .getDao(daoId)
        .then((dao: DaoDto) => {
          setDao(dao)
          navigate(`/${dao.name}`)
        })
        .catch((error: Error) => setError(error))
        .finally(() => setLoading(false))
    },
    [navigate]
  )

  const memoedValue = useMemo(
    () => ({
      dao,
      chainId,
      daoId,
      projectId,
      loading,
      error,
      load
    }),
    [dao, chainId, daoId, projectId, error, load, loading]
  )

  return <DaoContext.Provider value={memoedValue}>{!loadingInitial && children}</DaoContext.Provider>
}

// Let's only export the `useAuth` hook instead of the context.
// We only want to use the hook directly and never the context component.
export default function useDao() {
  return useContext(DaoContext)
}
