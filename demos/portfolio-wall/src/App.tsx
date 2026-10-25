import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, Check, Copy, Code2, Mail, MapPin, Pause, Play, Plus, X } from 'lucide-react';
import { Avatar, ProjectArtwork } from './Artwork';
import ChatWidget from './ChatWidget';
import { projects, type Project } from './data';

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reduced;
}

function Modal({ title, origin, reduced, onClose, children }: { title: string; origin: HTMLElement | null; reduced: boolean; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const closing = useRef(false);
  const closeAction = useRef(onClose);
  closeAction.current = onClose;
  useEffect(() => {
    const dialog = ref.current!;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    if (!reduced && origin && dialog.animate) {
      const a = origin.getBoundingClientRect();
      const b = dialog.getBoundingClientRect();
      dialog.animate([
        { transform: `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${a.width / b.width}, ${a.height / b.height})`, opacity: 0.3 },
        { transform: 'none', opacity: 1 },
      ], { duration: 420, easing: 'cubic-bezier(.2,.8,.2,1)' });
    }
    return () => { dialog.close(); document.body.style.overflow = overflow; origin?.focus({ preventScroll: true }); };
  }, [origin, reduced]);
  const close = async () => {
    if (closing.current) return;
    closing.current = true;
    const dialog = ref.current!;
    if (!reduced && origin && dialog.animate) {
      const a = origin.getBoundingClientRect();
      const b = dialog.getBoundingClientRect();
      await dialog.animate([
        { transform: 'none', opacity: 1 },
        { transform: `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${a.width / b.width}, ${a.height / b.height})`, opacity: 0 },
      ], { duration: 250, easing: 'cubic-bezier(.4,0,1,1)' }).finished.catch(() => {});
    }
    closeAction.current();
  };
  return <dialog ref={ref} className="detail-modal" aria-label={title} onCancel={event => { event.preventDefault(); void close(); }} onClick={event => { if (event.target === event.currentTarget) void close(); }}>
    <div className="modal-inner">
      <div className="modal-top"><span className="eyebrow">{title}</span><button autoFocus className="icon-button" aria-label="关闭弹窗" onClick={() => void close()}><X size={20} /></button></div>
      {children}
    </div>
  </dialog>;
}

function ProjectCard({ project, index, motion, onOpen }: { project: Project; index: number; motion: boolean; onOpen: (project: Project, origin: HTMLElement) => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (!motion) { ref.current?.style.setProperty('--rx', '0deg'); ref.current?.style.setProperty('--ry', '0deg'); } }, [motion]);
  return <div className={`project-position project-${project.id}`}>
    <div className="project-reveal" style={{ '--delay': `${index * 100}ms` } as CSSProperties}>
      <button ref={ref} className={`project-card ${index === 0 ? 'project-featured' : ''}`} aria-label={`查看项目：${project.name}`} data-project={project.id}
        onPointerMove={event => {
          if (!motion || event.pointerType !== 'mouse') return;
          const rect = event.currentTarget.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
          const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
          event.currentTarget.style.setProperty('--rx', `${-y * 7}deg`);
          event.currentTarget.style.setProperty('--ry', `${x * 7}deg`);
        }} onPointerLeave={event => { event.currentTarget.style.setProperty('--rx', '0deg'); event.currentTarget.style.setProperty('--ry', '0deg'); }}
        onClick={event => onOpen(project, event.currentTarget)}>
        <div className="project-art-stage"><div className="project-art-plane"><ProjectArtwork kind={project.kind} /></div><div className="project-art-tag">{project.category} <span>/ {project.year}</span></div><span className="project-open" aria-hidden="true"><ArrowUpRight size={20} /></span></div>
        <div className="project-copy"><div className="project-copy-heading"><h3>{project.name}<span>{project.title}</span></h3>{index === 0 && <span className="featured-tag">重点作品</span>}</div><p>{project.description}</p><span className="project-read">探索项目 <ArrowUpRight size={15} /></span></div>
      </button>
    </div>
  </div>;
}

function DemoCode() {
  const squares = Array.from({ length: 121 }, (_, i) => ({ x: (i % 11) * 6, y: Math.floor(i / 11) * 6, active: ((i * 17 + 3) % 7) < 3 }));
  return <div className="demo-code"><svg viewBox="-5 -5 76 76" aria-hidden="true">{squares.filter(s => s.active).map((s, i) => <rect key={i} x={s.x} y={s.y} width="4" height="4" rx="0.5" />)}{[[0, 0], [48, 0], [0, 48]].map(([x, y]) => <g key={`${x}-${y}`}><rect x={x} y={y} width="18" height="18" fill="white" /><rect x={x + 2} y={y + 2} width="14" height="14" fill="#121216" /><rect x={x + 5} y={y + 5} width="8" height="8" fill="white" /></g>)}</svg><span>微信码展示位</span><small>演示图形 · 无真实微信</small></div>;
}

export default function App() {
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  const [selected, setSelected] = useState<{ project: Project; origin: HTMLElement } | null>(null);
  const [contact, setContact] = useState<{ origin: HTMLElement | null } | null>(null);
  const [feedback, setFeedback] = useState('');
  const [copied, setCopied] = useState(false);
  const profileRef = useRef<HTMLElement>(null);
  const motion = !paused && !reduced && !hidden;
  useEffect(() => {
    const listener = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', listener);
    return () => document.removeEventListener('visibilitychange', listener);
  }, []);
  useEffect(() => { document.documentElement.dataset.motion = motion ? 'running' : 'paused'; }, [motion]);
  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(''), 4500);
    return () => clearTimeout(timer);
  }, [feedback]);
  useEffect(() => {
    if (reduced || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(items => {
      items.forEach(item => { if (item.isIntersecting) { item.target.classList.remove('will-reveal'); observer.unobserve(item.target); } });
    }, { threshold: 0.06 });
    document.querySelectorAll('.project-reveal').forEach(item => {
      if (item.getBoundingClientRect().top > innerHeight) { item.classList.add('will-reveal'); observer.observe(item); }
    });
    return () => { observer.disconnect(); document.querySelectorAll('.will-reveal').forEach(item => item.classList.remove('will-reveal')); };
  }, [reduced]);
  useEffect(() => {
    if (!motion) { document.querySelectorAll<HTMLElement>('.project-position').forEach(item => item.style.setProperty('--parallax', '0px')); return; }
    let frame = 0;
    const scroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        document.querySelectorAll<HTMLElement>('.project-position').forEach((item, index) => {
          const y = Math.max(-8, Math.min(8, (item.getBoundingClientRect().top - innerHeight / 2) / 80));
          item.style.setProperty('--parallax', `${y * (index % 2 ? -1 : 1)}px`);
        });
        frame = 0;
      });
    };
    window.addEventListener('scroll', scroll, { passive: true });
    return () => { window.removeEventListener('scroll', scroll); cancelAnimationFrame(frame); };
  }, [motion]);
  useEffect(() => {
    if (!motion) { profileRef.current?.style.setProperty('--rx', '0deg'); profileRef.current?.style.setProperty('--ry', '0deg'); }
  }, [motion]);
  const openContact = (origin: HTMLElement | null = null) => { setCopied(false); setContact({ origin }); };
  const copyEmail = async () => {
    try { await navigator.clipboard.writeText('hello@zhixia.example.com'); setCopied(true); }
    catch { setFeedback('请手动复制演示邮箱：hello@zhixia.example.com'); }
  };
  return <div className="portfolio-app" data-motion={motion ? 'running' : 'paused'}>
    <a className="skip-link" href="#works">跳到作品</a>
    <header className="site-header site-container flex items-center justify-between">
      <a className="wordmark" href="#top" aria-label="林知夏，回到首页">知夏<span className="wordmark-dot" /></a>
      <nav aria-label="主导航" className="flex items-center"><a href="#works">作品</a><a href="#about">关于</a><button onClick={event => openContact(event.currentTarget)}>联系 <ArrowUpRight size={14} /></button></nav>
      <button className="motion-toggle" aria-pressed={paused || reduced} aria-label={reduced ? '系统已开启减少动态' : paused ? '继续动效' : '暂停动效'} onClick={() => setPaused(value => !value)} disabled={reduced}>{motion ? <Pause size={13} /> : <Play size={13} />}<span>{reduced ? '减少动态' : paused ? '继续动效' : '暂停动效'}</span></button>
    </header>
    <main>
      <section id="top" className="hero site-container">
        <div className="hero-content">
          <div className="hero-eyebrow"><span className="availability-dot" /> 开放全职机会与独立合作 <span className="demo-pill">演示作品集</span></div>
          <h1>林知夏 <span className="hero-slash">/</span><br /><span>独立产品设计师</span><span className="hero-period">.</span></h1>
          <p className="hero-description">5年交互设计经验，专注做用户愿意用、记得住的数字产品，曾主导3款百万级用户工具的设计全流程。</p>
          <p className="hero-invitation">你可以往下看我的作品，也可以点右下角的聊天按钮，问我关于经历、项目和合作的问题。</p>
          <div className="hero-actions flex flex-wrap items-center"><a className="button-primary" href="#works">查看我的作品 <ArrowDownRight size={18} /></a><button className="button-secondary" onClick={event => openContact(event.currentTarget)}>联系我 <ArrowUpRight size={18} /></button></div>
          <div className="hero-footnote">人物、经历及成果数据均为演示设定</div>
        </div>
        <div className="hero-installation" aria-label="三张错落悬浮的创作卡片">
          <span className="installation-caption">IDEAS, SUSPENDED.</span>
          <div className="hanging-item hanging-one"><i className="suspension-wire" /><div className="mini-float"><div className="mini-card"><ProjectArtwork kind="walk" compact /><span>步程 / 2023</span></div></div></div>
          <div className="hanging-item hanging-two"><i className="suspension-wire" /><div className="mini-float"><div className="mini-card"><ProjectArtwork kind="identity" compact /></div></div></div>
          <div className="hanging-item hanging-three"><i className="suspension-wire" /><div className="mini-float"><div className="mini-card"><ProjectArtwork kind="earth" compact /></div></div></div>
          <span className="installation-note">想法有重量，<br />好的设计让它轻盈。</span>
          <Plus className="installation-cross" size={14} strokeWidth={1} />
        </div>
        <div className="hero-bottom"><a href="#works">向下，走进我的创作 <ArrowDown size={15} /></a><span>DESIGNED WITH INTENTION</span></div>
      </section>
      <section id="works" className="works-section site-container">
        <div className="section-heading"><div><span className="eyebrow">SELECTED WORK / 2022—2025</span><h2>精选作品<span>每一个项目，都是一次认真回答。</span></h2></div><span className="work-count">6 件作品 <span>↙</span></span></div>
        <div className="work-wall">{[0, 1].map(column => <div className={`work-column column-${column}`} key={column}>{projects.filter((_, index) => index % 2 === column).map(project => <ProjectCard key={project.id} project={project} index={projects.indexOf(project)} motion={motion} onOpen={(item, origin) => { setFeedback(''); setSelected({ project: item, origin }); }} />)}</div>)}</div>
        <div className="wall-end"><span />作品会更新，探索也会继续。<span /></div>
      </section>
      <section id="about" className="about-section site-container">
        <div className="section-heading"><div><span className="eyebrow">A LITTLE ABOUT ME</span><h2>设计之外，也是生活的观察者。</h2></div><ArrowDownRight size={32} strokeWidth={1} /></div>
        <div className="about-layout">
          <article ref={profileRef} className="profile-card" onPointerMove={event => {
            if (!motion || event.pointerType !== 'mouse') return;
            const r = event.currentTarget.getBoundingClientRect();
            const x = (event.clientX - r.left) / r.width; const y = (event.clientY - r.top) / r.height;
            event.currentTarget.style.setProperty('--rx', `${-(y - 0.5) * 10}deg`); event.currentTarget.style.setProperty('--ry', `${(x - 0.5) * 10}deg`);
            event.currentTarget.style.setProperty('--gx', `${x * 100}%`); event.currentTarget.style.setProperty('--gy', `${y * 100}%`);
          }} onPointerLeave={event => { event.currentTarget.style.setProperty('--rx', '0deg'); event.currentTarget.style.setProperty('--ry', '0deg'); }}>
            <div className="profile-portrait"><Avatar /><span className="portrait-caption">ILLUSTRATED DEMO PORTRAIT</span></div><div className="profile-content"><div className="profile-name"><h3>林知夏</h3><span>LIN ZHIXIA</span></div><p>独立产品设计师</p><span className="profile-location"><MapPin size={13} /> 杭州 · 可远程合作</span><button className="profile-email" onClick={event => openContact(event.currentTarget)}><Mail size={14} /> hello@zhixia.example.com</button><div className="social-links">{['站酷', 'Behance', 'GitHub'].map(label => <button key={label} onClick={() => setFeedback(`${label} 为演示入口，尚未配置真实个人主页。`)}>{label === 'GitHub' && <Code2 size={12} />}{label}<ArrowUpRight size={12} /></button>)}</div><button className="wechat-open" onClick={event => openContact(event.currentTarget)}>查看联系方式与微信展示位 <ArrowRight size={14} /></button></div>
          </article>
          <div className="about-copy"><p className="about-lead">我相信，好的设计不止于好看。<br /><span>它应该让复杂的事，变得自然一点。</span></p><p className="about-description">从理解一个真实的困扰开始，到把想法变成可用的产品，我享受在理性与感性之间找到平衡。工作之外，喜欢城市漫步、摄影和收集生活里的小巧思。</p><div className="experience-block"><h3>一路走来 <span>演示经历</span></h3><div className="experience-row"><span>2024—至今</span><div><h4>独立产品设计师</h4><p>为工具、生活服务与初创品牌提供产品设计。</p></div></div><div className="experience-row"><span>2021—2024</span><div><h4>产品设计师 · 一间数字产品工作室</h4><p>参与用户研究、交互设计、设计系统与产品迭代。</p></div></div><div className="experience-row"><span>2017—2021</span><div><h4>视觉传达设计 · 本科</h4><p>学习视觉表达、信息设计与交互基础。</p></div></div></div><div className="skills"><h3>我的工具箱</h3><div>{['用户研究', '交互设计', 'UI / UX', 'Figma', '设计系统', '原型与动效'].map(skill => <span key={skill}>{skill}</span>)}</div></div></div>
        </div>
      </section>
      <section className="contact-section site-container"><span className="eyebrow">LET’S MAKE SOMETHING MEANINGFUL</span><div className="contact-heading"><h2>下一个好想法，<br />也许从一句你好开始。</h2><button className="contact-arrow" aria-label="联系林知夏" onClick={event => openContact(event.currentTarget)}><ArrowUpRight size={42} strokeWidth={1} /></button></div><p>正在寻找一个认真、有趣的合作？我很乐意听听。</p></section>
    </main>
    <footer className="site-footer site-container"><span>© 2026 林知夏 <span className="footer-divider">/</span> 个人作品集演示</span><span>React + Tailwind CSS <span className="footer-divider">·</span> 预设内容，无后端服务</span><a href="#top">回到顶部 ↑</a></footer>
    <ChatWidget onContact={() => openContact()} />
    {feedback && !selected && !contact && <div className="feedback-toast" role="status">{feedback}<button aria-label="关闭提示" onClick={() => setFeedback('')}><X size={15} /></button></div>}
    {selected && <Modal title="PROJECT CASE STUDY / 演示项目" origin={selected.origin} reduced={!motion} onClose={() => setSelected(null)}><div className="project-detail-heading"><span className="eyebrow">{selected.project.category} / {selected.project.year}</span><h2>{selected.project.name}<span>{selected.project.title}</span></h2><p>{selected.project.description}</p></div><div className="detail-art"><ProjectArtwork kind={selected.project.kind} /></div><div className="case-study-body"><div><span className="eyebrow">我的角色</span><p>{selected.project.role}</p></div><div><h3>从问题开始</h3><p>{selected.project.challenge}</p><h3>设计的回应</h3><ul>{selected.project.approach.map(item => <li key={item}>{item}</li>)}</ul><h3>交付与边界</h3><p>{selected.project.outcome}</p><button className="button-secondary" onClick={() => setFeedback('该项目暂未公开，你可以通过联系方式咨询我')}>访问项目 <ArrowUpRight size={16} /></button>{feedback && <p className="project-link-feedback" role="status">{feedback}</p>}<p className="case-demo-note">人物、作品、图片与经历均为预设演示。本页为设计行为适配，未集成来源组件完整源码。</p></div></div></Modal>}
    {contact && <Modal title="SAY HELLO / 联系方式" origin={contact.origin} reduced={!motion} onClose={() => setContact(null)}><div className="contact-modal-content"><span className="eyebrow">LET’S CONNECT</span><h2>你好，<br />未来的合作者。</h2><p>以下为演示联系方式，暂不可用于真实联系。</p><div className="contact-email"><div><span>EMAIL</span><strong>hello@zhixia.example.com</strong></div><button className="icon-button" aria-label="复制演示邮箱" onClick={() => void copyEmail()}>{copied ? <Check size={19} /> : <Copy size={19} />}</button></div>{copied && <p className="copy-success" role="status">已复制演示邮箱</p>}{feedback && <p className="project-link-feedback" role="status">{feedback}</p>}<div className="contact-modal-bottom"><DemoCode /><div><h3>聊项目，也聊想法。</h3><p>合作类型：产品设计、网站设计、设计系统。<br />演示邮箱使用保留的 example.com 域名。<br />微信展示位不会连接真实账号。</p></div></div></div></Modal>}
  </div>;
}
