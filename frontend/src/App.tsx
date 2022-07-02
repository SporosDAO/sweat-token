import { createTheme, ThemeProvider } from '@mui/material'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Dao from './pages/Dao'
import Dashboard from './pages/Dashboard'
import Equity from './pages/Equity'
import Landing from './pages/Landing'
import Legal from './pages/Legal'
import NotFound from './pages/NotFound'
import People from './pages/People'
import Projects from './pages/Projects'
import ProjectAdd from './pages/Projects/pages/ProjectAdd'
import ProjectView from './pages/Projects/pages/ProjectView'
import ProjectDashboard from './pages/Projects/pages/ProjectDashboard'
import Taxes from './pages/Taxes'
import DaoCreate from './pages/DaoCreate'
import Registration from './pages/Legal/registration'

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
        <Route path="dao/create" element={<DaoCreate />} />
        <Route path="dao/chain/:chainId/address/:daoId" element={<Dao />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="legal" element={<Legal />} />
          <Route path="legal/registration" element={<Registration />} />
          <Route path="taxes" element={<Taxes />} />
          <Route path="equity" element={<Equity />} />
          <Route path="projects" element={<Projects />}>
            <Route index element={<ProjectDashboard />} />
            <Route path=":projectId" element={<ProjectView />} />
            <Route path="add" element={<ProjectAdd />} />
          </Route>
          <Route path="people" element={<People />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
