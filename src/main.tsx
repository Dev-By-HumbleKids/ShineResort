import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { StayProvider } from './context/StayContext'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'

// HashRouter keeps deep links working on static hosts such as GitHub Pages.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <ThemeProvider>
        <StayProvider>
          <App />
        </StayProvider>
      </ThemeProvider>
    </HashRouter>
  </StrictMode>,
)
