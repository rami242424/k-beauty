import { useRef } from "react";
import type { Product } from "../../api/products";

/**
 * 홈에서 쓰는 공용 캐러셀 섹션
 * - props로 api/products의 Product[] (thumbnail/title/price/category/rating) 그대로 받음
 * - 좌우 화살표로 한 화면(clientWidth)씩 이동
 */
export default function RankingSection({ products, title = "랭킹 TOP10" }: {
  products: Product[];
  title?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const { clientWidth } = el;
    el.scrollBy({
      left: dir === "left" ? -clientWidth : clientWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {/* 섹션 타이틀 (원하면 HomePage 쪽 타이틀은 지우세요) */}
      <h3 className="text-lg font-bold mb-3">{title}</h3>

      {/* 좌우 버튼 */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 grid place-items-center
                   h-9 w-9 rounded-full bg-white/80 shadow border hover:bg-white"
        aria-label="왼쪽으로"
      >
        ◀
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 grid place-items-center
                   h-9 w-9 rounded-full bg-white/80 shadow border hover:bg-white"
        aria-label="오른쪽으로"
      >
        ▶
      </button>

      {/* 캐러셀 리스트: x만 스크롤, y는 숨김, 스크롤바 숨김 */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth px-10 py-1
                   [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
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
  return (
    <article className="flex h-full flex-col rounded-2xl border p-3 shadow-sm hover:shadow transition bg-white">
      {/* 이미지: 고정높이 + contain */}
      <div className="mb-3 h-32 w-full overflow-hidden rounded-xl bg-white">
        <img
          src={p.thumbnail}          // ✅ thumbnail 사용
          alt={p.title}              // ✅ title 사용
          className="h-full w-full object-contain"
        />
      </div>

      {/* 제목 2줄 고정 높이 */}
      <div className="font-semibold line-clamp-2 min-h-[3rem]">{p.title}</div>

      <div className="mt-1 flex items-center gap-2 text-sm">
        <span className="text-gray-500 capitalize">{p.category.replace("-", " ")}</span>
        <span className="text-xs text-yellow-600">
          ★ {typeof p.rating === "number" ? p.rating.toFixed(1) : p.rating}
        </span>
      </div>

      <div className="mt-1 font-bold text-pink-600">{p.price.toLocaleString()}원</div>

      <div className="mt-auto" />

      <button className="mt-3 w-full rounded-xl border py-2 hover:bg-gray-50">담기</button>
    </article>
  );
}
