import * as React from 'react'
import { useLocation } from 'react-router-dom'
import { getTitleFromPath } from './title'

export * from './menu'

interface PageContextType {
  title: string
  setTitle: (title: string) => void
}

const PageContext = React.createContext<PageContextType>({} as PageContextType)

export function PageProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [title, setTitle] = React.useState('')
  const location = useLocation()

  React.useEffect(() => {
    setTitle(getTitleFromPath(location.pathname))
  }, [location.pathname])

  return <PageContext.Provider value={{ setTitle, title }}>{children}</PageContext.Provider>
}

export default function usePage() {
  return React.useContext(PageContext)
}
