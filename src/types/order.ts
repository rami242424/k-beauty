import type { Product } from './product';

export type CartItem = {
  id: string;  
  name: string;
  price: number;
  imageUrl: string;
  qty: number;
};
export type AddToCartPayload = Pick<Product, 'id' | 'name' | 'price' | 'imageUrl'> & { qty?: number };

export type CheckoutForm = {
  name: string;
  phone: string;
  address: string;
  payment: 'card' | 'bank' | 'cod';
  memo? : string;
}