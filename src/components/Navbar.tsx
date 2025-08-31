import { Link, useNavigate } from 'react-router-dom'
import { useCartCount } from '../features/order/cartStore'

export default function Navbar() {
  const navigate = useNavigate()
  const count = useCartCount()

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate('/')}
      >
        K-Beauty
      </h1>

      <div className="flex gap-4 items-center">
        <Link to="/catalog" className="hover:underline">카탈로그</Link>

        <Link to="/cart" className="relative hover:underline">
          장바구니
          {count > 0 && (
            <span className="absolute -top-2 -right-3 rounded-full bg-black text-white text-xs px-1.5 py-0.5">
              {count}
            </span>
          )}
        </Link>

        <Link to="/checkout" className="hover:underline">체크아웃</Link>
        <Link to="/admin" className="hover:underline">관리</Link>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="px-3 py-1 rounded-md border text-sm hover:bg-gray-50"
      >
        ← 뒤로가기
      </button>
    </nav>
  )
}
