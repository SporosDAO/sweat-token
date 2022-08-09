import { Factory, Help, Home, MenuBook, People } from '@mui/icons-material'
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import * as React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { OWNER } from '../../constants'

export const MainMenuItems = () => {
  return (
    <React.Fragment>
      <ListItemButton onClick={() => (document.location = '/')}>
        <ListItemIcon>
          <Home />
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
    icon: Factory,
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
    const parts = location.pathname.split('/')
    return parts && parts.length > 0 ? parts[parts.length - 1] : ''
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
          <MenuBook />
        </ListItemIcon>
        <ListItemText primary="Docs" />
      </ListItemButton>
      <ListItemButton onClick={() => (document.location = OWNER.helpUrl)}>
        <ListItemIcon>
          <Help />
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
