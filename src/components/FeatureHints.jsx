import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Volume2, Mic, ListTodo, Command, Brain, Settings, BarChart3, Bell, Palette, Timer, Shield } from 'lucide-react';

const HINTS = [
  { icon: Radio, title: 'Wake Word', text: 'Enable Wake Word in the chat toolbar, then say "Hey Namakshar" to go hands-free.' },
  { icon: Volume2, title: 'Auto-Speak', text: 'Toggle Auto-speak to hear Namakshar read responses aloud automatically.' },
  { icon: Mic, title: 'Voice Input', text: 'Tap the mic icon to send voice messages that are transcribed instantly.' },
  { icon: ListTodo, title: 'Natural Language Tasks', text: 'Ask Namakshar to create tasks, set reminders, and take notes in plain English.' },
  { icon: Command, title: 'Command Palette', text: 'Press Cmd+K or Ctrl+K to open the command palette and navigate anywhere fast.' },
  { icon: Brain, title: 'Memory', text: 'Namakshar remembers your preferences and context across conversations.' },
  { icon: Settings, title: 'Custom Personality', text: 'Customize the assistant name, voice type, and personality in Settings.' },
  { icon: BarChart3, title: 'Performance HUD', text: 'Press Shift+H to toggle real-time system telemetry and performance metrics.' },
  { icon: Bell, title: 'Smart Reminders', text: 'Set reminders and get notified when they are due — never miss a deadline.' },
  { icon: Palette, title: 'Dark and Light Themes', text: 'Toggle between dark and light themes from the sidebar icon.' },
  { icon: Timer, title: 'Built-in Stopwatch', text: 'Use the stopwatch page to track time for any activity with precision.' },
  { icon: Shield, title: 'Audit Trail', text: 'Every action is logged in the Audit page for full transparency.' },
];

export default function FeatureHints({ interval = 3500, compact = false }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % HINTS.length);
    }, interval);
    return () => clearInterval(timer);
  }, [interval]);

  const hint = HINTS[index];
  const Icon = hint.icon;

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        <motion.div key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="flex items-start gap-3">
          <div className={`shrink-0 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center ${compact ? 'h-8 w-8' : 'h-10 w-10'}`}>
            <Icon className={`${compact ? 'h-4 w-4' : 'h-5 w-5'} text-primary`} />
          </div>
          <div className="min-w-0">
            <p className={`font-medium text-foreground ${compact ? 'text-xs' : 'text-sm'}`}>{hint.title}</p>
            <p className={`text-muted-foreground ${compact ? 'text-xs' : 'text-sm'} leading-relaxed`}>{hint.text}</p>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="flex gap-1 mt-4 justify-center">
        {HINTS.map((_, i) => (
          <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-primary' : 'w-1.5 bg-border'}`} />
        ))}
      </div>
    </div>
  );
}