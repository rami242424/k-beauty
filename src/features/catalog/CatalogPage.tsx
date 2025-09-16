import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Product as ViewProduct } from '../../types/product'
import { useCartStore } from '../order/cartStore'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Bagde'
import Button from '../../components/ui/Button'
import Skeleton from '../../components/ui/Skeleton'
import { toast } from 'sonner'

// ▼ 추가: 뷰티 3종만 불러오는 API (이전에 만들어둔 파일)
import {
  fetchBeautyProducts,
  fetchBeautyProductsByCategory,
  type Product as ApiProduct,
  type BeautyCategory,
} from '../../api/products'

// 카테고리: all + (beauty 전용 3종)
const categories = ['all','beauty','skin-care','fragrances'] as const
const sorts = ['recent','price-asc','price-desc','rating-desc'] as const

// API → 화면 타입으로 매핑
function mapToViewProduct(p: ApiProduct): ViewProduct {
  return {
    id: String(p.id),
    name: p.title,
    price: p.price,
    category: p.category,       // "beauty" | "skin-care" | "fragrances"
    imageUrl: p.thumbnail,
    rating: p.rating,
    tags: [],                   // 필요 시 확장
  }
}

export default function CatalogPage() {
  const [params, setParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<ViewProduct[]>([])

  // ✅ 쿼리: 기존 'cat' 유지 + 홈에서 오는 'category'도 지원
  const q    = params.get('q') ?? ''
  const catQ = params.get('category') ?? params.get('cat') ?? 'all'
  const cat  = (catQ as (typeof categories)[number]) // all | beauty | skin-care | fragrances
  const sort = (params.get('sort') ?? 'recent') as (typeof sorts)[number]

  // 쿼리 바뀔 때 짧은 스켈레톤 유지
  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 350)
    return () => clearTimeout(t)
  }, [params.toString()])

  // ✅ 데이터 로딩: 카테고리 있으면 해당 카테고리만, 없으면 전체(뷰티 3종)
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

  // 파라미터 업데이트 헬퍼(기존 유지)
  const set = (k: string, v: string) => {
    const p = new URLSearchParams(params)
    v ? p.set(k, v) : p.delete(k)
    // 통일: 셀렉트는 'category' 키를 쓰도록
    if (k === 'cat') {
      v ? p.set('category', v) : p.delete('category')
      p.delete('cat')
    }
    setParams(p, { replace: true })
  }

  // 필터/정렬(기존 로직 유지)
  const filtered = useMemo(() => {
    let arr = data

    if (q) {
      const kw = q.toLowerCase()
      arr = arr.filter(p =>
        p.name.toLowerCase().includes(kw) ||
        p.tags?.some(t => t.toLowerCase().includes(kw))
      )
    }
    // cat !== 'all' 인 경우, 위에서 API 단계에서 이미 필터된 상태지만
    // 혹시 모를 일관성을 위해 한 번 더 방어적으로 필터링
    if (cat !== 'all') arr = arr.filter(p => p.category === cat)

    switch (sort) {
      case 'price-asc':   arr = [...arr].sort((a,b)=>a.price-b.price); break
      case 'price-desc':  arr = [...arr].sort((a,b)=>b.price-a.price); break
      case 'rating-desc': arr = [...arr].sort((a,b)=>(b.rating??0)-(a.rating??0)); break
      default: break // recent: 서버에서 최신순 정렬 X → 그대로
    }
    return arr
  }, [data, q, cat, sort])

  const addItem = useCartStore(s => s.addItem)

  // --- UI ---
  return (
    <div className="mx-auto max-w-[var(--container)] px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Catalog</h1>

      {/* 현재 선택 표시 */}
      {cat !== 'all' && (
        <div className="mb-2 text-sm text-gray-500">
          선택된 카테고리: <b className="capitalize">{cat.replace('-', ' ')}</b>
        </div>
      )}

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
          onChange={e => set('category', e.target.value)} // ✅ 'category'로 통일
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
                <span className="text-sm text-gray-500 capitalize">{p.category.replace('-', ' ')}</span>
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
