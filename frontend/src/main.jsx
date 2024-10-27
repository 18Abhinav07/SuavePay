import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SuavePayApp from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SuavePayApp />
  </StrictMode>,
)
