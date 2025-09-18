// src/stores/authStore.ts
import { create } from "zustand";
import type { User, LoginResponse } from "../api/auth";

type AuthState = {
  token: string | null;
  user: User | null;
  isHydrated: boolean;
  signIn: (payload: LoginResponse) => void;
  signOut: () => void;
  hydrate: () => void;
};

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isHydrated: false,
  signIn: ({ token, user }) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ token, user });
  },
  signOut: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({ token: null, user: null });
  },
  hydrate: () => {
    const t = localStorage.getItem(TOKEN_KEY);
    const u = localStorage.getItem(USER_KEY);
    set({
      token: t,
      user: u ? (JSON.parse(u) as User) : null,
      isHydrated: true,
    });
  },
}));
