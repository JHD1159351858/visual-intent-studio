import { createSession, restoreSession, type Session } from './session';
import { restoreDemo, type SavedDemo } from './demo-session';

export const CONVERSATIONS_KEY = 'jianyi.conversations.v1';
export interface Conversation { id: string; title: string; updatedAt: string; draft: Session; input: string; demo: SavedDemo | null }
export interface ConversationStore { activeId: string; items: Conversation[] }

const conversationTitle = (draft: Session, input: string) => Array.from((draft.brief.trim() || draft.messages.find(message => message.role === 'user')?.content.trim() || input.trim() || '新对话').replace(/\s+/g, ' ')).slice(0, 24).join('');

export function createConversation(draft: Session = createSession(), input = '', demo: SavedDemo | null = null): Conversation {
  return { id: crypto.randomUUID(), title: conversationTitle(draft, input), updatedAt: new Date().toISOString(), draft, input, demo: restoreDemo(JSON.stringify(demo), draft) };
}

function restoreConversation(value: unknown): Conversation | null {
  if (!value || typeof value !== 'object') return null;
  const item = value as Conversation;
  if (typeof item.id !== 'string' || !item.id || typeof item.title !== 'string' || typeof item.updatedAt !== 'string' || typeof item.input !== 'string' || !item.draft) return null;
  const draft = restoreSession(JSON.stringify(item.draft));
  if (draft.brief !== item.draft.brief || draft.stage !== item.draft.stage || JSON.stringify(draft.messages) !== JSON.stringify(item.draft.messages) || JSON.stringify(draft.selections) !== JSON.stringify(item.draft.selections)) return null;
  return { id: item.id, title: item.title, updatedAt: item.updatedAt, draft, input: item.input, demo: restoreDemo(JSON.stringify(item.demo), draft) };
}

export function restoreConversations(value: string | null, fallback: Session, fallbackDemo: SavedDemo | null): ConversationStore {
  try {
    const parsed = JSON.parse(value ?? 'null');
    if (parsed && Array.isArray(parsed.items)) {
      const items = parsed.items.map(restoreConversation).filter((item: Conversation | null): item is Conversation => item !== null);
      if (items.length) return { activeId: items.some((item: Conversation) => item.id === parsed.activeId) ? parsed.activeId : items[0].id, items };
    }
  } catch { /* Use the previous draft if no valid conversation history is available. */ }
  const item = createConversation(fallback, '', fallbackDemo);
  return { activeId: item.id, items: [item] };
}

export function updateConversation(store: ConversationStore, id: string, draft: Session, input: string, demo: SavedDemo | null): ConversationStore {
  return { ...store, items: store.items.map(item => item.id === id ? { ...item, title: conversationTitle(draft, input), updatedAt: new Date().toISOString(), draft, input, demo } : item) };
}

export function saveConversations(storage: Pick<Storage, 'setItem'>, store: ConversationStore): boolean {
  try { storage.setItem(CONVERSATIONS_KEY, JSON.stringify(store)); return true; } catch { return false; }
}
