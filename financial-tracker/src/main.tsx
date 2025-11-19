/**
 * financial-tracker/src/main.tsx
 *
 * Entry point for the React application. Mounts the App component to the root DOM element.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/globals.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)