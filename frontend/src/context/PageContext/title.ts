import { menu } from './menu'

const DAO_DEFAULT_TITLE = 'dashboard'

const daoPageTitle = (daoId?: string, subpath?: string, subpathId?: string, ...args: string[]): string => {
  if (!daoId) return DAO_DEFAULT_TITLE
  if (subpath) {
    switch (subpath) {
      case 'projects':
        return 'Projects'
      default:
        return DAO_DEFAULT_TITLE
    }
  }
  return DAO_DEFAULT_TITLE
}

export const getTitleFromPath = (pathname: string): string => {
  const parts = pathname.split('/')
  const [, group, , subpath] = parts
  switch (group) {
    case 'dao':
      const matches = menu.filter(({ link }) => link === subpath)
      return matches.length ? matches[0].label : daoPageTitle(...parts.slice(1))
    default:
      return 'Sweat Token'
  }
}
