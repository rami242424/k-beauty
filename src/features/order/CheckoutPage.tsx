import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CheckoutForm } from "../../types/order";
import { useCartStore, useCartTotal } from "./cartStore";

const schema = z.object({
    name: z.string().min(2, "이름을 입력하세요."),
    phone: z.string().min(9, "연락처를 입력하세요."),
    address: z.string().min(5, "주소를 입력하세요."),
    payment: z.enum(['card', 'bank', 'kakao', 'naver', 'payco', 'cod']),
    memo: z.string().optional(),
});

export default function CheckoutPage(){
    const navigate = useNavigate();
    const items = useCartStore(s => s.items);
    const clear = useCartStore(s => s.clear);
    const total = useCartTotal();

    const { register, handleSubmit, formState: {errors, isSubmitting} } = useForm<CheckoutForm>({ resolver: zodResolver(schema), defaultValues: { payment: 'card' }});

    if(items.length === 0){
        return (
            <div>
                <p>장바구니가 비어있습니다.</p>
                <Link to="/catalog">카탈로그로 가기</Link>
            </div>
        );
    }

    const onSubmit = async(data: CheckoutForm) => {
        //임시 api 호출
        await new Promise (r => setTimeout(r, 600));
        clear();
        navigate('/checkout/success', { state: {total} });
    };

    return (
        <div>
            {/* 주문자정보 */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <h1>주문 정보</h1>
                <div>
                    <label>이름</label>
                    <input {...register('name')}/>
                    {errors.name && <p>{errors.name.message}</p>}
                </div>

                <div>
                    <label>연락처</label>
                    <input placeholder="010-1234-5678" {...register('phone')}/>
                    <p>{errors.phone.message}</p>
                </div>

                <div>
                    <label>배송지 주소</label>
                    <input {...register('address')}/>
                    {errors.address && <p>{errors.address.message}</p>}
                </div>

                <div>
                    <label>결제 방법</label>
                    <select {...register('payment')}>
                        <option>카드결제</option>
                        <option>카카오페이</option>
                        <option>네이버페이</option>
                        <option>페이코결제</option>
                        <option>무통장 입금</option>
                        <option>대금 상환(COD)</option>
                    </select>
                    {errors.payment && <p>errors.payment.message</p>}
                </div>

                <div>
                    <label>요청사항(선택)</label>
                    <textarea rows={3} {...register('memo')}/>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "주문 처리 중..." : "주문하기"}
                </button>
            </form>

                {/* 주문요약 */}
                <aside>
                    <h2>주문 요약</h2>
                    <ul>
                        {items.map(i => (
                            <li key={i.id}>
                                <img src={i.imageUrl} alt={i.name} />
                                <div>
                                    <div>{i.name}</div>
                                    <div>{i.price.toLocaleString()}원 x {i.qty}</div>
                                </div>
                                <div>{(i.price*i.qty).toLocaleString()}원</div>
                            </li>
                        ))}
                    </ul>
                    <div>
                        <span>합계</span>
                        <span>{total.toLocaleString()}원</span>
                    </div>
                </aside>
        </div>
    );
}