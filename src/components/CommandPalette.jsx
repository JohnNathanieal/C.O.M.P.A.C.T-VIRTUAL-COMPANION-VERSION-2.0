import { useNavigate } from 'react-router-dom';
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from '@/components/ui/command';
import { MessageSquare, ListTodo, Bell, StickyNote, Timer, BarChart3, Settings, Brain, Shield, Network, Sunrise, Code, Search } from 'lucide-react';
import { AGENT_PRESETS, getActivePreset, setActivePresetId } from '@/lib/agentPresets';

const navItems = [
  { label: 'Chat', path: '/', icon: MessageSquare },
  { label: 'Tasks', path: '/tasks', icon: ListTodo },
  { label: 'Reminders', path: '/reminders', icon: Bell },
  { label: 'Notes', path: '/notes', icon: StickyNote },
  { label: 'Memories', path: '/memories', icon: Brain },
  { label: 'Audit Log', path: '/audit', icon: Shield },
  { label: 'Stopwatch', path: '/stopwatch', icon: Timer },
  { label: 'Dashboard', path: '/dashboard', icon: BarChart3 },
  { label: 'Settings', path: '/settings', icon: Settings },
];

const presetIcons = { orchestrator: Network, morning_briefing: Sunrise, code_assistant: Code, deep_research: Search };

export default function CommandPalette({ open, onOpenChange }) {
  const navigate = useNavigate();
  const activePreset = getActivePreset();

  const go = (path) => { navigate(path); onOpenChange(false); };
  const switchPreset = (id) => { setActivePresetId(id); onOpenChange(false); navigate('/'); };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {navItems.map(({ label, path, icon: Icon }) => (
            <CommandItem key={path} onSelect={() => go(path)}>
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Agent Presets">
          {AGENT_PRESETS.map((p) => {
            const Icon = presetIcons[p.id] || Network;
            return (
              <CommandItem key={p.id} onSelect={() => switchPreset(p.id)}>
                <Icon className="h-4 w-4" />
                <div className="flex flex-col">
                  <span>{p.label}</span>
                  <span className="text-xs text-muted-foreground">{p.desc}</span>
                </div>
                {activePreset === p.id && <span className="ml-auto text-xs text-primary">Active</span>}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}