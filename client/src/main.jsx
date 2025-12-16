import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom' // Import the Router
import './index.css' // <--- THIS LINE IS CRITICAL!

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* Wrap the App in Router */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)