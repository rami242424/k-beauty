import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  imageUrl: string;
  qty: number;
  /** ✅ USD 기준 단가 (언어/통화와 무관) */
  priceUsd: number;
};

export type AddToCartPayload =
  | {
      id: string;
      name: string;
      imageUrl: string;
      qty?: number;
      /** ✅ 신규 권장: USD 기준 단가 */
      priceUsd: number;
    }
  // (이전 코드와의 호환: legacy 필드. v2에서는 감지 시 무시/정리)
  | {
      id: string;
      name: string;
      imageUrl: string;
      qty?: number;
      /** ❌ legacy: 현지 통화 금액 */
      price?: number;
    };

type CartState = {
  items: CartItem[];
  addItem: (p: AddToCartPayload) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  /** USD 기준 총합 */
  totalUsd: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (p) => {
        const qty = Math.max(1, p.qty ?? 1);

        // ✅ v2: priceUsd 필수. legacy payload면 추가 안 함 (혼돈 방지)
        if (!("priceUsd" in p) || typeof p.priceUsd !== "number") {
          console.warn(
            "[cartStore] addItem payload에 priceUsd가 없습니다. v2 스키마에 맞게 호출 코드를 업데이트하세요."
          );
          return;
        }

        const exists = get().items.find((i) => i.id === p.id);
        set({
          items: exists
            ? get().items.map((i) =>
                i.id === p.id ? { ...i, qty: i.qty + qty } : i
              )
            : [
                ...get().items,
                {
                  id: p.id,
                  name: p.name,
                  imageUrl: p.imageUrl,
                  qty,
                  priceUsd: p.priceUsd,
                },
              ],
        });
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      updateQty: (id, qty) =>
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, qty: Math.max(1, qty) } : i
          ),
        }),
      clear: () => set({ items: [] }),
      totalUsd: () =>
        get().items.reduce((sum, i) => sum + i.priceUsd * i.qty, 0),
    }),
    {
      /** ✅ v2로 저장 키 변경 (기존 혼선을 깔끔히 차단) */
      name: "kbeauty-cart-v2",
      version: 2,
      // (선택) 마이그레이션 훅을 쓰고 싶다면 이곳에 작성 가능
    }
  )
);

/** 파생 훅들 */
export const useCartTotalUSD = () => useCartStore((s) => s.totalUsd());
export const useCartCount = () =>
  useCartStore((s) => s.items.reduce((sum, i) => sum + i.qty, 0));
