// src/features/auth/LoginPage.tsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { loginApi } from "../../api/auth";
import { useAuthStore } from "../../stores/authStore";
import { useI18n } from "../../lib/i18n";

export default function LoginPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";

  const { token, isHydrated, hydrate, signIn } = useAuthStore();

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isHydrated) hydrate();
  }, [isHydrated, hydrate]);

  useEffect(() => {
    if (isHydrated && token) {
      navigate(from, { replace: true });
    }
  }, [isHydrated, token, from, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");

    const emailOk = /\S+@\S+\.\S+/.test(email);
    if (!emailOk) return setErr("이메일 형식이 올바르지 않습니다.");
    if (pw.length < 6) return setErr("비밀번호는 6자 이상이어야 합니다.");

    try {
      setLoading(true);
      const res = await loginApi(email, pw);
      signIn(res);                // 전역 저장 + localStorage
      navigate(from, { replace: true });
    } catch (e: any) {
      setErr(
        e?.message === "INVALID_CREDENTIALS"
          ? "이메일/비밀번호를 확인해 주세요."
          : "로그인에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border shadow-sm p-6 bg-white">
        <h1 className="text-2xl font-bold">로그인</h1>
        <p className="text-sm text-gray-500 mt-1">이메일로 로그인해 주세요.</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-sm text-gray-600">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErr(""); }}
              className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">비밀번호</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={pw}
                onChange={(e) => { setPw(e.target.value); setErr(""); }}
                className="mt-1 w-full rounded-xl border px-3 py-2 pr-10 focus:outline-none focus:ring-2"
                placeholder="6자 이상"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500"
                onClick={() => setShowPw((v) => !v)}
                aria-label="비밀번호 보기"
              >
                {showPw ? "숨김" : "보기"}
              </button>
            </div>
          </div>

          {err && <p className="text-sm text-red-600">{err}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black text-white py-2.5 font-medium disabled:opacity-60"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-600 space-y-1">
          <div>
            계정이 없으신가요?{" "}
            <Link to="/signup" className="text-brand-600">회원가입</Link>
          </div>
          <div>
            <Link to="/forgot" className="text-brand-600">비밀번호 찾기</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
