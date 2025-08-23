import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CatalogPage from './features/catalog/CatalogPage';
import Navbar from './components/Navbar';
import CartPage from './features/order/CartPage.tsx'
import CheckoutPage from './features/order/CheckoutPage.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<App />} />
        {/* <Route path="/catalog" element={<div>Catalog Page</div>} /> */}
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/admin" element={<div>Admin Page</div>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
