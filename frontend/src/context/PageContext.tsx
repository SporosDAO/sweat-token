import * as React from 'react'

interface PageContextType {
  setTitle: (title: string) => void
  title: string
}

const PageContext = React.createContext<PageContextType>({} as PageContextType)

export function PageProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [title, setTitle] = React.useState('')

  const value = {
    setTitle,
    title
  } as PageContextType

  return <PageContext.Provider value={value}>{children}</PageContext.Provider>
}

export default function usePage() {
  return React.useContext(PageContext)
}
