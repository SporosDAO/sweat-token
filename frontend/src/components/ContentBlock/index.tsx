import { Paper, SxProps, Theme } from '@mui/material'
import { Box } from '@mui/system'
import { ReactNode } from 'react'

interface ContentBlockProps {
  title?: string
  children?: ReactNode
  sx?: SxProps<Theme>
}

export default function ContentBlock(props: ContentBlockProps) {
  const { title, children, sx } = props
  return (
    <Paper
      sx={
        sx || {
          p: 2,
          mb: 2
        }
      }
    >
      {title ? (
        <Box>
          <h2>{title}</h2>
        </Box>
      ) : (
        <></>
      )}
      {children ? <Box>{children}</Box> : <></>}
    </Paper>
  )
}
//
