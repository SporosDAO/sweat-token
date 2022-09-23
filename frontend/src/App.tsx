import { ThemeProvider } from '@mui/material'
import { Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import NotFound from './pages/NotFound'
import People from './pages/People'
import Projects from './pages/Projects'
import Dao from './pages/Dao'
import ProjectProposal from './pages/Projects/ProjectProposal'
import ProjectTribute from './pages/Projects/ProjectTribute'
import { darkTheme, lightTheme } from './theme/theme'
import { useState } from 'react'

function App() {
  function detectColorScheme() {
    const newColorScheme =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? darkTheme : lightTheme
    return newColorScheme
  }

  const [theme, setTheme] = useState(detectColorScheme())

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    // sync with user's device color mode preference
    setTheme(detectColorScheme())
  })

  return (
    <ThemeProvider theme={theme}>
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
