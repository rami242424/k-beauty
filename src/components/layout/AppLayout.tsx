import Navbar from "../Navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {/* 헤더: 풀너비 배경 + 안쪽만 가운데 정렬 */}
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-6">
          <Navbar />
        </div>
      </header>

      {/* 메인 컨텐츠 영역: 항상 가운데 고정폭 */}
      <main>
        <div className="mx-auto max-w-6xl px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
