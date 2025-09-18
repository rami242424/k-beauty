import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useAuthStore } from "../stores/authStore";
import { useCartStore } from "../features/order/cartStore";
import { useI18n } from "../lib/i18n";

export default function Navbar() {
  return (
    <div className="w-full">
      <TopBar />
      <CategoryBar />
    </div>
  );
}

/* ============ 1) 상단: 로고(좌) + 우측 액션(검색 없음) ============ */
function TopBar() {
  const navigate = useNavigate();

  const { token, user, isHydrated, hydrate, signOut } = useAuthStore();
  useEffect(() => {
    if (!isHydrated) hydrate();
  }, [isHydrated, hydrate]);

  const onLogout = () => {
    signOut();
    toast.success("로그아웃되었습니다.");
    navigate("/", { replace: true });
  };

  const { lang, setLang } = useI18n();
  const langs = (["ko", "en", "ja", "zh"] as const);

  return (
    <div className="grid grid-cols-[auto,1fr,auto] items-center gap-4 py-0.5">
      {/* 좌: 로고 */}
      <div className="justify-self-start flex items-center h-full">
        <Link
          to="/"
          className="block text-lg font-bold text-blue-700 leading-none tracking-tight -mt-[1px]"
        >
          K-Beauty
        </Link>
      </div>

      {/* 가운데 비움 */}
      <div />

      {/* 우: 로그인/로그아웃 · 언어 */}
      <div className="justify-self-end flex items-center gap-3 whitespace-nowrap shrink-0">
        {!isHydrated ? (
          <div className="text-sm text-gray-500">...</div>
        ) : token ? (
          <>
            <span className="hidden md:inline text-sm text-gray-600">
              {user?.name || user?.email}
            </span>
            <button
              onClick={onLogout}
              className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              로그아웃
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="rounded-lg bg-black text-white px-3 py-1.5 text-sm hover:opacity-90"
          >
            로그인
          </Link>
        )}

        {/* 언어 토글 */}
        <div className="hidden sm:flex items-center gap-1 rounded-xl border p-0.5">
          {langs.map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                lang === l ? "bg-black text-white" : "text-gray-700 hover:bg-gray-50"
              }`}
              aria-pressed={lang === l}
            >
              {l === "ko" ? "한국어" : l === "en" ? "EN" : l === "ja" ? "日本語" : "中文"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============ 2) 하단: 메뉴(가운데 정렬) + 장바구니 배지 ============ */
function CategoryBar() {
  // ✅ NavLink를 배지 기준으로 쓰기 위해 relative/inline-flex
  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `relative inline-flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
      isActive ? "text-black font-medium" : "text-gray-700 hover:bg-gray-50"
    }`;

  // ✅ 장바구니 배지 카운트 (안전 가드 포함)
  const items = useCartStore((s) => s.items ?? []);
  const count = useMemo(
    () => items.reduce((n, it) => n + (Number(it?.qty) || 0), 0),
    [items]
  );

  return (
    <nav className="pt-2">
      <ul className="flex items-center justify-center gap-3">
        {/* ✅ 전체메뉴: 카탈로그 전체 */}
        <li><NavLink to="/catalog" className={linkCls}>전체메뉴</NavLink></li>

        {/* ✅ 오특: 오늘의 특가 모드(view=today) */}
        <li><NavLink to="/catalog?view=today" className={linkCls}>오특</NavLink></li>

        {/* ✅ 랭킹: 평점순(sorting) */}
        <li><NavLink to="/catalog?sort=rank" className={linkCls}>랭킹</NavLink></li>

        {/* ✅ 장바구니 + 배지 */}
        <li>
          <NavLink
            to="/cart"
            className={({ isActive }) => `${linkCls({ isActive })} pr-5`}
          >
            장바구니
            {count > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1
                           rounded-full bg-lime-500 text-white text-xs
                           flex items-center justify-center"
                aria-label={`장바구니에 ${count}개`}
              >
                {count}
              </span>
            )}
          </NavLink>
        </li>

        <li><NavLink to="/checkout" className={linkCls}>체크아웃</NavLink></li>
      </ul>
    </nav>
  );
}
