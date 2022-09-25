import { Route, Routes } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'

import Dao from './pages/Dao'
import People from './pages/People'
import Landing from './pages/Landing'
import DaoLanding from './pages/Dao/index'
import CreateDao from './pages/Dao/create'
import NotFound from './pages/NotFound'
import Projects from './pages/Projects'
import ProjectProposal from './pages/Projects/ProjectProposal'
import ProjectTribute from './pages/Projects/ProjectTribute'
import { useTheme } from './hooks/useTheme'

const App = () => (
  <ThemeProvider theme={useTheme()}>
    <CssBaseline />
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dao" element={<DaoLanding />} />
      {/* @todo - remove routes, only temporary for testing purposes */}
      <Route path="/dao/create" element={<CreateDao />} />
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

export default App
