import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useI18n } from "../../lib/i18n";
import { formatFromUSD } from "../../lib/money";
import { useCartStore, useCartTotalUSD } from "./cartStore";

type CheckoutForm = {
  name: string;
  phone: string;
  address: string;
  payment: "card" | "bank" | "kakao" | "naver" | "payco" | "cod";
  memo?: string;
};

export default function CheckoutPage() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const totalUsd = useCartTotalUSD();

  const schema = z.object({
    name: z.string().min(2, t("val_name")),
    phone: z.string().min(9, t("val_phone")),
    address: z.string().min(5, t("val_address")),
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

  if (items.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <p className="text-gray-600">{t("cart_empty")}</p>
        <Link
          to="/catalog"
          className="mt-4 inline-block rounded-xl border px-4 py-2"
        >
          {t("go_to_catalog")}
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutForm) => {
    await new Promise((r) => setTimeout(r, 600));
    // 실제라면 서버에 USD 기준 총액/항목을 보냄
    clear();
    navigate("/checkout/success", { state: { totalUsd } });
  };

  return (
    <div className="mx-auto max-w-[var(--container)] px-4 py-6 grid gap-8 md:grid-cols-2">
      {/* 주문자 정보 */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <h1 className="text-2xl font-bold mb-2">{t("order_info")}</h1>

        <div>
          <label className="block text-sm mb-1">{t("name")}</label>
          <input className="w-full rounded-xl border px-3 py-2" {...register("name")} />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">{t("phone")}</label>
          <input
            className="w-full rounded-xl border px-3 py-2"
            placeholder="010-1234-5678"
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">{t("address")}</label>
          <input className="w-full rounded-xl border px-3 py-2" {...register("address")} />
          {errors.address && (
            <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">{t("payment")}</label>
          <select className="w-full rounded-xl border px-3 py-2" {...register("payment")}>
            <option value="card">{t("pay_card")}</option>
            <option value="kakao">{t("pay_kakao")}</option>
            <option value="naver">{t("pay_naver")}</option>
            <option value="payco">{t("pay_payco")}</option>
            <option value="bank">{t("pay_bank")}</option>
            <option value="cod">{t("pay_cod")}</option>
          </select>
          {errors.payment && (
            <p className="text-sm text-red-600 mt-1">{errors.payment.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">{t("memo_optional")}</label>
          <textarea className="w-full rounded-xl border px-3 py-2" rows={3} {...register("memo")} />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full py-3 rounded-xl border font-semibold hover:bg-gray-50 disabled:opacity-60"
        >
          {isSubmitting ? t("ordering") : t("place_order")}
        </button>
      </form>

      {/* 주문 요약 */}
      <aside className="space-y-3">
        <h2 className="text-xl font-bold mb-2">{t("order_summary")}</h2>
        <ul className="space-y-2 max-h-[400px] overflow-auto pr-1">
          {items.map((i) => (
            <li key={i.id} className="flex items-center gap-3 border rounded-xl p-3">
              <img src={i.imageUrl} alt={i.name} className="w-16 h-14 object-cover rounded" />
              <div className="flex-1">
                <div className="font-semibold">{i.name}</div>
                <div className="text-sm text-gray-500">
                  {formatFromUSD(i.priceUsd, lang)} × {i.qty}
                </div>
              </div>
              <div className="w-32 text-right font-semibold">
                {formatFromUSD(i.priceUsd * i.qty, lang)}
              </div>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-gray-600">{t("subtotal")}</span>
          <span className="text-xl font-bold">{formatFromUSD(totalUsd, lang)}</span>
        </div>
      </aside>
    </div>
  );
}
