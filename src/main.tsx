import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/catalog" element={<div>Catalog Page</div>} />
        <Route path="/cart" element={<div>Cart Page</div>} />
        <Route path="/checkout" element={<div>Checkout Page</div>} />
        <Route path="/admin" element={<div>Admin Page</div>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
