import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Message, Selection } from '../shared/types';
import { api } from '../src/api';
import { createSession, exportPayload, restoreSession, saveSession, type PageRequirements, type Session } from '../src/session';
import { createConversation, restoreConversations, updateConversation } from '../src/conversations';
import { applyPageRequirements, PROMPT_PREFIX, promptNeedsRefresh, requirementsContextMessages, requirementsFingerprint } from '../src/requirements';

afterEach(() => vi.unstubAllGlobals());

const requirements: PageRequirements = { audience: '教师与学生', features: ['课程介绍', '资料检索'], visualStyle: '明亮简洁', motion: 'balanced', constraints: '保留资料入口' };
const selection: Selection = { entryId: 'glass', stage: 'style', placement: '首页卡片', target: '课程卡片', layer: 'surface', adjustments: '半透明', preserve: ['布局', '文字'] };
const withPrompt = (session: Session): Session => ({ ...session, messages: [...session.messages, { role: 'assistant', content: PROMPT_PREFIX + '完整提示词' }], promptFingerprint: requirementsFingerprint(session) });

describe('editable whole-page requirements', () => {
  it('syncs cleaned whole-page fields into the draft and an explicit user update', () => {
    const original = { ...createSession(), stage: 'effect' as const, selections: [selection] };
    const updated = applyPageRequirements(original, '  课程\n 网站  ', { ...requirements, audience: ' 教师与学生 ', features: [' 课程介绍 ', '', '资料检索', '课程介绍'], visualStyle: ' 明亮  简洁 ', constraints: ' 保留资料入口 ' });
    expect(updated.brief).toBe('课程 网站');
    expect(updated.pageRequirements).toEqual({ ...requirements, visualStyle: '明亮 简洁' });
    expect(updated.stage).toBe('effect');
    expect(updated.selections).toEqual([selection]);
    expect(updated.messages.at(-1)).toMatchObject({ role: 'user' });
    const content = updated.messages.at(-1)!.content;
    for (const text of ['整页需求更新，以这一版为准：', '目标', '课程 网站', '用户', '教师与学生', '功能', '课程介绍', '资料检索', '风格', '明亮 简洁', '动效克制', '限制', '保留资料入口']) expect(content).toContain(text);
    expect(original.messages).toEqual([]);
  });

  it('does not append duplicate updates when the same requirements are saved again', () => {
    const updated = applyPageRequirements(createSession(), '课程网站', requirements);
    const withReply: Session = { ...updated, messages: [...updated.messages, { role: 'assistant', content: '好的' }] };
    expect(applyPageRequirements(withReply, ' 课程网站 ', { ...requirements, features: ['课程介绍', '资料检索', ''] })).toEqual(withReply);
  });

  it('reasserts a saved requirement after a later chat instruction', () => {
    const updated = applyPageRequirements(createSession(), '课程网站', requirements);
    const withChange: Session = { ...updated, messages: [...updated.messages, { role: 'user', content: '改成深色' }] };
    expect(applyPageRequirements(withChange, '课程网站', requirements).messages.at(-1)?.content).toBe(updated.messages[0].content);
  });

  it('writes every motion mode explicitly so the latest choice overrides earlier directions', () => {
    let updated = createSession();
    for (const [motion, text] of [['expressive', '动效特别强'], ['still', '不要动画'], ['balanced', '动效克制']] as const) {
      updated = applyPageRequirements(updated, '课程网站', { ...requirements, motion });
      expect(updated.pageRequirements?.motion).toBe(motion);
      expect(updated.messages.at(-1)?.content).toContain(text);
    }
    expect(updated.messages).toHaveLength(3);
  });

  it('does not mark a draft without a generated prompt as stale', () => {
    const updated = applyPageRequirements(createSession(), '课程网站', requirements);
    expect(promptNeedsRefresh(updated)).toBe(false);
  });

  it('marks existing prompts stale after changed requirements or when a legacy fingerprint is missing', () => {
    const draft = applyPageRequirements(createSession(), '课程网站', requirements);
    const generated = withPrompt(draft);
    expect(promptNeedsRefresh(generated)).toBe(false);
    expect(promptNeedsRefresh({ ...generated, promptFingerprint: undefined })).toBe(true);
    expect(promptNeedsRefresh(applyPageRequirements(generated, '课程网站', { ...requirements, motion: 'still' }))).toBe(true);
    expect(promptNeedsRefresh({ ...generated, brief: '另一个网站' })).toBe(true);
    expect(promptNeedsRefresh({ ...generated, messages: [...generated.messages, { role: 'user', content: '增加搜索' }] })).toBe(true);
  });

  it('tracks scoped selection changes, including preserved content', () => {
    const generated = withPrompt({ ...createSession(), brief: '课程网站', selections: [selection] });
    for (const changed of [{ ...selection, entryId: 'other' }, { ...selection, target: '搜索按钮' }, { ...selection, layer: 'border' as const }, { ...selection, adjustments: '不透明' }, { ...selection, preserve: ['布局'] }]) {
      expect(promptNeedsRefresh({ ...generated, selections: [changed] })).toBe(true);
    }
    expect(promptNeedsRefresh({ ...generated, selections: [] })).toBe(true);
  });

  it('ignores assistant replies, navigation stage, and selection ordering', () => {
    const second = { ...selection, entryId: 'border', layer: 'border' as const };
    const generated = withPrompt({ ...createSession(), brief: '课程网站', selections: [selection, second] });
    expect(promptNeedsRefresh({ ...generated, stage: 'effect', selections: [second, { ...selection, preserve: ['文字', '布局'] }], messages: [...generated.messages, { role: 'assistant', content: '新的回复' }] })).toBe(false);
  });

  it('restores previous draft storage and persists the new optional fields', () => {
    const legacy = { ...createSession(), brief: '原有需求', messages: [{ role: 'user' as const, content: '原有消息' }] };
    expect(restoreSession(JSON.stringify(legacy))).toEqual(legacy);
    const updated = withPrompt(applyPageRequirements(legacy, '课程网站', requirements));
    let saved = '';
    expect(saveSession({ setItem: (_key, value) => { saved = value; } }, updated)).toBe(true);
    expect(restoreSession(saved)).toEqual(updated);
  });

  it('drops malformed optional fields without losing valid core draft data', () => {
    const legacy = { ...createSession(), brief: '原有需求', messages: [{ role: 'user' as const, content: '保留历史' }] };
    for (const broken of [{ pageRequirements: { ...requirements, motion: 'invalid' }, promptFingerprint: 1 }, { pageRequirements: { ...requirements, features: [null] } }, { pageRequirements: null }, { pageRequirements: 'broken' }]) {
      expect(restoreSession(JSON.stringify({ ...legacy, ...broken }))).toEqual(legacy);
    }
    expect(restoreSession(JSON.stringify({ ...legacy, pageRequirements: requirements, promptFingerprint: [] }))).toEqual({ ...legacy, pageRequirements: requirements });
    expect(restoreSession(JSON.stringify({ ...legacy, pageRequirements: {}, promptFingerprint: 'saved' }))).toEqual({ ...legacy, promptFingerprint: 'saved' });
  });

  it('keeps old conversations compatible and isolates requirement edits by conversation', () => {
    const first = createConversation({ ...createSession(), brief: '原有对话' });
    const second = createConversation(withPrompt(applyPageRequirements(createSession(), '另一个网站', { ...requirements, audience: '研究人员' })));
    const store = { activeId: first.id, items: [first, second] };
    const updated = updateConversation(store, first.id, withPrompt(applyPageRequirements(first.draft, '课程网站', requirements)), '', null);
    const restored = restoreConversations(JSON.stringify(updated), createSession(), null);
    expect(restored).toEqual(updated);
    expect(restored.items[0].draft.pageRequirements?.audience).toBe('教师与学生');
    expect(restored.items[1].draft.pageRequirements?.audience).toBe('研究人员');
    expect(restored.items[1]).toEqual(second);
    expect(restoreConversations(JSON.stringify(store), createSession(), null).items[0]).toEqual(first);
    const broken = { ...first, draft: { ...first.draft, pageRequirements: {}, promptFingerprint: 7 } };
    expect(restoreConversations(JSON.stringify({ activeId: first.id, items: [broken, second] }), createSession(), null).items[0]).toEqual(first);
  });

  it('retains the latest saved whole-page update before the latest 39 messages in a long conversation', () => {
    const old = applyPageRequirements(createSession(), '旧需求', requirements).messages[0];
    const latest = applyPageRequirements(createSession(), '新需求', { ...requirements, motion: 'still' }).messages[0];
    const followUps: Message[] = Array.from({ length: 45 }, (_, index) => ({ role: index % 2 ? 'assistant' : 'user', content: `后续指令${index}` }));
    const messages = [old, latest, ...followUps];
    const context = requirementsContextMessages(messages);
    expect(context).toEqual([latest, ...followUps.slice(-39)]);
    expect(context).toHaveLength(40);
    expect(context.at(-1)).toEqual(followUps.at(-1));
    expect(messages).toHaveLength(47);
  });

  it('preserves the existing tail slicing behavior when the update is recent or absent', () => {
    const messages: Message[] = Array.from({ length: 45 }, (_, index) => ({ role: 'user', content: `消息${index}` }));
    const profile = applyPageRequirements(createSession(), '课程网站', requirements).messages[0];
    expect(requirementsContextMessages(messages)).toEqual(messages.slice(-40));
    expect(requirementsContextMessages([profile, ...messages.slice(0, 39)])).toEqual([profile, ...messages.slice(0, 39)]);
    expect(requirementsContextMessages([...messages, profile, ...messages.slice(0, 3)])).toEqual([...messages, profile, ...messages.slice(0, 3)].slice(-40));
    const assistantProfile: Message = { ...profile, role: 'assistant' };
    expect(requirementsContextMessages([assistantProfile, ...messages])).toEqual(messages.slice(-40));
  });

  it('keeps saved whole-page requirements in long-conversation export payloads', () => {
    const session = applyPageRequirements(createSession(), '课程网站', requirements);
    const messages: Message[] = [...session.messages, ...Array.from({ length: 45 }, (_, index) => ({ role: 'user' as const, content: `继续调整${index}` }))];
    expect(exportPayload({ ...session, messages }).messages).toEqual([session.messages[0], ...messages.slice(-39)]);
  });

  it('sends the retained whole-page context through both streaming and ordinary model requests', async () => {
    const session = applyPageRequirements(createSession(), '课程网站', requirements);
    const messages: Message[] = [...session.messages, ...Array.from({ length: 45 }, (_, index) => ({ role: 'user' as const, content: `继续调整${index}` }))];
    const sent: { messages: Message[] }[] = [];
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockImplementation(async (url, options) => {
      sent.push(JSON.parse(String(options?.body)));
      const result = { message: '已生成', developerPrompt: '完整提示词', referenceEntryIds: [], assumptions: [] };
      return String(url).endsWith('/stream') ? new Response(`data: ${JSON.stringify({ type: 'result', result })}\n\n`) : new Response(JSON.stringify({ mode: 'model', message: '已推荐', candidates: [] }));
    }));
    await api.promptStream({ brief: session.brief, messages, selections: [] }, () => {});
    await api.recommend({ description: session.brief, messages, selections: [], stage: 'structure', excludedIds: [] });
    for (const body of sent) expect(body.messages).toEqual([session.messages[0], ...messages.slice(-39)]);
  });
});
