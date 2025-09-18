import { Routes, Route } from "react-router-dom";
import HomePage from "./features/home/HomePage";
import CatalogPage from "./features/catalog/CatalogPage";
import CartPage from "./features/order/CartPage";
import CheckoutPage from "./features/order/CheckoutPage";
import CheckoutSuccessPage from "./features/order/CheckoutSuccessPage";

export default function App() {
  return (
    <Routes>
      {/* 홈 */}
      <Route path="/" element={<HomePage />} />

      {/* 카탈로그 */}
      <Route path="/catalog" element={<CatalogPage />} />

      {/* 장바구니 */}
      <Route path="/cart" element={<CartPage />} />

      {/* 결제 */}
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/checkout/success" element={<CheckoutSuccessPage />} />

      {/* 어드민 */}
      <Route
        path="/admin"
        element={
          <div className="mx-auto max-w-[var(--container)] px-4 py-6">
            Admin Page
          </div>
        }
      />

      {/* (옵션) 404 Not Found */}
      <Route
        path="*"
        element={
          <div className="mx-auto max-w-[var(--container)] px-4 py-6 text-center">
            <h1 className="text-2xl font-bold">404 - 페이지를 찾을 수 없습니다</h1>
          </div>
        }
      />
    </Routes>
  );
}
