// src/features/order/CheckoutPage.tsx
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useI18n } from "../../lib/i18n";
import { formatFromUSD } from "../../lib/money";
import { useCartStore } from "./cartStore";

// 폼 타입
type CheckoutForm = {
  name: string;
  phone: string;
  address: string;
  payment: "card" | "bank" | "kakao" | "naver" | "payco" | "cod";
  memo?: string;
};

// 안전한 번역 함수(키 없어도 폴백)
function tf(t: ((k: any) => string) | undefined, key: any, fallback: string) {
  try {
    const v = t ? t(key) : undefined;
    return (typeof v === "string" && v.length > 0) ? v : fallback;
  } catch {
    return fallback;
  }
}

export default function CheckoutPage() {
  const nav = useNavigate();

  // i18n 가드
  let lang = "ko" as any;
  let t: ((k: any) => string) | undefined;
  try {
    const hook = useI18n();
    lang = hook.lang as any;
    t = hook.t;
  } catch {
    // Provider 누락 등일 때도 죽지 않게.
  }

  // 스토어 읽기(무조건 배열 보장)
  const rawItems = useCartStore((s) => s.items as unknown) as any;
  const clear = useCartStore((s) => s.clear);
  const items: Array<any> = Array.isArray(rawItems) ? rawItems : [];

  // v2(USD) / legacy(KRW) 자동 감지 (아이템이 1개라도 priceUsd 있으면 USD로 간주)
  const hasUsd = items.some((i) => typeof i?.priceUsd === "number");
  const isUSD = hasUsd;

  // 합계 계산(가드)
  const totalUsd = isUSD
    ? items.reduce((sum, i) => sum + (Number(i?.priceUsd) || 0) * (Number(i?.qty) || 0), 0)
    : 0;

  const totalKrw = !isUSD
    ? items.reduce((sum, i) => sum + (Number(i?.price) || 0) * (Number(i?.qty) || 0), 0)
    : 0;

  // 유효성(문구 폴백)
  const schema = z.object({
    name: z.string().min(2, tf(t, "val_name", "이름을 입력하세요")),
    phone: z.string().min(9, tf(t, "val_phone", "연락처를 입력하세요")),
    address: z.string().min(5, tf(t, "val_address", "주소를 입력하세요")),
    payment: z.enum(["card", "bank", "kakao", "naver", "payco", "cod"]),
    memo: z.string().optional(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(schema),
    defaultValues: { payment: "card" },
  });

  // 빈 카트 처리
  if (!items.length) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <p className="text-gray-600">{tf(t, "cart_empty", "장바구니가 비어있습니다.")}</p>
        <Link to="/catalog" className="mt-4 inline-block rounded-xl border px-4 py-2">
          {tf(t, "go_to_catalog", "카탈로그로 가기")}
        </Link>
      </div>
    );
  }

  const onSubmit = async (_data: CheckoutForm) => {
    await new Promise((r) => setTimeout(r, 400));
    clear();
    // 성공 페이지로 실제 사용 총액만 전달
    nav("/checkout/success", {
      state: isUSD ? { totalUsd } : { totalKRW: totalKrw },
    });
  };

  return (
    <div className="mx-auto max-w-[var(--container)] px-4 py-6 grid gap-8 md:grid-cols-2">
      {/* 주문자 정보 */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <h1 className="text-2xl font-bold mb-2">{tf(t, "order_info", "주문 정보")}</h1>

        <div>
          <label className="block text-sm mb-1">{tf(t, "name", "이름")}</label>
          <input className="w-full rounded-xl border px-3 py-2" {...register("name")} />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">{tf(t, "phone", "연락처")}</label>
          <input
            className="w-full rounded-xl border px-3 py-2"
            placeholder="010-1234-5678"
            {...register("phone")}
          />
          {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">{tf(t, "address", "배송지 주소")}</label>
          <input className="w-full rounded-xl border px-3 py-2" {...register("address")} />
          {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">{tf(t, "payment", "결제 방법")}</label>
          <select className="w-full rounded-xl border px-3 py-2" {...register("payment")}>
            <option value="card">{tf(t, "pay_card", "카드 결제")}</option>
            <option value="kakao">{tf(t, "pay_kakao", "카카오페이")}</option>
            <option value="naver">{tf(t, "pay_naver", "네이버페이")}</option>
            <option value="payco">{tf(t, "pay_payco", "페이코결제")}</option>
            <option value="bank">{tf(t, "pay_bank", "무통장 입금")}</option>
          </select>
          {errors.payment && <p className="text-sm text-red-600 mt-1">{errors.payment.message}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">{tf(t, "memo_optional", "요청사항 (선택)")}</label>
          <textarea className="w-full rounded-xl border px-3 py-2" rows={3} {...register("memo")} />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full py-3 rounded-xl border font-semibold hover:bg-gray-50 disabled:opacity-60"
        >
          {isSubmitting ? tf(t, "ordering", "주문 처리 중…") : tf(t, "place_order", "주문하기")}
        </button>
      </form>

      {/* 주문 요약 */}
      <aside className="space-y-3">
        <h2 className="text-xl font-bold mb-2">{tf(t, "order_summary", "주문 요약")}</h2>
        <ul className="space-y-2 max-h-[400px] overflow-auto pr-1">
          {items.map((i, idx) => {
            const qty = Number(i?.qty) || 0;
            const name = String(i?.name ?? "");
            const imageUrl = String(i?.imageUrl ?? "");
            const priceUsd = Number(i?.priceUsd);
            const priceKrw = Number(i?.price);

            const unit = isUSD
              ? formatFromUSD(Number.isFinite(priceUsd) ? priceUsd : 0, lang as any)
              : `${(Number.isFinite(priceKrw) ? priceKrw : 0).toLocaleString("ko-KR")}원`;

            const line = isUSD
              ? formatFromUSD((Number.isFinite(priceUsd) ? priceUsd : 0) * qty, lang as any)
              : `${(((Number.isFinite(priceKrw) ? priceKrw : 0) * qty)).toLocaleString("ko-KR")}원`;

            return (
              <li key={i?.id ?? idx} className="flex items-center gap-3 border rounded-xl p-3">
                <img src={imageUrl} alt={name} className="w-16 h-14 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-semibold">{name}</div>
                  <div className="text-sm text-gray-500">
                    {unit} × {qty}
                  </div>
                </div>
                <div className="w-32 text-right font-semibold">{line}</div>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-gray-600">{tf(t, "subtotal", "합계")}</span>
          <span className="text-xl font-bold">
            {isUSD
              ? formatFromUSD(totalUsd, lang as any)
              : `${totalKrw.toLocaleString("ko-KR")}원`}
          </span>
        </div>
      </aside>
    </div>
  );
}
