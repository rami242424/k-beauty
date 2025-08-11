import type { Product } from "../../types/product";

const mock: Product[] = [
  { id: 'p1', name: 'Velvet Lip Tint', price: 12000, category: 'lip',  imageUrl: 'https://picsum.photos/seed/lip/640/480',  rating: 4.5, tags: ['matte'] },
  { id: 'p2', name: 'Glow Skin Serum', price: 22000, category: 'skin', imageUrl: 'https://picsum.photos/seed/skin/640/480', rating: 4.2 },
  { id: 'p3', name: 'Longlash Mascara', price: 15000, category: 'eye',  imageUrl: 'https://picsum.photos/seed/eye/640/480',  rating: 4.7 },
];

export default function CatalogPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Catalog</h1>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {mock.map(p => (
          <article key={p.id} className="rounded-2xl border p-3 shadow-sm hover:shadow transition">
            <img src={p.imageUrl} alt={p.name} className="w-full h-44 object-cover rounded-xl mb-3" />
            <div className="font-semibold">{p.name}</div>
            <div className="text-sm text-gray-500 capitalize">{p.category}</div>
            <div className="mt-1 font-bold">{p.price.toLocaleString()}원</div>
            <button className="mt-3 w-full py-2 rounded-xl border hover:bg-gray-50">담기</button>
          </article>
        ))}
      </div>
    </div>
  );
}
