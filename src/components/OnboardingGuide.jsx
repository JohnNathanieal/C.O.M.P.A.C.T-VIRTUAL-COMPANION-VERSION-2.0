import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight, MessageSquare, Command, Mic, Radio, Volume2, ListTodo, Bell, Settings, Brain, Sparkles, CheckCircle2, Zap } from 'lucide-react';

const STORAGE_KEY = 'compact_guide_seen';

const STEPS = [
  { icon: Sparkles, title: 'Welcome to C.O.M.P.A.C.T', text: 'Your personal virtual companion. Let me show you around in a few quick steps.' },
  { icon: MessageSquare, title: 'Chat with C.O.M.P.A.C.T', text: 'Ask me anything. I manage tasks, set reminders, take notes, answer questions, and more — all in natural language.' },
  { icon: Zap, title: 'Quick Commands', text: 'Click the Commands button above the chat input for instant actions like time, weather, news, jokes, and quick links.' },
  { icon: Mic, title: 'Voice Input', text: 'Tap the mic icon to send voice messages. Your speech is transcribed automatically. The mic glows when C.O.M.P.A.C.T is speaking.' },
  { icon: Radio, title: 'Wake Word', text: 'Enable Wake Word to go hands-free. Say "Hey C.O.M.P.A.C.T" followed by your request — no typing needed.' },
  { icon: Volume2, title: 'Auto-Speak', text: 'Toggle Auto-Speak to hear responses read aloud. Choose from 16 voice types and customize speed, pitch, and volume in Settings.' },
  { icon: ListTodo, title: 'Task Management', text: 'Visit the Tasks page to create, track, and complete tasks. You can also ask C.O.M.P.A.C.T to add tasks in chat.' },
  { icon: Bell, title: 'Smart Reminders', text: 'Set reminders and get notified when they are due. Never miss an important deadline.' },
  { icon: Brain, title: 'Memory', text: 'C.O.M.P.A.C.T remembers your preferences and context. Visit the Memories page to manage what it knows.' },
  { icon: Settings, title: 'Customize Everything', text: 'Head to Settings to change the assistant name, pick from 16 voice types, adjust speed, pitch, volume, and choose a personality.' },
  { icon: Command, title: 'Command Palette', text: 'Press Cmd+K (Mac) or Ctrl+K (Windows) to open the command palette and navigate anywhere instantly.' },
  { icon: CheckCircle2, title: 'You are all set', text: 'That is the tour. C.O.M.P.A.C.T is ready to assist you. You can replay this guide anytime from the help icon in the sidebar.' },
];

export default function OnboardingGuide({ open, onClose }) {
  const [step, setStep] = useState(0);

  if (!open) return null;

  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  const handleClose = () => {
    try { localStorage.setItem(STORAGE_KEY, 'true'); } catch {}
    onClose();
    setStep(0);
  };

  const handleNext = () => {
    if (isLast) handleClose();
    else setStep(step + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={handleClose}>
      <AnimatePresence mode="wait">
        <motion.div key={step}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-2xl">
          <div className="flex items-start justify-between mb-4">
            <div className="h-14 w-14 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center">
              <Icon className="h-7 w-7 text-primary" />
            </div>
            <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">{current.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">{current.text}</p>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
            </div>
            <span className="text-xs text-muted-foreground shrink-0">{step + 1}/{STEPS.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={handleClose} className="text-muted-foreground">
              Skip tutorial
            </Button>
            <div className="flex items-center gap-2">
              {step > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>
                  <ChevronLeft className="h-4 w-4" /> Back
                </Button>
              )}
              <Button size="sm" onClick={handleNext} className="gap-1">
                {isLast ? 'Get started' : 'Next'} <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function hasSeenGuide() {
  try { return localStorage.getItem(STORAGE_KEY) === 'true'; } catch { return false; }
}