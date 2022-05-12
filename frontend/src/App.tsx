import { AppBar, Box, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { PageLayout } from './layout/Page';
import { Dashboard } from './pages/Dashboard';

const mdTheme = createTheme();

function App() {

  return (
    <ThemeProvider theme={mdTheme}>
      <PageLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </PageLayout>
    </ThemeProvider>
  );
}

export default App;
