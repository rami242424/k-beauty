import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchBeautyProducts, type Product } from "../../api/products";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { useCartStore } from "../order/cartStore";
import { toast } from "sonner";
import { useI18n } from "../../lib/i18n";
import { formatFromUSD } from "../../lib/money";

export default function CatalogPage() {
  const { t, lang } = useI18n();
  const [params] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ URL 파라미터
  const rawQ = params.get("q");
  const rawCategory = params.get("category");
  const view = params.get("view"); // "today" -> 오특
  const sort = params.get("sort"); // "rank"  -> 랭킹

  const q = (rawQ ?? "").trim();
  const category = (rawCategory ?? "").trim();

  // ✅ 데이터 로드
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const prods = await fetchBeautyProducts();
        if (!mounted) return;
        setProducts(Array.isArray(prods) ? prods : []);
      } catch (e) {
        console.error(e);
        setProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // ✅ 필터/정렬
  const filtered = useMemo(() => {
    let list = [...products];

    // 검색어 필터
    if (q) {
      const qq = q.toLowerCase();
      list = list.filter((p) => {
        const title = (p.title ?? "").toLowerCase();
        const cat = (p.category ?? "").toLowerCase();
        return title.includes(qq) || cat.includes(qq);
      });
    }

    // 카테고리 필터
    if (category) {
      const cc = category.toLowerCase();
      list = list.filter((p) => (p.category ?? "").toLowerCase() === cc);
    }

    // 오특/랭킹 모드
    if (view === "today") {
      // 가격 오름차순(특가 느낌)
      list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sort === "rank") {
      // 평점 내림차순
      list.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    }

    return list;
  }, [products, q, category, view, sort]);

  const title =
    view === "today" ? "오늘의 특가" :
    sort === "rank" ? "랭킹" :
    "전체 상품";

  if (loading) return <div className="p-6 text-gray-600">로딩 중...</div>;

  return (
    <div className="mx-auto max-w-[var(--container)]">
      <div className="flex items-baseline justify-between">
        <h1 className="text-xl font-bold ink">{title}</h1>
        <div className="text-sm text-gray-500">
          총 <b>{filtered.length}</b>개
        </div>
      </div>

      {/* 그리드 */}
      <div className="mt-4 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6">
        {filtered.map((p) => (
          <CatalogCard key={p.id} p={p} lang={lang} t={t} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center text-gray-500">
          {t("noResults") ?? "검색 결과가 없습니다."}
        </div>
      )}
    </div>
  );
}

/* ===== 카드 컴포넌트 ===== */
function CatalogCard({
  p,
  lang,
  t,
}: {
  p: Product;
  lang: string;
  t: (k: string) => string;
}) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <article className="card flex h-full flex-col p-3">
      <div className="h-40 mb-3 w-full overflow-hidden rounded-xl bg-white">
        <img
          src={p.thumbnail}
          alt={p.title}
          className="h-full w-full object-contain"
          loading="lazy"
        />
      </div>

      <div className="font-semibold line-clamp-2 min-h-[3rem] ink">
        {p.title}
      </div>

      <div className="mt-1 flex items-center gap-2 text-sm">
        <span className="text-gray-500 capitalize">
          {(p.category ?? "").replace("-", " ")}
        </span>
        <Badge variant="brand">
          ★ {typeof p.rating === "number" ? p.rating.toFixed(1) : String(p.rating)}
        </Badge>
      </div>

      <div className="mt-1 price font-bold">
        {formatFromUSD(Number(p.price) || 0, lang)}
      </div>

      <div className="mt-auto" />

      <Button
        variant="solid"
        className="mt-3 w-full"
        onClick={() => {
          addItem({
            id: String(p.id),
            name: p.title,
            priceUsd: Number(p.price) || 0,
            imageUrl: p.thumbnail,
            qty: 1,
          });
          toast.success(t("toast_addedToCart") ?? "장바구니에 담았습니다");
        }}
      >
        {t("addToCart")}
      </Button>
    </article>
  );
}
