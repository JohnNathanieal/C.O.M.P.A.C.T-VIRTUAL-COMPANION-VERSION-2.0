const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Settings as SettingsIcon } from 'lucide-react';

const routeTitles = {
  '/': 'Chat',
  '/tasks': 'Tasks',
  '/reminders': 'Reminders',
  '/notes': 'Notes',
  '/stopwatch': 'Stopwatch',
  '/settings': 'Settings',
  '/dashboard': 'Dashboard',
  '/memories': 'Memories',
  '/audit': 'Audit',
};

export default function MobileHeader() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const title = routeTitles[pathname] || 'C.O.M.P.A.C.T';
  const isHome = pathname === '/';

  return (
    <header className="md:hidden shrink-0 border-b border-border bg-card/95 backdrop-blur pt-[env(safe-area-inset-top)]">
      <div className="flex items-center justify-between h-14 px-2">
        <div className="flex items-center min-w-[56px]">
          {!isHome ? (
            <button onClick={() => navigate(-1)} className="flex items-center gap-0.5 text-primary px-2 py-1 rounded-lg active:bg-secondary transition-colors select-none">
              <ChevronLeft className="h-6 w-6" />
              <span className="text-sm">Back</span>
            </button>
          ) : (
            <img src="https://media.db.com/images/public/6a17d6cb694a8811145ddd38/9a4361e1e_logo.png" alt="C.O.M.P.A.C.T" className="h-7 w-7 rounded-full object-cover" />
          )}
        </div>
        <h1 className="text-base font-semibold text-foreground">{title}</h1>
        <div className="min-w-[56px] flex justify-end">
          {isHome && (
            <Link to="/settings" className="flex items-center justify-center h-9 w-9 rounded-lg text-muted-foreground active:bg-secondary transition-colors select-none">
              <SettingsIcon className="h-5 w-5" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}