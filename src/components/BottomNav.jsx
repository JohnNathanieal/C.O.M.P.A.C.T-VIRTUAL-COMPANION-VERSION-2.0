import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, ListTodo, Bell, Mic, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import MicGlow from './MicGlow';

const navItems = [
  { to: '/', icon: MessageSquare, label: 'Chat' },
  { to: '/tasks', icon: ListTodo, label: 'Tasks' },
  { to: '/reminders', icon: Bell, label: 'Alerts' },
  { to: '/dashboard', icon: BarChart3, label: 'Stats' },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const [talking, setTalking] = useState(false);

  const startTalk = () => {
    setTalking(true);
    window.dispatchEvent(new CustomEvent('namakshar_hold_to_talk', { detail: { active: true } }));
  };
  const stopTalk = () => {
    if (!talking) return;
    setTalking(false);
    window.dispatchEvent(new CustomEvent('namakshar_hold_to_talk', { detail: { active: false } }));
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.slice(0, 2).map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to} className={cn("flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors select-none", pathname === to ? "text-primary" : "text-muted-foreground")}>
            <Icon className="h-5 w-5" />
            <span className="text-[10px]">{label}</span>
          </Link>
        ))}
        <MicGlow active={talking}>
        <button
          onPointerDown={startTalk}
          onPointerUp={stopTalk}
          onPointerLeave={stopTalk}
          onPointerCancel={stopTalk}
          className={cn("flex items-center justify-center h-12 w-12 rounded-full border-2 transition-all shrink-0 select-none", talking ? "bg-primary border-primary text-primary-foreground scale-110 animate-pulse" : "bg-primary/10 border-primary/30 text-primary")}
        >
          <Mic className="h-5 w-5" />
        </button>
        </MicGlow>
        {navItems.slice(2).map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to} className={cn("flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors select-none", pathname === to ? "text-primary" : "text-muted-foreground")}>
            <Icon className="h-5 w-5" />
            <span className="text-[10px]">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}