export type Product = {
  id: number;
  title: string;
  price: number;
  rating: number;        
  category: string;
  thumbnail: string;
};

export async function fetchCategories(): Promise<string[]> {
  const res = await fetch("https://dummyjson.com/products/categories");
  if (!res.ok) throw new Error("Failed to load categories");
  
  const data = await res.json();
  return Array.isArray(data) ? data.map((c: any) => (typeof c === "string" ? c : c.slug ?? c.name)) : [];
}

export async function fetchProducts(limit = 60): Promise<Product[]> {
  const res = await fetch(`https://dummyjson.com/products?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to load products");
  const data = await res.json();
  return (data.products ?? []).map((p: any) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    rating: p.rating,
    category: p.category,
    thumbnail: p.thumbnail,
  }));
}
