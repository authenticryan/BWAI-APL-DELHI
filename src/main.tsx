import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { StadiumProvider } from './context/StadiumContext'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <StadiumProvider>
        <App />
      </StadiumProvider>
    </BrowserRouter>
  </StrictMode>
)
