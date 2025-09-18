export type User = {
  id: string;
  email: string;
  name: string;
  // 필요한 필드 더 추가: avatarUrl, role 등
};

export type LoginResponse = {
  token: string | null; // 세션쿠키 방식이면 null이어도 됨
  user: User | null;    // 어떤 서버는 로그인 직후 user를 안 돌려주기도 함 → 그땐 /me로 다시 조회
};

const API_BASE = import.meta.env.VITE_API_BASE ?? ""; // 예: "https://api.example.com"

/**
 * 로그인 (이 함수가 "교체 지점")
 * - 토큰 방식: /auth/login 으로 POST → { accessToken, user } 받음
 * - 세션 방식: /auth/login 으로 POST( credentials:'include' ) → 쿠키 세팅, 그 후 /auth/me 로 user 조회
 */
export async function loginApi(email: string, password: string): Promise<LoginResponse> {
  // ▣ 1) 공통 옵션
  const url = `${API_BASE}/auth/login`;

  // ▣ 2-A) ───── 토큰 방식(JSON Body로 토큰/유저 반환) ─────
  //  - Nest/Express에서 많이 보는 형태:
  //    { "accessToken": "...", "user": { "id": "...", "email": "...", "name": "..." } }
  //  - 아래 credentials: 'omit' 그대로 두세요 (쿠키 안 씀)
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // ⚠️ 서버 스펙에 맞추세요: { email, password } 또는 { username, password } 등
    body: JSON.stringify({ email, password }),
    credentials: "omit", // 토큰 방식이면 omit (쿠키 안 씀)
  });

  // 에러 처리
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    // 서버가 에러 메시지 포맷을 제공한다면 여기에 맞춰 파싱
    throw new Error(text || `LOGIN_FAILED_${res.status}`);
  }

  // 서버 응답 모양 정규화
  // 예) { accessToken, user }, 또는 { token, profile }, 또는 { jwt, user }
  const data = await res.json().catch(() => ({}));
  const token =
    data.accessToken ?? data.token ?? data.jwt ?? null;
  const rawUser =
    data.user ?? data.profile ?? null;

  const user: User | null = rawUser
    ? {
        id: rawUser.id ?? rawUser.userId ?? "",
        email: rawUser.email ?? "",
        name: rawUser.name ?? rawUser.nickname ?? rawUser.username ?? "",
      }
    : null;

  return { token, user };

  // ▣ 2-B) ───── 세션 쿠키 방식(원하면 위 블럭 대신 이 블럭을 사용) ─────
  // - 쿠키를 httpOnly로 심어줘서 프론트에서 토큰을 다루지 않는 방식
  // - 사용하려면 위 2-A 블럭을 주석 처리하고, 아래를 주석 해제하세요.
  /*
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include", // ★ 쿠키 전달/수신
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `LOGIN_FAILED_${res.status}`);
  }

  // 어떤 서버는 여기서 user를 주고, 어떤 서버는 아무것도 안 줍니다.
  // user가 없으면 /auth/me 로 추가 조회
  let user: User | null = null;
  try {
    const data = await res.json();
    const rawUser = data?.user ?? data?.profile ?? null;
    if (rawUser) {
      user = {
        id: rawUser.id ?? rawUser.userId ?? "",
        email: rawUser.email ?? "",
        name: rawUser.name ?? rawUser.nickname ?? rawUser.username ?? "",
      };
    }
  } catch (_) {
    // 본문이 없을 수 있음
  }

  if (!user) {
    user = await meApi(); // 쿠키 기반으로 /auth/me 호출
  }

  return { token: null, user };
  */
}

/**
 * 현재 로그인 사용자 조회 (세션 쿠키 방식 or 토큰 방식 모두에서 사용 가능)
 * - 토큰 방식이라면, 호출하는 쪽에서 Authorization 헤더를 넣으세요.
 */
export async function meApi(token?: string): Promise<User | null> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: token ? "omit" : "include", // 토큰 없으면 세션쿠키 모드로 호출
  });

  if (!res.ok) return null;

  const data = await res.json().catch(() => null);
  if (!data) return null;

  const rawUser = data.user ?? data.profile ?? data;
  return {
    id: rawUser.id ?? rawUser.userId ?? "",
    email: rawUser.email ?? "",
    name: rawUser.name ?? rawUser.nickname ?? rawUser.username ?? "",
  };
}

/**
 * 로그아웃
 * - 토큰 방식: 클라이언트에서 토큰만 지워도 됨(서버에 블랙리스트가 있으면 /auth/logout 호출).
 * - 세션 방식: 반드시 서버에 /auth/logout 요청(쿠키 삭제).
 */
export async function logoutApi(token?: string): Promise<void> {
  const res = await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: token ? "omit" : "include",
  });
  // 실패하더라도 클라이언트 상태는 정리 가능
  if (!res.ok) {
    // 필요 시 서버 메시지 확인
    await res.text().catch(() => "");
  }
}

/**
 * (옵션) 토큰 리프레시
 * - 백엔드가 refreshToken을 준다면 여기에 구현
 */
export async function refreshTokenApi(refreshToken: string): Promise<string> {
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) throw new Error("REFRESH_FAILED");
  const data = await res.json();
  return data.accessToken ?? data.token ?? data.jwt;
}
