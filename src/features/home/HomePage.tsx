import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCategories, fetchProducts, type Product } from "../../api/products";

export default function HomePage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [cats, prods] = await Promise.all([
          fetchCategories(),
          fetchProducts(60),
        ]);
        if (!mounted) return;
        setCategories(cats.slice(0, 12));
        setProducts(prods);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const todaysDeals = useMemo(
    () => [...products].sort((a, b) => a.price - b.price).slice(0, 6),
    [products]
  );
  const topRank = useMemo(
    () => [...products].sort((a, b) => b.rating - a.rating).slice(0, 10),
    [products]
  );

  if (loading) return <div className="p-6 text-gray-600">로딩 중...</div>;

  return (
    <div className="pb-16">
      {/* 상단 */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-14">
          <Link to="/" className="font-extrabold text-2xl">K-Beauty</Link>
          <nav className="hidden sm:flex gap-6 text-sm text-gray-600">
            <Link to="/catalog">카탈로그</Link>
            <Link to="/cart">장바구니</Link>
            <Link to="/checkout">체크아웃</Link>
            <Link to="/admin">관리</Link>
          </nav>
          <div className="flex-1 max-w-md ml-4">
            <input
              placeholder="상품, 브랜드, 성분 검색"
              className="w-full px-3 py-2 rounded-xl border outline-none"
            />
          </div>
        </div>
      </header>

      {/* 히어로 배너 (간단 슬라이드 느낌) */}
      <section className="mt-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory rounded-2xl"
               style={{ scrollBehavior: "smooth" }}>
            {["retinol", "hydration", "lipcare"].map((seed, i) => (
              <div key={seed} className="snap-center min-w-[90%] sm:min-w-[48%] md:min-w-[32%] relative">
                <img
                  src={`https://picsum.photos/seed/${seed}/1200/400`}
                  alt={`banner-${i}`}
                  className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-2xl border"
                />
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-xl font-semibold">NEW 프로모션 {i + 1}</div>
                  <p className="text-sm opacity-90">지금 가장 핫한 제품</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 카테고리 퀵 메뉴 */}
      <section className="mt-8">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-lg font-bold mb-3">카테고리</h2>
          <div className="flex gap-2 overflow-x-auto py-2">
            {categories.map(c => (
              <Link key={c}
                to={`/catalog?category=${encodeURIComponent(c)}`}
                className="px-3 py-2 rounded-full border text-sm hover:bg-gray-50 whitespace-nowrap">
                {c}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 오늘의 특가 */}
      <section className="mt-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-bold">오늘의 특가</h2>
            <Link to="/catalog" className="text-sm text-blue-600">더 보기 →</Link>
          </div>
          <div className="mt-4 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6">
            {todaysDeals.map(p => <ProductCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* 랭킹 TOP10 */}
      <section className="mt-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-lg font-bold mb-3">랭킹 TOP10</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {topRank.map((p, idx) => (
              <div key={p.id} className="min-w-[220px]">
                <div className="text-xs text-gray-500 mb-1">#{idx + 1}</div>
                <ProductCard p={p} compact />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ p, compact }: { p: Product; compact?: boolean }) {
  return (
    <article className="rounded-2xl border p-3 shadow-sm hover:shadow transition bg-white">
      <img
        src={p.thumbnail}
        alt={p.title}
        className={`w-full ${compact ? "h-32" : "h-40"} object-cover rounded-xl mb-3`}
      />
      <div className="font-semibold line-clamp-2">{p.title}</div>
      <div className="text-sm text-gray-500 capitalize">{p.category}</div>
      <div className="mt-1 font-bold">{p.price.toLocaleString()}원</div>
      <div className="text-xs text-yellow-600 mt-1">★ {p.rating.toFixed(1)}</div>
      <button className="mt-3 w-full py-2 rounded-xl border hover:bg-gray-50">담기</button>
    </article>
  );
}

