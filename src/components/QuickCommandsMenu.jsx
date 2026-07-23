import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Command, Clock, Calendar, Cloud, Newspaper, Smile, Sparkles, Languages, FileText, Calculator, Plus, Bell, StickyNote, Youtube, MessageCircle, Search, Map, Mail, Music, Coins, Dices, Lightbulb, BookOpen, Trash2, ListChecks } from 'lucide-react';

const GROUPS = [
  {
    label: 'Utilities',
    items: [
      { label: 'Time', cmd: 'time', icon: Clock },
      { label: 'Date', cmd: 'date', icon: Calendar },
      { label: 'Weather', cmd: 'weather', icon: Cloud },
      { label: 'News', cmd: 'news', icon: Newspaper },
      { label: 'Calculator', cmd: 'calculator', icon: Calculator },
      { label: 'Coin Flip', cmd: 'coin', icon: Coins },
      { label: 'Dice Roll', cmd: 'dice', icon: Dices },
      { label: 'Fun Fact', cmd: 'fact', icon: Lightbulb },
      { label: 'Define', cmd: 'define', icon: BookOpen },
    ],
  },
  {
    label: 'Productivity',
    items: [
      { label: 'Add Task', cmd: 'addtask', icon: Plus },
      { label: 'Set Reminder', cmd: 'reminder', icon: Bell },
      { label: 'Add Note', cmd: 'note', icon: StickyNote },
      { label: 'Daily Summary', cmd: 'summary', icon: ListChecks },
    ],
  },
  {
    label: 'Chat',
    items: [
      { label: 'Joke', cmd: 'joke', icon: Smile },
      { label: 'Motivate', cmd: 'motivate', icon: Sparkles },
      { label: 'Translate', cmd: 'translate', icon: Languages },
      { label: 'Summarize', cmd: 'summarize', icon: FileText },
      { label: 'Clear Chat', cmd: 'clear', icon: Trash2 },
    ],
  },
  {
    label: 'Quick Links',
    items: [
      { label: 'YouTube', cmd: 'youtube', icon: Youtube },
      { label: 'WhatsApp', cmd: 'whatsapp', icon: MessageCircle },
      { label: 'Google', cmd: 'google', icon: Search },
      { label: 'Maps', cmd: 'maps', icon: Map },
      { label: 'Gmail', cmd: 'gmail', icon: Mail },
      { label: 'Calendar', cmd: 'calendar', icon: Calendar },
      { label: 'Music', cmd: 'music', icon: Music },
    ],
  },
];

export default function QuickCommandsMenu({ onCommand }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-primary px-2">
          <Command className="h-4 w-4" />
          Commands
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52 max-h-[360px] overflow-y-auto" align="start">
        {GROUPS.map((group, gi) => (
          <div key={group.label}>
            {gi > 0 && <DropdownMenuSeparator />}
            <DropdownMenuLabel className="text-xs text-muted-foreground">{group.label}</DropdownMenuLabel>
            {group.items.map(({ label, cmd, icon: Icon }) => (
              <DropdownMenuItem key={cmd} onClick={() => onCommand(cmd)} className="gap-2 text-sm cursor-pointer">
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </DropdownMenuItem>
            ))}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}