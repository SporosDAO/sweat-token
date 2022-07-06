import { People } from '@mui/icons-material'
import FactoryIcon from '@mui/icons-material/Factory'
import HelpIcon from '@mui/icons-material/Help'
import HomeIcon from '@mui/icons-material/Home'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import * as React from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { OWNER } from '../../constants'
import { ProjectDto } from '../../api/openapi'

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
