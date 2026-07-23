import { useState, useEffect } from 'react';
import { Gauge, X, Cpu, Database, Zap, MemoryStick } from 'lucide-react';
import { subscribePerformance, getStats, startTracking, stopTracking } from '@/lib/performance';

export default function PerformanceHUD() {
  const [visible, setVisible] = useState(false);
  const [stats, setStats] = useState(() => getStats());

  useEffect(() => {
    startTracking();
    const unsub = subscribePerformance(setStats);
    return () => { stopTracking(); unsub(); };
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.shiftKey && (e.key === 'H' || e.key === 'h')) setVisible((v) => !v);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (!visible) {
    return (
      <button onClick={() => setVisible(true)} title="Performance HUD (Shift+H)"
        className="fixed bottom-20 md:bottom-4 right-4 z-50 h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary shadow-lg transition-colors">
        <Gauge className="h-4 w-4" />
      </button>
    );
  }

  const metrics = [
    { label: 'FPS', value: stats.fps, icon: Zap, color: stats.fps >= 50 ? 'text-green-500' : stats.fps >= 30 ? 'text-yellow-500' : 'text-red-500' },
    { label: 'Memory', value: stats.memoryUsed ? `${stats.memoryUsed}MB` : 'N/A', icon: MemoryStick },
    { label: 'DB Latency', value: `${stats.dbLatency.avg}ms`, icon: Database, color: stats.dbLatency.avg < 200 ? 'text-green-500' : 'text-yellow-500' },
    { label: 'Tokens/s', value: stats.tokenThroughput || '--', icon: Cpu },
  ];

  return (
    <div className="fixed bottom-20 md:bottom-4 right-4 z-50 rounded-xl border border-border bg-card/95 backdrop-blur p-3 shadow-xl w-52">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-foreground flex items-center gap-1">
          <Gauge className="h-3 w-3 text-primary" /> Performance HUD
        </span>
        <button onClick={() => setVisible(false)} className="text-muted-foreground hover:text-foreground">
          <X className="h-3 w-3" />
        </button>
      </div>
      <div className="space-y-1.5">
        {metrics.map((m) => (
          <div key={m.label} className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <m.icon className="h-3 w-3" /> {m.label}
            </span>
            <span className={`font-mono font-medium ${m.color || 'text-foreground'}`}>{m.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 pt-2 border-t border-border text-[10px] text-muted-foreground">Shift+H to toggle</div>
    </div>
  );
}