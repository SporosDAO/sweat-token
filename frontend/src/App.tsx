import { Route, Routes } from 'react-router-dom'
import Dao from './pages/Dao'
import Landing from './pages/Landing'
import People from './pages/People'
import Proposals from './pages/Proposals'
import DaoCreate from './pages/Dao/create'
import NotFound from './pages/NotFound'
import Projects from './pages/Projects'
import ProjectProposal from './pages/Projects/ProjectProposal'
import ProjectTribute from './pages/Projects/ProjectTribute'
import ProposalDetails from './pages/Proposals/ProposalDetails'
import DaoCreateIntro from './pages/Dao/create/DaoCreateIntro'
import DaoCreateStepper from './pages/Dao/create/DaoCreateStepper'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="dao/chain/:chainId/create" element={<DaoCreate />}>
        <Route index element={<DaoCreateIntro />} />
        <Route path="stepper" element={<DaoCreateStepper />} />
      </Route>
      <Route path="dao/chain/:chainId/address/:daoId" element={<Dao />}>
        <Route path="projects" element={<Projects />}></Route>
        <Route path="projects/propose" element={<ProjectProposal />}></Route>
        <Route path="projects/:projectId/tribute" element={<ProjectTribute />}></Route>
        <Route path="proposals" element={<Proposals />}></Route>
        <Route path="proposals/:serial" element={<ProposalDetails />}></Route>
        <Route path="people" element={<People />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
