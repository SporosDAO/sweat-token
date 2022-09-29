import ReactDOM from 'react-dom/client'
import App from './App'
import { AppWrapper } from './AppWrapper'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <AppWrapper>
    <App />
  </AppWrapper>
)
