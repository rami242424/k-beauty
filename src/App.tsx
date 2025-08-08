import { Link } from 'react-router-dom'

export default function App() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">K-Beauty Project</h1>
      <p className="mt-2 text-gray-600">카탈로그 · 장바구니 · 체크아웃 · 관리</p>
      <div className="mt-6 flex gap-3">
        <Link to="/catalog" className="px-4 py-2 rounded-xl border">카탈로그</Link>
        <Link to="/cart" className="px-4 py-2 rounded-xl border">장바구니</Link>
        <Link to="/checkout" className="px-4 py-2 rounded-xl border">체크아웃</Link>
        <Link to="/admin" className="px-4 py-2 rounded-xl border">관리</Link>
      </div>
    </div>
  )
}
