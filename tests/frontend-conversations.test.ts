import { describe, expect, it } from 'vitest';
import type { DemoResult } from '../shared/types';
import { acceptDemo } from '../src/demo-session';
import { createSession } from '../src/session';
import { CONVERSATIONS_KEY, createConversation, restoreConversations, saveConversations, updateConversation } from '../src/conversations';

const draft = { ...createSession(), brief: '做一个作品集', messages: [{ role: 'user' as const, content: '保留作品列表' }] };
const result: DemoResult = { status: 'ready', message: '已生成', html: '<html><body>作品集</body></html>', developerPrompt: '展示作品列表', pagePlan: { summary: '作品集', layout: '列表', visualStyle: '简洁', features: [], effects: [], assumptions: [] } };
const demo = acceptDemo(null, result, draft)!;

describe('browser conversation history', () => {
  it('migrates the previous draft and its matching demo when history is absent', () => {
    const store = restoreConversations(null, draft, demo);
    expect(store.items).toHaveLength(1);
    expect(store.activeId).toBe(store.items[0].id);
    expect(store.items[0]).toMatchObject({ title: draft.brief, draft, input: '', demo });
  });

  it('creates independent empty conversations with useful short titles', () => {
    const first = createConversation();
    const second = createConversation();
    expect(first.id).not.toBe(second.id);
    expect(first.draft).not.toBe(second.draft);
    expect(first).toMatchObject({ title: '新对话', draft: createSession(), input: '', demo: null });
    expect(createConversation({ ...createSession(), messages: [{ role: 'user', content: '  第一个需求\n继续描述 ' }] }).title).toBe('第一个需求 继续描述');
    expect(createConversation(createSession(), '准备发送的需求').title).toBe('准备发送的需求');
    expect(Array.from(createConversation({ ...draft, brief: '需要一个展示所有设计项目及其详细过程与成果的个人作品集网站' }).title)).toHaveLength(24);
  });

  it('updates one conversation without altering the other draft, input, or demo', () => {
    const first = createConversation(draft, '继续调整', demo);
    const second = createConversation({ ...createSession(), brief: '课程网站' }, '课程简介');
    const store = { activeId: second.id, items: [first, second] };
    const changed = { ...second.draft, brief: '教学平台' };
    const updated = updateConversation(store, second.id, changed, '下一步', null);
    expect(updated.activeId).toBe(second.id);
    expect(updated.items[0]).toBe(first);
    expect(updated.items[1]).toMatchObject({ id: second.id, title: '教学平台', draft: changed, input: '下一步', demo: null });
    expect(store.items[1]).toBe(second);
    expect(second.draft.brief).toBe('课程网站');
  });

  it('restores the active conversation, unsent input, and generated demo after saving', () => {
    const first = createConversation(draft, '尚未发送', demo);
    const second = createConversation();
    const store = { activeId: first.id, items: [second, first] };
    let key = '';
    let value = '';
    expect(saveConversations({ setItem: (savedKey, savedValue) => { key = savedKey; value = savedValue; } }, store)).toBe(true);
    expect(key).toBe(CONVERSATIONS_KEY);
    expect(restoreConversations(value, createSession(), null)).toEqual(store);
  });

  it('rejects demos from another draft on restore and legacy migration', () => {
    const otherDraft = { ...createSession(), brief: '另一份需求' };
    const item = { ...createConversation(otherDraft), demo };
    expect(restoreConversations(JSON.stringify({ activeId: item.id, items: [item] }), draft, demo).items[0].demo).toBeNull();
    expect(restoreConversations(null, otherDraft, demo).items[0].demo).toBeNull();
  });

  it('recovers from broken history through the previous draft', () => {
    for (const value of ['{', 'null', '{}', '{"items":[]}', JSON.stringify({ activeId: 'bad', items: [{ id: 'bad', draft: { brief: '损坏', stage: 'other' } }] })]) {
      const restored = restoreConversations(value, draft, demo);
      expect(restored.items).toHaveLength(1);
      expect(restored.items[0]).toMatchObject({ draft, demo });
      expect(restored.activeId).toBe(restored.items[0].id);
    }
  });

  it('preserves valid history entries and selects an existing conversation if the active entry is broken', () => {
    const item = createConversation(draft, '保留输入', demo);
    const store = restoreConversations(JSON.stringify({ activeId: 'broken', items: [{ id: 'broken' }, item] }), createSession(), null);
    expect(store).toEqual({ activeId: item.id, items: [item] });
  });

  it('keeps every history entry without silently limiting conversation count', () => {
    const items = Array.from({ length: 105 }, (_, index) => createConversation({ ...createSession(), brief: `需求${index}` }));
    const store = { activeId: items[104].id, items };
    expect(restoreConversations(JSON.stringify(store), createSession(), null)).toEqual(store);
  });

  it('reports storage failures without claiming the conversations were saved', () => {
    const item = createConversation(draft, '', demo);
    expect(saveConversations({ setItem: () => { throw new Error('quota exceeded'); } }, { activeId: item.id, items: [item] })).toBe(false);
  });
});
