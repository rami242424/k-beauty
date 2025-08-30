import { Link } from 'react-router-dom';
import { useCartStore, useCartTotal } from './cartStore';

export default function CartPage() {
  const items = useCartStore(s => s.items);
  const removeItem = useCartStore(s => s.removeItem);
  const updateQty = useCartStore(s => s.updateQty);
  const clear = useCartStore(s => s.clear);
  const total = useCartTotal();

  if (items.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <p className="text-gray-600">장바구니가 비었습니다.</p>
        <Link to="/catalog" className="mt-4 inline-block rounded-xl border px-4 py-2">카탈로그로 가기</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[var(--container)] px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">장바구니</h1>
      <ul className="space-y-3">
        {items.map(i => (
          <li key={i.id} className="flex items-center gap-3 border rounded-xl p-3">
            <img src={i.imageUrl} alt={i.name} className="w-20 h-16 object-cover rounded-lg" />
            <div className="flex-1">
              <div className="font-semibold">{i.name}</div>
              <div className="text-sm text-gray-500">{i.price.toLocaleString()}원</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-2 py-1 border rounded" onClick={() => updateQty(i.id, i.qty - 1)}>-</button>
              <input
                className="w-12 text-center border rounded py-1"
                value={i.qty}
                onChange={e => updateQty(i.id, parseInt(e.target.value || '1', 10))}
              />
              <button className="px-2 py-1 border rounded" onClick={() => updateQty(i.id, i.qty + 1)}>+</button>
            </div>
            <div className="w-24 text-right font-semibold">{(i.price * i.qty).toLocaleString()}원</div>
            <button className="ml-2 text-sm text-red-600" onClick={() => removeItem(i.id)}>삭제</button>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between">
        <button className="text-sm text-gray-600 underline" onClick={clear}>모두 비우기</button>
        <div className="text-xl font-bold">합계: {total.toLocaleString()}원</div>
      </div>

      <div className="mt-4 text-right">
        <Link to="/checkout" className="inline-block rounded-xl border px-4 py-2">체크아웃</Link>
      </div>
    </div>
  );
}
