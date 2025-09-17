import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "ko" | "en" | "ja" | "zh";

export type DictKey =
  | "brand"
  | "catalog"
  | "cart"
  | "checkout"
  | "admin"
  | "searchPlaceholder"
  | "todaysDeals"
  | "rankingTop10"
  | "category"
  | "seeMore"
  | "addToCart"
  | "price"
  // 컨트롤바/상태
  | "category_all"
  | "category_beauty"
  | "category_skin_care"
  | "category_fragrances"
  | "sortRecent"
  | "sortPriceAsc"
  | "sortPriceDesc"
  | "sortRatingDesc"
  | "reset"
  | "noResults"
  // ✅ 토스트/알림
  | "toast_addedToCart";

const dict: Record<Lang, Record<DictKey, string>> = {
  ko: {
    brand: "K-Beauty",
    catalog: "카탈로그",
    cart: "장바구니",
    checkout: "체크아웃",
    admin: "관리",
    searchPlaceholder: "상품, 브랜드, 성분 검색",
    todaysDeals: "오늘의 특가",
    rankingTop10: "랭킹 TOP 10",
    category: "카테고리",
    seeMore: "더 보기",
    addToCart: "담기",
    price: "가격",
    category_all: "전체",
    category_beauty: "뷰티",
    category_skin_care: "스킨케어",
    category_fragrances: "향수",
    sortRecent: "신상품순(기본)",
    sortPriceAsc: "가격 낮은순",
    sortPriceDesc: "가격 높은순",
    sortRatingDesc: "평점 높은순",
    reset: "초기화",
    noResults: "조건에 맞는 상품이 없습니다.",
    // ✅ 토스트
    toast_addedToCart: "장바구니에 담겼습니다.",
  },
  en: {
    brand: "K-Beauty",
    catalog: "Catalog",
    cart: "Cart",
    checkout: "Checkout",
    admin: "Admin",
    searchPlaceholder: "Search products, brands, ingredients",
    todaysDeals: "Today’s Deals",
    rankingTop10: "Ranking TOP 10",
    category: "Categories",
    seeMore: "See more",
    addToCart: "Add",
    price: "Price",
    category_all: "All",
    category_beauty: "Beauty",
    category_skin_care: "Skin care",
    category_fragrances: "Fragrances",
    sortRecent: "Newest (default)",
    sortPriceAsc: "Price: Low to High",
    sortPriceDesc: "Price: High to Low",
    sortRatingDesc: "Rating: High to Low",
    reset: "Reset",
    noResults: "No products match your filters.",
    // ✅ toast
    toast_addedToCart: "Added to cart.",
  },
  ja: {
    brand: "K-Beauty",
    catalog: "カタログ",
    cart: "カート",
    checkout: "チェックアウト",
    admin: "管理",
    searchPlaceholder: "商品・ブランド・成分を検索",
    todaysDeals: "本日の特価",
    rankingTop10: "ランキング TOP 10",
    category: "カテゴリ",
    seeMore: "もっと見る",
    addToCart: "追加",
    price: "価格",
    category_all: "すべて",
    category_beauty: "ビューティー",
    category_skin_care: "スキンケア",
    category_fragrances: "フレグランス",
    sortRecent: "新着（デフォルト）",
    sortPriceAsc: "価格が安い順",
    sortPriceDesc: "価格が高い順",
    sortRatingDesc: "評価が高い順",
    reset: "リセット",
    noResults: "条件に合う商品がありません。",
    // ✅ toast
    toast_addedToCart: "カートに追加しました。",
  },
  zh: {
    brand: "K-Beauty",
    catalog: "目录",
    cart: "购物车",
    checkout: "结账",
    admin: "管理",
    searchPlaceholder: "搜索商品、品牌、成分",
    todaysDeals: "今日特价",
    rankingTop10: "排行榜 TOP 10",
    category: "分类",
    seeMore: "查看更多",
    addToCart: "加入",
    price: "价格",
    category_all: "全部",
    category_beauty: "美妆",
    category_skin_care: "护肤",
    category_fragrances: "香水",
    sortRecent: "最新（默认）",
    sortPriceAsc: "价格从低到高",
    sortPriceDesc: "价格从高到低",
    sortRatingDesc: "评分从高到低",
    reset: "重置",
    noResults: "没有符合条件的商品。",
    // ✅ toast
    toast_addedToCart: "已加入购物车。",
  },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: DictKey) => string; };
const I18nCtx = createContext<Ctx | null>(null);

export function I18nProvider({ children, defaultLang = "ko" as Lang }) {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      return (localStorage.getItem("lang") as Lang) || defaultLang;
    } catch {
      return defaultLang;
    }
  });


  const value = useMemo<Ctx>(() => ({
    lang,
    setLang: (l: Lang) => {
      setLang(l);
      localStorage.setItem("lang", l);
    },
    t: (k) => dict[lang][k],
  }), [lang]);

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
