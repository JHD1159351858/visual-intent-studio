import { useState, type FormEvent } from 'react';
import { ArrowDownToLine, Copy, LoaderCircle, RefreshCw, X } from 'lucide-react';
import type { SavedDemo } from './demo-session';

export const layerLabels = { layout: '布局', surface: '内部表面', border: '边缘', 'outer-glow': '外部光晕', 'page-background': '页面背景', text: '文字', content: '内容与交互' };

export default function DemoWorkspace({ saved, outdated, busy, generating, stream, error, clarification, canGenerate, modelConfigured, onGenerate, onRevise, onRetry, onStop, onNotice }: { saved: SavedDemo | null; outdated: boolean; busy: boolean; generating: boolean; stream: string; error: string; clarification: string; canGenerate: boolean; modelConfigured: boolean; onGenerate: () => void; onRevise: (change: string) => void; onRetry: () => void; onStop: () => void; onNotice: (message: string) => void }) {
  const [tab, setTab] = useState<'preview' | 'plan' | 'prompt'>('preview');
  const [change, setChange] = useState('');
  const result = saved?.result;
  function download(content: string, name: string, type: string) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click(); URL.revokeObjectURL(url);
  }
  async function copy() { try { await navigator.clipboard.writeText(result?.developerPrompt || ''); onNotice('已复制专业提示词'); } catch { setTab('prompt'); onNotice('剪贴板不可用，请在提示词文本框中全选复制。'); } }
  function revise(event: FormEvent) { event.preventDefault(); if (change.trim() && !busy) onRevise(change.trim()); }

  return <section className="demo-workspace panel" aria-label="页面生成与预览">
    <div className="demo-heading"><div><span className="eyebrow">把当前需求变成可操作的页面</span><h2>{result ? '你的页面 Demo' : '生成你的第一版页面'}{saved && <span className="demo-version">版本 {saved.version}</span>}</h2></div><button className="button primary" disabled={busy || !canGenerate || !modelConfigured} onClick={onGenerate}>{generating ? <LoaderCircle size={16} className="spin" /> : <RefreshCw size={16} />}{result ? '重新生成页面' : '生成页面'}</button></div>
    {!modelConfigured && <p className="helper">连接智能体后，可以生成完整页面与专业提示词。</p>}
    {result && outdated && <p className="demo-outdated" role="status">需求已变化，当前显示上一版。重新生成或应用页面修改后，会更新预览与提示词。</p>}
    {generating && <div className="demo-progress" role="status" aria-label="页面生成流式回复"><div><LoaderCircle size={16} className="spin" /><strong>{stream ? '正在生成页面与提示词…' : '正在整理需求，等待智能体回复…'}</strong><button className="text-button" onClick={onStop}><X size={14} />停止生成</button></div>{stream && <p>{stream}</p>}</div>}
    {error && <div className="request-error" role="alert"><p>{error}</p><button disabled={busy} onClick={onRetry}><RefreshCw size={14} />重试页面生成</button></div>}
    {clarification && <div className="demo-clarification"><strong>还需要你确认一点</strong><p>{clarification}</p><p className="helper">在左侧补充需求，或在下方修改输入中回答，然后再次生成。</p></div>}
    {result ? <><div className="demo-toolbar"><div className="filter-tabs" aria-label="生成结果视图">{([['preview', '页面预览'], ['plan', '页面方案'], ['prompt', '专业提示词']] as const).map(([key, label]) => <button key={key} className={tab === key ? 'active' : ''} onClick={() => setTab(key)}>{label}</button>)}</div><div className="demo-downloads"><button className="button secondary" onClick={() => download(result.html, '见意-页面Demo.html', 'text/html;charset=utf-8')}><ArrowDownToLine size={15} />下载 HTML</button><button className="button secondary" onClick={() => void copy()}><Copy size={15} />复制提示词</button><button className="button secondary" onClick={() => download(result.developerPrompt, '见意-专业开发提示词.md', 'text/markdown;charset=utf-8')}><ArrowDownToLine size={15} />下载提示词</button></div></div>
      {tab === 'preview' && <div className="demo-preview"><iframe title="生成的页面 Demo" sandbox="allow-scripts allow-forms allow-downloads" referrerPolicy="no-referrer" srcDoc={result.html} /><p className="helper">这是本地演示页面。可在预览中操作按钮；真实接口需在后续开发时接入。</p></div>}
      {tab === 'plan' && result.pagePlan && <div className="demo-plan"><h3>{result.pagePlan.summary}</h3><div><h4>功能需求</h4><ul>{result.pagePlan.features.map((feature, index) => <li key={index}>{feature}</li>)}</ul></div><div><h4>布局与样式</h4><p>{result.pagePlan.layout}</p><p>{result.pagePlan.visualStyle}</p></div>{result.pagePlan.effects.length > 0 && <div><h4>效果使用位置</h4>{result.pagePlan.effects.map((effect, index) => <article key={index}><strong>{effect.target} · {layerLabels[effect.layer]}</strong><p>{effect.behavior}</p>{effect.adaptation && <p>适配：{effect.adaptation}</p>}{effect.preserve.length > 0 && <p>保留：{effect.preserve.join('、')}</p>}<small>{effect.referenceEntryId ? `参考案例：${effect.referenceEntryId}` : '为本页面补充的基础实现'}</small></article>)}</div>}{result.pagePlan.assumptions.length > 0 && <div><h4>本版采用的假设</h4><ul>{result.pagePlan.assumptions.map((assumption, index) => <li key={index}>{assumption}</li>)}</ul></div>}</div>}
      {tab === 'prompt' && <textarea className="demo-prompt" readOnly aria-label="专业开发提示词" value={result.developerPrompt} rows={18} onFocus={event => event.target.select()} />}
      <form className="demo-revision" onSubmit={revise}><label htmlFor="demo-change">修改这个页面</label><textarea id="demo-change" rows={2} disabled={busy} value={change} onChange={event => setChange(event.target.value)} placeholder="例如：只给功能卡片边缘加缓慢流动的渐变，保留内部玻璃和现有布局" /><div><span className="helper">基于当前版本修改，页面和提示词一起更新。</span><button className="button primary" disabled={busy || !change.trim() || !modelConfigured} type="submit">应用页面修改</button></div></form>
    </> : !generating && <p className="demo-empty">输入用途、功能和你想要的感觉，再点击“生成页面”。参考选择会一起传给智能体。</p>}
  </section>;
}
