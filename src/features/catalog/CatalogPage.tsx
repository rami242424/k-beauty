import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Product } from '@/types/product';

const mock: Product[] = [
  { id: 'p1', name: 'Velvet Lip Tint', price: 12000, category: 'lip',  imageUrl: 'https://picsum.photos/seed/lip/640/480',  rating: 4.5, tags: ['matte'] },
  { id: 'p2', name: 'Glow Skin Serum',  price: 22000, category: 'skin', imageUrl: 'https://picsum.photos/seed/skin/640/480', rating: 4.2 },
  { id: 'p3', name: 'Longlash Mascara', price: 15000, category: 'eye',  imageUrl: 'https://picsum.photos/seed/eye/640/480',  rating: 4.7 },
];

const categories = ['all','lip','eye','skin','tool'] as const;
const sorts = ['recent','price-asc','price-desc','rating-desc'] as const;

export default function CatalogPage() {
  const [params, setParams] = useSearchParams();

  const q = params.get('q') ?? '';
  const cat = (params.get('cat') ?? 'all') as (typeof categories)[number];
  const sort = (params.get('sort') ?? 'recent') as (typeof sorts)[number];

  const set = (k: string, v: string) => {
    const p = new URLSearchParams(params);
    v ? p.set(k, v) : p.delete(k);
    setParams(p, { replace: true });
  };

  const filtered = useMemo(() => {
    let arr = mock;
    // 검색
    if (q) {
      const kw = q.toLowerCase();
      arr = arr.filter(p =>
        p.name.toLowerCase().includes(kw) ||
        p.tags?.some(t => t.toLowerCase().includes(kw))
      );
    }
    // 카테고리
    if (cat !== 'all') arr = arr.filter(p => p.category === cat);
    // 정렬
    switch (sort) {
      case 'price-asc':  arr = [...arr].sort((a,b)=>a.price-b.price); break;
      case 'price-desc': arr = [...arr].sort((a,b)=>b.price-a.price); break;
      case 'rating-desc':arr = [...arr].sort((a,b)=>(b.rating??0)-(a.rating??0)); break;
      default:           arr = arr; // recent/mock order
    }
    return arr;
  }, [q, cat, sort]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* 컨트롤바 */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center mb-4">
        <input
          className="flex-1 rounded-xl border px-3 py-2"
          placeholder="검색어를 입력하세요 (이름/태그)"
          value={q}
          onChange={e => set('q', e.target.value)}
        />
        <select
          className="rounded-xl border px-3 py-2"
          value={cat}
          onChange={e => set('cat', e.target.value)}
        >
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          className="rounded-xl border px-3 py-2"
          value={sort}
          onChange={e => set('sort', e.target.value)}
        >
          <option value="recent">신상품순(기본)</option>
          <option value="price-asc">가격 낮은순</option>
          <option value="price-desc">가격 높은순</option>
          <option value="rating-desc">평점 높은순</option>
        </select>
        <button
          className="rounded-xl border px-3 py-2"
          onClick={() => setParams(new URLSearchParams(), { replace: true })}
        >
          초기화
        </button>
      </div>

      {/* 결과 */}
      {filtered.length === 0 ? (
        <div className="text-gray-500">조건에 맞는 상품이 없습니다.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {filtered.map(p => (
            <article key={p.id} className="rounded-2xl border p-3 shadow-sm hover:shadow transition">
              <img src={p.imageUrl} alt={p.name} className="w-full h-44 object-cover rounded-xl mb-3" />
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm text-gray-500 capitalize">{p.category}</div>
              <div className="mt-1 font-bold">{p.price.toLocaleString()}원</div>
              <button className="mt-3 w-full py-2 rounded-xl border hover:bg-gray-50">담기</button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
