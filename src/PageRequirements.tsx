import { useState, type FormEvent } from 'react';
import { motionIntensity } from '../shared/motion';
import type { PageRequirements, Session } from './session';
import './page-requirements.css';

const motionLabels: Record<PageRequirements['motion'], string> = { still: '无动画', balanced: '适度', expressive: '强动效' };

export function PageRequirementsForm({ draft, onSave, onCancel }: { draft: Session; onSave: (brief: string, requirements: PageRequirements) => void; onCancel: () => void }) {
  const [brief, setBrief] = useState(draft.brief);
  const [audience, setAudience] = useState(draft.pageRequirements?.audience || '');
  const [features, setFeatures] = useState(draft.pageRequirements?.features.join('\n') || '');
  const [visualStyle, setVisualStyle] = useState(draft.pageRequirements?.visualStyle || '');
  const [motion, setMotion] = useState<PageRequirements['motion']>(draft.pageRequirements?.motion ?? motionIntensity(draft));
  const [constraints, setConstraints] = useState(draft.pageRequirements?.constraints || '');

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!brief.trim()) return;
    onSave(brief.trim(), { audience: audience.trim(), features: features.split('\n').map(item => item.trim()).filter(Boolean), visualStyle: visualStyle.trim(), motion, constraints: constraints.trim() });
  }

  return <form className="requirements-form" onSubmit={submit}>
    <p className="requirements-form-intro">把整页要做什么、给谁用和需要保留的内容写在这里，保存后用于生成页面与导出需求。</p>
    <label className="requirements-field requirements-field-wide">页面目标 <span className="requirements-required">必填</span><textarea autoFocus required rows={3} value={brief} onChange={event => setBrief(event.target.value)} placeholder="例如：为一门课程建立学习入口，让学生快速找到资料与练习。" /></label>
    <label className="requirements-field">目标用户<input value={audience} onChange={event => setAudience(event.target.value)} placeholder="例如：刚开始学习本课程的学生" /></label>
    <label className="requirements-field">动效强度<select value={motion} onChange={event => setMotion(event.target.value as PageRequirements['motion'])}>{Object.entries(motionLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
    <label className="requirements-field">核心功能 <span className="requirements-field-hint">每行一项</span><textarea rows={5} value={features} onChange={event => setFeatures(event.target.value)} placeholder={'课程介绍\n资料分类与搜索\n练习入口'} /></label>
    <label className="requirements-field">视觉风格<textarea rows={5} value={visualStyle} onChange={event => setVisualStyle(event.target.value)} placeholder="例如：浅色背景、蓝紫色点缀、圆润卡片，内容清晰易读。" /></label>
    <label className="requirements-field requirements-field-wide">限制与保留<textarea rows={3} value={constraints} onChange={event => setConstraints(event.target.value)} placeholder="例如：保留现有导航与品牌色；暂不接入登录和支付。" /></label>
    <div className="requirements-actions"><button type="button" className="button secondary" onClick={onCancel}>取消</button><button type="submit" className="button primary" disabled={!brief.trim()}>保存整页需求</button></div>
  </form>;
}

export function PageRequirementsSummary({ draft, busy, onEdit, onReviewDraft, onDismissDraft }: { draft: Session; busy: boolean; onEdit: () => void; onReviewDraft?: () => void; onDismissDraft?: () => void }) {
  const requirements = draft.pageRequirements;
  const suggestion = draft.requirementDraft;
  const motion = requirements?.motion ?? motionIntensity(draft);

  return <section className="requirements-summary" aria-label="整页需求">
    {suggestion && <section className="requirements-suggestion" aria-label="AI 整理的待确认需求">
      <div className="requirements-suggestion-heading"><h4>AI 整理的需求</h4><span>待确认</span></div>
      <p className="requirements-suggestion-goal">{suggestion.goal}</p>
      {!!suggestion.features.length && <p className="requirements-suggestion-features">{suggestion.features.slice(0, 3).join(' · ')}{suggestion.features.length > 3 ? ` 等 ${suggestion.features.length} 项功能` : ''}</p>}
      <details className="requirements-suggestion-details">
        <summary>查看建议详情 · {motionLabels[suggestion.motion]}</summary>
        <div className="requirements-suggestion-content">
          {suggestion.audience && <p><strong>目标用户</strong>{suggestion.audience}</p>}
          {!!suggestion.features.length && <div><strong>核心功能</strong><ul>{suggestion.features.map((feature, index) => <li key={index}>{feature}</li>)}</ul></div>}
          {suggestion.visualStyle && <p><strong>视觉风格</strong>{suggestion.visualStyle}</p>}
          {suggestion.constraints && <p><strong>限制与保留</strong>{suggestion.constraints}</p>}
        </div>
      </details>
      <p className="requirements-suggestion-note">查看并确认后，才会更新已保存的整页需求。</p>
      <div className="requirements-suggestion-actions"><button type="button" className="button secondary" disabled={busy || !onDismissDraft} onClick={onDismissDraft}>忽略</button><button type="button" className="button primary" disabled={busy || !onReviewDraft} onClick={onReviewDraft}>查看并采用</button></div>
    </section>}
    <div className="requirements-summary-heading"><h3>整页需求</h3><span>页面目标与约束</span></div>
    <div className="requirements-summary-content">
      {draft.brief.trim() && <div className="requirements-summary-item"><h4>页面目标</h4><p>{draft.brief.trim()}</p></div>}
      {requirements ? <>
        {requirements.audience && <div className="requirements-summary-item"><h4>目标用户</h4><p>{requirements.audience}</p></div>}
        {!!requirements.features.length && <div className="requirements-summary-item"><h4>核心功能</h4><ul>{requirements.features.map((feature, index) => <li key={index}>{feature}</li>)}</ul></div>}
        {requirements.visualStyle && <div className="requirements-summary-item"><h4>视觉风格</h4><p>{requirements.visualStyle}</p></div>}
        <div className="requirements-summary-item"><h4>动效强度</h4><p>{motionLabels[motion]}</p></div>
        {requirements.constraints && <div className="requirements-summary-item"><h4>限制与保留</h4><p>{requirements.constraints}</p></div>}
      </> : <div className="requirements-summary-item"><p className="requirements-empty">补充核心功能、视觉风格与限制，让整页需求更完整。</p></div>}
    </div>
    <button type="button" className="button secondary requirements-edit" disabled={busy} onClick={onEdit}>管理整页需求</button>
  </section>;
}
