export const DEMO_CREDENTIALS = {
  email: "demo@kat.com",
  password: "demo123",
  name: "Demo Broker",
} as const;

export interface AuthSession {
  email: string;
  name: string;
  loggedInAt: string;
}

const SESSION_KEY = "kat-auth-session";

export function validateLogin(email: string, password: string): AuthSession | null {
  const normalised = email.trim().toLowerCase();
  if (
    normalised === DEMO_CREDENTIALS.email &&
    password === DEMO_CREDENTIALS.password
  ) {
    return {
      email: DEMO_CREDENTIALS.email,
      name: DEMO_CREDENTIALS.name,
      loggedInAt: new Date().toISOString(),
    };
  }
  return null;
}

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function setSession(session: AuthSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

export function getActorLabel(session: AuthSession | null): string {
  return session?.name ?? "user";
}
