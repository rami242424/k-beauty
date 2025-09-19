import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useAuthStore } from "../stores/authStore";
import { useCartStore } from "../features/order/cartStore";
import { useI18n } from "../lib/i18n";
import LogoKRBadge from "./logo/LogoKRBadge";

const LOGO_SIZE = 80; // ← 지금 쓰는 로고 크기 그대로. 필요하면 숫자만 바꿔줘.

export default function Navbar() {
  return (
    <div className="w-full">
      <TopRow />
      <MenuRow />
    </div>
  );
}

/* ============ 1줄차: 로고(좌) ───────────── 로그인/언어(우) ============ */
function TopRow() {
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
    // ✅ 높이 고정 X: 현재 요소 크기(로고/버튼) 그대로 사용
    <div className="flex items-center justify-between gap-6 py-1">
      {/* 좌: 로고 (크기 유지) */}
      <Link to="/" className="no-underline flex items-center">
        <LogoKRBadge
          size={LOGO_SIZE}
          text="K-beauty"
          fill="#82DC28"
          textColor="#111827"
          fontFamily={`"Noto Sans KR", system-ui, -apple-system, sans-serif`}
          fontWeight={800}
          dy={-2}
        />
        <span className="sr-only">K-뷰티 홈으로</span>
      </Link>

      {/* 우: 로그인/언어 (크기 유지) */}
      <div className="flex items-center gap-3 whitespace-nowrap">
        {!isHydrated ? (
          <div className="text-sm text-gray-500 px-2">...</div>
        ) : token ? (
          <>
            <span className="hidden md:inline text-sm text-gray-600">
              {user?.name || user?.email}
            </span>
            <button
              onClick={onLogout}
              className="inline-flex items-center rounded-full border border-[#82dc28] px-4 py-2 text-sm text-black hover:bg-[#e9fbd8] bg-white"
            >
              로그아웃
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="inline-flex items-center rounded-full border border-[#82dc28] bg-[#82DC28] px-4 py-2 text-sm text-black hover:bg-[#76cc1f]"
          >
            로그인
          </Link>
        )}

        <div className="hidden sm:flex items-stretch rounded-full border border-[#d9e9d0] overflow-hidden">
          {langs.map((l, i) => {
            const selected = lang === l;
            return (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-2 text-sm
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

/* ============ 2줄차: 가운데 메뉴 ============ */
function MenuRow() {
  const items = useCartStore((s) => s.items ?? []);
  const count = useMemo(() => items.reduce((n, it) => n + (Number(it?.qty) || 0), 0), [items]);

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `relative inline-flex items-center px-3 py-2 rounded-md text-sm no-underline
     ${isActive ? "text-black font-bold" : "text-black font-semibold hover:bg-gray-50"}`;

  return (
    <nav className="pt-1 pb-1">
      <ul className="flex items-center justify-center gap-3">
        <li><NavLink to="/catalog" className={linkCls}>전체메뉴</NavLink></li>
        <li><NavLink to="/catalog?view=today" className={linkCls}>오특</NavLink></li>
        <li><NavLink to="/catalog?sort=rank" className={linkCls}>랭킹</NavLink></li>

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
