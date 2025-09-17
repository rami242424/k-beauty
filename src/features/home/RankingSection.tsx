import { useRef } from "react";
import type { Product } from "../../api/products";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { useCartStore } from "../order/cartStore";
import { toast } from "sonner";
import { formatFromUSD, numberFromUSD } from "../../lib/money"; // ✅
import { useI18n } from "../../lib/i18n"; // ✅ 버튼/언어

export default function RankingSection({
  products,
  title = "랭킹 TOP 10",
}: {
  products: Product[];
  title?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = ref.current;
    if (!el) return;
    const { clientWidth } = el;
    el.scrollBy({ left: dir === "left" ? -clientWidth : clientWidth, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <h3 className="text-lg font-bold ink mb-3">{title}</h3>

      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white/80 shadow border hover:bg-white"
        aria-label="왼쪽으로"
      >
        ◀
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white/80 shadow border hover:bg-white"
        aria-label="오른쪽으로"
      >
        ▶
      </button>

      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto overflow-y-visible scroll-smooth px-10 py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
      >
        {products.map((p, idx) => (
          <div key={p.id} className="min-w-[220px]">
            <div className="text-xs text-gray-500 mb-1">#{idx + 1}</div>
            <RankingCard p={p} />
          </div>
        ))}
      </div>
    </div>
  );
}

function RankingCard({ p }: { p: Product }) {
  const addItem = useCartStore(s => s.addItem);
  const { lang, t } = useI18n(); // ✅

  return (
    <article className="card flex h-full flex-col p-3">
      <div className="mb-3 h-32 w-full overflow-hidden rounded-xl bg-white">
        <img src={p.thumbnail} alt={p.title} className="h-full w-full object-contain" />
      </div>

      <div className="font-semibold line-clamp-2 min-h-[3rem] ink">{p.title}</div>

      <div className="mt-1 flex items-center gap-2 text-sm">
        <span className="text-gray-500 capitalize">{p.category.replace("-", " ")}</span>
        <Badge variant="brand">
          ★ {typeof p.rating === "number" ? p.rating.toFixed(1) : p.rating}
        </Badge>
      </div>

      {/* ✅ 기존 `...원` 하드코딩 제거 → 다국어 통화 표기 */}
      <div className="mt-1 price font-bold">{formatFromUSD(p.price, lang)}</div>

      <div className="mt-auto" />

      <Button
        variant="solid"
        className="mt-3 w-full"
        onClick={() => {
          addItem({
            id: String(p.id),
            name: p.title,
            price: numberFromUSD(p.price, lang), // ✅ 카트 금액도 현재 통화로
            imageUrl: p.thumbnail,
            qty: 1,
          });
          toast.success(t("toast_addedToCart"));
        }}
      >
        {t("addToCart")}
      </Button>
    </article>
  );
}
