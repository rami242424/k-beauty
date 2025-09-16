import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import App from './App.tsx'
import CatalogPage from './features/catalog/CatalogPage.tsx'
import CartPage from './features/order/CartPage.tsx'
import CheckoutPage from './features/order/CheckoutPage.tsx'
import CheckoutSuccessPage from './features/order/CheckoutSuccessPage.tsx'
import './index.css'
import AppLayout from './components/layout/AppLayout.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster richColors position="top-center" />
      <AppLayout>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
          <Route path="/admin" element={<div className="mx-auto max-w-[var(--container)] px-4 py-6">Admin Page</div>} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  </StrictMode>,
)
