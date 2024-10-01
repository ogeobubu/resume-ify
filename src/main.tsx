import React from "react"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter as Router } from "react-router-dom";
import './index.css'

createRoot(document.getElementById('root')!).render(
  <Router>
    <App />
  </Router>,
)
