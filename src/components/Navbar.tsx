import { Link } from "react-router-dom";
import { useI18n } from "../lib/i18n";

export default function Navbar() {
  const { t, lang, setLang } = useI18n();

  return (
    <nav className="flex items-center justify-between h-14">
      {/* 왼쪽 로고 */}
      <Link to="/" className="font-extrabold text-2xl ink">
        {t("brand")}
      </Link>

      {/* 가운데 메뉴 */}
      <div className="hidden sm:flex gap-6 text-sm text-gray-600">
        <Link to="/catalog">{t("catalog")}</Link>
        <Link to="/cart">{t("cart")}</Link>
        <Link to="/checkout">{t("checkout")}</Link>
        <Link to="/admin">{t("admin")}</Link>
      </div>

      {/* 오른쪽 언어 선택 */}
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as any)}
        className="ml-4 rounded-md border px-2 py-1 text-sm"
      >
        <option value="ko">한국어</option>
        <option value="en">English</option>
        <option value="ja">日本語</option>
        <option value="zh">中文</option>
      </select>
    </nav>
  );
}
