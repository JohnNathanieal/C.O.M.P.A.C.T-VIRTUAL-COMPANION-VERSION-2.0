const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useQuery } from '@tanstack/react-query';

import { Shield, CheckCircle2, XCircle, Clock } from 'lucide-react';

const statusConfig = {
  success: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
  failed: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  pending: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
};

export default function AuditLogPanel() {
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['auditlogs'],
    queryFn: () => db.entities.AuditLog.list('-created_date', 100),
  });

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" /> Audit Log
          </h1>
          <p className="text-sm text-muted-foreground">Signed action log for all agent executions and system events.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-12">No actions logged yet.</p>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => {
              const config = statusConfig[log.status] || statusConfig.success;
              const Icon = config.icon;
              return (
                <div key={log.id} className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
                  <div className={`h-8 w-8 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{log.action}</span>
                      {log.entity_type && <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{log.entity_type}</span>}
                    </div>
                    {log.details && <p className="text-xs text-muted-foreground mt-0.5 truncate">{log.details}</p>}
                    <span className="text-[10px] text-muted-foreground">{new Date(log.created_date).toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}