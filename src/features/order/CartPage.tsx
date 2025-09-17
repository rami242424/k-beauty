import { Link } from "react-router-dom";
import { useI18n } from "../../lib/i18n";
import { formatFromUSD, numberFromUSD } from "../../lib/money";
import { useCartStore, useCartTotalUSD } from "./cartStore";

export default function CartPage() {
  const { t, lang } = useI18n();
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty = useCartStore((s) => s.updateQty);
  const clear = useCartStore((s) => s.clear);
  const totalUsd = useCartTotalUSD();

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

  return (
    <div className="mx-auto max-w-[var(--container)] px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">{t("cart")}</h1>

      <ul className="space-y-3">
        {items.map((i) => {
          const unitFormatted = formatFromUSD(i.priceUsd, lang);
          const lineFormatted = formatFromUSD(i.priceUsd * i.qty, lang);
          return (
            <li
              key={i.id}
              className="flex items-center gap-3 border rounded-xl p-3"
            >
              <img
                src={i.imageUrl}
                alt={i.name}
                className="w-20 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <div className="font-semibold">{i.name}</div>
                <div className="text-sm text-gray-500">
                  {unitFormatted} × {i.qty}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="px-2 py-1 border rounded"
                  onClick={() => updateQty(i.id, i.qty - 1)}
                >
                  −
                </button>
                <input
                  className="w-12 text-center border rounded py-1"
                  value={i.qty}
                  onChange={(e) =>
                    updateQty(i.id, parseInt(e.target.value || "1", 10))
                  }
                />
                <button
                  className="px-2 py-1 border rounded"
                  onClick={() => updateQty(i.id, i.qty + 1)}
                >
                  +
                </button>
              </div>

              <div className="w-32 text-right font-semibold">{lineFormatted}</div>

              <button
                className="ml-2 text-sm text-red-600"
                onClick={() => removeItem(i.id)}
              >
                {t("remove")}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex items-center justify-between">
        <button className="text-sm text-gray-600 underline" onClick={clear}>
          {t("clear_all")}
        </button>
        <div className="text-xl font-bold">
          {t("subtotal")}: {formatFromUSD(totalUsd, lang)}
        </div>
      </div>

      <div className="mt-4 text-right">
        <Link
          to="/checkout"
          className="inline-block rounded-xl border px-4 py-2"
        >
          {t("checkout")}
        </Link>
      </div>
    </div>
  );
}
