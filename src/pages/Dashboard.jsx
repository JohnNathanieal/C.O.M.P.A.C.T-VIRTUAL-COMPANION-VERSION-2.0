const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis } from 'recharts';
import { CheckCircle2, Clock, TrendingUp, Cpu, Database, Shield, Zap, Activity, Brain } from 'lucide-react';
import { subscribeTelemetry, getTelemetry } from '@/lib/telemetry';
import { timedQuery } from '@/lib/performance';
import { getActivePreset, getPreset } from '@/lib/agentPresets';
import { getName } from '@/lib/voiceSettings';

export default function Dashboard() {
  const [telemetry, setTelemetry] = useState(() => getTelemetry());

  useEffect(() => {
    return subscribeTelemetry(setTelemetry);
  }, []);

  const { data: tasks = [] } = useQuery({ queryKey: ['tasks'], queryFn: () => timedQuery(() => db.entities.Task.list('-created_date')) });
  const { data: reminders = [] } = useQuery({ queryKey: ['reminders'], queryFn: () => timedQuery(() => db.entities.Reminder.list('-created_date')) });
  const { data: notes = [] } = useQuery({ queryKey: ['notes'], queryFn: () => timedQuery(() => db.entities.Note.list('-created_date')) });
  const { data: memories = [] } = useQuery({ queryKey: ['memories'], queryFn: () => timedQuery(() => db.entities.Memory.list('-created_date')) });

  const completed = tasks.filter((t) => t.status === 'completed').length;
  const pending = tasks.filter((t) => t.status === 'pending').length;
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
  const total = tasks.length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const chartData = [
    { name: 'Completed', value: completed, cssVar: '--chart-2' },
    { name: 'Pending', value: pending, cssVar: '--chart-3' },
    { name: 'In Progress', value: inProgress, cssVar: '--chart-1' },
  ].filter((d) => d.value > 0);

  const activePreset = getPreset(getActivePreset());
  const latencyData = telemetry.latencyHistory.map((v, i) => ({ index: i + 1, latency: v }));

  const telemetryPanels = [
    { label: 'Avg Latency', value: telemetry.avgLatency ? `${telemetry.avgLatency}ms` : '--', icon: Activity },
    { label: 'Last Latency', value: telemetry.lastLatency ? `${telemetry.lastLatency}ms` : '--', icon: Zap },
    { label: 'Messages', value: telemetry.messageCount, icon: TrendingUp },
    { label: 'Memory Hits', value: telemetry.memoryHits, icon: Brain },
  ];

  const entityPanels = [
    { label: 'Tasks', value: total, icon: CheckCircle2 },
    { label: 'Reminders', value: reminders.length, icon: Clock },
    { label: 'Notes', value: notes.length, icon: TrendingUp },
    { label: 'Memories', value: memories.length, icon: Database },
  ];

  const securityPanels = [
    { label: 'Auth', value: 'Active' },
    { label: 'Agent Mode', value: activePreset.label },
    { label: 'LLM Engine', value: 'Cloud' },
    { label: 'Memory Engine', value: 'Active' },
  ];

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">System Dashboard</h1>
            <p className="text-sm text-muted-foreground">Real-time telemetry and productivity metrics, Boss.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs text-primary font-medium">{getName()} Online</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {telemetryPanels.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-1">
                <Icon className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
              <div className="text-xl font-semibold text-foreground">{value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {entityPanels.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-1">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
              <div className="text-2xl font-semibold text-foreground">{value}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {latencyData.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-medium text-foreground mb-4">Response Latency</h2>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={latencyData}>
                  <XAxis dataKey="index" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Line type="monotone" dataKey="latency" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-foreground">Task Status</h2>
              <span className="text-sm font-medium text-primary">{completionRate}% complete</span>
            </div>
            {total === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-12">No tasks yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40} paddingAngle={3}>
                    {chartData.map((entry, i) => <Cell key={i} style={{ fill: `hsl(var(${entry.cssVar}))` }} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-medium text-foreground">System Status</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {securityPanels.map(({ label, value }) => (
              <div key={label} className="rounded-lg bg-secondary/50 p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
                <div className="text-sm font-medium text-foreground">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}