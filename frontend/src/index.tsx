import ReactDOM from 'react-dom/client'
import App from './App'
import { AppWrapper } from './AppWrapper'
import { lightTheme } from './theme'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <AppWrapper theme={lightTheme}>
    <App />
  </AppWrapper>
)
