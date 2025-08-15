import type { Product } from './product';

export type CartItem = {
  id: string;          // product id
  name: string;
  price: number;
  imageUrl: string;
  qty: number;
};
export type AddToCartPayload = Pick<Product, 'id' | 'name' | 'price' | 'imageUrl'> & { qty?: number };
