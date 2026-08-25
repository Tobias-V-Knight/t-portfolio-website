import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'

// Every route renders the same desktop. Which window is open is derived from
// the URL inside the window manager, not from a different component tree per
// route, because the desktop underneath has to survive the navigation.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
