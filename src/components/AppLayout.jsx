const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { MessageSquare, ListTodo, LogOut, Bell, StickyNote, Timer, Settings, BarChart3, Brain, Shield, HelpCircle } from 'lucide-react';

import { cn } from '@/lib/utils';
import { NAMAKSHAR_AVATAR } from '@/lib/voiceSettings';
import ReminderChecker from './ReminderChecker';
import ThemeToggle from './ThemeToggle';
import CommandPalette from './CommandPalette';
import PerformanceHUD from './PerformanceHUD';
import BottomNav from './BottomNav';
import MobileHeader from './MobileHeader';
import '@/lib/compactMode';
import '@/lib/wakeLock';

const navItems = [
{ to: '/', icon: MessageSquare, label: 'Chat' },
{ to: '/tasks', icon: ListTodo, label: 'Tasks' },
{ to: '/reminders', icon: Bell, label: 'Reminders' },
{ to: '/notes', icon: StickyNote, label: 'Notes' },
{ to: '/stopwatch', icon: Timer, label: 'Stopwatch' },
{ to: '/dashboard', icon: BarChart3, label: 'Dashboard' },
{ to: '/memories', icon: Brain, label: 'Memories' },
{ to: '/audit', icon: Shield, label: 'Audit' },
{ to: '/settings', icon: Settings, label: 'Settings' }];

export default function AppLayout() {
  const { pathname } = useLocation();
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <div className="w-16 md:w-20 border-r border-border bg-card/50 flex flex-col items-center py-4 shrink-0">
        <img src="https://media.db.com/images/public/6a17d6cb694a8811145ddd38/9a4361e1e_logo.png" alt="C.O.M.P.A.C.T" title="C.O.M.P.A.C.T"
        className="h-10 w-10 rounded-full object-cover border border-primary/30 mb-8" />
        <nav className="flex-1 flex flex-col items-center gap-2">
          {navItems.map(({ to, icon: Icon, label }) =>
          <Link key={to} to={to} title={label}
          className={cn("h-10 w-10 rounded-xl flex items-center justify-center transition-all",
          pathname === to ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground")}>
              <Icon className="h-5 w-5" />
            </Link>
          )}
        </nav>
        <button onClick={() => window.dispatchEvent(new CustomEvent('compact_open_guide'))} title="Guide"
        className="h-10 w-10 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
          <HelpCircle className="h-5 w-5" />
        </button>
        <ThemeToggle />
        <button onClick={() => db.auth.logout()} title="Logout"
        className="h-10 w-10 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
          <LogOut className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1 min-w-0 flex flex-col">
        <MobileHeader />
        <ReminderChecker />
        <div className="flex-1 min-h-0">
          <Outlet />
        </div>
      </div>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      <PerformanceHUD />
      <BottomNav />
    </div>);

}