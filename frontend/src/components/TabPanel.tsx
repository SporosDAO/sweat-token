import Box from '@mui/material/Box'

const a11yProps = (index: number) => ({
  id: `simple-tab-${index}`,
  'aria-controls': `simple-tabpanel-${index}`
})

const TabPanel = ({ children, value, index, ...rest }: any) => (
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

export { a11yProps, TabPanel }
