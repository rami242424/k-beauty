import { Routes, Route } from "react-router-dom";
import HomePage from "./features/home/HomePage";
import CatalogPage from "./features/catalog/CatalogPage";
import CartPage from "./features/order/CartPage";
import CheckoutPage from "./features/order/CheckoutPage";
import CheckoutSuccessPage from "./features/order/CheckoutSuccessPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
      <Route
        path="/admin"
        element={<div className="mx-auto max-w-[var(--container)] px-4 py-6">Admin Page</div>}
      />
    </Routes>
  );
}
