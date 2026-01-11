const STORAGE_KEY = 'fridgePlannerAuth';

export type AuthState = {
  userId: string;
  token: string;
  householdId?: string;
};

export const loadAuth = (): AuthState | null => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthState;
  } catch {
    return null;
  }
};

export const saveAuth = (auth: AuthState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
};

export const clearAuth = () => {
  localStorage.removeItem(STORAGE_KEY);
};
