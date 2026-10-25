import './artwork.css';

type ArtworkProps = { kind: string; compact?: boolean };

function Arrow({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5" /></svg>;
}

function Phone({ second = false }: { second?: boolean }) {
  return <div className={`art-phone ${second ? 'art-phone-second' : ''}`}>
    <div className="art-phone-notch" />
    <div className="art-phone-status"><span>9:41</span><span>••• ▰</span></div>
    <div className="art-phone-heading"><b>步程<span>WALK A LITTLE.</span></b><span className="art-phone-avatar">林</span></div>
    {second ? <>
      <div className="art-phone-journey">走一条<br /><strong>不一样的路。</strong></div>
      <div className="art-mini-map"><RouteMap /></div>
      <div className="art-phone-trip"><b>江畔落日路线</b><small>3.2 km · 预计 42 分钟</small><span>开始漫步 ↗</span></div>
    </> : <>
      <div className="art-phone-greeting">下午好，知夏</div>
      <div className="art-phone-journey">去发现城市的<br /><strong>另一面。</strong></div>
      <div className="art-walk-photo"><span className="art-walk-sun" /><i /><i /><i /><i /><em>沿着风，走进日常</em></div>
      <div className="art-phone-bottom"><b>今日漫步灵感</b><span>探索附近 ↗</span></div>
      <div className="art-walk-chips"><span>城市公园</span><span>街角咖啡</span></div>
    </>}
    <div className="art-phone-nav"><span>⌂</span><span>⌕</span><span>♡</span><span>○</span></div>
  </div>;
}

function RouteMap() {
  return <svg viewBox="0 0 320 250" aria-hidden="true"><path d="M0 22h320M0 77h320M0 133h320M0 190h320M44 0v250M116 0v250M195 0v250M268 0v250" stroke="#c4ceab" strokeWidth="11" /><path d="m-10 240 75-74 87 11L270 64l60-12" stroke="#f2f1d9" strokeWidth="34" fill="none" /><path d="M43 191V79h113v55h92V48" stroke="#385a3f" strokeWidth="5" strokeDasharray="8 6" fill="none" strokeLinecap="round" /><circle cx="43" cy="191" r="10" fill="#385a3f" stroke="#f1f4d5" strokeWidth="4" /><circle cx="248" cy="48" r="10" fill="#f58252" stroke="#f1f4d5" strokeWidth="4" /></svg>;
}

function Walk() {
  return <div className="art-walk"><div className="art-walk-grid" /><div className="art-cover-kicker">步程 / PRODUCT DESIGN</div><div className="art-walk-title">城市的温度，<br />用脚步丈量。</div><div className="art-walk-coordinate">31°13′ N<br />121°28′ E</div><div className="art-walk-ring" /><Phone /><Phone second /><div className="art-walk-foot">A LITTLE WALK. A NEW PERSPECTIVE.</div></div>;
}

function Chair() {
  return <svg className="art-chair" viewBox="0 0 240 250" fill="none" aria-hidden="true"><ellipse cx="123" cy="228" rx="83" ry="13" fill="#8c5e451a" /><path d="m78 165-13 62M167 164l20 63M94 167l7 59M157 165l-6 62" stroke="#6f3f29" strokeWidth="8" strokeLinecap="round" /><path d="M65 120c0-26 14-69 54-69s64 35 62 68l-7 42H76z" fill="#c46e45" /><path d="M75 114c0-21 10-54 44-54s54 28 53 52l-5 29H82z" fill="#d78a5f" /><path d="M64 139c0-12 9-20 20-18l41 7 38-6c13-2 22 8 22 20l-3 22c-1 10-10 17-20 17H83c-10 0-19-8-19-18z" fill="#b85f3e" /><path d="M75 137c17-7 27 4 49 5 19 0 35-11 48-5l-4 22H79z" fill="#db956c" /><path d="M60 123c-2-5-11-5-12 3l5 31c1 9 8 15 16 15M184 124c2-5 10-5 12 3l-5 30c-1 9-8 15-16 15" stroke="#6f3f29" strokeWidth="7" strokeLinecap="round" /></svg>;
}

function Home() {
  return <div className="art-home"><div className="art-home-orbit" /><div className="art-home-browser"><div className="art-home-nav"><b>栖居<span>QIJU</span></b><div>客厅　卧室　灵感</div><span>⌕　♡</span></div><div className="art-home-page"><div className="art-home-copy"><span>EVERYDAY, WELL LIVED.</span><h3>把喜欢，<br />放进生活里。</h3><p>属于你的，一方舒适。</p><span className="art-home-cta">发现栖居　↗</span></div><div className="art-home-product"><div className="art-home-halo" /><Chair /><span className="art-home-product-label">弧 · 休闲椅<br /><b>ARC LOUNGE CHAIR</b></span></div></div><div className="art-home-strip"><span>为日常而设计</span><span>自然材质</span><span>长久的陪伴</span></div></div><div className="art-home-caption">A HOME FOR YOUR EVERYDAY.</div><div className="art-home-swatch"><i /><i /><i /></div></div>;
}

function PetPortrait({ dog = false }: { dog?: boolean }) {
  return <svg viewBox="0 0 180 170" fill="none" aria-hidden="true">{dog ? <><path d="M47 45c-24-26-43 0-32 43 4 17 18 21 33 4M133 45c24-26 43 0 32 43-4 17-18 21-33 4" fill="#9d5b3c" /><path d="M38 70c0-33 19-48 52-48s52 15 52 48v41c0 28-23 45-52 45s-52-17-52-45z" fill="#d7a16f" /><path d="M73 27c-16 16-25 44-25 66 12 5 29 0 34-15 4-15 3-37-9-51" fill="#b8794f" /><ellipse cx="90" cy="115" rx="31" ry="26" fill="#f5d7b6" /><path d="M81 104c0-7 18-7 18 0l-9 10z" fill="#49372e" /><path d="M90 114v10m-10-3q10 13 20 0" stroke="#49372e" strokeWidth="3" strokeLinecap="round" /><circle cx="65" cy="84" r="5" fill="#49372e" /><circle cx="116" cy="84" r="5" fill="#49372e" /></> : <><path d="m42 65-9-48q23-1 43 25m28 0q20-26 43-25l-9 48" fill="#d79c66" /><path d="m41 48-3-22 25 19m54 0 25-19-3 22" fill="#f2b3a2" /><path d="M34 84c0-37 24-51 56-51s56 14 56 51v26c0 27-24 45-56 45s-56-18-56-45z" fill="#e9b582" /><path d="m80 35 10 22 10-22M60 41l11 17M120 41l-11 17" stroke="#bd8453" strokeWidth="6" strokeLinecap="round" /><path d="m53 87 15 2m43 0 15-2" stroke="#43372f" strokeWidth="5" strokeLinecap="round" /><path d="m83 106 7 6 7-6" fill="#b87265" /><path d="M90 112v6m-10-1q10 14 20 0m-48-9-26-5m27 17-27 4m102-16 26-5m-27 17 27 4" stroke="#805b44" strokeWidth="2" strokeLinecap="round" /><ellipse cx="62" cy="104" rx="11" ry="5" fill="#e69a80" /><ellipse cx="118" cy="104" rx="11" ry="5" fill="#e69a80" /></>}</svg>;
}

function Pets() {
  return <div className="art-pets"><div className="art-pets-dots" /><div className="art-cover-kicker">MAOLIN / SERVICE DESIGN</div><div className="art-pets-word">毛邻<span>有你在，尾巴就会摇起来。</span></div><span className="art-pets-star art-pets-star-one">✳</span><span className="art-pets-star art-pets-star-two">✦</span><div className="art-pet-ticket"><span>MEET YOUR NEW FRIEND.</span><PetPortrait /><b>今天也被可爱治愈！</b><small>附近好朋友　·　安心宠物服务</small></div><div className="art-pets-phone"><div className="art-pets-phone-head"><b>Hi, 毛邻！</b><span>♡</span></div><p>每一种陪伴<br />都值得认真。</p><div className="art-dog-wrap"><PetPortrait dog /></div><div className="art-pet-services"><span>洗护</span><span>寄养</span><span>遛宠</span></div><b className="art-pets-discover">发现身边的美好　↗</b></div></div>;
}

function Data() {
  return <div className="art-data"><div className="art-data-grid" /><div className="art-data-shell"><aside><b>观<span>·</span></b><i /><i /><i /><i /><i /><div>↙</div></aside><main><nav><b>GUANSHU <span>/ OVERVIEW</span></b><span>⌕　◷　●</span></nav><div className="art-data-heading"><div><small>观数 / WORKSPACE ANALYTICS</small><h3>让每一个决策，有据可循。</h3></div><span>近 30 天　⌄</span></div><div className="art-data-stats">{[['总活跃用户', '128,460', '+12.8%'], ['核心转化率', '24.86%', '+4.2%'], ['业务完成量', '36,892', '+8.6%']].map(([label, value, growth]) => <div key={label}><span>{label}</span><b>{value}</b><small>↗ {growth}</small></div>)}</div><div className="art-data-charts"><section className="art-data-line"><b>用户增长趋势<span>● 新增用户　● 活跃用户</span></b><svg viewBox="0 0 420 130" fill="none" aria-hidden="true"><path d="M0 22h420M0 55h420M0 88h420M0 121h420" stroke="#ffffff0a" /><path d="m0 106 35-12 35 6 35-29 35 6 35-25 35 13 35-29 35 8 35-17 35 7 35-23" stroke="#5fae97" strokeWidth="3" /><path d="m0 124 35-7 35 4 35-16 35 8 35-13 35-2 35-12 35 7 35-22 35 5 35-12" stroke="#7a8eaa" strokeWidth="2" strokeDasharray="5 5" /></svg><div className="art-chart-months"><span>01 AUG</span><span>10 AUG</span><span>20 AUG</span><span>30 AUG</span></div></section><section className="art-data-donut"><b>流量来源</b><div><span>68<small>%</small></span></div><small>自然访问 <i />　其他 <i /></small></section></div><div className="art-data-table"><b>最新业务动态</b><div><span>品牌合作项目</span><span>产品设计</span><em>进行中</em><span>86%</span></div><div><span>客户体验优化</span><span>用户研究</span><em>进行中</em><span>72%</span></div></div></main></div><div className="art-data-caption">CLARITY IN EVERY NUMBER.</div></div>;
}

function Identity() {
  return <div className="art-identity"><div className="art-cover-kicker">ZHEDIAN STUDIO / BRAND IDENTITY</div><div className="art-brand-sheet"><span>独立，自有引力。</span><div className="art-brand-monogram">ZD<span>®</span></div><b>折点<br /><small>ZHEDIAN STUDIO</small></b><div className="art-brand-rule" /><p>MADE WITH INTENT.<br />DESIGNED TO CONNECT.</p></div><div className="art-brand-card"><span>HELLO, I'M</span><strong>折点。</strong><p>一个有想法的设计工作室。</p><b>zhedian.design　↗</b></div><div className="art-brand-seal">INDEPENDENT<br /><b>✳</b><br />BY DESIGN</div><div className="art-brand-swatch"><i /><i /><i /><i /></div><div className="art-identity-foot">LESS NOISE.<br />MORE CHARACTER.</div></div>;
}

function Botanical() {
  return <svg className="art-botanical" viewBox="0 0 240 300" fill="none" aria-hidden="true"><path d="M121 287c-4-80 14-143 3-237M125 167l-47-43M127 209l61-54M124 111l43-41M124 247l-54-40" stroke="#355f49" strokeWidth="3" /><path d="M124 108C88 89 75 57 80 22c34 12 53 47 44 86" fill="#518161" /><path d="M125 155C84 153 49 125 46 89c39 1 70 28 79 66" fill="#6b9974" /><path d="M127 210c43-4 77-30 83-76-43 9-68 34-83 76" fill="#3f755c" /><path d="M124 245c-43 8-80-5-97-41 40-12 79 7 97 41" fill="#8cae82" /><path d="M124 116c40-6 61-32 61-70-35 10-57 34-61 70" fill="#92b48c" /><path d="M125 277c42 5 71-13 84-48-37-6-66 13-84 48" fill="#658c67" /><path d="M124 107 88 38m37 115L56 99m72 108 70-59m-76 97-82-35m85-94 51-58m-49 218 69-39" stroke="#c2d2a5" strokeWidth="1.3" /></svg>;
}

function Earth() {
  return <div className="art-earth"><div className="art-earth-screen"><nav><b>一叶 EARTH.</b><span>我们的行动　　地球故事　　加入我们 ↗</span></nav><div className="art-earth-content"><span>SMALL STEPS. BIG CHANGE.</span><h3>和地球，<br />好好相处。</h3><p>从一片叶子开始，让改变生根。</p><span className="art-earth-cta">种下一个可能　↗</span></div><div className="art-earth-sun" /><Botanical /><div className="art-earth-footer"><span>01 / 03</span><span>每一个微小的行动，都有回响。</span><b>↓</b></div></div><div className="art-earth-tag">GROW A BETTER TOMORROW.</div></div>;
}

const covers: Record<string, () => React.JSX.Element> = { walk: Walk, home: Home, pets: Pets, data: Data, identity: Identity, earth: Earth };

export function ProjectArtwork({ kind, compact = false }: ArtworkProps) {
  const Cover = covers[kind] || Walk;
  return <div className={`art-project art-project-${kind}${compact ? ' art-compact' : ''}`} aria-hidden="true"><Cover /><Arrow className="art-project-arrow" /></div>;
}

export function Avatar({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 280 320" role="img" aria-label="林知夏的演示插画头像"><rect width="280" height="320" rx="12" fill="#b8c9bb" /><circle cx="212" cy="63" r="55" fill="#cfdbca" /><path d="M50 320c0-58 25-102 90-102s90 44 90 102" fill="#e9e8d9" /><path d="M89 174c-10-32-21-88 8-119 20-23 61-25 86-7 37 27 24 88 13 136l-51 53-61-42z" fill="#323a36" /><path d="M116 199v33l24 22 25-22v-34" fill="#d6a78d" /><path d="M103 87c5-28 66-29 76 3l-3 68c-1 27-18 48-37 48s-35-23-37-47z" fill="#e6bba1" /><path d="M99 134c-14-29-4-66 22-78 18-8 41-2 54 11 9 12 13 36 5 55-18-6-36-32-41-46-8 30-24 48-40 58" fill="#323a36" /><path d="M99 139c-14-11-16 14-1 24m80-24c15-11 16 14 1 24" fill="#e6bba1" /><path d="M114 143h13m27 0h13" stroke="#4c4940" strokeWidth="2.5" strokeLinecap="round" /><path d="M120 144v5m41-5v5" stroke="#323a36" strokeWidth="3" strokeLinecap="round" /><path d="m139 151-3 17h7" stroke="#bd8d77" strokeWidth="2" strokeLinecap="round" /><path d="M129 180q11 7 23-1" stroke="#a87668" strokeWidth="2.5" strokeLinecap="round" /><circle cx="104" cy="166" r="3" fill="#d5c69d" /><circle cx="177" cy="166" r="3" fill="#d5c69d" /><path d="m113 232 27 22-25 28-17-47m69-3-27 22 25 28 18-47" stroke="#bfc1b3" strokeWidth="1.5" /><path d="M140 254v66" stroke="#bfc1b3" strokeWidth="1.5" /><circle cx="151" cy="286" r="2" fill="#929b8d" /></svg>;
}
