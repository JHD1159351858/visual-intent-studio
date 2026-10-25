import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, Check, Code2, Copy, Mail, Menu, MessageCircle, Pause, Play, X } from 'lucide-react';
import Chat from './Chat';
import { ProjectVisual } from './ProjectVisual';
import { projects, type Project } from './data';

function Dialog({ title, origin, motion, onClose, children }: { title: string; origin: HTMLElement | null; motion: boolean; onClose: () => void; children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closing = useRef(false);
  const callback = useRef(onClose);
  callback.current = onClose;
  useEffect(() => {
    const dialog = dialogRef.current!;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    if (motion && origin) {
      const a = origin.getBoundingClientRect(), b = dialog.getBoundingClientRect();
      dialog.animate([{ transform: `translate(${a.x - b.x}px,${a.y - b.y}px) scale(${a.width / b.width},${a.height / b.height})`, opacity: .35 }, { transform: 'none', opacity: 1 }], { duration: 450, easing: 'cubic-bezier(.2,.8,.2,1)' });
    }
    return () => { dialog.close(); document.body.style.overflow = oldOverflow; origin?.focus({ preventScroll: true }); };
  }, [origin]);
  async function close() {
    if (closing.current) return;
    closing.current = true;
    if (motion && origin) {
      const dialog = dialogRef.current!, a = origin.getBoundingClientRect(), b = dialog.getBoundingClientRect();
      await dialog.animate([{ transform: 'none', opacity: 1 }, { transform: `translate(${a.x - b.x}px,${a.y - b.y}px) scale(${a.width / b.width},${a.height / b.height})`, opacity: 0 }], { duration: 280, easing: 'cubic-bezier(.4,0,1,1)' }).finished.catch(() => {});
    }
    callback.current();
  }
  return <dialog ref={dialogRef} className="s-dialog" aria-label={title} onCancel={event => { event.preventDefault(); void close(); }} onClick={event => { if (event.target === event.currentTarget) void close(); }}><div className="s-dialog-inner"><header className="s-dialog-header"><span>{title}</span><button className="icon-button" autoFocus aria-label="关闭弹窗" onClick={() => void close()}><X size={21} /></button></header>{children}</div></dialog>;
}

function WorkCard({ project, index, feature, motion, onOpen }: { project: Project; index: number; feature?: boolean; motion: boolean; onOpen: (project: Project, element: HTMLElement) => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const hold = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const held = useRef(false);
  useEffect(() => () => clearTimeout(hold.current), []);
  useEffect(() => { if (!motion && ref.current) { ref.current.style.setProperty('--rx', '0deg'); ref.current.style.setProperty('--ry', '0deg'); ref.current.removeAttribute('data-held'); } }, [motion]);
  const reset = () => { clearTimeout(hold.current); if (ref.current) { ref.current.style.setProperty('--rx', '0deg'); ref.current.style.setProperty('--ry', '0deg'); ref.current.removeAttribute('data-held'); } };
  return <div className={`work-entry ${feature ? 'work-feature' : ''}`} style={{ '--entry-delay': `${index * 200}ms` } as CSSProperties}>
    <button ref={ref} className="work-card" data-project={project.id} aria-label={`查看项目：${project.name}`}
      onPointerMove={event => {
        if (!motion || event.pointerType !== 'mouse') return;
        const r = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty('--rx', `${-((event.clientY - r.top) / r.height - .5) * 4}deg`);
        event.currentTarget.style.setProperty('--ry', `${((event.clientX - r.left) / r.width - .5) * 4}deg`);
      }} onPointerLeave={reset} onPointerDown={event => {
        held.current = false;
        if (!motion || event.pointerType !== 'touch') return;
        hold.current = setTimeout(() => { held.current = true; ref.current?.setAttribute('data-held', 'true'); ref.current?.style.setProperty('--rx', '-2deg'); }, 400);
      }} onPointerUp={() => { clearTimeout(hold.current); setTimeout(reset, 180); }} onPointerCancel={reset} onContextMenu={event => event.preventDefault()}
      onClick={event => { if (held.current) { held.current = false; return; } onOpen(project, event.currentTarget); }}>
      <div className="work-cover"><div className="work-cover-plane"><ProjectVisual kind={project.kind} /></div><span className="cover-open"><ArrowUpRight size={21} /></span><span className="cover-type">{project.category.split(' · ')[0]}</span></div>
      <div className="work-caption"><div><h3>{project.name}</h3><p>{project.subtitle}</p></div><div className="work-caption-end"><span>{project.year}</span><ArrowUpRight size={20} /></div></div>
      {feature && <p className="work-description">{project.description}</p>}
    </button>
  </div>;
}

export default function App() {
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  const [menu, setMenu] = useState(false);
  const [chatSignal, setChatSignal] = useState(0);
  const [selection, setSelection] = useState<{ project: Project; origin: HTMLElement } | null>(null);
  const [contact, setContact] = useState<{ origin: HTMLElement | null } | null>(null);
  const [feedback, setFeedback] = useState('');
  const [copied, setCopied] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const motion = !paused && !reduced && !hidden;
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches), visibility = () => setHidden(document.hidden);
    query.addEventListener('change', update); document.addEventListener('visibilitychange', visibility);
    return () => { query.removeEventListener('change', update); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  useEffect(() => {
    document.documentElement.dataset.motion = motion ? 'running' : 'paused';
    if (!motion && heroRef.current) { heroRef.current.style.setProperty('--mx', '0px'); heroRef.current.style.setProperty('--my', '0px'); }
  }, [motion]);
  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(''), 5000);
    return () => clearTimeout(timer);
  }, [feedback]);
  useEffect(() => {
    if (reduced || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('has-entered'); observer.unobserve(entry.target); } }), { threshold: .08 });
    document.querySelectorAll('.work-entry').forEach(element => { element.classList.add('entry-ready'); observer.observe(element); });
    return () => { observer.disconnect(); document.querySelectorAll('.entry-ready').forEach(element => element.classList.remove('entry-ready')); };
  }, [reduced]);
  const openContact = (origin: HTMLElement | null = null) => { setFeedback(''); setCopied(false); setContact({ origin }); setMenu(false); };
  const openProject = (project: Project, origin: HTMLElement) => { setFeedback(''); setSelection({ project, origin }); };
  async function copyEmail() {
    try { await navigator.clipboard.writeText('hello@linzhi.example.com'); setCopied(true); }
    catch { setFeedback('请手动复制：hello@linzhi.example.com'); }
  }
  const social = (name: string) => setFeedback(`${name} 为演示入口，尚未配置真实主页。`);
  return <div className="space-app" data-motion={motion ? 'running' : 'paused'}>
    <a className="skip-link" href="#works">跳到作品</a>
    <header className="site-header"><div className="container header-inner flex items-center justify-between"><a href="#top" className="brand"><span className="brand-symbol">L<span>Z</span><i /></span><span>林知 <em>/ 产品设计师</em></span></a><nav className={menu ? 'nav-open' : ''} aria-label="主导航"><a href="#works" onClick={() => setMenu(false)}>作品<span>Work</span></a><a href="#about" onClick={() => setMenu(false)}>关于<span>About</span></a><button onClick={event => openContact(event.currentTarget)}>联系<span>Contact <ArrowUpRight size={12} /></span></button></nav><div className="header-actions"><button className="pause-button" title={reduced ? '系统已开启减少动态' : paused ? '继续动效' : '暂停动效'} aria-label={reduced ? '减少动态已开启' : paused ? '继续动效' : '暂停动效'} aria-pressed={paused || reduced} disabled={reduced} onClick={() => setPaused(value => !value)}>{motion ? <Pause size={16} /> : <Play size={16} />}</button><button className="menu-button icon-button" aria-label={menu ? '关闭导航' : '打开导航'} aria-expanded={menu} onClick={() => setMenu(value => !value)}>{menu ? <X size={19} /> : <Menu size={19} />}</button></div></div></header>
    <main>
      <section id="top" className="hero container">
        <div className="hero-copy"><div className="hero-kicker"><i /> 开放设计合作 <span>PORTFOLIO / 2026</span></div><p className="hero-intro">你好，我是林知</p><h1>专注数字产品<br /><span>体验设计</span><span className="title-dot">.</span></h1><p className="hero-description">从用户需求出发，<br />把复杂的问题，变成自然的体验。<br />探索兼具美感与实用性的数字产品。</p><div className="hero-buttons flex flex-wrap"><a className="primary-button" href="#works">查看我的作品 <ArrowDownRight size={18} /></a><button className="outline-button" onClick={() => setChatSignal(value => value + 1)}>聊天了解经历 <MessageCircle size={17} /></button></div><div className="hero-socials"><button aria-label="GitHub演示入口" onClick={() => social('GitHub')}><Code2 size={19} /></button><button aria-label="站酷演示入口" onClick={() => social('站酷')}><span className="zc-icon">Z</span></button><button aria-label="查看邮箱联系方式" onClick={event => openContact(event.currentTarget)}><Mail size={19} /></button><span className="demo-note">概念项目 · 演示作品集</span></div></div>
        <div ref={heroRef} className="hero-stage" onPointerMove={event => { if (!motion || event.pointerType !== 'mouse') return; const r = event.currentTarget.getBoundingClientRect(); event.currentTarget.style.setProperty('--mx', `${Math.max(-12, Math.min(12, ((event.clientX - r.x) / r.width - .5) * 24))}px`); event.currentTarget.style.setProperty('--my', `${Math.max(-12, Math.min(12, ((event.clientY - r.y) / r.height - .5) * 24))}px`); }} onPointerLeave={event => { event.currentTarget.style.setProperty('--mx', '0px'); event.currentTarget.style.setProperty('--my', '0px'); }}>
          <div className="stage-grid" aria-hidden="true" /><div className="stage-orbit" aria-hidden="true" />
          <div className="hero-main-motion"><div className="hero-float"><button className="hero-work" aria-label="查看主作品：轻康" onClick={event => openProject(projects[0], event.currentTarget)}><div className="hero-work-image"><ProjectVisual kind="health" /></div><span className="hero-work-badge"><span /> FEATURED PROJECT</span><span className="hero-work-index">PRODUCT DESIGN / 2025</span></button></div></div>
          <div className="hero-aux hero-aux-brand"><div className="aux-float"><ProjectVisual kind="brand" /><span>形序 / BRAND IDENTITY</span></div></div><div className="hero-aux hero-aux-travel"><div className="aux-float"><ProjectVisual kind="travel" /></div></div>
          <div className="hero-work-caption"><div><span>SELECTED PROJECT</span><h2>《轻康》健康管理 APP</h2></div><button aria-label="展开轻康项目" onClick={event => openProject(projects[0], event.currentTarget)}><ArrowUpRight size={23} /></button></div><div className="stage-footnote"><span>LIGHT. INTUITIVE. HUMAN.</span><i /> 让设计，更贴近生活。</div>
        </div>
        <a className="hero-scroll" href="#works"><ArrowDown size={14} /> 向下探索作品 <span>SCROLL TO EXPLORE</span></a>
      </section>
      <section id="works" className="works-section container"><div className="section-heading"><div><span className="eyebrow">SELECTED WORKS</span><h2>精选作品<span className="heading-dot">.</span></h2></div><p>从一个问题出发，<br />抵达一个值得被使用的答案。</p></div><div className="work-group"><WorkCard project={projects[0]} index={0} feature motion={motion} onOpen={openProject} /><div className="work-side">{projects.slice(1, 3).map((project, index) => <WorkCard key={project.id} project={project} index={index + 1} motion={motion} onOpen={openProject} />)}</div></div><div className="work-group work-group-reverse"><div className="work-side">{projects.slice(3, 5).map((project, index) => <WorkCard key={project.id} project={project} index={index + 3} motion={motion} onOpen={openProject} />)}</div><WorkCard project={projects[5]} index={5} feature motion={motion} onOpen={openProject} /></div><p className="works-end"><span /> 每个项目，都是一次新的探索。<span /></p></section>
      <section id="about" className="about-section container"><div className="about-identity"><div className="personal-mark" aria-label="林知个人标识">LZ<span>.</span></div><div><span className="eyebrow">BEHIND THE WORK</span><h2>设计的起点，<br />是对生活的好奇。</h2></div></div><div className="about-content"><p className="about-lead">我是林知，一名关注产品体验的设计师。<br /><span>在理性的结构里，寻找有温度的表达。</span></p><p>喜欢从具体的使用情境出发，在研究、交互、视觉与原型之间来回推敲。好的设计应该让事情更容易理解，也让日常多一点值得记住的细节。</p><div className="about-experience"><div><span>体验设计</span><p>需求梳理、用户旅程、信息架构与交互原型。</p></div><div><span>视觉表达</span><p>数字产品、品牌识别与界面视觉语言。</p></div><div><span>设计协作</span><p>组件规范、可交互原型与设计交付。</p></div></div><div className="skill-list">{['Figma', 'Product Design', 'UI / UX', 'Design Systems', 'Prototyping'].map(skill => <span key={skill}>{skill}</span>)}</div><small>本页人物介绍与项目均为预设演示内容。</small></div></section>
      <section id="contact" className="contact-section container"><div><span className="eyebrow">HAVE SOMETHING IN MIND?</span><h2>让下一个想法，<br />从一句你好开始<span>。</span></h2><p>关于项目、合作，或者一个有趣的点子，都欢迎聊聊。</p></div><button className="contact-orbit" aria-label="打开联系方式" onClick={event => openContact(event.currentTarget)}><ArrowUpRight size={46} strokeWidth={1.4} /><span>SAY HELLO</span></button></section>
    </main>
    <footer className="site-footer"><div className="container footer-inner"><span>© 2026 林知 <i>/</i> 概念作品集</span><p>以好奇心开始，以细节完成。</p><div><button onClick={() => social('GitHub')}>GitHub <ArrowUpRight size={12} /></button><button onClick={() => social('站酷')}>站酷 <ArrowUpRight size={12} /></button><button onClick={event => openContact(event.currentTarget)}>邮箱 <ArrowUpRight size={12} /></button></div></div></footer>
    <Chat onContact={() => openContact()} openSignal={chatSignal} />
    {feedback && !contact && !selection && <div className="toast" role="status">{feedback}<button aria-label="关闭提示" onClick={() => setFeedback('')}><X size={16} /></button></div>}
    {selection && <Dialog title="PROJECT / 概念项目" origin={selection.origin} motion={motion} onClose={() => setSelection(null)}><div className="detail-heading"><span className="eyebrow">{selection.project.category} / {selection.project.year}</span><h2>{selection.project.name}<span>{selection.project.subtitle}</span></h2><p>{selection.project.description}</p></div><div className="detail-visual"><ProjectVisual kind={selection.project.kind} detail /></div><div className="detail-body"><aside><span className="eyebrow">ROLE & SCOPE</span><p>{selection.project.role}</p><span className="detail-demo">概念设计 / 演示资料</span></aside><div><h3>项目背景</h3><p>{selection.project.background}</p><h3>设计过程</h3><ol>{selection.project.process.map((step, index) => <li key={step}><span>0{index + 1}</span>{step}</li>)}</ol><h3>设计交付</h3><p>{selection.project.outcome}</p><button className="outline-button" onClick={() => setFeedback('这是概念展示项目，暂无公开链接。可通过演示联系入口查看联系方式。')}>查看项目链接 <ArrowUpRight size={16} /></button>{feedback && <p className="inline-feedback" role="status">{feedback}</p>}</div></div></Dialog>}
    {contact && <Dialog title="CONTACT / 联系方式" origin={contact.origin} motion={motion} onClose={() => setContact(null)}><div className="contact-dialog"><span className="eyebrow">A GOOD CONVERSATION STARTS HERE</span><h2>很高兴，<br />在这里遇见你<span>。</span></h2><p>以下为演示联系方式，暂不可用于真实联系。</p><div className="email-row"><div><span>EMAIL ADDRESS</span><strong>hello@linzhi.example.com</strong></div><button className="icon-button" aria-label="复制演示邮箱" onClick={() => void copyEmail()}>{copied ? <Check size={19} /> : <Copy size={19} />}</button></div>{copied && <p className="copy-success" role="status">已复制演示邮箱</p>}{feedback && <p className="inline-feedback" role="status">{feedback}</p>}<div className="contact-dialog-notes"><span>产品体验 / 网站设计 / 品牌数字体验</span><span>演示邮箱使用保留域名 example.com</span></div></div></Dialog>}
  </div>;
}
