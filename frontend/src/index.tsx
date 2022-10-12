import { createRoot } from 'react-dom/client'
import App from './App'
import { AppWrapper } from './AppWrapper'
import { lightTheme } from './theme'

export const root = createRoot(document.getElementById('root') as HTMLElement)

export const rootRender = root.render(
  <AppWrapper theme={lightTheme}>
    <App />
  </AppWrapper>
)
