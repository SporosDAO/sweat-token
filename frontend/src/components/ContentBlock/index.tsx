import { Paper, Theme, SxProps } from '@mui/material'
import { Box } from '@mui/system'
import { ReactNode } from 'react'

interface ContentBlockProps {
  title?: string
  children?: ReactNode
  sx?: SxProps<Theme>
}

export default function ContentBlock(props: ContentBlockProps) {
  return (
    <Paper
      sx={
        props.sx || {
          p: 2,
          height: 240
        }
      }
    >
      {props.title ? (
        <Box>
          <h2>{props.title}</h2>
        </Box>
      ) : (
        <></>
      )}
      {props.children ? <Box>{props.children}</Box> : <></>}
    </Paper>
  )
}
