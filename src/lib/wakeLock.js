const STORAGE_KEY = 'background_mode';

let wakeLock = null;
let enabled = false;

export function isBackgroundMode() {
  try { return localStorage.getItem(STORAGE_KEY) === 'true'; } catch { return false; }
}

export async function setBackgroundMode(value) {
  try { localStorage.setItem(STORAGE_KEY, String(value)); } catch {}
  enabled = value;
  if (value) {
    await acquire();
  } else {
    release();
  }
}

async function acquire() {
  if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) return;
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    wakeLock.addEventListener('release', () => { wakeLock = null; });
  } catch {}
}

function release() {
  if (wakeLock) {
    wakeLock.release();
    wakeLock = null;
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (enabled && document.visibilityState === 'visible' && !wakeLock) {
      acquire();
    }
  });
}

enabled = isBackgroundMode();
if (enabled && typeof document !== 'undefined' && document.visibilityState === 'visible') {
  acquire();
}