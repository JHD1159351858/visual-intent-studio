import { useId } from 'react';
import './project-visual.css';

function FormCover({ id }: { id: string }) {
  return <div className="visual-brand">
    <div className="visual-brand-heading">FORM<span>®</span></div>
    <div className="visual-brand-caption">形序 · 品牌视觉识别<br /><span>IDENTITY IN EVERY DIMENSION</span></div>
    <svg className="visual-full-svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}-front`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fcffff" /><stop offset=".42" stopColor="#a8d5e5" /><stop offset=".66" stopColor="#d4edf4" /><stop offset="1" stopColor="#84afc3" /></linearGradient>
        <linearGradient id={`${id}-side`}><stop stopColor="#739eaf" /><stop offset=".45" stopColor="#c8e5ed" /><stop offset="1" stopColor="#638ea4" /></linearGradient>
        <linearGradient id={`${id}-top`} x2="0" y2="1"><stop stopColor="#f8ffff" /><stop offset="1" stopColor="#a4c4d2" /></linearGradient>
        <filter id={`${id}-shadow`}><feGaussianBlur stdDeviation="14" /></filter>
      </defs>
      <path d="M0 475H800M0 530H800M0 585H800M120 600 380 360M400 600 470 360M680 600 560 360" stroke="#c3d1d9" strokeWidth="1" opacity=".38" />
      <ellipse cx="520" cy="492" rx="168" ry="25" fill="#43627b" opacity=".18" filter={`url(#${id}-shadow)`} />
      <g transform="translate(0 -4)">
        <path d="m374 232 67-45 240 0-67 45Z" fill={`url(#${id}-top)`} />
        <path d="m614 232 67-45v66l-67 45Z" fill={`url(#${id}-side)`} />
        <path d="m447 347 67-45h118l-67 45Z" fill={`url(#${id}-top)`} />
        <path d="m565 347 67-45v65l-67 45Z" fill={`url(#${id}-side)`} />
        <path d="m447 497 67-45V367l-67 45Z" fill={`url(#${id}-side)`} />
        <path d="M374 232h240v66H447v49h118v65H447v85h-73Z" fill={`url(#${id}-front)`} stroke="#f1ffff" strokeOpacity=".65" />
        <path d="M376 234h237M376 235v259M450 349h111" fill="none" stroke="white" strokeOpacity=".8" />
      </g>
    </svg>
    <div className="visual-brand-bottom">A NEW PERSPECTIVE.<span>品牌策略 / 视觉系统 / 物料设计</span></div>
  </div>;
}

function MountainScene({ id }: { id: string }) {
  return <svg viewBox="0 0 250 240" preserveAspectRatio="xMidYMid slice" className="visual-mountain">
    <defs><linearGradient id={`${id}-sky`} x2="0" y2="1"><stop stopColor="#b8dae0" /><stop offset="1" stopColor="#eef3e8" /></linearGradient><linearGradient id={`${id}-mountain`} x2="0" y2="1"><stop stopColor="#427b79" /><stop offset="1" stopColor="#204d50" /></linearGradient></defs>
    <path d="M0 0h250v240H0Z" fill={`url(#${id}-sky)`} /><circle cx="174" cy="50" r="23" fill="#fcf4d8" />
    <path d="m0 145 53-73 58 81 43-52 96 73v66H0Z" fill="#80ada9" /><path d="m0 174 70-70 79 96 45-65 56 51v54H0Z" fill={`url(#${id}-mountain)`} />
    <path d="M0 211c62-36 111-4 145-23s70-28 105-10v62H0Z" fill="#b9d5cf" /><path d="M0 223c58-20 102 16 141-7s73-13 109-18v42H0Z" fill="#d7e6de" />
    <path d="M116 240c31-22 60-18 46-30s-30-11-11-23" fill="none" stroke="#fbf7e9" strokeWidth="10" />
  </svg>;
}

function TravelCover({ id }: { id: string }) {
  return <div className="visual-travel">
    <div className="visual-travel-wordmark"><span className="visual-shore-symbol">∿</span> 有岸</div>
    <div className="visual-travel-title">去远方，<br />也回到自己。</div>
    <div className="visual-travel-note">A LITTLE FURTHER.<br />A LITTLE CLOSER.</div>
    <svg className="visual-travel-route" viewBox="0 0 800 600"><path d="M-100 500C70 340 183 612 304 391S479 335 604 175 800 65 900 25" fill="none" stroke="#b5d0cc" strokeWidth="2" strokeDasharray="5 8" /></svg>
    <div className="visual-phone visual-phone-secondary">
      <div className="visual-phone-status">9:41 <span>● ▰</span></div>
      <div className="visual-travel-mobile-heading">出发吧。</div>
      <div className="visual-phone-subtitle">找到属于你的下一程</div>
      <div className="visual-travel-search">⌕　想去哪里走走？</div>
      <div className="visual-travel-destination"><MountainScene id={`${id}-a`} /><span>山野之间<br /><small>去自然里，慢一点。</small></span></div>
      <div className="visual-travel-tags"><span>山野</span><span>海岸</span><span>城市</span></div>
      <div className="visual-phone-footer">⌂　　♡　　◉</div>
    </div>
    <div className="visual-phone visual-phone-primary">
      <div className="visual-phone-status">9:41 <span>● ▰</span></div>
      <MountainScene id={`${id}-b`} />
      <div className="visual-travel-detailed"><small>WEEKEND ESCAPE</small><strong>住进山风里</strong><p>一条不用赶路的山间漫游路线。</p><div className="visual-travel-trip-meta"><span>3 天 2 晚</span><span>轻徒步</span></div><div className="visual-travel-fake-button">开启这段旅程　↗</div></div>
    </div>
    <div className="visual-cover-label">有岸 · 旅行发现 APP</div>
  </div>;
}

function StillLifeCover({ id }: { id: string }) {
  return <div className="visual-still-life">
    <svg className="visual-full-svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}-back`} x2=".5" y2="1"><stop stopColor="#07153f" /><stop offset=".6" stopColor="#1945a1" /><stop offset="1" stopColor="#5a90d6" /></linearGradient>
        <linearGradient id={`${id}-vase`}><stop stopColor="#b2e9ff" stopOpacity=".95" /><stop offset=".17" stopColor="#467ed4" stopOpacity=".6" /><stop offset=".48" stopColor="#051b67" stopOpacity=".8" /><stop offset=".7" stopColor="#558be5" stopOpacity=".65" /><stop offset=".91" stopColor="#a5dbfd" stopOpacity=".85" /><stop offset="1" stopColor="#153979" /></linearGradient>
        <radialGradient id={`${id}-orb`} cx=".33" cy=".25" r=".75"><stop stopColor="#e2f9ff" /><stop offset=".3" stopColor="#9fcae3" /><stop offset=".7" stopColor="#4975a8" /><stop offset="1" stopColor="#14294f" /></radialGradient>
        <linearGradient id={`${id}-petal`} x2="1" y2="1"><stop stopColor="#d7faff" /><stop offset=".4" stopColor="#6ca4e9" /><stop offset="1" stopColor="#0c3e9a" /></linearGradient>
        <filter id={`${id}-soft`}><feGaussianBlur stdDeviation="13" /></filter>
      </defs>
      <path d="M0 0h800v600H0Z" fill={`url(#${id}-back)`} />
      <path d="M0 436h800v164H0Z" fill="#70a4dc" opacity=".2" /><path d="m0 436 800 0" stroke="#a8d4f2" strokeOpacity=".25" />
      <ellipse cx="452" cy="500" rx="218" ry="33" fill="#031444" opacity=".55" filter={`url(#${id}-soft)`} />
      <path d="M257 464V281a110 110 0 0 1 220 0v184h-52V281a58 58 0 0 0-116 0v183Z" fill="#2764bf" /><path d="M257 464V281a110 110 0 0 1 220 0" fill="none" stroke="#6098dc" strokeWidth="3" />
      <path d="M473 358c8-59 3-133 29-191" fill="none" stroke="#a0c9e4" strokeWidth="4" />
      <g transform="translate(504 170) rotate(-23)"><ellipse rx="83" ry="26" fill={`url(#${id}-petal)`} transform="rotate(15)" /><ellipse rx="83" ry="26" fill={`url(#${id}-petal)`} transform="rotate(75)" /><ellipse rx="83" ry="26" fill={`url(#${id}-petal)`} transform="rotate(135)" /><circle r="18" fill="#b8daf6" /><circle r="8" fill="#6f95c8" /></g>
      <path d="M429 314h83l-9 71c0 21 40 34 40 70 0 40-30 57-72 57s-72-17-72-57c0-36 40-49 40-70Z" fill={`url(#${id}-vase)`} stroke="#b6ddfa" strokeOpacity=".6" />
      <ellipse cx="470.5" cy="314" rx="41.5" ry="10" fill="#1c4588" stroke="#b6ddfa" /><ellipse cx="470.5" cy="314" rx="34" ry="6" fill="#0c2765" />
      <path d="M435 329c9 76-18 88-18 128 0 23 5 32 13 38" fill="none" stroke="#d0f0ff" strokeOpacity=".6" strokeWidth="4" />
      <circle cx="325" cy="474" r="61" fill={`url(#${id}-orb)`} /><ellipse cx="598" cy="477" rx="58" ry="18" fill="#092655" opacity=".25" /><path d="m567 405 70 29-15 66-72-31Z" fill="#93c1e7" /><path d="m567 405 32-21 70 29-32 21Z" fill="#d5e8f6" /><path d="m637 434 32-21-15 65-32 22Z" fill="#3e74b6" />
    </svg>
    <div className="visual-still-heading">BLUE<br /><span>OBJECTS.</span></div>
    <div className="visual-still-caption"><span>蓝色静物</span><span>A STUDY OF LIGHT & FORM / 2025</span></div>
  </div>;
}

function SystemCover() {
  return <div className="visual-system">
    <div className="visual-system-heading">FRAME<span>DESIGN SYSTEM</span></div>
    <div className="visual-system-type"><span>字形，秩序，可能。</span><strong>Aa</strong><p>Designed for clarity.<br />Built for possibilities.</p></div>
    <div className="visual-system-sheet">
      <div className="visual-system-sheet-label">FOUNDATIONS / COMPONENTS <span>↗</span></div>
      <div className="visual-type-specimen">Make room.<span>Regular　Medium　Semibold</span></div>
      <div className="visual-system-colors"><span /><span /><span /><span /><span /></div>
      <div className="visual-system-control-row"><div className="visual-system-pill">Primary ↗</div><div className="visual-system-pill visual-system-pill-light">Secondary</div><div className="visual-system-switch" /></div>
      <div className="visual-system-input">⌕　Search something <span>⌘ K</span></div>
      <div className="visual-system-bottom-row"><div className="visual-system-mini-chart"><i /><i /><i /><i /><i /><i /><i /><i /></div><div className="visual-system-icon-grid">↗　✳　⌘<br />◉　⊕　▥</div></div>
      <div className="visual-system-ruler"><span>8</span><span>16</span><span>24</span><span>32</span><span>48</span></div>
    </div>
    <div className="visual-system-caption">少一点噪音，多一点秩序。<span>PRODUCT DESIGN LANGUAGE</span></div>
  </div>;
}

function CultureCover() {
  return <div className="visual-culture">
    <div className="visual-culture-poster">
      <div className="visual-culture-poster-top"><span>THE MOUNTAIN<br />ART EXHIBITION</span><span>2025<br />秋季特别展</span></div>
      <div className="visual-culture-chinese">观<span>山</span></div>
      <div className="visual-culture-disc"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
      <div className="visual-culture-poster-bottom">在留白里，看见山的回响。<span>10.18 — 11.30</span></div>
    </div>
    <div className="visual-culture-side"><span>SEE<br />THE<br />UNSEEN.</span><div>观山<br /><small>艺术展览视觉设计</small></div><p>图形 / 字体 / 空间<br />EXHIBITION IDENTITY</p></div>
  </div>;
}

export function ProjectVisual({ kind, detail = false }: { kind: string; detail?: boolean }) {
  const id = useId().replace(/:/g, '');
  return <div className={`visual-art visual-kind-${kind}${detail ? ' visual-detail' : ''}`} aria-hidden="true">
    {kind === 'health' ? <img className="visual-health-image" src="./assets/qingkang-hero.png" alt="" />
      : kind === 'brand' ? <FormCover id={id} />
      : kind === 'travel' ? <TravelCover id={id} />
      : kind === 'illustration' ? <StillLifeCover id={id} />
      : kind === 'system' ? <SystemCover />
      : <CultureCover />}
  </div>;
}
