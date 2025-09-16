// src/features/home/HomePage.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchBeautyCategories,
  fetchBeautyProducts,
  type Product,
} from "../../api/products";
import RankingSection from "./RankingSection";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { useCartStore } from "../order/cartStore";
import { toast } from "sonner";

export default function HomePage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [cats, prods] = await Promise.all([
          fetchBeautyCategories(),
          fetchBeautyProducts(),
        ]);
        if (!mounted) return;
        setCategories(cats);
        setProducts(prods);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
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
      {/* 상단 바 + 간단 검색 */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-14">
          <Link to="/" className="font-extrabold text-2xl ink">K-Beauty</Link>
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

      {/* 히어로 배너 */}
      <section className="mt-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory rounded-2xl" style={{ scrollBehavior: "smooth" }}>
            {["retinol", "hydration", "lipcare"].map((seed, i) => (
              <div key={seed} className="snap-center min-w-[90%] sm:min-w-[48%] md:min-w-[32%] relative">
                <img
                  src={`https://picsum.photos/seed/${seed}/1200/400`}
                  alt={`banner-${i}`}
                  className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-2xl border"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/40 to-transparent" />
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
          <h2 className="text-lg font-bold ink mb-3">카테고리</h2>
          <div className="flex gap-2 overflow-x-auto py-2">
            {categories.map((c) => (
              <Link
                key={c}
                to={`/catalog?category=${encodeURIComponent(c)}`}
                className="chip capitalize whitespace-nowrap"
              >
                {c.replace("-", " ")}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 오늘의 특가 */}
      <section className="mt-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-bold ink">오늘의 특가</h2>
            <Link to="/catalog" className="text-sm text-brand-600">더 보기 →</Link>
          </div>
          <div className="mt-4 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6">
            {todaysDeals.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 랭킹 TOP10 */}
      <section className="mt-10">
        <div className="max-w-6xl mx-auto px-4">
          <RankingSection products={topRank} />
        </div>
      </section>
    </div>
  );
}

function ProductCard({ p, compact }: { p: Product; compact?: boolean }) {
  const addItem = useCartStore(s => s.addItem);

  return (
    <article className="card flex h-full flex-col p-3">
      <div className={`${compact ? "h-32" : "h-40"} mb-3 w-full overflow-hidden rounded-xl bg-white`}>
        <img src={p.thumbnail} alt={p.title} className="h-full w-full object-contain" />
      </div>

      <div className="font-semibold line-clamp-2 min-h-[3rem] ink">{p.title}</div>

      <div className="mt-1 flex items-center gap-2 text-sm">
        <span className="text-gray-500 capitalize">{p.category.replace("-", " ")}</span>
        <Badge variant="brand">
          ★ {typeof p.rating === "number" ? p.rating.toFixed(1) : p.rating}
        </Badge>
      </div>

      <div className="mt-1 price font-bold">{p.price.toLocaleString()}원</div>

      <div className="mt-auto" />

      {/* ✅ 색 있는 버튼 + 담기 동작 */}
      <Button
        variant="solid"
        className="mt-3 w-full"
        onClick={() => {
          addItem({
            id: String(p.id),
            name: p.title,
            price: p.price,
            imageUrl: p.thumbnail,
            qty: 1,
          });
          toast.success("장바구니에 담겼습니다.");
        }}
      >
        담기
      </Button>
    </article>
  );
}
