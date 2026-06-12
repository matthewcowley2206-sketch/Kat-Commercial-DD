export interface AuthSession {
  email: string;
  name: string;
  loggedInAt: string;
}

const SESSION_KEY = "kat-auth-session";

function displayNameFromEmail(email: string): string {
  const local = email.split("@")[0]?.trim();
  if (!local) return "Guest";
  return local.charAt(0).toUpperCase() + local.slice(1);
}

export function validateLogin(email: string, password: string): AuthSession | null {
  const normalised = email.trim().toLowerCase();
  if (!normalised || !password.trim()) return null;

  return {
    email: normalised,
    name: displayNameFromEmail(normalised),
    loggedInAt: new Date().toISOString(),
  };
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
