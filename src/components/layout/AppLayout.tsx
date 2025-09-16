// src/components/layout/AppLayout.tsx
import Navbar from "../Navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {/* 상단 고정 헤더 */}
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-[var(--container)] px-6">
          {/* Navbar 안에 언어 드롭다운 포함 */}
          <Navbar />
        </div>
      </header>

      {/* 메인 컨테이너 */}
      <main>
        <div className="mx-auto max-w-[var(--container)] px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
