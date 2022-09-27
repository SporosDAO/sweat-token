import { ThemeOptions } from '@mui/material'

export const MuiTypographyConfig: ThemeOptions['typography'] = {
  allVariants: {
    letterSpacing: 0,
    fontFamily: ['Inter'].join(',')
  },
  h1: {
    fontSize: '72px',
    lineHeight: '90px',
    fontWeight: 600
  },
  h2: {
    fontSize: '60px',
    lineHeight: '72px',
    fontWeight: 600
  },
  h3: {
    fontSize: '48px',
    lineHeight: '60px',
    fontWeight: 600
  },
  h4: {
    fontSize: '36px',
    lineHeight: '44px',
    fontWeight: 600
  },
  h5: {
    fontSize: '30px',
    lineHeight: '38px',
    fontWeight: 600
  },
  h6: {
    fontSize: '24px',
    lineHeight: '32px',
    fontWeight: 600
  },
  body1: {
    fontSize: '16px',
    lineHeight: '24px'
  },
  body2: {
    fontSize: '20px',
    lineHeight: '30px'
  },
  subtitle1: {
    fontSize: '18px',
    lineHeight: '28px'
  },
  subtitle2: {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: 400
  },
  caption: {
    fontSize: '12px',
    lineHeight: '18px'
  }
}
