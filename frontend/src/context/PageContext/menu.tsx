import {
  ThumbUpOutlined,
  FolderOutlined,
  HelpOutlined,
  HomeOutlined,
  MenuBookOutlined,
  HowToRegOutlined
} from '@mui/icons-material'
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import * as React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { OWNER } from '../../constants'

export const MainMenuItems = () => {
  const navigate = useNavigate()
  return (
    <React.Fragment>
      <ListItemButton data-testid="home-button" onClick={() => navigate('/')}>
        <ListItemIcon>
          <HomeOutlined />
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
  dataCy?: string
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
    icon: FolderOutlined,
    link: 'projects/',
    dataCy: 'projects-button'
  },
  {
    label: 'Proposals',
    icon: ThumbUpOutlined,
    link: 'proposals/',
    dataCy: 'proposals-button'
  },
  {
    label: 'Members',
    icon: HowToRegOutlined,
    link: 'people/',
    dataCy: 'people-button'
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
      {menu.map(({ icon: MenuIcon, label, link, dataCy }) => (
        <ListItemButton key={label} onClick={() => goto(link)} selected={currentPath === link} data-testid={dataCy}>
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
      <ListItemButton href={OWNER.docsUrl} rel="noopener" target="_blank">
        <ListItemIcon>
          <MenuBookOutlined />
        </ListItemIcon>
        <ListItemText primary="Docs" />
      </ListItemButton>
      <ListItemButton href={OWNER.helpUrl} rel="noopener" target="_blank">
        <ListItemIcon>
          <HelpOutlined />
        </ListItemIcon>
        <ListItemText data-testid="help-link" primary="Help" />
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
