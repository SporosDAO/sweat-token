import React from 'react'

import { green } from '@mui/material/colors'

// Uses MUIv5 Theme API

export const getDesignTokens = (mode: string) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: green
        }
      : {
          primary: green
        })
  }
})
