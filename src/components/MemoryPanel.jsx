const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Trash2, Brain, Plus } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = [
  { id: 'fact', label: 'Fact' },
  { id: 'preference', label: 'Preference' },
  { id: 'routine', label: 'Routine' },
  { id: 'project', label: 'Project' },
  { id: 'conversation', label: 'Conversation' },
];

export default function MemoryPanel() {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('fact');
  const [tags, setTags] = useState('');
  const queryClient = useQueryClient();

  const { data: memories = [], isLoading } = useQuery({
    queryKey: ['memories'],
    queryFn: () => db.entities.Memory.list('-created_date'),
  });

  const addMemory = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await db.entities.Memory.create({ content: content.trim(), category, tags: tags.trim() });
      setContent('');
      setTags('');
      queryClient.invalidateQueries(['memories']);
      toast.success('Memory stored');
    } catch { toast.error('Failed to store memory'); }
  };

  const deleteMemory = async (id) => {
    try {
      await db.entities.Memory.delete(id);
      queryClient.invalidateQueries(['memories']);
      toast.success('Memory removed');
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" /> Memory Engine
          </h1>
          <p className="text-sm text-muted-foreground">Long-term memory for context-aware conversations. Relevant memories are auto-injected into chat.</p>
        </div>

        <form onSubmit={addMemory} className="rounded-xl border border-border bg-card p-4 space-y-3">
          <textarea value={content} onChange={(e) => setContent(e.target.value)}
            placeholder="Store a fact, preference, or context for the assistant to remember..."
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            rows={3} />
          <div className="flex flex-wrap gap-2">
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground">
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <input value={tags} onChange={(e) => setTags(e.target.value)}
              placeholder="Tags (comma-separated)"
              className="flex-1 min-w-[150px] bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            <Button type="submit" disabled={!content.trim()} size="sm" className="gap-1">
              <Plus className="h-4 w-4" /> Store
            </Button>
          </div>
        </form>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
          </div>
        ) : memories.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-12">No memories stored yet. Add context for richer conversations.</p>
        ) : (
          <div className="space-y-2">
            {memories.map((m) => (
              <div key={m.id} className="group flex items-start gap-3 rounded-lg border border-border bg-card p-3">
                <div className="flex-1">
                  <p className="text-sm text-foreground">{m.content}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{m.category}</span>
                    {m.tags && <span className="text-xs text-muted-foreground">{m.tags}</span>}
                  </div>
                </div>
                <button onClick={() => deleteMemory(m.id)}
                  className="p-1 rounded text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition-all">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}