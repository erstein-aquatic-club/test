import { loadAuth } from './storage';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string | undefined;

export type ApiResponse<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

export const apiPost = async <T,>(action: string, payload?: Record<string, unknown>): Promise<ApiResponse<T>> => {
  if (!BACKEND_URL) {
    return { ok: false, error: 'BACKEND_URL manquant' };
  }

  const auth = loadAuth();
  const body = {
    action,
    userId: auth?.userId,
    token: auth?.token,
    householdId: auth?.householdId,
    payload: payload ?? {},
  };

  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = (await response.json()) as ApiResponse<T>;
    return data;
  } catch (error) {
    return { ok: false, error: 'Erreur réseau' };
  }
};
