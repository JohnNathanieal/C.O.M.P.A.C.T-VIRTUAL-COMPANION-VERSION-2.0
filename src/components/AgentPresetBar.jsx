import { useState } from 'react';
import { Network, Sunrise, Code, Search } from 'lucide-react';
import { AGENT_PRESETS, getActivePreset, setActivePresetId } from '@/lib/agentPresets';

const presetIcons = { orchestrator: Network, morning_briefing: Sunrise, code_assistant: Code, deep_research: Search };

export default function AgentPresetBar() {
  const [active, setActive] = useState(() => getActivePreset());

  const select = (id) => { setActivePresetId(id); setActive(id); };

  return (
    <div className="flex items-center gap-1 px-3 py-2 border-b border-border bg-card/30 overflow-x-auto shrink-0">
      <span className="text-xs text-muted-foreground shrink-0 mr-1">Mode:</span>
      {AGENT_PRESETS.map((p) => {
        const Icon = presetIcons[p.id] || Network;
        const isActive = active === p.id;
        return (
          <button key={p.id} onClick={() => select(p.id)} title={p.desc}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs whitespace-nowrap border transition-colors select-none ${isActive ? 'bg-primary/15 text-primary border-primary/30' : 'text-muted-foreground hover:bg-secondary hover:text-foreground border-transparent'}`}>
            <Icon className="h-3 w-3" /> {p.label}
          </button>
        );
      })}
    </div>
  );
}