import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { CheckoutForm } from '../../types/order';
import { useCartStore, useCartTotal } from './cartStore';

const schema = z.object({
  name: z.string().min(2, '이름을 입력하세요'),
  phone: z.string().min(9, '연락처를 입력하세요'),
  address: z.string().min(5, '주소를 입력하세요'),
  payment: z.enum(['card', 'bank', 'kakao', 'naver', 'payco', 'cod']),
  memo: z.string().optional(),
});

export default function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore(s => s.items);
  const clear = useCartStore(s => s.clear);
  const total = useCartTotal();

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<CheckoutForm>({ resolver: zodResolver(schema), defaultValues: { payment: 'card' } });

  if (items.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <p className="text-gray-600">장바구니가 비어있습니다.</p>
        <Link to="/catalog" className="mt-4 inline-block rounded-xl border px-4 py-2">카탈로그로 가기</Link>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutForm) => {
    // 모의 API 호출
    await new Promise(r => setTimeout(r, 600));
    // 실제라면: fetch('/api/orders', { method:'POST', body: JSON.stringify({ items, total, ...data }) })
    clear();
    navigate('/checkout/success', { state: { total } });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
      {/* 주문자 정보 */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <h1 className="text-2xl font-bold mb-2">주문 정보</h1>

        <div>
          <label className="block text-sm mb-1">이름</label>
          <input className="w-full rounded-xl border px-3 py-2" {...register('name')} />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">연락처</label>
          <input className="w-full rounded-xl border px-3 py-2" placeholder="010-1234-5678" {...register('phone')} />
          {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">배송지 주소</label>
          <input className="w-full rounded-xl border px-3 py-2" {...register('address')} />
          {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">결제 방법</label>
          <select className="w-full rounded-xl border px-3 py-2" {...register('payment')}>
            <option value="card">카드 결제</option>
            <option value="kakao">카카오페이</option>
            <option value="naver">네이버페이</option>
            <option value="payco">페이코결제</option>
            <option value="bank">무통장 입금</option>
            <option value="cod">대금 상환(COD)</option>
          </select>
          {errors.payment && <p className="text-sm text-red-600 mt-1">{errors.payment.message}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">요청사항 (선택)</label>
          <textarea className="w-full rounded-xl border px-3 py-2" rows={3} {...register('memo')} />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full py-3 rounded-xl border font-semibold hover:bg-gray-50 disabled:opacity-60"
        >
          {isSubmitting ? '주문 처리 중…' : '주문하기'}
        </button>
      </form>

      {/* 주문 요약 */}
      <aside className="space-y-3">
        <h2 className="text-xl font-bold mb-2">주문 요약</h2>
        <ul className="space-y-2 max-h-[400px] overflow-auto pr-1">
          {items.map(i => (
            <li key={i.id} className="flex items-center gap-3 border rounded-xl p-3">
              <img src={i.imageUrl} alt={i.name} className="w-16 h-14 object-cover rounded" />
              <div className="flex-1">
                <div className="font-semibold">{i.name}</div>
                <div className="text-sm text-gray-500">{i.price.toLocaleString()}원 × {i.qty}</div>
              </div>
              <div className="w-24 text-right font-semibold">{(i.price*i.qty).toLocaleString()}원</div>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-gray-600">합계</span>
          <span className="text-xl font-bold">{total.toLocaleString()}원</span>
        </div>
      </aside>
    </div>
  );
}
