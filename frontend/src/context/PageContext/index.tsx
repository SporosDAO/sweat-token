import * as React from 'react'

export * from './menu'

interface PageContextType {
  title: string
  setTitle: (title: string) => void
}

export const PageContext = React.createContext<PageContextType>({} as PageContextType)

export function PageProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [title, setTitle] = React.useState('')

  React.useEffect(() => {
    setTitle('Sporos DAO App')
  }, [])

  return <PageContext.Provider value={{ setTitle, title }}>{children}</PageContext.Provider>
}

export default function usePage() {
  return React.useContext(PageContext)
}
