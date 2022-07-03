import { People } from '@mui/icons-material'
import FactoryIcon from '@mui/icons-material/Factory'
import PieChartIcon from '@mui/icons-material/PieChart'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import DashboardIcon from '@mui/icons-material/Dashboard'
import GavelIcon from '@mui/icons-material/Gavel'
import HelpIcon from '@mui/icons-material/Help'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import * as React from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { OWNER } from '../../constants'
import { ProjectDto } from '../../api/openapi'

export interface MenuItem {
  label: string
  icon: any
  link: string
}

export const menu: MenuItem[] = [
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
  }
]

export const MainListItems = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { daoId, chainId } = useParams()

  const goto = (path: string) => {
    navigate(getDaoUrl(chainId, daoId, path))
  }

  const currentPath = React.useMemo((): string => {
    if (!daoId) return ''
    const [, , , subpath] = location.pathname.split('/')
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

export const SecondaryListItems = () => {
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
  daoId?: string
  path?: string
  project?: ProjectDto | { daoId?: string; projectId?: string }
  children: any
}

export const LinkProject = ({ daoId, add, children, project, path }: LinkProjectProps) => {
  project = project || {}
  daoId = daoId || project.daoId
  const projectId = add === true ? 'add' : project.projectId || undefined
  return <Link to={getProjectUrl(daoId, projectId, path)}>{children}</Link>
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
