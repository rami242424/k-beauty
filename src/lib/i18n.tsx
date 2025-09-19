// src/lib/i18n.tsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "ko" | "en" | "ja" | "zh";

export type DictKey =
  // 공통 내비/레이블
  | "brand" | "catalog" | "cart" | "checkout" | "admin"
  | "searchPlaceholder" | "todaysDeals" | "rankingTop10" | "category"
  | "seeMore" | "addToCart" | "price"
  // 카탈로그 컨트롤바
  | "category_all" | "category_beauty" | "category_skin_care" | "category_fragrances"
  | "sortRecent" | "sortPriceAsc" | "sortPriceDesc" | "sortRatingDesc"
  | "reset" | "noResults"
  // 토스트
  | "toast_addedToCart"
  // ✅ Cart/Checkout 추가
  | "cart_empty" | "go_to_catalog" | "remove" | "clear_all" | "remove_all"
  | "subtotal" | "order_info" | "order_summary" | "order_complete"
  | "name" | "phone" | "address" | "payment" | "memo_optional"
  | "ordering" | "place_order" | "continue_shopping" | "paid_amount"
  // 결제 수단
  | "pay_card" | "pay_kakao" | "pay_naver" | "pay_payco" | "pay_bank"
  // 유효성(체크아웃)
  | "val_name" | "val_phone" | "val_address"
  // ✅ 네브바(i18n) 추가
  | "home" | "login" | "logout" | "logout_done"
  | "menu_all" | "menu_today" | "menu_rank" | "menu_cart" | "menu_checkout";

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

    toast_addedToCart: "장바구니에 담겼습니다.",

    // Cart/Checkout
    cart_empty: "장바구니가 비어있습니다.",
    go_to_catalog: "카탈로그로 가기",
    remove: "삭제",
    clear_all: "모두 비우기",
    remove_all: "모두 제거",
    subtotal: "합계",
    order_info: "주문 정보",
    order_summary: "주문 요약",
    order_complete: "주문이 완료되었습니다",
    continue_shopping: "계속 쇼핑하기",
    paid_amount: "결제 금액",

    name: "이름",
    phone: "연락처",
    address: "배송지 주소",
    payment: "결제 방법",
    memo_optional: "요청사항 (선택)",
    ordering: "주문 처리 중…",
    place_order: "주문하기",

    pay_card: "카드 결제",
    pay_kakao: "카카오페이",
    pay_naver: "네이버페이",
    pay_payco: "페이코결제",
    pay_bank: "무통장 입금",

    val_name: "이름을 입력하세요",
    val_phone: "연락처를 입력하세요",
    val_address: "주소를 입력하세요",

    // 네브바
    home: "홈",
    login: "로그인",
    logout: "로그아웃",
    logout_done: "로그아웃되었습니다.",
    menu_all: "전체메뉴",
    menu_today: "오특",
    menu_rank: "랭킹",
    menu_cart: "장바구니",
    menu_checkout: "체크아웃",
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

    toast_addedToCart: "Added to cart.",

    cart_empty: "Your cart is empty.",
    go_to_catalog: "Go to catalog",
    remove: "Remove",
    clear_all: "Clear all",
    remove_all: "Remove all",
    subtotal: "Subtotal",
    order_info: "Order information",
    order_summary: "Order summary",
    order_complete: "Order completed",
    continue_shopping: "Continue shopping",
    paid_amount: "Paid amount",

    name: "Name",
    phone: "Phone",
    address: "Shipping address",
    payment: "Payment method",
    memo_optional: "Notes (optional)",
    ordering: "Placing order…",
    place_order: "Place order",

    pay_card: "Card",
    pay_kakao: "Kakao Pay",
    pay_naver: "Naver Pay",
    pay_payco: "Payco",
    pay_bank: "Bank transfer",

    val_name: "Please enter your name",
    val_phone: "Please enter your phone",
    val_address: "Please enter your address",

    home: "Home",
    login: "Sign in",
    logout: "Sign out",
    logout_done: "You have been signed out.",
    menu_all: "All",
    menu_today: "Today’s Deals",
    menu_rank: "Ranking",
    menu_cart: "Cart",
    menu_checkout: "Checkout",
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

    toast_addedToCart: "カートに追加しました。",

    cart_empty: "カートは空です。",
    go_to_catalog: "カタログへ",
    remove: "削除",
    clear_all: "すべて削除",
    remove_all: "全て取り消し",
    subtotal: "小計",
    order_info: "注文情報",
    order_summary: "注文概要",
    order_complete: "注文が完了しました",
    continue_shopping: "買い物を続ける",
    paid_amount: "支払金額",

    name: "氏名",
    phone: "電話番号",
    address: "配送先住所",
    payment: "支払い方法",
    memo_optional: "備考（任意）",
    ordering: "注文処理中…",
    place_order: "注文する",

    pay_card: "カード",
    pay_kakao: "カカオペイ",
    pay_naver: "ネイバーペイ",
    pay_payco: "Payco",
    pay_bank: "銀行振込",

    val_name: "氏名を入力してください",
    val_phone: "電話番号を入力してください",
    val_address: "住所を入力してください",

    home: "ホーム",
    login: "ログイン",
    logout: "ログアウト",
    logout_done: "ログアウトしました。",
    menu_all: "すべて",
    menu_today: "本日の特価",
    menu_rank: "ランキング",
    menu_cart: "カート",
    menu_checkout: "チェックアウト",
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

    toast_addedToCart: "已加入购物车。",

    cart_empty: "购物车为空。",
    go_to_catalog: "前往目录",
    remove: "删除",
    clear_all: "清空",
    remove_all: "全部移除",
    subtotal: "小计",
    order_info: "订单信息",
    order_summary: "订单摘要",
    order_complete: "订单已完成",
    continue_shopping: "继续购物",
    paid_amount: "支付金额",

    name: "姓名",
    phone: "联系电话",
    address: "收货地址",
    payment: "支付方式",
    memo_optional: "备注（可选）",
    ordering: "下单中…",
    place_order: "下单",

    pay_card: "银行卡",
    pay_kakao: "Kakao Pay",
    pay_naver: "Naver Pay",
    pay_payco: "Payco",
    pay_bank: "银行转账",

    val_name: "请输入姓名",
    val_phone: "请输入联系电话",
    val_address: "请输入地址",

    home: "首页",
    login: "登录",
    logout: "登出",
    logout_done: "已登出。",
    menu_all: "全部",
    menu_today: "今日特价",
    menu_rank: "排行榜",
    menu_cart: "购物车",
    menu_checkout: "结算",
  },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: DictKey) => string; };
const I18nCtx = createContext<Ctx | null>(null);

export function I18nProvider({ children, defaultLang = "ko" as Lang }) {
  const [lang, setLang] = useState<Lang>(defaultLang);

  useEffect(() => {
    const saved = (localStorage.getItem("lang") as Lang) || defaultLang;
    setLang(saved);
  }, [defaultLang]);

  const value = useMemo<Ctx>(() => ({
    lang,
    setLang: (l: Lang) => { setLang(l); localStorage.setItem("lang", l); },
    t: (k) => dict[lang][k],
  }), [lang]);

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
