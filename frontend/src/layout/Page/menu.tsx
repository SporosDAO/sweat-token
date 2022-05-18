import { People } from '@mui/icons-material'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
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
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { OWNER } from '../../constants'

interface MenuItem {
  label: string
  icon: React.ReactElement
  link: string
}

const menu: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: <DashboardIcon />,
    link: 'dashboard'
  },
  {
    label: 'Legal',
    icon: <GavelIcon />,
    link: 'legal'
  },
  {
    label: 'Taxes',
    icon: <ReceiptLongIcon />,
    link: 'taxes'
  },
  {
    label: 'Equity',
    icon: <PieChartIcon />,
    link: 'equity'
  },
  {
    label: 'Projects',
    icon: <AccountTreeIcon />,
    link: 'projects'
  },
  {
    label: 'People',
    icon: <People />,
    link: 'people'
  }
]

const DEFAULT_PATH = 'dashboard'

const getDaoPath = (pathname: string): string => {
  const parts = pathname.split('/')
  if (!parts.length) return DEFAULT_PATH
  const [, , path] = parts
  if (!path) return DEFAULT_PATH
  return path
}

export const GetPageTitle = (): string => {
  const location = useLocation()
  const path = React.useMemo(() => getDaoPath(location.pathname), [location.pathname])

  const defaultMatches = menu.filter(({ link }) => link === DEFAULT_PATH)
  if (!defaultMatches.length) {
    throw new Error('layout/Page/menu.tsx: Missing a matching default path?')
  }
  const defaultTitle = defaultMatches[0].label

  const matches = menu.filter(({ link }) => link === path)
  return matches.length ? matches[0].label : defaultTitle
}

export const MainListItems = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { daoId } = useParams()

  const goto = (path: string) => {
    navigate(`/${daoId}/${path}`)
  }

  const currentPath = React.useMemo(() => getDaoPath(location.pathname), [location.pathname])

  return (
    <React.Fragment>
      {menu.map(({ icon, label, link }) => (
        <ListItemButton key={label} onClick={() => goto(link)} selected={currentPath === link}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText primary={label} />
        </ListItemButton>
      ))}
    </React.Fragment>
  )
}

export const SecondaryListItems = () => {
  return (
    <React.Fragment>
      <ListSubheader component="div" inset>
        Support
      </ListSubheader>
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
