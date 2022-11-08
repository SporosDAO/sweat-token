import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import MenuIcon from '@mui/icons-material/Menu'
import { Avatar, Box, CssBaseline, IconButton, Toolbar, useMediaQuery, useTheme } from '@mui/material'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import MuiDrawer from '@mui/material/Drawer'
import Link from '@mui/material/Link'
import List from '@mui/material/List'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { ReactNode, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { OWNER } from '../../constants'
import { MainMenuItems, DaoMenuItems, SecondaryMenuItems } from '../../context/PageContext'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useGetDAO } from '../../graph/getDAO'

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href={OWNER.homepageUrl} target="_blank" rel="noopener">
        {OWNER.name}
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const drawerWidth = 240

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}))

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9)
      }
    })
  }
}))

interface PageLayoutProps {
  withDrawer?: boolean
  children: ReactNode
}

export function PageLayout(props: PageLayoutProps) {
  const theme = useTheme()

  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const shouldOpen = props.withDrawer !== false && !isMobile

  const [open, setOpen] = useState(shouldOpen)

  console.debug({ props, open, isMobile, shouldOpen })

  const { chainId, daoId } = useParams()
  const cid = Number(chainId)
  const daoResult = useGetDAO(cid, daoId)
  const { data: myDao, isSuccess: isMyDaoLoaded } = daoResult

  const toggleDrawer = () => {
    setOpen(!open)
  }

  useEffect(() => {
    setOpen(shouldOpen)
  }, [shouldOpen])

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="absolute"
        open={open}
        sx={{
          bgcolor: 'background.paper',
          opacity: 0.8
        }}
      >
        <Toolbar
          sx={{
            pr: '24px' // keep right padding when drawer closed
          }}
        >
          {props.withDrawer !== false ? (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' })
              }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <></>
          )}
          <Avatar alt="Sporos DAO logo" src="/logo192.png" sx={{ width: '32px', height: '32px' }} />
          {!isMobile && (
            <Typography variant="subtitle1" fontWeight={600} noWrap sx={{ ml: 2 }}>
              Sporos DAO - The Launchpad of For-Profit DAOs
            </Typography>
          )}
          <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1, ml: 2 }}>
            {isMyDaoLoaded && myDao?.token && `${myDao?.token?.name} (${myDao?.token?.symbol})`}
          </Typography>
          <IconButton color="inherit" aria-label="account">
            {/* <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge> */}
          </IconButton>
          <ConnectButton />
        </Toolbar>
      </AppBar>
      {props.withDrawer !== false ? (
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1]
            }}
          >
            {open && (
              <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            )}
          </Toolbar>
          <Divider />
          <List component="nav">
            {MainMenuItems()}
            <Divider sx={{ my: 1 }} />
            {DaoMenuItems()}
            <Divider sx={{ my: 1 }} />
            {SecondaryMenuItems()}
          </List>
        </Drawer>
      ) : (
        <></>
      )}
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto'
        }}
      >
        <Toolbar />
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          {props.children}
          <Copyright sx={{ pt: 4 }} />
        </Container>
      </Box>
    </Box>
  )
}
