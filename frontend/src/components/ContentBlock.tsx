import { Fab, Card, SxProps, Theme } from '@mui/material'
import { Box } from '@mui/system'
import { ReactNode } from 'react'
import { Add } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

interface ContentBlockProps {
  title?: string
  children?: ReactNode
  cta?: {
    text: string
    href: string
  }
  sx?: SxProps<Theme>
}

export default function ContentBlock(props: ContentBlockProps) {
  const { title, children, sx, cta } = props
  const navigate = useNavigate()
  return (
    <Card sx={sx}>
      <Box display={'flex'}>
        {title && <h2>{title}</h2>}
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
      {children ? <Box>{children}</Box> : <></>}
    </Card>
  )
}
