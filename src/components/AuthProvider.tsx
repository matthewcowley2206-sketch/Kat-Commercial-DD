"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { LogIn, Shield } from "lucide-react";
import {
  clearSession,
  getSession,
  setSession,
  validateLogin,
  type AuthSession,
} from "@/lib/auth/dummy-auth";
import { copy } from "@/lib/copy";

interface AuthContextValue {
  session: AuthSession | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

function LoginScreen({ onLogin }: { onLogin: (email: string, password: string) => boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!onLogin(email, password)) {
      setError(copy.auth.invalidCredentials);
    }
  };

  const handleQuickSignIn = () => {
    setError(null);
    onLogin("guest@kat.com", "guest");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f7] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
              <Shield className="h-6 w-6" aria-hidden />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{copy.auth.signInTitle}</h1>
              <p className="text-sm text-slate-500">{copy.auth.signInSubtitle}</p>
            </div>
          </div>

          <button type="button" className="btn-primary mb-4 w-full" onClick={handleQuickSignIn}>
            <LogIn className="h-4 w-4" aria-hidden />
            {copy.auth.demoSignIn}
          </button>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center" aria-hidden>
              <div className="w-full border-t border-slate-200" />
            </div>
            <p className="relative flex justify-center text-xs uppercase tracking-wide text-slate-400">
              <span className="bg-white px-2">{copy.auth.orEmail}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-slate-700">
                {copy.auth.email}
              </label>
              <input
                id="login-email"
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-slate-700">
                {copy.auth.password}
              </label>
              <input
                id="login-password"
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
            <button type="submit" className="btn-secondary w-full">
              {copy.auth.signIn}
            </button>
          </form>

          <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
            {copy.auth.demoNote}
          </p>
        </div>
      </div>
    </div>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<AuthSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSessionState(getSession());
    setReady(true);
  }, []);

  const login = useCallback((email: string, password: string) => {
    const next = validateLogin(email, password);
    if (!next) return false;
    setSession(next);
    setSessionState(next);
    return true;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSessionState(null);
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center" role="status">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-brand-600" />
      </div>
    );
  }

  if (!session) {
    return <LoginScreen onLogin={login} />;
  }

  return (
    <AuthContext.Provider value={{ session, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
