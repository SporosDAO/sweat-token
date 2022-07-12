import { createTheme, ThemeProvider } from '@mui/material'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Landing from './pages/Landing'
import NotFound from './pages/NotFound'
import People from './pages/People'
import Projects from './pages/Projects'
import Dao from './pages/Dao'
import ProjectProposal from './pages/Projects/ProjectProposal'
import ProjectTribute from './pages/Projects/ProjectTribute'

const mdTheme = createTheme({
  palette: {
    mode: 'dark'
  }
})

function App() {
  return (
    <ThemeProvider theme={mdTheme}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="dao/chain/:chainId/address/:daoId" element={<Dao />}>
          <Route path="projects" element={<Projects />}></Route>
          <Route path="projects/propose" element={<ProjectProposal />}></Route>
          <Route path="projects/:projectId/tribute" element={<ProjectTribute />}></Route>
          <Route path="people" element={<People />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
