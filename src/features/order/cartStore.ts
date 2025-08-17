import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, AddToCartPayload } from '../../types/order';

type CartState = {
  items: CartItem[];
  addItem: (p: AddToCartPayload) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
};
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (p) => {
        const qty = Math.max(1, p.qty ?? 1);
        const exists = get().items.find(i => i.id === p.id);
        set({
          items: exists
            ? get().items.map(i => i.id === p.id ? { ...i, qty: i.qty + qty } : i)
            : [...get().items, { id: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl, qty }]
        });
      },
      removeItem: (id) => set({ items: get().items.filter(i => i.id !== id) }),
      updateQty: (id, qty) => set({
        items: get().items
          .map(i => i.id === id ? { ...i, qty: Math.max(1, qty) } : i)
      }),
      clear: () => set({ items: [] }),
    }),
    { name: 'kbeauty-cart' } // localStorage key
  )
);

// 선택자(총합/개수)
export const useCartTotal = () =>
  useCartStore(s => s.items.reduce((sum, i) => sum + i.price * i.qty, 0));
export const useCartCount = () =>
  useCartStore(s => s.items.reduce((sum, i) => sum + i.qty, 0));
