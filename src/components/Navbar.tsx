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
        className="text-2xl font-bold cursor-pointer tracking-tight text-gray-900"
        onClick={() => navigate('/')}
      >
        K-Beauty
      </h1>

      {/* 가운데 링크들 */}
      <div className="flex items-center gap-8">
        <Link
          to="/catalog"
          className="text-gray-700 no-underline hover:underline hover:text-gray-900"
        >
          카탈로그
        </Link>

        {/* 장바구니 (아이콘 + 뱃지 + 라벨) */}
        <Link
          to="/cart"
          className="w-16 select-none no-underline text-gray-700 hover:text-gray-900"
        >
          <span className="relative mx-auto flex h-8 w-8 items-center justify-center">
            {/* 카트 아이콘 */}
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 6h15l-1.5 9H8.5L7 6Z" />
              <path d="M6 6l-2-2" />
              <circle cx="9" cy="19" r="1.5" />
              <circle cx="18" cy="19" r="1.5" />
            </svg>

            {/* 뱃지 */}
            {count > 0 && (
              <span
                className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center
                           rounded-full bg-red-600 px-1.5 text-[11px] font-bold leading-none text-white
                           ring-2 ring-white shadow"
                aria-label={`장바구니에 ${badgeText}개`}
              >
                {badgeText}
              </span>
            )}
          </span>
          <span className="mt-1 block text-center text-sm">장바구니</span>
        </Link>

        <Link
          to="/checkout"
          className="text-gray-700 no-underline hover:underline hover:text-gray-900"
        >
          체크아웃
        </Link>

        <Link
          to="/admin"
          className="text-gray-700 no-underline hover:underline hover:text-gray-900"
        >
          관리
        </Link>
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
