import { createTheme, ThemeProvider } from '@mui/material'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Dao from './pages/Dao'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import Legal from './pages/Legal'
import Taxes from './pages/Taxes'
import Equity from './pages/Equity'
import People from './pages/People'
import Projects from './pages/Projects'

const mdTheme = createTheme()

function App() {
  return (
    <ThemeProvider theme={mdTheme}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path=":daoId" element={<Dao />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="legal" element={<Legal />} />
          <Route path="taxes" element={<Taxes />} />
          <Route path="equity" element={<Equity />} />
          <Route path="projects" element={<Projects />} />
          <Route path="people" element={<People />} />
          <Route path="*" element={<Dashboard />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
