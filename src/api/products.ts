export type Product = {
  id: number;
  title: string;
  price: number;
  rating: number;
  category: string;   // "beauty" | "skin-care" | "fragrances"
  thumbnail: string;
};

export const BEAUTY_CATEGORIES = ["beauty", "skin-care", "fragrances"] as const;
export type BeautyCategory = typeof BEAUTY_CATEGORIES[number];

// (공통) fetch 유틸: 실패 시 에러 throw
async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

/** 1) 카테고리 목록: beauty/skin-care/fragrances만 반환 */
export async function fetchBeautyCategories(): Promise<BeautyCategory[]> {
  const data = await fetchJSON<any[]>("https://dummyjson.com/products/categories");
  // API가 문자열 배열을 주므로, 우리가 원하는 3가지만 필터링
  return data.filter((c) => (BEAUTY_CATEGORIES as readonly string[]).includes(c)) as BeautyCategory[];
}

/** 2) 뷰티 전체 상품 모으기: 카테고리별 호출 → 합치기 */
export async function fetchBeautyProducts(): Promise<Product[]> {
  let all: Product[] = [];
  for (const cat of BEAUTY_CATEGORIES) {
    const data = await fetchJSON<{ products: any[] }>(
      `https://dummyjson.com/products/category/${cat}`
    );
    const mapped = (data.products ?? []).map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      rating: p.rating,
      category: p.category,     // e.g. "beauty"
      thumbnail: p.thumbnail,
    })) as Product[];
    all = all.concat(mapped);
  }
  return all;
}

/** 3) (옵션) 특정 카테고리만 개별로 가져오기 — 카탈로그 필터에서 유용 */
export async function fetchBeautyProductsByCategory(cat: BeautyCategory): Promise<Product[]> {
  const data = await fetchJSON<{ products: any[] }>(
    `https://dummyjson.com/products/category/${cat}`
  );
  return (data.products ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    rating: p.rating,
    category: p.category,
    thumbnail: p.thumbnail,
  })) as Product[];
}
