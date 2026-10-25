// Independently authored, simplified reference demonstrations. See docs/sources.md.
const id = document.body.dataset.case;
const stage = document.querySelector('.stage');
const card = (title, text, art = false) => `<article class="card">${art ? '<div class="art"></div>' : '<div class="symbol">✧</div>'}<h2>${title}</h2><p>${text}</p></article>`;

if (id === 'aceternity-bento-grid') {
  stage.innerHTML = `<div class="grid bento">${['Explore','Create','Connect','Everything in one place','Your next idea'].map((title, i) => card(title, ['A clear space for every idea','Bring the details together','Designed to work as one'][i % 3], true)).join('')}</div>`;
}
if (id === 'aceternity-layout-grid') {
  stage.innerHTML = `<div class="grid gallery">${['Northern Light','Open Horizon','Still Water','Mountain Study'].map((title, i) => `<button class="tile art" style="background:linear-gradient(135deg,${['#38576b,#8fb2ad','#655579,#b79eaf','#31445c,#779cc0','#5b6859,#afb99a'][i]})"><strong>${title}</strong></button>`).join('')}</div>`;
  stage.querySelectorAll('.tile').forEach(tile => tile.addEventListener('click', () => {
    const modal = document.createElement('div'); modal.className = 'modal';
    modal.innerHTML = `<div><h2>${tile.textContent}</h2><p>A closer look at the selected project.</p></div><button aria-label="Close">×</button>`;
    modal.querySelector('button').onclick = () => modal.remove(); stage.append(modal);
  }));
}
if (id === 'aceternity-sidebar') {
  stage.innerHTML = `<div class="dashboard"><aside class="sidebar">${['Overview','Projects','Messages','Settings'].map((name, i) => `<div class="nav"><span>${['◈','□','◇','⚙'][i]}</span><label>${name}</label></div>`).join('')}</aside><div class="dash-main"><h2>Your workspace</h2><div class="placeholder"><div><strong>24</strong>Projects</div><div><strong>08</strong>In progress</div><div><strong>96%</strong>Complete</div></div><div class="art"></div></div></div>`;
}
if (id === 'aceternity-timeline') {
  stage.classList.add('timeline-stage');
  stage.innerHTML = `<div class="timeline-line"><div class="timeline-beam"></div></div>${['2026','2025','2024'].map((year, i) => `<section class="timeline-row"><div class="timeline-year">${year}</div><div><h2>${['A new chapter','Ideas take shape','The first step'][i]}</h2><p>Build, learn, and create. A record of progress over time.</p><div class="art"></div></div></section>`).join('')}`;
  const progress = () => { document.querySelector('.timeline-beam').style.height = `${Math.max(0, Math.min(100, (scrollY + 260) / (document.body.scrollHeight - innerHeight + 260) * 100))}%`; };
  addEventListener('scroll', progress); progress();
}
if (id === 'reactbits-glass-surface') {
  stage.classList.add('glass-scene');
  stage.innerHTML = '<div class="orb"></div><div class="orb second"></div><article class="glass"><span class="pill">GLASS SURFACE</span><h2>A softer perspective.</h2><p>Light, layers, and a surface that lets the background through.</p></article>';
}
if (id === 'reactbits-dot-grid') {
  stage.innerHTML = '<canvas class="canvas"></canvas><div class="center-copy"><h2>Small details.<br>Living space.</h2><p>Move your pointer through the dots</p></div>';
  const canvas = stage.querySelector('canvas'); const ctx = canvas.getContext('2d');
  canvas.width = stage.clientWidth; canvas.height = stage.clientHeight;
  let pointer = { x: -1000, y: -1000 }; let shock = null;
  stage.onpointermove = event => { const r = stage.getBoundingClientRect(); pointer = { x: event.clientX - r.left, y: event.clientY - r.top }; };
  stage.onpointerleave = () => { pointer = { x: -1000, y: -1000 }; };
  stage.onclick = () => { shock = { ...pointer, start: performance.now() }; };
  const points = [];
  for (let y = 18; y < canvas.height; y += 26) for (let x = 18; x < canvas.width; x += 26) points.push({ x, y, ox: x, oy: y });
  function draw(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of points) {
      const dx = p.ox - pointer.x, dy = p.oy - pointer.y, d = Math.hypot(dx, dy), energy = Math.max(0, 1 - d / 130);
      let push = energy * 18;
      if (shock) { const ring = (time - shock.start) * .3; const sd = Math.hypot(p.ox - shock.x, p.oy - shock.y); push += Math.max(0, 1 - Math.abs(sd - ring) / 35) * 16; }
      p.x += (p.ox + dx / (d || 1) * push - p.x) * .12; p.y += (p.oy + dy / (d || 1) * push - p.y) * .12;
      ctx.beginPath(); ctx.arc(p.x, p.y, 2 + energy * 2.2, 0, Math.PI * 2); ctx.fillStyle = `rgba(${90 + energy * 90},${107 + energy * 90},${148 + energy * 100},${.45 + energy * .55})`; ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}
if (id === 'aceternity-background-gradient') {
  stage.innerHTML = `<div class="gradient-frame">${card('Color in motion','A quiet glow around your next idea.',true)}</div>`;
}
if (id === 'aceternity-background-boxes') {
  stage.innerHTML = '<div class="boxes">' + Array.from({ length: 391 }, () => '<div class="box"></div>').join('') + '</div><div class="center-copy"><h2>A grid that responds.</h2><p>Explore the surface with your pointer</p></div>';
}
if (id === 'reactbits-spotlight-card') {
  stage.innerHTML = '<article class="card spotlight"><div class="symbol">◈</div><h2>Bring it into focus.</h2><p>A little light follows your curiosity.<br>Move across this card to see it.</p></article>';
  const el = stage.querySelector('.spotlight');
  el.onpointermove = event => { const r = el.getBoundingClientRect(); el.style.setProperty('--x', `${event.clientX - r.left}px`); el.style.setProperty('--y', `${event.clientY - r.top}px`); };
}
if (id === 'reactbits-tilted-card') {
  stage.innerHTML = '<div class="tilt-scene"><article class="card tilt"><div class="tilt-art"></div><label>OBJECT / 001</label><strong>A different angle.</strong></article></div>';
  const scene = stage.querySelector('.tilt-scene'), el = scene.querySelector('.tilt');
  scene.onpointermove = event => { const r = scene.getBoundingClientRect(); const x = (event.clientX - r.left) / r.width - .5, y = (event.clientY - r.top) / r.height - .5; el.style.transform = `rotateX(${-y * 26}deg) rotateY(${x * 26}deg) scale(1.04)`; };
  scene.onpointerleave = () => { el.style.transform = 'rotateX(0) rotateY(0) scale(1)'; };
}
if (id === 'aceternity-glowing-effect') {
  stage.innerHTML = `<div class="glow-set">${['A bright idea','Made to connect'].map(title => `<div class="glow-card">${card(title,'A glow traces the edge as you move.')}</div>`).join('')}</div>`;
  stage.onpointermove = event => stage.querySelectorAll('.glow-card').forEach(el => {
    const r = el.getBoundingClientRect(), dx = event.clientX - r.left - r.width / 2, dy = event.clientY - r.top - r.height / 2;
    el.style.setProperty('--angle', `${Math.atan2(dy, dx) * 180 / Math.PI + 55}deg`);
    const near = event.clientX > r.left - 25 && event.clientX < r.right + 25 && event.clientY > r.top - 25 && event.clientY < r.bottom + 25;
    el.style.setProperty('--glow', near && Math.hypot(dx, dy) > 75 ? '1' : '0');
  });
  stage.onpointerleave = () => stage.querySelectorAll('.glow-card').forEach(el => el.style.setProperty('--glow', '0'));
}
if (id === 'aceternity-text-reveal-card') {
  stage.innerHTML = '<article class="card reveal-card"><h2>There is more beneath the surface.</h2><p>Move across the card to reveal the other thought.</p><div class="reveal-text"><span class="reveal-base">See the possibility.</span><span class="reveal-front">Make it a reality.</span><div class="reveal-line"></div></div></article>';
  const el = stage.querySelector('.reveal-card');
  el.onpointermove = event => { const r = el.getBoundingClientRect(); el.style.setProperty('--reveal', `${Math.max(0,Math.min(100,(event.clientX-r.left-38)/(r.width-76)*100))}%`); };
  el.onpointerleave = () => el.style.setProperty('--reveal','0%');
}

const cursor = document.createElement('div'); cursor.className = 'cursor'; document.body.append(cursor);
addEventListener('pointermove', event => { cursor.style.left = `${event.clientX}px`; cursor.style.top = `${event.clientY}px`; cursor.style.opacity = '1'; });
addEventListener('pointerdown', () => cursor.classList.add('click'));
addEventListener('pointerup', () => cursor.classList.remove('click'));
