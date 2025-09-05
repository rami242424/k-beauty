import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Product } from '../../types/product'
import { useCartStore } from '../order/cartStore'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Skeleton from '../../components/ui/Skeleton'
import { toast } from 'sonner'

const mock: Product[] = [
  { id: 'p1', name: 'Velvet Lip Tint', price: 12000, category: 'lip',  imageUrl: 'https://picsum.photos/seed/lip/640/480',  rating: 4.5, tags: ['matte'] },
  { id: 'p2', name: 'Glow Skin Serum',  price: 22000, category: 'skin', imageUrl: 'https://picsum.photos/seed/skin/640/480', rating: 4.2 },
  { id: 'p3', name: 'Longlash Mascara', price: 15000, category: 'eye',  imageUrl: 'https://picsum.photos/seed/eye/640/480',  rating: 4.7 },
]

const categories = ['all','lip','eye','skin','tool'] as const
const sorts = ['recent','price-asc','price-desc','rating-desc'] as const

export default function CatalogPage() {
  const [params, setParams] = useSearchParams()
  const [loading, setLoading] = useState(true)

  // 첫 진입/쿼리 변경 시 약간의 로딩을 보여줌(스켈레톤)
  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 350)
    return () => clearTimeout(t)
  }, [params.toString()])

  const q    = params.get('q') ?? ''
  const cat  = (params.get('cat')  ?? 'all')    as (typeof categories)[number]
  const sort = (params.get('sort') ?? 'recent') as (typeof sorts)[number]

  const set = (k: string, v: string) => {
    const p = new URLSearchParams(params)
    v ? p.set(k, v) : p.delete(k)
    setParams(p, { replace: true })
  }

  const filtered = useMemo(() => {
    let arr = mock

    if (q) {
      const kw = q.toLowerCase()
      arr = arr.filter(p =>
        p.name.toLowerCase().includes(kw) ||
        p.tags?.some(t => t.toLowerCase().includes(kw))
      )
    }
    if (cat !== 'all') arr = arr.filter(p => p.category === cat)

    switch (sort) {
      case 'price-asc':   arr = [...arr].sort((a,b)=>a.price-b.price); break
      case 'price-desc':  arr = [...arr].sort((a,b)=>b.price-a.price); break
      case 'rating-desc': arr = [...arr].sort((a,b)=>(b.rating??0)-(a.rating??0)); break
      default: break // recent: mock 순서 유지
    }
    return arr
  }, [q, cat, sort])

  const addItem = useCartStore(s => s.addItem)

  // --- UI ---
  return (
    <div className="mx-auto max-w-[var(--container)] px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Catalog</h1>

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

      {/* 로딩 스켈레톤 */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <Skeleton className="w-full h-44 mb-3" />
              <Skeleton className="h-4 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/3 mb-4" />
              <Skeleton className="h-9 w-full" />
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-500">조건에 맞는 상품이 없습니다.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {filtered.map(p => (
            <Card key={p.id}>
              <img src={p.imageUrl} alt={p.name} className="w-full h-44 object-cover rounded-xl mb-3" />
              <div className="font-semibold">{p.name}</div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 capitalize">{p.category}</span>
                {p.rating && <Badge>★ {p.rating}</Badge>}
              </div>
              <div className="mt-1 text-pink-600 font-bold">{p.price.toLocaleString()}원</div>
              <Button
                variant="solid"
                className="mt-3 w-full"
                onClick={() => {
                  addItem({ id: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl, qty: 1 })
                  toast.success('장바구니에 담겼습니다.')
                }}
              >
                담기
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
