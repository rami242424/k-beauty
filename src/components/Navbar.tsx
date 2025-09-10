import { Link, useNavigate } from 'react-router-dom'
import { useCartCount } from '../features/order/cartStore'

export default function Navbar() {
  const navigate = useNavigate()
  const count = useCartCount()
  const badgeText = count > 99 ? '99+' : String(count)

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b">
      {/* 로고 */}
      <h1
        className="text-xl font-bold cursor-pointer tracking-tight"
        onClick={() => navigate('/')}
      >
        K-Beauty
      </h1>

      {/* 가운데 링크들 */}
      <div className="flex items-center gap-6 whitespace-nowrap">
        <Link to="/catalog" className="hover:underline">카탈로그</Link>

        {/* 장바구니: 인라인 배지로 겹침 방지 */}
        <Link to="/cart" className="hover:underline inline-flex items-center gap-2">
          장바구니
          {count > 0 && (
            <span
              className="inline-flex items-center justify-center
                        rounded-full bg-pink-600 text-white text-[11px] font-bold
                        h-5 min-w-[20px] px-1.5 leading-none shadow-sm"
              aria-label={`장바구니에 ${badgeText}개`}
            >
              {badgeText}
            </span>
          )}
        </Link>


        <Link to="/checkout" className="hover:underline">체크아웃</Link>
        <Link to="/admin" className="hover:underline">관리</Link>
      </div>

      {/* 뒤로가기 */}
      <button
        onClick={() => navigate(-1)}
        className="px-3 py-1 rounded-md border text-sm hover:bg-gray-50"
      >
        ← 뒤로가기
      </button>

    </nav>
  )
}