import { People } from '@mui/icons-material'
import FactoryIcon from '@mui/icons-material/Factory'
import Settings from '@mui/icons-material/Settings'
import HelpIcon from '@mui/icons-material/Help'
import HomeIcon from '@mui/icons-material/Home'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import * as React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { OWNER } from '../../constants'

export const MainMenuItems = () => {
  return (
    <React.Fragment>
      <ListItemButton onClick={() => (document.location = '/')}>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItemButton>
    </React.Fragment>
  )
}
export interface DaoMenuItem {
  label: string
  icon: any
  link: string
}

export const menu: DaoMenuItem[] = [
  /**
  {
    label: 'Dashboard',
    icon: DashboardIcon,
    link: 'dashboard'
  },
  {
    label: 'Legal',
    icon: GavelIcon,
    link: 'legal'
  },
  {
    label: 'Taxes',
    icon: ReceiptLongIcon,
    link: 'taxes'
  },
  {
    label: 'Equity',
    icon: PieChartIcon,
    link: 'equity'
  },
  */
  {
    label: 'Projects',
    icon: FactoryIcon,
    link: 'projects'
  },
  {
    label: 'People',
    icon: People,
    link: 'people'
  },
  {
    label: 'Settings',
    icon: Settings,
    link: 'settings'
  }
]

export const DaoMenuItems = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { daoId, chainId } = useParams()

  const goto = (path: string) => {
    navigate(getDaoUrl(chainId, daoId, path))
  }

  const currentPath = React.useMemo((): string => {
    if (!daoId) return ''
    const parts = location.pathname.split('/')
    const subpath = parts && parts.length > 0 ? parts[parts.length - 1] : ''
    return subpath
  }, [daoId, location.pathname])

  return (
    <React.Fragment>
      {menu.map(({ icon: MenuIcon, label, link }) => (
        <ListItemButton key={label} onClick={() => goto(link)} selected={currentPath === link}>
          <ListItemIcon>
            <MenuIcon />
          </ListItemIcon>
          <ListItemText primary={label} />
        </ListItemButton>
      ))}
    </React.Fragment>
  )
}

export const SecondaryMenuItems = () => {
  return (
    <React.Fragment>
      <ListItemButton onClick={() => (document.location = OWNER.docsUrl)}>
        <ListItemIcon>
          <MenuBookIcon />
        </ListItemIcon>
        <ListItemText primary="Docs" />
      </ListItemButton>
      <ListItemButton onClick={() => (document.location = OWNER.helpUrl)}>
        <ListItemIcon>
          <HelpIcon />
        </ListItemIcon>
        <ListItemText primary="Help" />
      </ListItemButton>
    </React.Fragment>
  )
}

export const getDaoUrl = (chainId?: string, daoId?: string, ...parts: (string | undefined)[]): string => {
  if (!daoId) return '/'
  return ['', 'dao', 'chain', chainId, 'address', daoId, ...(parts.filter((p) => p !== undefined) as string[])].join(
    '/'
  )
}
<<<<<<< HEAD
=======

export const getProjectUrl = (
  chainId?: string,
  daoId?: string,
  projectId?: string,
  ...parts: (string | undefined)[]
): string => {
  if (!daoId) return '/'
  const subpath = ['projects']
  if (projectId) subpath.push(projectId)
  if (parts.length) subpath.push(...(parts.filter((p) => p !== undefined) as string[]))
  return getDaoUrl(chainId, daoId, ...subpath)
}

interface LinkProjectProps {
  add?: boolean
  chainId?: string
  daoId?: string
  path?: string
  project?: ProjectDto | { daoId?: string; projectId?: string }
  children: any
}

export const LinkProject = ({ chainId, daoId, add, children, project, path }: LinkProjectProps) => {
  project = project || {}
  daoId = daoId || project.daoId
  const projectId = add === true ? 'add' : project.projectId || undefined
  return <Link to={getProjectUrl(chainId, daoId, projectId, path)}>{children}</Link>
}

interface LinkDaoProps {
  add?: boolean
  chainId?: string
  daoId?: string
  children: any
  path?: string
  onClick?: (e: any) => void
}

export const LinkDao = ({ children, chainId, daoId, path, add, onClick }: LinkDaoProps) => {
  const { daoId: paramDaoId } = useParams()
  path = add === true ? 'add' : path || undefined
  return (
    <Link to={getDaoUrl(chainId, daoId || paramDaoId, path)} onClick={onClick}>
      {children}
    </Link>
  )
}
>>>>>>> 3e9c91317197455bc0d907be727ddf97df0824bf
