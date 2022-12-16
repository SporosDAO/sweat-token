import { Fab, Box, Stack, SxProps, Theme, Typography } from '@mui/material'
import { ReactNode } from 'react'
import { Add } from '@mui/icons-material'
import Alert, { AlertColor } from '@mui/material/Alert'

import { useNavigate } from 'react-router-dom'

interface ContentBlockProps {
  title?: string
  children?: ReactNode
  cta?: {
    text: string
    href: string
  }
  alert?: {
    text: string
    type?: AlertColor
    action?: ReactNode
  }
  sx?: SxProps<Theme>
}

export default function ContentBlock(props: ContentBlockProps) {
  const { title, children, sx, cta, alert } = props
  const navigate = useNavigate()
  return (
    <Stack sx={sx} spacing={2}>
      <Box display={'flex'}>
        {title && (
          <Typography variant="h4" noWrap sx={{ m: 2 }}>
            {title}
          </Typography>
        )}
        {cta?.href && (
          <Fab
            sx={{ margin: '10px 0 0 auto', order: 2 }}
            variant="extended"
            color="primary"
            onClick={() => {
              navigate(cta?.href)
            }}
            data-testid="cta-button"
          >
            <Add />
            {cta?.text}
          </Fab>
        )}
      </Box>
      {alert?.text && (
        <Box display={'flex'} justifyContent="center">
          <Alert severity={alert.type || 'info'} data-testid="toast-alert" variant="filled" action={alert.action}>
            {alert.text}
          </Alert>
        </Box>
      )}
      {children ? <Box>{children}</Box> : <></>}
    </Stack>
  )
}
