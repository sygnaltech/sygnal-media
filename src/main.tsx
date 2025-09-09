import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'            // or a small demo page importing your components
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
