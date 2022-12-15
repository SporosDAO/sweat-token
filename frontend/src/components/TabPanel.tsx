import Box from '@mui/material/Box'
import { Done } from '@mui/icons-material'

export function useA11yProps(index: number, activeView: number) {
  const isStepDone = index < activeView
  // console.debug({ index, activeView, isStepDone })
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
    icon: isStepDone ? <Done /> : <></>,
    iconPosition: 'end',
    href: '#'
  } as any
}

export function TabPanel({ children, value, index, ...rest }: any) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...rest}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  )
}
