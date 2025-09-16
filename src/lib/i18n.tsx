import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Lang = "ko" | "en" | "ja" | "zh";

// 화면에서 쓸 텍스트 키들
type DictKey =
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
  | "price";

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
  },
};

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: DictKey) => string;
};

const I18nCtx = createContext<Ctx | null>(null);

export function I18nProvider({ children, defaultLang = "ko" as Lang }) {
  const [lang, setLang] = useState<Lang>(defaultLang);

  useEffect(() => {
    const saved = (localStorage.getItem("lang") as Lang) || defaultLang;
    setLang(saved);
  }, [defaultLang]);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang: (l: Lang) => {
        setLang(l);
        localStorage.setItem("lang", l);
      },
      t: (k) => dict[lang][k],
    }),
    [lang]
  );

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
