const CREDENTIAL_KEY = 'agp-admin-credential-v1';
const SESSION_KEY = 'agp-admin-session-v1';

interface StoredCredential {
  id: string;
  passwordHash: string;
}

function hashValue(value: string): string {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return String(hash);
}

function readCredential(): StoredCredential | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const raw = window.localStorage.getItem(CREDENTIAL_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as Partial<StoredCredential>;
    if (typeof parsed.id !== 'string' || typeof parsed.passwordHash !== 'string') {
      return null;
    }
    return parsed as StoredCredential;
  } catch {
    return null;
  }
}

export function hasAdminCredential(): boolean {
  return readCredential() !== null;
}

export function registerAdminCredential(id: string, password: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  const payload: StoredCredential = {
    id: id.trim(),
    passwordHash: hashValue(password),
  };
  window.localStorage.setItem(CREDENTIAL_KEY, JSON.stringify(payload));
}

export function loginAdmin(id: string, password: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  const credential = readCredential();
  if (!credential) {
    return false;
  }
  const isValid = credential.id === id.trim() && credential.passwordHash === hashValue(password);
  if (isValid) {
    window.sessionStorage.setItem(SESSION_KEY, '1');
  }
  return isValid;
}

export function logoutAdmin(): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.sessionStorage.removeItem(SESSION_KEY);
}

export function isAdminLoggedIn(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.sessionStorage.getItem(SESSION_KEY) === '1';
}

