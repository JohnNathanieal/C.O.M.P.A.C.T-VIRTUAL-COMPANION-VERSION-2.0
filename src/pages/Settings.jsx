const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState, useEffect } from 'react';

import { User, Shield, Trash2, Loader2, Mail, BadgeCheck, Mic, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import ThemeToggle from '@/components/ThemeToggle';
import { VOICE_TYPES, PERSONALITIES, getVoiceSettings, saveVoiceSettings } from '@/lib/voiceSettings';
import { speak } from '@/lib/tts';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { isCompactMode, setCompactMode } from '@/lib/compactMode';
import { isBackgroundMode, setBackgroundMode } from '@/lib/wakeLock';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cur, setCur] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [savingPw, setSavingPw] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState(() => getVoiceSettings());
  const [compact, setCompactState] = useState(() => isCompactMode());
  const [bgMode, setBgModeState] = useState(() => isBackgroundMode());

  useEffect(() => {
    db.auth.me()
      .then((u) => { setUser(u); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const updateVoiceSetting = (partial) => {
    const updated = saveVoiceSettings(partial);
    setVoiceSettings(updated);
  };

  const testVoice = () => {
    speak(`Good day. I am ${voiceSettings.name}, at your service. How may I assist you today?`);
  };

  const currentP = PERSONALITIES.find((p) => p.id === voiceSettings.personality) || PERSONALITIES[0];
  const currentVoice = VOICE_TYPES.find((v) => v.id === voiceSettings.voiceType) || VOICE_TYPES[0];
  const currentPitch = voiceSettings.personalityOverrides?.[voiceSettings.personality]?.pitch ?? currentVoice.pitch ?? 1.0;
  const currentSlang = voiceSettings.personalityOverrides?.[voiceSettings.personality]?.slang ?? currentP.defaultSlang;

  const updateOverride = (partial) => {
    const overrides = { ...(voiceSettings.personalityOverrides || {}) };
    const current = overrides[voiceSettings.personality] || {};
    overrides[voiceSettings.personality] = { ...current, ...partial };
    updateVoiceSetting({ personalityOverrides: overrides });
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (next !== confirm) { toast.error('New passwords do not match'); return; }
    if (next.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setSavingPw(true);
    try {
      await db.auth.changePassword({ userId: user.id, currentPassword: cur, newPassword: next });
      toast.success('Password updated, Boss');
      setCur(''); setNext(''); setConfirm('');
    } catch (err) { toast.error('Could not change password'); }
    setSavingPw(false);
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await db.auth.logout();
    } catch (err) {
      toast.error('Failed to delete account');
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="flex-1 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your account and preferences, Boss.</p>
        </div>

        <section className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center gap-2 text-foreground font-medium"><User className="h-4 w-4 text-primary" /> Account</div>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-semibold">
              {(user?.full_name || user?.email || '?').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-foreground font-medium truncate">{user?.full_name || 'Member'}</div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground truncate"><Mail className="h-3 w-3 shrink-0" /> {user?.email}</div>
            </div>
            <span className="ml-auto inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-secondary border border-border text-muted-foreground capitalize"><BadgeCheck className="h-3 w-3" /> {user?.role || 'user'}</span>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center gap-2 text-foreground font-medium">Preferences</div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Appearance (light / dark)</span>
            <ThemeToggle />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-muted-foreground">Compact mode</span>
              <p className="text-xs text-muted-foreground/70">Tighter spacing to fit more on screen</p>
            </div>
            <Switch checked={compact} onCheckedChange={(v) => { setCompactMode(v); setCompactState(v); }} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-muted-foreground">Run in background</span>
              <p className="text-xs text-muted-foreground/70">Keep the app active when you switch tabs</p>
            </div>
            <Switch checked={bgMode} onCheckedChange={(v) => { setBackgroundMode(v); setBgModeState(v); }} />
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2 text-foreground font-medium"><Volume2 className="h-4 w-4 text-primary" /> Voice & Personality</div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Assistant Name</label>
            <Input
              value={voiceSettings.name}
              onChange={(e) => updateVoiceSetting({ name: e.target.value })}
              placeholder="Enter a name"
              maxLength={30}
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Voice Type ({VOICE_TYPES.length} voices)</label>
            <div className="flex flex-wrap gap-2">
              {VOICE_TYPES.map((v) => (
                <button key={v.id} onClick={() => updateVoiceSetting({ voiceType: v.id })}
                  className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${voiceSettings.voiceType === v.id ? 'bg-primary/15 text-primary border-primary/30' : 'bg-secondary border-border text-muted-foreground hover:text-foreground'}`}>
                  {v.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Voice Speed: {voiceSettings.speed.toFixed(1)}x</label>
            <input type="range" min="0.5" max="1.5" step="0.1" value={voiceSettings.speed}
              onChange={(e) => updateVoiceSetting({ speed: parseFloat(e.target.value) })}
              className="w-full accent-primary" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Volume: {Math.round((voiceSettings.volume ?? 1) * 100)}%</label>
            <input type="range" min="0" max="1" step="0.05" value={voiceSettings.volume ?? 1}
              onChange={(e) => updateVoiceSetting({ volume: parseFloat(e.target.value) })}
              className="w-full accent-primary" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Personality</label>
            <div className="grid grid-cols-2 gap-2">
              {PERSONALITIES.map((p) => (
                <button key={p.id} onClick={() => updateVoiceSetting({ personality: p.id })}
                  className={`px-3 py-2 rounded-lg text-sm border text-left transition-colors ${voiceSettings.personality === p.id ? 'bg-primary/15 text-primary border-primary/30' : 'bg-secondary border-border text-muted-foreground hover:text-foreground'}`}>
                  <div className="font-medium">{p.label}</div>
                  <div className="text-xs opacity-70 mt-0.5">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3 pt-3 border-t border-border">
            <div className="text-sm text-foreground font-medium">Fine-tune {currentP.label}</div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Pitch: {currentPitch.toFixed(2)}</label>
              <input type="range" min="0.5" max="1.5" step="0.05" value={currentPitch}
                onChange={(e) => updateOverride({ pitch: parseFloat(e.target.value) })}
                className="w-full accent-primary" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Slang: {currentSlang.toFixed(1)}</label>
              <input type="range" min="0" max="1" step="0.1" value={currentSlang}
                onChange={(e) => updateOverride({ slang: parseFloat(e.target.value) })}
                className="w-full accent-primary" />
            </div>
          </div>

          <Button variant="outline" size="sm" className="gap-2" onClick={testVoice}>
            <Mic className="h-4 w-4" /> Test Voice
          </Button>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center gap-2 text-foreground font-medium"><Shield className="h-4 w-4 text-primary" /> Security</div>
          <form onSubmit={changePassword} className="space-y-3">
            <Input type="password" placeholder="Current password" value={cur} onChange={(e) => setCur(e.target.value)} required />
            <Input type="password" placeholder="New password" value={next} onChange={(e) => setNext(e.target.value)} required />
            <Input type="password" placeholder="Confirm new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            <Button type="submit" disabled={savingPw} className="gap-2">
              {savingPw && <Loader2 className="h-4 w-4 animate-spin" />} Update password
            </Button>
          </form>
        </section>

        <section className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 space-y-3">
          <div className="flex items-center gap-2 text-destructive font-medium"><Trash2 className="h-4 w-4" /> Danger zone</div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 select-none">
                <Trash2 className="h-4 w-4" /> Delete account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently sign you out and remove your session from this device. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDeleteAccount} disabled={deleting}>
                  {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>
      </div>
    </div>
  );
}