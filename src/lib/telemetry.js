const stats = {
  latencies: [],
  lastLatency: 0,
  avgLatency: 0,
  messageCount: 0,
  memoryHits: 0,
};

const listeners = new Set();

function notify() {
  const snapshot = getTelemetry();
  listeners.forEach((fn) => fn(snapshot));
}

export function recordLatency(ms) {
  const rounded = Math.round(ms);
  stats.latencies.push(rounded);
  if (stats.latencies.length > 50) stats.latencies.shift();
  stats.lastLatency = rounded;
  stats.avgLatency = Math.round(stats.latencies.reduce((a, b) => a + b, 0) / stats.latencies.length);
  stats.messageCount++;
  notify();
}

export function recordMemoryHit(count = 1) {
  stats.memoryHits += count;
  notify();
}

export function getTelemetry() {
  return {
    lastLatency: stats.lastLatency,
    avgLatency: stats.avgLatency,
    messageCount: stats.messageCount,
    memoryHits: stats.memoryHits,
    latencyHistory: [...stats.latencies],
  };
}

export function subscribeTelemetry(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}