import Navbar from "../Navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {/* 상단 고정 헤더 */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b py-0">
        <div className="mx-auto max-w-[var(--container)] px-6">
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
