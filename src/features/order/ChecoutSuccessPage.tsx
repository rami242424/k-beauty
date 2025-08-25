import { Link, useLocation } from "react-router-dom";


export default function CheckoutSuccessPage(){
    const { state } = useLocation() as { state?: { total?: number } };
    const total = state?.total ?? 0;

    return (
        <div>
            <h1>주문이 완료되었습니다</h1>
            <p>결제 금액 : <b>{total.toLocaleString()}원</b></p>
            <div>
                <Link to="/catalog">계속 쇼핑하기</Link>
                <Link to="/admin">관리페이지</Link>
            </div>
        </div>

    );
}