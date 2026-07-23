const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useState } from 'react';
import FeatureHints from './FeatureHints';

const STARTUP_LOGO = 'https://media.db.com/images/public/6a17d6cb694a8811145ddd38/9a4361e1e_logo.png';

export default function BootScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => Math.min(prev + 2, 100));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-full">
      <div className="flex flex-col items-center max-w-md w-full">
        <img src={STARTUP_LOGO} alt="C.O.M.P.A.C.T"
          className="h-24 w-24 rounded-full object-cover border-2 border-primary/30 mb-6 shadow-lg shadow-primary/10" />
        <h2 className="text-xl font-semibold text-foreground mb-1">Initializing C.O.M.P.A.C.T</h2>
        <p className="text-sm text-muted-foreground mb-6">Preparing your AI butler...</p>

        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden mb-8">
          <div className="h-full bg-primary rounded-full transition-all duration-100 ease-linear" style={{ width: `${progress}%` }} />
        </div>

        <FeatureHints />
      </div>
    </div>
  );
}