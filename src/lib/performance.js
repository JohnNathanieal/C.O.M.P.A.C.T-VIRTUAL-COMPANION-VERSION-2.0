const stats = {
  fps: 0,
  memoryUsed: 0,
  memoryLimit: 0,
  dbLatency: { last: 0, avg: 0, history: [] },
  tokenThroughput: 0,
  lastTokenCount: 0,
  lastResponseMs: 0,
};

let frameCount = 0;
let lastFrameTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
let rafId = null;
let tracking = false;

const listeners = new Set();

function notify() {
  const snapshot = getStats();
  listeners.forEach((fn) => fn(snapshot));
}

export function startTracking() {
  if (tracking || typeof requestAnimationFrame === 'undefined') return;
  tracking = true;
  const tick = () => {
    if (!tracking) return;
    frameCount++;
    const now = performance.now();
    if (now - lastFrameTime >= 1000) {
      stats.fps = Math.round((frameCount * 1000) / (now - lastFrameTime));
      frameCount = 0;
      lastFrameTime = now;
      updateMemory();
      notify();
    }
    rafId = requestAnimationFrame(tick);
  };
  rafId = requestAnimationFrame(tick);
}

export function stopTracking() {
  tracking = false;
  if (rafId) cancelAnimationFrame(rafId);
}

function updateMemory() {
  if (typeof performance !== 'undefined' && performance.memory) {
    stats.memoryUsed = Math.round(performance.memory.usedJSHeapSize / 1048576);
    stats.memoryLimit = Math.round(performance.memory.jsHeapSizeLimit / 1048576);
  }
}

export function recordDBLatency(ms) {
  const rounded = Math.round(ms);
  stats.dbLatency.last = rounded;
  stats.dbLatency.history.push(rounded);
  if (stats.dbLatency.history.length > 20) stats.dbLatency.history.shift();
  stats.dbLatency.avg = Math.round(stats.dbLatency.history.reduce((a, b) => a + b, 0) / stats.dbLatency.history.length);
  notify();
}

export function recordTokenThroughput(textLength, ms) {
  if (ms <= 0) return;
  const approxTokens = Math.max(1, Math.round(textLength / 4));
  stats.lastTokenCount = approxTokens;
  stats.lastResponseMs = Math.round(ms);
  stats.tokenThroughput = Math.round((approxTokens / ms) * 1000);
  notify();
}

export async function timedQuery(fn) {
  const start = performance.now();
  try {
    return await fn();
  } finally {
    recordDBLatency(performance.now() - start);
  }
}

export function getStats() {
  updateMemory();
  return {
    fps: stats.fps,
    memoryUsed: stats.memoryUsed,
    memoryLimit: stats.memoryLimit,
    dbLatency: { ...stats.dbLatency },
    tokenThroughput: stats.tokenThroughput,
    lastTokenCount: stats.lastTokenCount,
    lastResponseMs: stats.lastResponseMs,
  };
}

export function subscribePerformance(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}