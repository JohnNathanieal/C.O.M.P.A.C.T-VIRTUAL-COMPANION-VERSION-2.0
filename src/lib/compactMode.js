const STORAGE_KEY = 'compact_mode';

export function isCompactMode() {
  try { return localStorage.getItem(STORAGE_KEY) === 'true'; } catch { return false; }
}

export function setCompactMode(enabled) {
  try { localStorage.setItem(STORAGE_KEY, String(enabled)); } catch {}
  applyCompactMode(enabled);
}

export function applyCompactMode(enabled) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('compact', enabled);
}

if (typeof document !== 'undefined') {
  applyCompactMode(isCompactMode());
}