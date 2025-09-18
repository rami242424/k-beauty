import { Routes, Route } from "react-router-dom";
import HomePage from "./features/home/HomePage";
import CatalogPage from "./features/catalog/CatalogPage";
import CartPage from "./features/order/CartPage";
import CheckoutPage from "./features/order/CheckoutPage";
import CheckoutSuccessPage from "./features/order/CheckoutSuccessPage";
import LoginPage from "./features/auth/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* 공개 페이지 */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/cart" element={<CartPage />} />

      {/* 지금은 공개로 두되, 보호로 바꾸고 싶으면 아래 블럭으로 이동 */}
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/checkout/success" element={<CheckoutSuccessPage />} />

      
      <Route element={<ProtectedRoute />}>
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
        {/* <Route path="/admin" element={<AdminPage />} /> */}
      </Route>
     

      <Route
        path="/admin"
        element={
          <div className="mx-auto max-w-[var(--container)] px-4 py-6">Admin Page</div>
        }
      />

      {/* 404 */}
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
