import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate('/')}
      >
        K-Beauty
      </h1>
      <div className="flex gap-4">
        <Link to="/catalog" className="hover:underline">카탈로그</Link>
        <Link to="/cart" className="hover:underline">장바구니</Link>
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
