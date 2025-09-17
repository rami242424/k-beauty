import { Link, useLocation } from "react-router-dom";
import { useI18n } from "../../lib/i18n";
import { formatFromUSD } from "../../lib/money";

export default function CheckoutSuccessPage() {
  const { state } = useLocation() as { state?: { totalUsd?: number } };
  const totalUsd = state?.totalUsd ?? 0;
  const { t, lang } = useI18n();

  return (
    <div className="mx-auto max-w-[var(--container)] px-4 py-6 space-y-4">
      <h1 className="text-2xl font-bold">{t("order_complete")}</h1>
      <p>
        {t("paid_amount")} : <b>{formatFromUSD(totalUsd, lang)}</b>
      </p>
      <div className="flex gap-3">
        <Link to="/catalog" className="rounded-xl border px-4 py-2">
          {t("continue_shopping")}
        </Link>
        <Link to="/admin" className="rounded-xl border px-4 py-2">
          {t("admin")}
        </Link>
      </div>
    </div>
  );
}
