import { useEffect, useRef, useState } from 'react';
import { ArrowDownToLine, ArrowRight, Code2, ExternalLink, LoaderCircle, RefreshCw, Search, X } from 'lucide-react';
import type { ComponentImplementation, DesignLibrary as LibraryData, PageRecipe } from '../shared/design-library';
import { api } from './api';
import { layerLabels } from './DemoWorkspace';
import './design-library.css';

type Example = { item: PageRecipe | ComponentImplementation; html: string; developerPrompt: string };
export default function DesignLibrary({ busy, onUsePage, onUseComponent }: { busy: boolean; onUsePage: (page: PageRecipe) => void; onUseComponent: (component: ComponentImplementation) => void }) {
  const [library, setLibrary] = useState<LibraryData | null>(null);
  const [error, setError] = useState('');
  const [kind, setKind] = useState<'page' | 'component'>('page');
  const [query, setQuery] = useState('');
  const [opened, setOpened] = useState<{ kind: 'page' | 'component'; item: PageRecipe | ComponentImplementation } | null>(null);
  const [example, setExample] = useState<Example | null>(null);
  const [previewError, setPreviewError] = useState('');
  const [tab, setTab] = useState<'preview' | 'details' | 'code'>('preview');
  const dialog = useRef<HTMLDialogElement>(null);
  const controller = useRef<AbortController | null>(null);

  async function refresh() { setError(''); try { setLibrary(await api.designLibrary()); } catch (reason) { setError(reason instanceof Error ? reason.message : String(reason)); } }
  useEffect(() => { void refresh(); return () => controller.current?.abort(); }, []);
  useEffect(() => { if (opened && !dialog.current?.open) dialog.current?.showModal(); }, [opened]);
  async function preview(item: PageRecipe | ComponentImplementation) {
    controller.current?.abort(); const pending = new AbortController(); controller.current = pending;
    const type = 'purpose' in item ? 'page' : 'component';
    setOpened({ kind: type, item }); setExample(null); setPreviewError(''); setTab('preview');
    try { const result = await api.designExample(type, item.id, pending.signal); if (!pending.signal.aborted) setExample(result); }
    catch (reason) { if (!pending.signal.aborted) setPreviewError(reason instanceof Error ? reason.message : String(reason)); }
  }
  function close() { controller.current?.abort(); controller.current = null; setOpened(null); setExample(null); }
  function download(content: string, filename: string, type: string) { const url = URL.createObjectURL(new Blob([content], { type })); const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; anchor.click(); URL.revokeObjectURL(url); }
  function use(item: PageRecipe | ComponentImplementation) { close(); if ('purpose' in item) onUsePage(item); else onUseComponent(item); }
  const items = (kind === 'page' ? library?.pages || [] : library?.components || []).filter(item => [item.title, item.description, ...('aliases' in item ? item.aliases : [item.entryId])].join(' ').toLowerCase().includes(query.toLowerCase()));

  return <section className="design-library" aria-label="整页范例与原生组件">
    <div className="design-library-heading"><div><h2>从整页开始，找到适合你的搭配</h2><p>查看可操作的范例、设计参数和原生实现。生成时会按你的用途自动选用；你也可以指定一套参考。</p></div></div>
    <div className="library-toolbar"><div className="search-field"><Search size={17} /><input aria-label="搜索整页与组件" value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索用途、页面名称或组件…" /></div><div className="filter-tabs"><button className={kind === 'page' ? 'active' : ''} onClick={() => setKind('page')}>整页范例 {library?.pages.length ?? 0}</button><button className={kind === 'component' ? 'active' : ''} onClick={() => setKind('component')}>组件实现 {library?.components.length ?? 0}</button></div></div>
    {error ? <div className="request-error" role="alert"><p>{error}</p><button onClick={() => void refresh()}><RefreshCw size={14} />重新加载设计库</button></div> : !library ? <div className="empty-state"><LoaderCircle className="spin" /><p>正在加载整页与实现资料</p></div> : items.length === 0 ? <div className="empty-state"><p>暂时没有匹配的范例</p></div> : <div className="design-example-grid">{items.map(item => <article className="design-example-card" key={item.id}>
      <button className="design-example-image" onClick={() => void preview(item)} aria-label={`预览${item.title}`}><img src={`/${item.posterPath}`} alt={`${item.title}预览`} loading="lazy" /><span>打开可操作演示 <ArrowRight size={13} /></span></button>
      <div className="design-example-body"><span className="eyebrow">{'purpose' in item ? item.designMethod ? `${item.designMethod} · 本项目案例` : '整页设计范例' : `原生适配 · ${layerLabels[item.layer]}`}</span><h3>{item.title}</h3><p>{item.description}</p><div className="design-example-tags">{('purpose' in item ? item.features.slice(0, 3) : Object.keys(item.parameters).slice(0, 3)).map(value => <span key={value}>{value}</span>)}</div><div className="design-example-actions"><button className="button secondary" onClick={() => void preview(item)}>预览与说明</button><button className="text-button" disabled={busy} onClick={() => use(item)}>{'purpose' in item ? '参考这套页面' : '采用这个实现'}<ArrowRight size={13} /></button></div></div>
    </article>)}</div>}
    {opened && <dialog ref={dialog} className="modal design-example-modal" aria-label={opened.item.title} onCancel={close}><div className="modal-heading"><h2>{opened.item.title}</h2><button className="icon-button" aria-label="关闭设计范例" onClick={close}><X size={20} /></button></div>
      <div className="design-example-toolbar"><div className="filter-tabs">{([['preview', '可操作预览'], ['details', '设计与搭配'], ['code', '实现代码']] as const).map(([value, label]) => <button className={tab === value ? 'active' : ''} key={value} onClick={() => setTab(value)}>{label}</button>)}</div>{example && <div className="design-downloads"><button className="button secondary" onClick={() => download(example.html, `${opened.item.id}.html`, 'text/html;charset=utf-8')}><ArrowDownToLine size={14} />下载 HTML</button><button className="button secondary" onClick={() => download(example.developerPrompt, `${opened.item.id}-开发提示词.md`, 'text/markdown;charset=utf-8')}><ArrowDownToLine size={14} />下载提示词</button></div>}</div>
      {previewError ? <div className="request-error" role="alert"><p>{previewError}</p><button onClick={() => void preview(opened.item)}>重试预览</button></div> : !example ? <div className="empty-state"><LoaderCircle className="spin" /><p>正在读取范例</p></div> : <>
        {tab === 'preview' && <><iframe className="design-live-preview" title={`${opened.item.title}可操作演示`} sandbox="allow-scripts allow-forms allow-downloads" referrerPolicy="no-referrer" srcDoc={example.html} /><p className="helper">这是本地原生适配示例。可以操作按钮与输入；标注为演示的结果使用示例数据。</p></>}
        {tab === 'details' && <div className="design-example-details">{'purpose' in example.item ? <><h3>页面用途</h3><p>{example.item.purpose}</p><h3>功能与操作</h3><ul>{example.item.interactions.map(value => <li key={value.name}>{value.name}：{value.trigger} → {value.result}</li>)}</ul><h3>视觉参数</h3><div className="design-colors">{Object.entries(example.item.tokens.colors).map(([label, color]) => <span key={label}><i style={{ background: color }} />{label} {color}</span>)}</div><p>间距：{example.item.tokens.spacing.join(' / ')} px · 圆角：{example.item.tokens.radius} px</p><h3>搭配规则</h3><ul>{example.item.pairingRules.map(value => <li key={value}>{value}</li>)}</ul><h3>实现参考</h3>{library?.components.filter(value => (example.item as PageRecipe).componentIds.includes(value.id)).map(value => <p key={value.id}><a href={value.sourceUrl} target="_blank" rel="noreferrer">{value.title}<ExternalLink size={12} /></a></p>)}</> : <><h3>作用部位与参数</h3><p>{layerLabels[example.item.layer]}</p><ul>{Object.entries(example.item.parameters).map(([name, value]) => <li key={name}>{name}：{value}</li>)}</ul><h3>搭配与边界</h3><p>可搭配：{example.item.compatibleWith.map(id => library?.components.find(value => value.id === id)?.title || id).join('、') || '按对象与部位判断'}</p><ul>{[...example.item.conflicts, ...example.item.limitations].map((value, index) => <li key={index}>{value}</li>)}</ul><p>{example.item.mobileBehavior}</p><p>{example.item.reducedMotion}</p><a href={example.item.sourceUrl} target="_blank" rel="noreferrer">查看原始来源 <ExternalLink size={12} /></a></>}</div>}
        {tab === 'code' && <div className="design-code-view"><p className="helper">本项目整理的原生适配实现，可按用途修改；来源组件的完整集成需另行核对。</p>{'purpose' in example.item ? <textarea readOnly aria-label="整页 HTML 代码" value={example.html} rows={22} /> : (['html', 'css', 'js'] as const).map(part => <label key={part}><span><Code2 size={14} />{part.toUpperCase()}</span><textarea readOnly aria-label={`组件 ${part.toUpperCase()} 代码`} value={(example.item as ComponentImplementation).code[part] || `此实现无需额外 ${part.toUpperCase()}。`} rows={part === 'html' ? 6 : 10} /></label>)}</div>}
      </>}
      <div className="modal-actions"><button className="button secondary" onClick={close}>关闭</button><button className="button primary" disabled={busy || !example} onClick={() => use(opened.item)}>{opened.kind === 'page' ? '参考这套页面' : '采用这个实现'}<ArrowRight size={14} /></button></div>
    </dialog>}
  </section>;
}
