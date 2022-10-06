import { Route, Routes } from 'react-router-dom'

import Dao from './pages/Dao'
import People from './pages/People'
import Landing from './pages/Landing'
import DaoLanding from './pages/Dao'
import CreateDao from './pages/Dao/create'
import NotFound from './pages/NotFound'
import Projects from './pages/Projects'
import ProjectProposal from './pages/Projects/ProjectProposal'
import ProjectTribute from './pages/Projects/ProjectTribute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="dao" element={<DaoLanding />} />
      <Route path="dao/create" element={<CreateDao />} />
      <Route path="dao/chain/:chainId/address/:daoId" element={<Dao />}>
        <Route path="projects" element={<Projects />} />
        <Route path="projects/propose" element={<ProjectProposal />} />
        <Route path="projects/:projectId/tribute" element={<ProjectTribute />} />
        <Route path="people" element={<People />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
