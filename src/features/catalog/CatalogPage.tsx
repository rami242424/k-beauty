// src/features/catalog/CatalogPage.tsx
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Product as ViewProduct } from '../../types/product'
import { useCartStore } from '../order/cartStore'
import Card from '../../components/ui/Card'
import Badge from "../../components/ui/Badge"
import Button from '../../components/ui/Button'
import Skeleton from '../../components/ui/Skeleton'
import { toast } from 'sonner'
import {
  fetchBeautyProducts,
  fetchBeautyProductsByCategory,
  type Product as ApiProduct,
  type BeautyCategory,
} from '../../api/products'

const categories = ['all','beauty','skin-care','fragrances'] as const
const sorts = ['recent','price-asc','price-desc','rating-desc'] as const

function mapToViewProduct(p: ApiProduct): ViewProduct {
  return {
    id: String(p.id),
    name: p.title,
    price: p.price,
    category: p.category,
    imageUrl: p.thumbnail,
    rating: p.rating,
    tags: [],
  }
}

export default function CatalogPage() {
  const [params, setParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<ViewProduct[]>([])

  const q    = params.get('q') ?? ''
  const catQ = params.get('category') ?? params.get('cat') ?? 'all'
  const cat  = (catQ as (typeof categories)[number])
  const sort = (params.get('sort') ?? 'recent') as (typeof sorts)[number]

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 350)
    return () => clearTimeout(t)
  }, [params.toString()])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        if (cat !== 'all') {
          const list = await fetchBeautyProductsByCategory(cat as BeautyCategory)
          if (!mounted) return
          setData(list.map(mapToViewProduct))
        } else {
          const list = await fetchBeautyProducts()
          if (!mounted) return
          setData(list.map(mapToViewProduct))
        }
      } catch (e) {
        console.error(e)
        if (mounted) setData([])
      }
    })()
    return () => { mounted = false }
  }, [cat])

  const set = (k: string, v: string) => {
    const p = new URLSearchParams(params)
    v ? p.set(k, v) : p.delete(k)
    if (k === 'cat') {
      v ? p.set('category', v) : p.delete('category')
      p.delete('cat')
    }
    setParams(p, { replace: true })
  }

  const filtered = useMemo(() => {
    let arr = data
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
      default: break
    }
    return arr
  }, [data, q, cat, sort])

  const addItem = useCartStore(s => s.addItem)

  return (
    <div className="mx-auto max-w-[var(--container)] px-4 py-6">
      <h1 className="text-2xl font-bold ink mb-4">Catalog</h1>

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
          onChange={e => set('category', e.target.value)}
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
          className="btn-outline-brand"
          onClick={() => setParams(new URLSearchParams(), { replace: true })}
        >
          초기화
        </button>
      </div>

      {/* 로딩 스켈레톤 */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="flex h-full flex-col p-3">
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
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 items-stretch">
          {filtered.map(p => (
            <Card key={p.id} className="flex h-full flex-col p-3">
              <div className="mb-3 h-44 w-full overflow-hidden rounded-xl bg-white">
                <img src={p.imageUrl} alt={p.name} className="h-full w-full object-contain" />
              </div>
              <div className="font-semibold line-clamp-2 min-h-[3rem] ink">{p.name}</div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-sm text-gray-500 capitalize">{p.category.replace('-', ' ')}</span>
                {p.rating && <Badge variant='brand'>★ {p.rating}</Badge>}
              </div>
              <div className="mt-1 price font-bold">{p.price.toLocaleString()}원</div>
              <Button
                variant="solid"
                className="mt-auto w-full"
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
