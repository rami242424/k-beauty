// src/components/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../stores/authStore";

export default function ProtectedRoute() {
  const { token, isHydrated, hydrate } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!isHydrated) hydrate();
  }, [isHydrated, hydrate]);

  if (!isHydrated) return <div className="p-6 text-gray-600">로딩 중...</div>;
  if (!token) return <Navigate to="/login" replace state={{ from: location }} />;

  return <Outlet />;
}
