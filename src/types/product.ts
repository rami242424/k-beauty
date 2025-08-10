export type Product = {
  id: string;
  name: string;
  price: number;
  category: 'lip' | 'eye' | 'skin' | 'tool';
  imageUrl: string;
  rating?: number;
  tags?: string[];
};
