// src/components/Navbar.tsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useAuthStore } from "../stores/authStore";
import { useCartStore } from "../features/order/cartStore";
import { useI18n } from "../lib/i18n";
import LogoKRBadge from "../components/logo/LogoKRBadge";

export default function Navbar() {
  return (
    <div className="w-full">
      <TopBar />
      <CategoryBar />
    </div>
  );
}

/* ============ 상단: 로고 + 우측 액션(사이즈 완전 일치) ============ */
function TopBar() {
  const navigate = useNavigate();
  const { token, user, isHydrated, hydrate, signOut } = useAuthStore();
  useEffect(() => { if (!isHydrated) hydrate(); }, [isHydrated, hydrate]);

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
        <Link to="/" className="no-underline flex items-center gap-2">
          <LogoKRBadge
            size={100}
            text="K-beauty"
            fill="#82DC28"
            textColor="#111827"
            fontFamily={`"Noto Sans KR", system-ui, -apple-system, sans-serif`}
            fontWeight={700}
            dy={-2}
          />
          <span className="sr-only">K-뷰티 홈으로</span>
        </Link>
      </div>

      <div /> {/* 가운데 비움 */}

      {/* 우: 로그인/언어 (높이/두께 일치) */}
      <div className="justify-self-end flex items-center gap-2 whitespace-nowrap shrink-0">
        {!isHydrated ? (
          <div className="text-sm text-gray-500">...</div>
        ) : token ? (
          <>
            <span className="hidden md:inline text-sm text-gray-600">
              {user?.name || user?.email}
            </span>
            <button
              onClick={onLogout}
              className="inline-flex h-9 items-center rounded-full border border-[#82dc28] px-4 text-sm text-black hover:bg-[#e9fbd8] no-underline bg-white"
            >
              로그아웃
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="inline-flex h-9 items-center rounded-full border border-[#82dc28] bg-[#82dc28] px-4 text-sm text-black hover:bg-[#76cc1f] no-underline"
          >
            로그인
          </Link>
        )}

        {/* 언어 토글: 컨테이너 h-9, 내부 버튼 h-full */}
        <div className="hidden sm:flex h-9 items-stretch rounded-full border border-[#d9e9d0] overflow-hidden">
          {langs.map((l, i) => {
            const selected = lang === l;
            return (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`h-full px-3 text-sm no-underline 
                  ${selected ? "bg-[#82dc28] text-black" : "text-gray-800 hover:bg-[#f6fff0]"} 
                  ${i !== 0 ? "border-l border-[#e9f1e3]" : ""}`}
                aria-pressed={selected}
              >
                {l === "ko" ? "한국어" : l === "en" ? "EN" : l === "ja" ? "日本語" : "中文"}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============ 하단: 메뉴(검정, 살짝 굵게) + 장바구니 배지 ============ */
function CategoryBar() {
  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `relative inline-flex items-center px-3 py-2 rounded-md text-sm transition-colors no-underline
     ${isActive ? "text-black font-bold" : "text-black font-semibold hover:bg-gray-50"}`;

  const items = useCartStore((s) => s.items ?? []);
  const count = useMemo(() => items.reduce((n, it) => n + (Number(it?.qty) || 0), 0), [items]);

  return (
    <nav className="pt-2">
      <ul className="flex items-center justify-center gap-3">
        <li><NavLink to="/catalog" className={linkCls}>전체메뉴</NavLink></li>
        <li><NavLink to="/catalog?view=today" className={linkCls}>오특</NavLink></li>
        <li><NavLink to="/catalog?sort=rank" className={linkCls}>랭킹</NavLink></li>

        {/* 장바구니 + 배지 */}
        <li>
          <NavLink to="/cart" className={({ isActive }) => `${linkCls({ isActive })} pr-5`}>
            장바구니
            {count > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1
                           rounded-full bg-[#82dc28] text-black text-xs
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
