import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowDownToLine, ArrowRight, Check, ChevronRight, Copy, ExternalLink, Film, History, Layers3, LoaderCircle, MessageSquare, Pencil, Play, Plus, RefreshCw, Search, Send, Square, Trash2, X } from 'lucide-react';
import type { AppStatus, CatalogEntry, DemoRequest, DesignPromptRequest, RecommendationRequest, RecommendationResponse, Selection, SourceInfo, Stage, VisualLayer } from '../shared/types';
import { selectionKey, selectionLayer, selectionTarget, visualLayers } from '../shared/selection';
import { api } from './api';
import { confirmSelection, createSession, exportPayload, removeSelection, restoreSession, saveSession, STORAGE_KEY, type PageRequirements } from './session';
import DemoWorkspace, { layerLabels } from './DemoWorkspace';
import DesignLibrary from './DesignLibrary';
import PromptMessage, { PROMPT_PREFIX } from './PromptMessage';
import type { ComponentImplementation, PageRecipe } from '../shared/design-library';
import { acceptDemo, DEMO_STORAGE_KEY, demoNeedsRefresh, reconcileDemoSelections, restoreDemo, saveDemo, type SavedDemo } from './demo-session';
import { CONVERSATIONS_KEY, createConversation, restoreConversations, saveConversations, updateConversation, type ConversationStore } from './conversations';
import { applyPageRequirements, capturePromptResult, promptNeedsRefresh, promptReferenceCandidates, requirementsFingerprint } from './requirements';
import { PageRequirementsForm, PageRequirementsSummary } from './PageRequirements';

const stages: Stage[] = ['structure', 'style', 'effect'];
const labels: Record<Stage, string> = { structure: '结构', style: '样式', effect: '效果' };
const stageNotes: Record<Stage, string> = { structure: '先决定内容怎样组织', style: '再决定页面的视觉语言', effect: '最后补充交互与动效' };
const sourceNames = { designeer: 'Designeer', reactbits: 'React Bits', aceternity: 'Aceternity UI', codrops: 'Codrops', '60fps': '60fps.design' };
const selectable = (entry: CatalogEntry) => entry.status === 'ready' && entry.preview.type === 'video' && entry.preview.verified;

function initialConversations() {
  try { const draft = restoreSession(localStorage.getItem(STORAGE_KEY)); return restoreConversations(localStorage.getItem(CONVERSATIONS_KEY), draft, restoreDemo(localStorage.getItem(DEMO_STORAGE_KEY), draft)); }
  catch { return restoreConversations(null, createSession(), null); }
}
function Modal({ title, children, onClose, className = '' }: { title: string; children: ReactNode; onClose: () => void; className?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { ref.current?.showModal(); }, []);
  return <dialog ref={ref} className={`modal ${className}`} aria-label={title} onCancel={onClose}><div className="modal-heading"><h2>{title}</h2><button className="icon-button" aria-label="关闭" onClick={onClose}><X size={20} /></button></div>{children}</dialog>;
}

function VideoPreview({ entry, onPlayable, preload = 'metadata' }: { entry: CatalogEntry; onPlayable?: () => void; preload?: 'none' | 'metadata' }) {
  const [failed, setFailed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => { setFailed(false); setExpanded(false); }, [entry.preview.url]);
  return <div className="video-frame">
    {entry.preview.type === 'video' && !failed ? <><video ref={videoRef} preload={preload} playsInline poster={entry.preview.poster} src={entry.preview.url} aria-label={`${entry.title}演示视频`} onLoadedData={onPlayable} onError={() => setFailed(true)} /><button className="video-expand" aria-label={`放大观看${entry.title}`} onClick={() => { videoRef.current?.pause(); setExpanded(true); }}><span><Play size={17} fill="currentColor" />放大观看</span></button></> : <div className="video-unavailable"><Film size={24} /><span>{failed ? '视频暂时无法播放' : '该条目还没有视频预览'}</span><a href={entry.sourceUrl} target="_blank" rel="noreferrer">查看来源 <ExternalLink size={13} /></a></div>}
    <span className="provenance">{entry.preview.provenance === 'original' ? '来源原始视频' : entry.preview.provenance === 'source-recording' ? '原站演示实录' : '参考演示录屏'}</span>
    {expanded && <Modal title={entry.title} className="video-modal" onClose={() => setExpanded(false)}><video controls autoPlay muted loop playsInline poster={entry.preview.poster} src={entry.preview.url} aria-label={`${entry.title}放大演示视频`} onLoadedData={onPlayable} onError={() => { setFailed(true); setExpanded(false); }} /><p className="video-description">{entry.description}</p></Modal>}
  </div>;
}

function SelectionEditor({ entry, selected, implementation, targets, onConfirm, onClose }: { entry: CatalogEntry; selected?: Selection; implementation?: ComponentImplementation; targets: string[]; onConfirm: (value: Selection) => void; onClose: () => void }) {
  const [placement, setPlacement] = useState(selected?.placement || entry.placements[0] || '首页');
  const [adjustments, setAdjustments] = useState(selected?.adjustments || (implementation ? `采用《${implementation.title}》原生实现；${implementation.limitations.join('；')}` : ''));
  const [target, setTarget] = useState(selected ? selectionTarget(selected) : implementation ? targets.find(value => value !== 'page') || entry.placements[0] || '功能卡片' : entry.stage === 'structure' ? 'page' : targets[0] || entry.placements[0] || '功能卡片');
  const [layer, setLayer] = useState<VisualLayer>(selected ? selectionLayer(selected) : implementation?.layer || selectionLayer({ entryId: entry.id, stage: entry.stage, placement: '', adjustments: '' }));
  const [operation, setOperation] = useState<'add' | 'replace'>(selected?.operation || (implementation ? 'add' : entry.stage === 'structure' ? 'replace' : 'add'));
  const [preserve, setPreserve] = useState(selected?.preserve?.join('、') || (implementation?.layer === 'border' ? '卡片内部表面、现有布局与功能' : entry.id === 'aceternity-background-gradient' ? '卡片内部玻璃表面、现有布局与功能' : ''));
  function submit(event: FormEvent) { event.preventDefault(); onConfirm({ entryId: entry.id, stage: entry.stage, placement: placement.trim(), adjustments: adjustments.trim(), target: target.trim(), layer, operation, preserve: preserve.split(/[,，、\n]/).map(value => value.trim()).filter(Boolean) }); }
  return <Modal title={selected ? '编辑已选方案' : '确认这项选择'} onClose={onClose}><form onSubmit={submit} className="form-stack"><div className="choice-summary"><span className="eyebrow">{labels[entry.stage]}</span><h3>{entry.title}</h3><p>{entry.description}</p></div><label>用在什么位置<input autoFocus required value={placement} onChange={event => setPlacement(event.target.value)} placeholder="例如：首页首屏、作品列表" /></label><div className="suggestions">{entry.placements.map(value => <button type="button" key={value} onClick={() => setPlacement(value)}>{value}</button>)}</div><label>作用在哪个对象<input required aria-label="效果作用对象" value={target === 'page' ? '整个页面' : target} onChange={event => setTarget(event.target.value === '整个页面' ? 'page' : event.target.value)} placeholder="例如：功能卡片、开始按钮、整个页面" /></label>{targets.length > 0 && <div className="suggestions">{targets.map(value => <button type="button" key={value} onClick={() => setTarget(value)}>{value === 'page' ? '整个页面' : value}</button>)}</div>}<div className="selection-scope"><label>作用部位<select aria-label="效果作用部位" value={layer} onChange={event => setLayer(event.target.value as VisualLayer)}>{visualLayers.map(value => <option key={value} value={value}>{layerLabels[value]}</option>)}</select></label><label>如何应用<select aria-label="效果应用方式" value={operation} onChange={event => setOperation(event.target.value as 'add' | 'replace')}><option value="add">叠加到现有设计</option><option value="replace">替换同一对象的这个部位</option></select></label></div><label>需要保留哪些内容<input value={preserve} onChange={event => setPreserve(event.target.value)} placeholder="例如：内部玻璃、现有布局，用顿号分隔" /></label><label>需要怎样调整<textarea value={adjustments} onChange={event => setAdjustments(event.target.value)} placeholder="例如：保留布局，换成深蓝色；动效慢一点" rows={3} /></label><p className="helper">边缘与内部表面可同时保留。替换只影响同一对象的同一部位。</p><div className="modal-actions"><button type="button" className="button secondary" onClick={onClose}>取消</button><button className="button primary" disabled={!placement.trim() || !target.trim()}><Check size={16} />确认选择</button></div></form></Modal>;
}

function EntryEditor({ entry, onSaved, onClose }: { entry: CatalogEntry; onSaved: (entry: CatalogEntry) => void; onClose: () => void }) {
  const [aliases, setAliases] = useState(entry.aliases.join('，'));
  const [notes, setNotes] = useState(entry.userNotes || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError('');
    try { const result = await api.edit(entry.id, aliases.split(/[,，\n]/).map(value => value.trim()).filter(Boolean), notes); onSaved(result.entry); } catch (reason) { setError(String(reason instanceof Error ? reason.message : reason)); } finally { setBusy(false); }
  }
  return <Modal title="补充自己的说法" onClose={onClose}><form onSubmit={submit} className="form-stack"><h3>{entry.title}</h3><label>口语别名<input value={aliases} onChange={event => setAliases(event.target.value)} placeholder="例如：一格一格的、卡片拼贴，用逗号分隔" /></label><label>我的备注<textarea rows={5} value={notes} onChange={event => setNotes(event.target.value)} placeholder="记下适合什么项目、哪里需要调整" /></label>{error && <p className="error-text" role="alert">{error}</p>}<div className="modal-actions"><button type="button" className="button secondary" onClick={onClose}>取消</button><button className="button primary" disabled={busy}>{busy && <LoaderCircle size={16} className="spin" />}保存备注</button></div></form></Modal>;
}

export default function App() {
  const [conversations, setConversations] = useState(initialConversations);
  const activeConversation = conversations.items.find(item => item.id === conversations.activeId)!;
  const [draft, setDraft] = useState(activeConversation.draft);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [requirementsOpen, setRequirementsOpen] = useState(false);
  const [reviewingRequirementDraft, setReviewingRequirementDraft] = useState(false);
  const [previewEntry, setPreviewEntry] = useState<CatalogEntry | null>(null);
  const [page, setPage] = useState<'workbench' | 'library' | 'sources'>('workbench');
  const [entries, setEntries] = useState<CatalogEntry[]>([]);
  const [sources, setSources] = useState<SourceInfo[]>([]);
  const [status, setStatus] = useState<AppStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [toast, setToast] = useState('');
  const [input, setInput] = useState(activeConversation.input);
  const [busy, setBusy] = useState(false);
  const [promptGenerating, setPromptGenerating] = useState(false);
  const [promptRetry, setPromptRetry] = useState<DesignPromptRequest | null>(null);
  const [streamMessage, setStreamMessage] = useState('');
  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null);
  const [excluded, setExcluded] = useState<string[]>([]);
  const [retryRequest, setRetryRequest] = useState<RecommendationRequest | null>(null);
  const [requestError, setRequestError] = useState('');
  const [selecting, setSelecting] = useState<CatalogEntry | null>(null);
  const [selectionScope, setSelectionScope] = useState<Selection | null>(null);
  const [selectingImplementation, setSelectingImplementation] = useState<ComponentImplementation | null>(null);
  const [editing, setEditing] = useState<CatalogEntry | null>(null);
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [exportBusy, setExportBusy] = useState(false);
  const [search, setSearch] = useState('');
  const [libraryStage, setLibraryStage] = useState<Stage | 'all'>('all');
  const [libraryCollection, setLibraryCollection] = useState<'videos' | 'designs'>('videos');
  const [libraryLimit, setLibraryLimit] = useState(24);
  const [loadedPreviews, setLoadedPreviews] = useState<string[]>([]);
  const [sourceBusy, setSourceBusy] = useState('');
  const [importUrl, setImportUrl] = useState('');
  const [importStage, setImportStage] = useState<Stage>('effect');
  const messagesEnd = useRef<HTMLDivElement>(null);
  const recommendationAbort = useRef<AbortController | null>(null);
  const demoAbort = useRef<AbortController | null>(null);
  const promptAbort = useRef<AbortController | null>(null);
  const [savedDemo, setSavedDemo] = useState<SavedDemo | null>(activeConversation.demo);
  const [demoGenerating, setDemoGenerating] = useState(false);
  const [demoStream, setDemoStream] = useState('');
  const [demoError, setDemoError] = useState('');
  const [demoClarification, setDemoClarification] = useState('');
  const [demoRetry, setDemoRetry] = useState<DemoRequest | null>(null);

  async function refresh() {
    setLoading(true); setLoadError('');
    try { const [catalog, sourceList, currentStatus] = await Promise.all([api.catalog(), api.sources(), api.status()]); setEntries(catalog.entries); setSources(sourceList.sources); setStatus(currentStatus); } catch (reason) { setLoadError(reason instanceof Error ? reason.message : String(reason)); } finally { setLoading(false); }
  }
  useEffect(() => { void refresh(); }, []);
  useEffect(() => () => { recommendationAbort.current?.abort(); recommendationAbort.current = null; demoAbort.current?.abort(); demoAbort.current = null; promptAbort.current?.abort(); promptAbort.current = null; }, []);
  useEffect(() => { try { if (!saveSession(localStorage, draft)) setToast('浏览器无法保存草稿，请在关闭前导出需求。'); } catch { setToast('浏览器无法保存草稿，请在关闭前导出需求。'); } }, [draft]);
  useEffect(() => { try { if (!saveDemo(localStorage, savedDemo)) setToast('浏览器无法保存生成页面，请在关闭前下载 HTML 与提示词。'); } catch { setToast('浏览器无法保存生成页面，请在关闭前下载 HTML 与提示词。'); } }, [savedDemo]);
  useEffect(() => { setConversations(value => updateConversation(value, value.activeId, draft, input, savedDemo)); }, [conversations.activeId, draft, input, savedDemo]);
  useEffect(() => { try { if (!saveConversations(localStorage, conversations)) setToast('浏览器无法保存对话记录，请先导出重要内容。'); } catch { setToast('浏览器无法保存对话记录，请先导出重要内容。'); } }, [conversations]);
  useEffect(() => { if (toast) { const timer = setTimeout(() => setToast(''), 5000); return () => clearTimeout(timer); } }, [toast]);
  useEffect(() => { messagesEnd.current?.scrollIntoView({ block: 'nearest' }); }, [draft.messages, busy, streamMessage]);

  const readyEntries = entries.filter(selectable);
  const stageEntries = readyEntries.filter(entry => entry.stage === draft.stage);
  const manualCandidates = stageEntries.filter(entry => !excluded.includes(entry.id)).slice(0, 3).map(entry => ({ entryId: entry.id, reason: `${entry.description} 适合${entry.placements.slice(0, 2).join('、') || '当前页面'}。` }));
  const linkedCandidates = promptReferenceCandidates(draft, entries, excluded);
  const candidates = recommendation?.candidates ?? (linkedCandidates.length ? linkedCandidates : manualCandidates);
  const linkedReferenceCount = readyEntries.filter(entry => draft.promptReferenceEntryIds?.includes(entry.id)).length;
  const filtered = entries.filter(entry => (libraryStage === 'all' || entry.stage === libraryStage) && `${entry.title} ${entry.name} ${entry.aliases.join(' ')} ${entry.description} ${entry.tags.join(' ')} ${entry.userNotes || ''}`.toLowerCase().includes(search.toLowerCase()));
  const libraryEntries = [...filtered].sort((a, b) => Number(selectable(b)) - Number(selectable(a)));
  useEffect(() => setLibraryLimit(24), [search, libraryStage]);
  const modelConfigured = status?.model.configured === true;
  const promptOutdated = promptNeedsRefresh(draft);
  const canGenerateRequirements = !!(draft.brief.trim() || draft.messages.some(message => message.role === 'user'));

  function changeStage(stage: Stage) { if (busy) return; setDraft(value => ({ ...value, stage })); setRecommendation(null); setExcluded([]); setRetryRequest(null); setRequestError(''); }
  function stopGeneration(preserveReply = true) {
    if (!recommendationAbort.current && !promptAbort.current && !demoAbort.current) return draft;
    const partial = demoGenerating ? demoStream : streamMessage;
    const stopped = partial.trim() ? { ...draft, messages: [...draft.messages, { role: 'assistant' as const, content: `已停止生成，以下为未完成内容，尚未通过完整校验：\n${partial}` }] } : draft;
    recommendationAbort.current?.abort(); recommendationAbort.current = null;
    promptAbort.current?.abort(); promptAbort.current = null;
    demoAbort.current?.abort(); demoAbort.current = null;
    setBusy(false); setPromptGenerating(false); setDemoGenerating(false); setStreamMessage(''); setDemoStream(''); setRequestError('');
    if (preserveReply) { setDraft(stopped); setToast('已停止生成，已有内容和选择已保留'); }
    return stopped;
  }
  function activateConversation(store: ConversationStore) {
    const next = store.items.find(item => item.id === store.activeId)!;
    setConversations(store); setDraft(next.draft); setInput(next.input); setSavedDemo(next.demo);
    setPromptRetry(null); setRecommendation(null); setExcluded([]); setRetryRequest(null); setRequestError(''); setDemoError(''); setDemoClarification(''); setDemoRetry(null); setMarkdown(null); setSelecting(null); setSelectionScope(null); setHistoryOpen(false); setRequirementsOpen(false); setReviewingRequirementDraft(false); setPreviewEntry(null); setPage('workbench');
  }
  function newDraft() {
    const saved = updateConversation(conversations, conversations.activeId, stopGeneration(false), input, savedDemo);
    const next = createConversation();
    activateConversation({ activeId: next.id, items: [next, ...saved.items] }); setToast('已开启新对话，之前的内容可在对话记录中找回');
  }
  function switchConversation(id: string) {
    if (id === conversations.activeId) { setHistoryOpen(false); return; }
    const saved = updateConversation(conversations, conversations.activeId, stopGeneration(false), input, savedDemo);
    activateConversation({ ...saved, activeId: id });
  }
  async function runRecommendation(body: RecommendationRequest) {
    if (recommendationAbort.current || demoAbort.current || promptAbort.current) return;
    const controller = new AbortController(); recommendationAbort.current = controller;
    setBusy(true); setStreamMessage(''); setRequestError(''); setPromptRetry(null); setRetryRequest(body);
    try {
      const result = await api.recommendStream(body, content => { if (!controller.signal.aborted) setStreamMessage(content); }, controller.signal);
      if (controller.signal.aborted) return;
      setRecommendation(result); setDraft(value => ({ ...value, messages: [...value.messages, { role: 'assistant', content: result.message }] })); setRetryRequest(null);
    } catch (reason) { if (!controller.signal.aborted) setRequestError(reason instanceof Error ? reason.message : String(reason)); }
    finally { if (recommendationAbort.current === controller) { recommendationAbort.current = null; setStreamMessage(''); setBusy(false); } }
  }
  function findReferences(event: FormEvent) {
    event.preventDefault(); const pending = input.trim(); const content = pending || [...draft.messages].reverse().find(message => message.role === 'user')?.content || draft.brief; if (!content || busy) return;
    const messages = pending ? [...draft.messages, { role: 'user' as const, content }] : draft.messages;
    const brief = draft.brief || content;
    setDraft(value => ({ ...value, brief, messages })); setInput('');
    void runRecommendation({ description: content, stage: draft.stage, selections: draft.selections, messages, excludedIds: excluded });
  }
  async function runPrompt(body: DesignPromptRequest) {
    if (recommendationAbort.current || demoAbort.current || promptAbort.current) return;
    const controller = new AbortController(); promptAbort.current = controller;
    const fingerprint = requirementsFingerprint({ brief: body.brief, messages: body.messages || [], selections: body.selections });
    setBusy(true); setPromptGenerating(true); setStreamMessage(''); setRequestError(''); setRetryRequest(null); setPromptRetry(body);
    try {
      const result = await api.promptStream({ ...body, conversationId: body.conversationId || conversations.activeId }, content => { if (!controller.signal.aborted) setStreamMessage(content); }, controller.signal);
      if (controller.signal.aborted) return;
      setDraft(value => {
        const linked = capturePromptResult(value, result, entries, fingerprint);
        const currentHasReference = entries.some(entry => linked.promptReferenceEntryIds?.includes(entry.id) && entry.stage === value.stage);
        return { ...linked, stage: currentHasReference ? value.stage : entries.find(entry => linked.promptReferenceEntryIds?.includes(entry.id))?.stage || value.stage };
      }); setRecommendation(null); setExcluded([]); setPromptRetry(null); setToast(result.selectionDiversity?.reselected && !result.selectionDiversity.keptOriginal ? '已调整主视觉搭配，提示词、需求草稿与参考视频已同步' : '提示词、需求草稿与参考视频已同步');
    } catch (reason) { if (!controller.signal.aborted) setRequestError(reason instanceof Error ? reason.message : String(reason)); }
    finally { if (promptAbort.current === controller) { promptAbort.current = null; setBusy(false); setPromptGenerating(false); setStreamMessage(''); } }
  }
  function send(event: FormEvent) {
    event.preventDefault(); const content = input.trim(); if (!content || busy || !modelConfigured) return;
    const messages = [...draft.messages, { role: 'user' as const, content }]; const brief = draft.brief || content;
    setDraft(value => ({ ...value, brief, messages })); setInput('');
    void runPrompt({ brief, messages, selections: draft.selections });
  }
  function savePageRequirements(brief: string, requirements: PageRequirements) {
    setDraft(value => applyPageRequirements(value, brief, requirements)); setRequirementsOpen(false); setReviewingRequirementDraft(false); setPromptRetry(null); setRetryRequest(null); setRequestError(''); setRecommendation(null); setExcluded([]); setToast('整页需求已保存，后续生成将采用最新设置');
  }
  function generateRequirementsPrompt() {
    if (busy || !modelConfigured) return;
    const pending = input.trim();
    const messages = pending ? [...draft.messages, { role: 'user' as const, content: pending }] : draft.messages;
    const brief = draft.brief || pending || draft.messages.find(message => message.role === 'user')?.content || '';
    if (!brief.trim()) { setRequirementsOpen(true); return; }
    if (pending || !draft.brief) { setDraft(value => ({ ...value, brief, messages })); setInput(''); }
    void runPrompt({ brief, messages, selections: draft.selections });
  }
  async function runDemo(body: DemoRequest) {
    if (recommendationAbort.current || demoAbort.current || promptAbort.current) return;
    const controller = new AbortController(); demoAbort.current = controller;
    setBusy(true); setDemoGenerating(true); setDemoStream(''); setDemoError(''); setDemoClarification(''); setDemoRetry(body);
    try {
      const result = await api.demoStream(body, content => { if (!controller.signal.aborted) setDemoStream(content); }, controller.signal);
      if (controller.signal.aborted) return;
      const selections = result.status === 'ready' && body.task === 'revise_demo' ? reconcileDemoSelections(body.selections, result) : body.selections;
      if (result.status === 'needs_clarification') setDemoClarification(result.message);
      else { setSavedDemo(previous => acceptDemo(previous, result, { brief: body.brief, messages: body.messages || [], selections })); setToast(body.task === 'revise_demo' ? '页面与提示词已同步更新' : '页面与专业提示词已生成'); }
      setDraft(value => ({ ...value, selections, messages: [...value.messages, { role: 'assistant', content: result.message }] })); setDemoRetry(null);
    } catch (reason) { if (!controller.signal.aborted) setDemoError(reason instanceof Error ? reason.message : String(reason)); }
    finally { if (demoAbort.current === controller) { demoAbort.current = null; setBusy(false); setDemoGenerating(false); setDemoStream(''); } }
  }
  function generateDemo() {
    if (busy || !modelConfigured) return;
    const pending = input.trim();
    const messages = pending ? [...draft.messages, { role: 'user' as const, content: pending }] : draft.messages;
    const brief = draft.brief || pending || [...messages].reverse().find(message => message.role === 'user')?.content || '';
    if (!brief.trim()) return;
    if (pending) { setDraft(value => ({ ...value, brief, messages })); setInput(''); }
    void runDemo({ task: 'generate_demo', brief, messages, selections: draft.selections });
  }
  function reviseDemo(changeRequest: string) {
    if (busy || !savedDemo || !modelConfigured) return;
    const messages = [...draft.messages, { role: 'user' as const, content: changeRequest }];
    setDraft(value => ({ ...value, messages }));
    void runDemo({ task: 'revise_demo', brief: draft.brief, messages, selections: draft.selections, previous: savedDemo.result, changeRequest });
  }
  function stopDemo() { stopGeneration(); setDemoError('已停止生成，上一版页面仍然保留。可以重试这次请求。'); }
  function choose(entry: CatalogEntry, selection?: Selection, implementation?: ComponentImplementation) { if (busy) return; setSelectionScope(selection || null); setSelectingImplementation(implementation || null); setSelecting(entry); }
  function usePage(recipe: PageRecipe) { if (busy) return; setInput(value => [value.trim(), `参考《${recipe.title}》整页范例，${recipe.purpose}。保留我已确认的功能与选择，并按我的需求调整。`].filter(Boolean).join('\n')); setPage('workbench'); setToast('已放入需求输入框，可以补充后生成页面'); }
  function useComponent(component: ComponentImplementation) { const entry = entries.find(value => value.id === component.entryId); if (!entry || !selectable(entry)) { setToast('对应来源参考暂不可用，请重新加载资料'); return; } choose(entry, undefined, component); }
  function anotherGroup() {
    if (busy) return;
    const nextExcluded = [...new Set([...excluded, ...candidates.map(candidate => candidate.entryId)])];
    if (modelConfigured) { setExcluded(nextExcluded); void runRecommendation({ description: [...draft.messages].reverse().find(message => message.role === 'user')?.content || draft.brief || `浏览${labels[draft.stage]}方案`, stage: draft.stage, selections: draft.selections, messages: draft.messages, excludedIds: nextExcluded }); }
    else { setRecommendation(null); if (stageEntries.some(entry => !nextExcluded.includes(entry.id))) { setExcluded(nextExcluded); } else { setExcluded([]); setToast('已浏览本阶段全部可选方案，重新从第一组开始。'); } }
  }
  function updateEntry(entry: CatalogEntry) { setEntries(values => values.map(value => value.id === entry.id ? entry : value)); }
  async function verify(entry: CatalogEntry) {
    setSourceBusy(entry.id);
    try { const result = await api.verify(entry.id); updateEntry(result.entry); const next = await api.status(); setStatus(next); setToast('视频预览已验证，可以参与选型。'); } catch (reason) { setToast(reason instanceof Error ? reason.message : String(reason)); } finally { setSourceBusy(''); }
  }
  async function sync(source: SourceInfo) {
    setSourceBusy(source.id);
    try { const result = await api.sync(source.id); await refresh(); setToast(`${source.name} 已同步 ${result.importedCount} 条资料。待补全视频的条目保留在待完善区。`); } catch (reason) { setToast(reason instanceof Error ? reason.message : String(reason)); } finally { setSourceBusy(''); }
  }
  async function importEntry(event: FormEvent) {
    event.preventDefault(); setSourceBusy('import');
    try { await api.import(importUrl, importStage); setImportUrl(''); await refresh(); setToast('已导入来源条目。请在参考库检查预览；可用视频需完成验证后才能选型。'); } catch (reason) { setToast(reason instanceof Error ? reason.message : String(reason)); } finally { setSourceBusy(''); }
  }
  async function doExport() {
    if (!draft.brief.trim() && !draft.selections.length) return; setExportBusy(true);
    try { const result = await api.export(exportPayload(draft)); setMarkdown(result.markdown); } catch (reason) { setToast(reason instanceof Error ? reason.message : String(reason)); } finally { setExportBusy(false); }
  }
  async function copyExport() { try { await navigator.clipboard.writeText(markdown || ''); setToast('已复制需求'); } catch { setToast('剪贴板不可用，请在下方文本框中全选复制。'); } }
  function downloadExport() { const url = URL.createObjectURL(new Blob([markdown || ''], { type: 'text/markdown;charset=utf-8' })); const anchor = document.createElement('a'); anchor.href = url; anchor.download = '见意-视觉开发需求.md'; anchor.click(); URL.revokeObjectURL(url); }

  return <div className="app-shell">
    <header className="topbar"><a className="brand" href="#" onClick={event => { event.preventDefault(); setPage('workbench'); }}><span className="brand-icon"><Layers3 size={23} strokeWidth={1.8} /></span><span><strong>见意<span className="brand-dot">.</span></strong><small>VISUAL INTENT STUDIO</small></span></a><nav aria-label="主导航">{([['workbench', '工作台'], ['library', '参考库'], ['sources', '来源管理']] as const).map(([key, label]) => <button key={key} className={page === key ? 'active' : ''} onClick={() => setPage(key)}>{label}</button>)}</nav><div className="topbar-actions"><span className="local-indicator"><i />本地工作空间</span><button className="button secondary conversation-picker" disabled={exportBusy} onClick={() => setHistoryOpen(true)}><History size={16} />对话记录</button><button className="button primary new-draft" disabled={exportBusy} onClick={newDraft}><Plus size={16} />新对话</button></div></header>
    {loadError && <div className="global-error" role="alert"><span>{loadError}</span><button onClick={() => void refresh()}>重新加载</button></div>}
    {page === 'workbench' && <>
      <div className="workbench-heading"><div><span className="eyebrow">从一句想法，到一份明确的需求</span><h1>把你想要的样子，选出来。</h1></div><div className="mode-status"><span className={modelConfigured ? 'status-dot configured' : 'status-dot'} />{status ? modelConfigured ? `模型推荐 · ${status.model.name || '已配置'}` : '手动选型 · 模型未配置' : '正在读取本地服务'}</div></div>
      <div className="workbench-grid">
        <section className="brief-panel panel" aria-label="需求对话"><div className="panel-heading"><div><MessageSquare size={18} /><h2>说说你的想法</h2></div><span className="tiny-label">需求草稿</span></div><div className="conversation"><div className="assistant-intro"><span className="mini-brand"><Layers3 size={17} /></span><div><p>不需要懂设计术语。</p><p>说用途、功能和想要的感觉，先生成完整提示词，也可以找参考或生成页面。</p></div></div>{!draft.messages.length && <><div className="example-label">可以从这里开始</div>{['做一个个人作品集，简洁但有点特别', '我想要一格一格的布局，方便放项目', '鼠标移上去有一点反应，不要太花'].map(value => <button className="example-prompt" key={value} onClick={() => setInput(value)}>{value}<ArrowRight size={14} /></button>)}</>}{draft.messages.map((message, index) => <div key={index} className={`chat-message ${message.role}`}><span>{message.role === 'user' ? '你' : modelConfigured ? '见意' : '选型提示'}</span><>{message.role === 'assistant' && message.content.startsWith(PROMPT_PREFIX) ? <PromptMessage content={message.content} onNotice={setToast} /> : <p>{message.content}</p>}</></div>)}{busy && !demoGenerating && streamMessage && <div className="chat-message assistant" aria-label="智能体流式回复"><span>见意</span><p>{streamMessage}</p></div>}{busy && !demoGenerating && <div className="pending-message"><LoaderCircle className="spin" size={15} />{promptGenerating ? '正在生成完整专业提示词…' : streamMessage ? '正在生成回复…' : '正在查找可用参考…'}</div>}{requestError && <div className="request-error" role="alert"><p>{requestError}</p><button disabled={busy} onClick={() => promptRetry ? void runPrompt(promptRetry) : retryRequest && void runRecommendation(retryRequest)}><RefreshCw size={14} />重试这次请求</button></div>}<div ref={messagesEnd} /></div><form className="composer" onSubmit={send}><label className="sr-only" htmlFor="brief-input">输入需求或调整意见</label><textarea id="brief-input" value={input} onChange={event => setInput(event.target.value)} placeholder="我想做一个…" rows={3} disabled={busy} /><div className="composer-footer"><span>生成完整提示词，或先找参考</span><div className="composer-actions"><button type="button" className="button secondary" disabled={(!input.trim() && !canGenerateRequirements) || busy || loading} onClick={findReferences}><Search size={13} />找参考</button>{busy ? <button type="button" className="button stop-button composer-stop" onClick={() => stopGeneration()} aria-label="停止生成"><Square size={13} fill="currentColor" />停止生成</button> : <button type="submit" className="button primary composer-submit" disabled={!input.trim() || loading || !modelConfigured}><Send size={13} />生成提示词</button>}</div></div></form><div className="saving-note"><span className="small-dot" />草稿保存在当前浏览器</div></section>
        <section className="comparison-panel" aria-label="视频选型"><div className="stage-stepper">{stages.map((stage, index) => <button className={draft.stage === stage ? 'current' : ''} key={stage} disabled={busy} onClick={() => changeStage(stage)}><span>{draft.selections.some(item => item.stage === stage) ? <Check size={13} /> : `0${index + 1}`}</span><strong>{labels[stage]}</strong>{index < 2 && <ChevronRight size={14} className="step-chevron" />}</button>)}</div><div className="comparison-heading"><div><h2>看看哪种{labels[draft.stage]}更接近你的想法</h2><p>{stageNotes[draft.stage]} · {draft.stage === 'structure' ? '可替换同一对象的布局' : '可叠加不同部位的样式与效果'}</p></div><button className="text-button" disabled={busy || loading || !stageEntries.length} onClick={anotherGroup}><RefreshCw size={15} />换一组</button></div>{!recommendation && linkedReferenceCount > 0 && <div className="requirements-linked-references" role="status"><strong>{promptOutdated ? "上一版提示词的参考" : "当前提示词的参考"} · {linkedReferenceCount} 项</strong><span>切换结构、样式、效果观看；确认对象与作用部位后加入右侧需求。</span></div>}{!modelConfigured && status && <div className="manual-note"><span>当前直接浏览已验证的视频，描述会保留在需求中。</span><details><summary>启用模型推荐</summary><p>在项目 .env 中填写 Coze 的 COZE_API_KEY 和 COZE_BOT_ID，或兼容接口的 MODEL_BASE_URL、MODEL_API_KEY 和 MODEL_NAME，重启服务后启用推荐。</p></details></div>}{loading && !entries.length ? <div className="empty-state"><LoaderCircle size={24} className="spin" /><p>正在加载参考视频</p></div> : candidates.length === 0 ? <div className="empty-state"><Film size={28} /><h3>本阶段还没有可选的视频</h3><p>在参考库完善视频预览，完成验证后会出现在这里。</p><button className="button secondary" onClick={() => setPage('library')}>打开参考库</button></div> : <div className="candidate-list">{candidates.map((candidate, index) => { const entry = entries.find(value => value.id === candidate.entryId); if (!entry || !selectable(entry)) return null; const selected = draft.selections.some(value => value.entryId === entry.id); return <article key={entry.id} className={`candidate-card ${selected ? 'selected' : ''}`}><VideoPreview entry={entry} /><div className="candidate-content"><div className="candidate-title"><span className="candidate-number">{String(index + 1).padStart(2, '0')}</span><h3>{entry.title}</h3>{selected && <span className="selected-tag"><Check size={12} />已选</span>}</div><p className="candidate-reason">{candidate.reason}</p><div className="candidate-footer"><a href={entry.sourceUrl} target="_blank" rel="noreferrer">{sourceNames[entry.sourceId]}<ExternalLink size={12} /></a><button className={selected ? 'button selected-button' : 'button secondary'} disabled={busy} onClick={() => choose(entry)}><Plus size={14} />{selected ? '再添加' : '选择这个'}</button></div></div></article>; })}</div>}<p className="preview-footnote"><Film size={13} />标为“参考演示录屏”的视频是参考重现，原始案例见来源链接。</p></section>
        <aside className="choices-panel panel" aria-label="已确认需求">
          <div className="panel-heading"><div><Check size={18} /><h2>整页需求管理</h2></div><span className="count-badge" title="已确认参考数量">{draft.selections.length}</span></div>
          <div className="choices-content">
            <PageRequirementsSummary draft={draft} busy={busy} onEdit={() => { setReviewingRequirementDraft(false); setRequirementsOpen(true); }} onReviewDraft={() => { setReviewingRequirementDraft(true); setRequirementsOpen(true); }} onDismissDraft={() => setDraft(value => ({ ...value, requirementDraft: undefined }))} />
            <p className="requirements-reference-heading">已确认参考 · {draft.selections.length} 项</p>
            {stages.map((stage, index) => { const choices = draft.selections.filter(value => value.stage === stage); return <section className="choice-section" key={stage}>
              <div className="choice-stage"><span>0{index + 1}</span><h3>{labels[stage]}</h3>{!!choices.length && <Check size={13} className="choice-check" />}</div>
              {choices.length ? choices.map(selection => { const entry = entries.find(value => value.id === selection.entryId); return <div key={selectionKey(selection)} className="saved-choice">
                <strong>{entry?.title || '已保存的选择（目录中暂不可用）'}</strong>
                <p className="placement">用于 {selection.placement} · {selectionTarget(selection) === 'page' ? '整个页面' : selectionTarget(selection)} · {layerLabels[selectionLayer(selection)]}</p>
                {selection.adjustments && <p className="adjustment">{selection.adjustments}</p>}
                {!!selection.preserve?.length && <p className="adjustment">保留：{selection.preserve.join('、')}</p>}
                <div className="saved-choice-actions">
                  <button disabled={!entry || !selectable(entry)} onClick={() => entry && setPreviewEntry(entry)}><Play size={12} />预览</button>
                  <button disabled={busy || !entry || !selectable(entry)} onClick={() => entry && choose(entry, selection)}><Pencil size={12} />编辑</button>
                  <button disabled={busy} onClick={() => setDraft(value => ({ ...value, selections: removeSelection(value.selections, selection.entryId, selectionTarget(selection), selectionLayer(selection)) }))}><Trash2 size={12} />移除</button>
                </div>
              </div>; }) : <button className="empty-choice" disabled={busy} onClick={() => changeStage(stage)}><span>{stage === 'structure' ? '选择页面结构' : stage === 'style' ? '选择视觉风格' : '添加交互效果'}</span><Plus size={14} /></button>}
            </section>; })}
            {draft.selections.some(item => item.stage === draft.stage) && draft.stage !== 'effect' && <button className="next-stage" disabled={busy} onClick={() => changeStage(draft.stage === 'structure' ? 'style' : 'effect')}>继续选择{draft.stage === 'structure' ? '样式' : '效果'}<ArrowRight size={15} /></button>}
          </div>
          <div className="export-footer">
            {promptOutdated && <p className="requirements-stale" role="status">需求或参考已修改，旧提示词尚未同步。</p>}
            <p>整页需求与已确认参考，<br />会一起用于下一次生成。</p>
            <button type="button" className="button primary export-button" disabled={busy || !modelConfigured || !(input.trim() || canGenerateRequirements)} onClick={generateRequirementsPrompt}>{promptGenerating ? <LoaderCircle className="spin" size={16} /> : <Send size={16} />}{promptOutdated ? '按最新需求重新生成' : '生成页面提示词'}</button>
            <button className="button secondary export-button generate-button" disabled={busy || (!draft.brief.trim() && !draft.selections.length) || exportBusy} onClick={() => void doExport()}>{exportBusy ? <LoaderCircle className="spin" size={16} /> : <ArrowDownToLine size={16} />}导出开发需求</button>
            <button className="button secondary export-button generate-button" disabled={busy || !modelConfigured || !(input.trim() || canGenerateRequirements)} onClick={generateDemo}>{demoGenerating ? <LoaderCircle className="spin" size={16} /> : <Play size={16} />}生成页面</button>
          </div>
        </aside>
      </div>
      <DemoWorkspace saved={savedDemo} outdated={demoNeedsRefresh(savedDemo, draft)} busy={busy} generating={demoGenerating} stream={demoStream} error={demoError} clarification={demoClarification} canGenerate={!!(input.trim() || draft.brief || draft.messages.some(message => message.role === 'user'))} modelConfigured={modelConfigured} onGenerate={generateDemo} onRevise={reviseDemo} onRetry={() => demoRetry && void runDemo(demoRetry)} onStop={stopDemo} onNotice={setToast} />
    </>}
    {page === 'library' && <main className="secondary-page"><div className="page-heading"><div><span className="eyebrow">参考资料与自己的说法</span><h1>参考库</h1><p>看视频，记下直觉。已验证的参考才能加入需求。</p></div><div className="catalog-counts"><span><i className="ready-dot" />可选 {readyEntries.length}</span><span>待完善 {entries.filter(entry => !selectable(entry)).length}</span></div></div><div className="library-toolbar"><div className="filter-tabs" aria-label="参考库内容"><button className={libraryCollection === 'videos' ? 'active' : ''} onClick={() => setLibraryCollection('videos')}>视频参考</button><button className={libraryCollection === 'designs' ? 'active' : ''} onClick={() => setLibraryCollection('designs')}>整页与组件</button></div></div>{libraryCollection === 'designs' ? <DesignLibrary busy={busy} onUsePage={usePage} onUseComponent={useComponent} /> : <><div className="library-toolbar"><div className="search-field"><Search size={17} /><input aria-label="搜索参考资料" placeholder="搜名称、口语别名或描述…" value={search} onChange={event => setSearch(event.target.value)} /></div><div className="filter-tabs">{(['all', ...stages] as const).map(stage => <button key={stage} onClick={() => setLibraryStage(stage)} className={libraryStage === stage ? 'active' : ''}>{stage === 'all' ? '全部' : labels[stage]}</button>)}</div></div><div className="library-grid">{libraryEntries.slice(0, libraryLimit).map(entry => <article key={entry.id} className="library-card"><VideoPreview entry={entry} preload="none" onPlayable={() => setLoadedPreviews(values => values.includes(entry.id) ? values : [...values, entry.id])} /><div className="library-card-body"><div className="library-card-labels"><span>{labels[entry.stage]}</span><span className={selectable(entry) ? 'ready-label' : 'draft-label'}>{selectable(entry) ? '可选 · 视频已验证' : '待完善预览'}</span></div><h2>{entry.title}</h2><p>{entry.description}</p>{!!entry.aliases.length && <div className="alias-list">{entry.aliases.map(alias => <span key={alias}>{alias}</span>)}</div>}{entry.userNotes && <p className="user-note">我的备注：{entry.userNotes}</p>}<a className="source-link" href={entry.sourceUrl} target="_blank" rel="noreferrer">{sourceNames[entry.sourceId]} · 查看来源<ExternalLink size={12} /></a>{entry.preview.note && <p className="helper preview-note">{entry.preview.note}</p>}<details className="entry-details"><summary>使用与实现资料</summary><p>触发：{entry.trigger}</p><p>适用位置：{entry.placements.join("、")}</p>{entry.implementationUrl ? <a href={entry.implementationUrl} target="_blank" rel="noreferrer">查看实现参考<ExternalLink size={12} /></a> : <p>来源未提供源码，可参考原站的视觉行为。</p>}</details><div className="library-actions"><button className="text-button" onClick={() => setEditing(entry)}><Pencil size={14} />别名与备注</button>{selectable(entry) ? <button className="button secondary" disabled={busy} onClick={() => choose(entry)}><Plus size={14} />选择</button> : entry.preview.type === 'video' ? <button className="button secondary" disabled={!loadedPreviews.includes(entry.id) || !!sourceBusy} onClick={() => void verify(entry)}>{sourceBusy === entry.id ? <LoaderCircle className="spin" size={14} /> : <Check size={14} />}验证预览</button> : <span className="helper">等待视频预览</span>}</div>{entry.preview.type === 'video' && !selectable(entry) && !loadedPreviews.includes(entry.id) && <p className="helper">先播放并确认预览可用，再点击验证。</p>}</div></article>)}</div>{libraryEntries.length > libraryLimit && <div className="library-more"><p>已展示 {Math.min(libraryLimit, libraryEntries.length)} / {libraryEntries.length} 条参考</p><button className="button secondary" onClick={() => setLibraryLimit(value => value + 24)}>加载更多案例</button></div>}{!filtered.length && <div className="empty-state"><Search size={26} /><h3>没有找到匹配的参考</h3><p>试试其他说法，或者在来源管理中导入案例。</p></div>}</>}</main>}
    {page === 'sources' && <main className="secondary-page sources-page"><div className="page-heading"><div><span className="eyebrow">每个参考，都有出处</span><h1>来源管理</h1><p>同步组件资料，或从具体案例链接导入参考。</p></div><a className="text-button" href="https://www.designeer.xyz/" target="_blank" rel="noreferrer">去 Designeer 找灵感<ExternalLink size={14} /></a></div><div className="sources-list">{sources.map(source => <article key={source.id} className="source-row"><div className={`source-mark ${source.id}`}><span>{source.name.slice(0, 1)}</span></div><div className="source-name"><h2>{source.name}</h2><span>{source.kind === 'directory' ? '设计目录 · 发现参考' : source.kind === 'components' ? '组件库 · 交互与动效' : '案例库 · 视觉与实验'}</span></div><div className="source-count"><strong>{source.count}</strong><span>本地条目</span></div><div className="source-sync"><span>{source.lastSyncedAt ? '最近同步' : source.id === 'designeer' ? '外部参考目录' : '尚未同步'}</span><strong>{source.lastSyncedAt ? new Date(source.lastSyncedAt).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : source.id === 'designeer' ? '通过原站浏览' : '可导入具体页面'}</strong></div><div className="source-actions"><a className="icon-button" aria-label={`打开${source.name}`} href={source.url} target="_blank" rel="noreferrer"><ExternalLink size={16} /></a>{['reactbits', 'aceternity'].includes(source.id) && <button className="button secondary" disabled={!!sourceBusy} onClick={() => void sync(source)}>{sourceBusy === source.id ? <LoaderCircle size={14} className="spin" /> : <RefreshCw size={14} />}同步资料</button>}</div></article>)}</div><section className="import-panel"><div><span className="eyebrow">添加具体的参考</span><h2>发现喜欢的案例？带进来。</h2><p>支持 React Bits、Aceternity UI、Codrops 和 60fps.design 的具体页面。导入后会保留出处；未验证的视频不会出现在选型中。</p></div><form onSubmit={importEntry}><label htmlFor="import-url">案例链接</label><div className="import-inputs"><input id="import-url" type="url" required placeholder="粘贴具体组件或案例页面链接" value={importUrl} onChange={event => setImportUrl(event.target.value)} /><select aria-label="导入阶段" value={importStage} onChange={event => setImportStage(event.target.value as Stage)}>{stages.map(stage => <option value={stage} key={stage}>{labels[stage]}</option>)}</select><button className="button primary" disabled={!importUrl.trim() || !!sourceBusy}>{sourceBusy === 'import' ? <LoaderCircle className="spin" size={16} /> : <Plus size={16} />}导入参考</button></div></form></section><div className="source-explanation"><Film size={18} /><p>来源资料和视频预览分开处理。同步或导入成功表示资料已进入参考库；参考演示录屏会单独标记，避免和原始视频混淆。</p></div></main>}
    <footer className="app-footer"><span>见意 · 把感觉说清楚</span><span>你的选择决定最终需求</span></footer>
    {toast && <div className="toast" role="status"><span>{toast}</span><button aria-label="关闭提示" onClick={() => setToast('')}><X size={15} /></button></div>}
    {requirementsOpen && <Modal title="管理整页需求" className="requirements-modal" onClose={() => setRequirementsOpen(false)}><PageRequirementsForm draft={reviewingRequirementDraft && draft.requirementDraft ? { ...draft, brief: draft.requirementDraft.goal, pageRequirements: draft.requirementDraft } : draft} onSave={savePageRequirements} onCancel={() => setRequirementsOpen(false)} /></Modal>}
    {previewEntry && <Modal title={previewEntry.title} className="video-modal" onClose={() => setPreviewEntry(null)}><video controls autoPlay muted loop playsInline poster={previewEntry.preview.poster} src={previewEntry.preview.url} aria-label={previewEntry.title + '确认预览'} /><p className="video-description">{previewEntry.description}</p><a className="source-link" href={previewEntry.sourceUrl} target="_blank" rel="noreferrer">查看来源<ExternalLink size={12} /></a></Modal>}
    {historyOpen && <Modal title="对话记录" className="conversation-menu" onClose={() => setHistoryOpen(false)}><p className="conversation-menu-heading">每个想法都有自己的空间。切换对话会保留输入、选择与生成结果。</p><div className="conversation-menu-list">{[...conversations.items].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).map(item => <button type="button" key={item.id} className={`conversation-item ${item.id === conversations.activeId ? 'active' : ''}`} aria-current={item.id === conversations.activeId ? 'true' : undefined} onClick={() => switchConversation(item.id)}><span className="conversation-item-title">{item.title}{item.id === conversations.activeId && <Check size={14} />}</span><span className="conversation-item-meta">{item.draft.messages.length} 条消息 · {item.draft.selections.length} 项选择 · {new Date(item.updatedAt).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</span></button>)}</div></Modal>}
    {selecting && <SelectionEditor entry={selecting} selected={selectionScope || undefined} implementation={selectingImplementation || undefined} targets={[...new Set(draft.selections.filter(item => item.stage === selecting.stage).map(selectionTarget))]} onClose={() => { setSelecting(null); setSelectionScope(null); }} onConfirm={selection => { setPage("workbench"); setRecommendation(null); setExcluded([]); setDraft(value => ({ ...value, stage: selection.stage, selections: confirmSelection(selectionScope ? value.selections.filter(item => selectionKey(item) !== selectionKey(selectionScope)) : value.selections, selection) })); setSelecting(null); setSelectionScope(null); setToast(`已确认${labels[selection.stage]}选择`); }} />}
    {editing && <EntryEditor entry={editing} onClose={() => setEditing(null)} onSaved={entry => { updateEntry(entry); setEditing(null); setToast('别名与备注已保存'); }} />}
    {markdown !== null && <Modal title="开发需求已整理好" onClose={() => setMarkdown(null)}><p className="export-description">这是当前已确认的选择与调整意见。复制或下载后交给开发者。</p><textarea className="markdown-output" aria-label="开发需求Markdown" readOnly value={markdown} rows={16} onFocus={event => event.target.select()} /><div className="modal-actions"><button className="button secondary" onClick={() => void copyExport()}><Copy size={15} />复制全文</button><button className="button primary" onClick={downloadExport}><ArrowDownToLine size={15} />下载 Markdown</button></div></Modal>}
  </div>;
}
