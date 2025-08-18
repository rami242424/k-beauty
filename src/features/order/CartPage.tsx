import { Link } from "react-router-dom";
import { useCartStore, useCartTotal } from "./cartStore";

export default function CartPage(){
    const items = useCartStore(s => s.items);
    const removeItem = useCartStore(s => s.removeItem);
    const updateQty = useCartStore(s => s.updateQty);
    const clear = useCartStore(s => s.clear);
    const total = useCartTotal();

    if(items.length === 0){
        return (
            <div>
                <p>장바구니가 비었습니다.</p>
                <Link to="/catalog">카탈로그로 가기 </Link>
            </div>
        );
    }

    return (
        <div>
            <h1>장바구니</h1>
            <ul>
                {items.map(i => (
                    <li>
                        <img src={i.imageUrl} alt={i.name} />
                        <div>
                            <div>{i.name}</div>
                            <div>{i.price.toLocaleString()}원</div>
                        </div>
                        <div>
                            <button onClick={() => updateQty(i.id, i.qty - 1)}>-</button>
                            <input 
                                value={i.qty}
                                onChange={e => updateQty(i.id, parseInt(e.target.value || "1", 10))}
                            />
                            <button
                                onClick={() => updateQty(i.id, i.qty + 1)}
                            >+</button>
                        </div>
                        <div>{(i.price * i.qty).toLocaleString()}원</div>
                        <button
                            onClick={() => removeItem(i.id)}
                        >삭제</button>
                    </li>
                ))}
            </ul>

            <div>
                <button
                    onClick={clear}
                >모두 비우기</button>
                <div>합계: {total.toLocaleString()}원</div>
            </div>

            <div>
                <Link to="/checkout">체크아웃</Link>
            </div>
        </div>
    );
}