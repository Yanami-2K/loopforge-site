(function () {
'use strict';
const D = window.LF_RM, qs = new URLSearchParams(location.search);
let L = qs.get('lang') || localStorage.getItem('lf-lang') || ((navigator.language || '').startsWith('zh') ? 'zh' : 'en');
if (!D.ui[L]) L = 'zh';
const RM = matchMedia('(prefers-reduced-motion: reduce)'), STILL = qs.has('still');
if (STILL) document.body.classList.add('still');
const calm = () => RM.matches || STILL;
const Z = (a, b) => (L === 'zh' ? a : b);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const withLang = p => p + (L === 'en' ? '?lang=en' : '');

/* ---------- marks and icons, same artwork as the home page ---------- */
let lgN = 0;
const LOGO = glint => { const g = 'rlg' + (++lgN), d = 'M53 72C53 59 63 52.5 73 52.5S93 59 93 72 83 91.5 73 91.5 53 85 53 72V40C53 27 44.5 20.5 36 20.5S19 27 19 40';
  return `<svg viewBox="12 12 88 88" fill="none" aria-hidden="true"><defs><linearGradient id="${g}" x1="19" y1="20" x2="93" y2="93" gradientUnits="userSpaceOnUse"><stop stop-color="#008DCC"/><stop offset=".48" stop-color="#526CE8"/><stop offset="1" stop-color="#8A4ED9"/></linearGradient></defs><path class="lgp" pathLength="100" d="${d}" stroke="url(#${g})" stroke-width="7.6" stroke-linecap="round" stroke-linejoin="round"/>${glint ? `<path class="lgg" pathLength="100" d="${d}" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/>` : ''}</svg>`; };
const GHM = '<svg class="mk" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>';
const STAR = '<svg viewBox="0 0 800 800" fill="currentColor" aria-hidden="true"><path d="M305.105 180.279C347.327 104.538 368.437 66.6667 400 66.6667C431.563 66.6667 452.673 104.537 494.893 180.279L505.817 199.874C517.817 221.398 523.813 232.16 533.17 239.26C542.523 246.361 554.17 248.997 577.47 254.268L598.683 259.068C680.67 277.619 721.667 286.894 731.42 318.258C741.173 349.62 713.227 382.303 657.33 447.663L642.87 464.573C626.987 483.147 619.043 492.433 615.47 503.923C611.9 515.413 613.1 527.803 615.5 552.587L617.687 575.147C626.137 662.353 630.363 705.957 604.83 725.34C579.293 744.723 540.91 727.05 464.143 691.707L444.283 682.56C422.47 672.517 411.563 667.493 400 667.493C388.437 667.493 377.53 672.517 355.717 682.56L335.857 691.707C259.089 727.05 220.706 744.723 195.172 725.34C169.637 705.957 173.863 662.353 182.313 575.147L184.499 552.587C186.901 527.803 188.102 515.413 184.529 503.923C180.956 492.433 173.014 483.147 157.131 464.573L142.67 447.663C86.7749 382.303 58.8272 349.62 68.5806 318.258C78.3339 286.894 119.329 277.619 201.318 259.068L222.53 254.268C245.828 248.997 257.478 246.361 266.831 239.26C276.185 232.16 282.184 221.398 294.182 199.874L305.105 180.279Z"/></svg>';
const SPK = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5L12 0z"/></svg>';
const IC = {
  arrow: 'M5 12h14M13 6l6 6-6 6', out: 'M7 17 17 7M8 7h9v9', x: 'M6 6l12 12M18 6 6 18', map: 'M9 4 3 6.5v13L9 17l6 3 6-2.5v-13L15 7 9 4zM9 4v13M15 7v13',
  flow: 'M6 3v12M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9a9 9 0 0 1-9 9',
  loop: 'M17 2l3 3-3 3M4 11V9a4 4 0 0 1 4-4h12M7 22l-3-3 3-3M20 13v2a4 4 0 0 1-4 4H4',
  plug: 'M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4',
  cloud: 'M7 18a4.5 4.5 0 0 1-.5-9 6 6 0 0 1 11.6 1.5A3.8 3.8 0 0 1 17.5 18z',
  plus: 'M12 5v14M5 12h14',
  hand: 'M7 11V6.5a1.5 1.5 0 0 1 3 0V11M10 10V4.5a1.5 1.5 0 0 1 3 0V10M13 10.5V6a1.5 1.5 0 0 1 3 0v5M16 9.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-.5a6 6 0 0 1-4.9-2.5L4 15.5a1.6 1.6 0 0 1 2.4-2L7 14',
};
const ic = (k, c = '') => `<svg class="ic ${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${IC[k]}"/></svg>`;
const AREA_IC = { delivery: 'flow', assets: 'loop', access: 'plug', platform: 'cloud' };
const ORDER = ['planned', 'progress', 'done'];
const GLYPH = {
  planned: '<svg class="gl gl-planned" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7.2"/></svg>',
  progress: '<svg class="gl gl-progress" viewBox="0 0 20 20" aria-hidden="true"><circle class="t" cx="10" cy="10" r="7.2"/><circle class="a" cx="10" cy="10" r="7.2" pathLength="100"/><circle class="c" cx="10" cy="10" r="2.6"/></svg>',
  done: '<svg class="gl gl-done" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8.4"/><path pathLength="100" d="m6.4 10.3 2.4 2.4 4.8-5"/></svg>',
};

/* split a heading into masked lines, highlighting the em phrase */
const head = (h, em, tag, cls = '') => `<${tag} class="h ${cls}">${h.split('<br>').map((x, i) =>
  `<span class="hl"><span class="rv up" data-d="${80 + i * 90}">${em && x.includes(em) ? x.replace(em, `<em>${em}</em>`) : x}</span></span>`).join(L === 'en' ? ' ' : '')}</${tag}>`;


function cardHTML(it, i) {
  const t = it[L], u = D.ui[L], a = D.areas[it.a];
  const refs = it.refs || [];
  const num = refs.filter(r => r.label.includes('#'));
  const badge = num.length ? `<span class="rm-ref">${esc(num[0].label.replace('PR ', ''))}${num.length > 1 ? `<i>+${num.length - 1}</i>` : ''}</span>` : '';
  const pill = it.s === 'progress' ? `<span class="rm-pill doing"><i></i>${u.status.progress[0]}</span>`
    : it.help ? `<span class="rm-pill help">${ic('hand')}${u.help}</span>` : '';
  const people = it.people ? `<span class="rm-people">${it.people.map(p => `<b title="${esc(p)}">${esc(p[0].toUpperCase())}</b>`).join('')}</span>` : '';
  return `<button type="button" class="rm-card" data-id="${i}">
    <span class="rm-ct"><span class="rm-tag">${ic(AREA_IC[it.a])}${a[L]}</span>${badge}</span>
    <h3>${esc(t.title)}</h3>
    <p>${esc(t.desc)}</p>
    <span class="rm-cf">${pill}${people}<span class="sp"></span><span class="rm-go">${ic('arrow')}</span></span>
  </button>`;
}

function build() {
  const u = D.ui[L], GH = D.GH;
  document.documentElement.lang = L === 'zh' ? 'zh-CN' : 'en';
  document.title = u.title;
  const md = document.querySelector('meta[name=description]'); if (md) md.content = u.desc;
  const arrow = `<span class="ar">${ic('arrow')}</span>`;
  const ids = ['why', 'story', 'video', 'deploy'];

  document.getElementById('app').innerHTML = `
  <header class="nav"><i class="nprog"></i><div class="nbar"><a class="brand" href="${withLang('../')}">${LOGO(1)}<span>LoopForge</span></a><span class="sp"></span>
   <div class="links">${u.nav.map((n, i) => `<a href="${withLang('../')}#${ids[i]}" data-sec>${n}</a>`).join('')}<a href="${withLang('../docs/')}">${u.docs}</a></div>
   <div class="lang"><button data-l="zh" class="${L === 'zh' ? 'on' : ''}" aria-label="${Z('中文', 'Chinese')}">${Z('中', 'ZH')}</button><button data-l="en" class="${L === 'en' ? 'on' : ''}">EN</button></div>
   <a class="ghs" href="${GH}" target="_blank" rel="noopener" aria-label="GitHub"><span class="gsw"><span class="g1">${GHM}</span><span class="g2">${STAR}</span><i class="sk s1">${SPK}</i><i class="sk s2">${SPK}</i></span><span class="gtx">GitHub</span><span class="gct" hidden></span></a><a class="btn-k sm" href="${withLang('../demo/')}">${u.try}${arrow}</a></div></header>
  <main>
   <section class="rm-hero">
    <div class="rm-hx">
     <div><span class="kick rv" data-d="0">${ic('map')}${u.kick}</span>${head(u.h, u.em, 'h1')}</div>
     <aside class="rm-ver rv" data-d="300">
      <span class="rm-vk">${u.version}</span>
      <b class="rm-vn">v0.4.0</b>
      <span class="rm-vm"><i class="led"></i>${u.released}</span>
      <span class="rm-vm">${u.updated}</span>
      <a class="btn-t" href="${GH}/releases" target="_blank" rel="noopener">${u.notes}${arrow}</a>
      <a class="btn-t" href="${GH}/blob/main/${u.guideUrl}" target="_blank" rel="noopener">${u.join}${arrow}</a>
     </aside>
    </div>
    <p class="sub rv" data-d="220">${u.sub}</p>
   </section>

   <section class="rm-main">
    <div class="rm-board">
     ${ORDER.map(s => `<section class="rm-col" data-s="${s}">
       <header class="rm-ch">${GLYPH[s]}<h2>${u.status[s][0]}</h2><b class="rm-n">0</b><small>${u.status[s][1]}</small></header>
       <div class="rm-list">${D.items.map((it, i) => it.s === s ? cardHTML(it, i) : '').join('')}</div>
      </section>`).join('')}
    </div>
   </section>

   <section class="fin rm-cta"><span class="fl rv pop" data-d="0">${LOGO()}</span>${head(u.cta.h, u.cta.em, 'h2')}
    <p class="sub rv" data-d="200">${u.cta.sub}</p>
    <div class="cta rv" data-d="300"><a class="btn-k" href="${GH}/issues/new/choose" target="_blank" rel="noopener">${ic('plus')}${u.cta.ask}${arrow}</a><a class="btn-t" href="${GH}/issues" target="_blank" rel="noopener">${GHM}${u.cta.issues}${arrow}</a></div>
   </section>
  </main>
  <footer class="ft"><a class="brand" href="${withLang('../')}">${LOGO(1)}<span>LoopForge</span></a><span>${u.foot} · <a href="${GH}" target="_blank" rel="noopener">github.com/Tencent/LoopForge</a></span></footer>
  <div class="rm-dlg" id="rmDlg" hidden><div class="rm-scrim"></div><div class="rm-panel" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="rmDlgT"></div></div>`;

  bind();
}

/* ---------- motion ---------- */
function countTo(el, to, dur = 900) {
  const from = +el.textContent || 0;
  if (calm() || from === to) { el.textContent = to; return; }
  const t0 = performance.now(), ease = x => 1 - Math.pow(1 - x, 3);
  cancelAnimationFrame(el._raf);
  const step = now => { const k = Math.min(1, (now - t0) / dur); el.textContent = Math.round(from + (to - from) * ease(k)); if (k < 1) el._raf = requestAnimationFrame(step); };
  el._raf = requestAnimationFrame(step);
}

function reveal(root) {
  root.querySelectorAll('.rv[data-d]').forEach(e => { if (calm()) e.classList.add('on'); else setTimeout(() => e.classList.add('on'), +e.dataset.d); });
}

function enter(list, base = 0) {
  list.forEach((c, i) => {
    if (calm()) return;
    c.style.setProperty('--d', base + i * 55 + 'ms');
    c.classList.add('in');
    c.addEventListener('animationend', function done(e) { if (e.target !== c) return; c.classList.remove('in'); c.removeEventListener('animationend', done); });
  });
}

function updateCounts() {
  document.querySelectorAll('.rm-col').forEach(col => {
    countTo(col.querySelector('.rm-n'), col.querySelectorAll('.rm-card').length, 500);
  });
}

/* ---------- detail dialog ---------- */
let lastFocus = null;
function openDlg(it) {
  const u = D.ui[L], t = it[L], a = D.areas[it.a];
  const dlg = document.getElementById('rmDlg'), panel = dlg.querySelector('.rm-panel');
  const refs = (it.refs || []).map(r => `<a class="rm-link" href="${r.url}" target="_blank" rel="noopener">${esc(r.label)}${ic('out')}</a>`).join('');
  const rows = [
    [u.area, `<span class="rm-tag">${ic(AREA_IC[it.a])}${a[L]}</span>`],
    it.s === 'progress' ? [u.state, `<span class="rm-pill doing"><i></i>${u.status.progress[0]}</span>`] : null,
    it.people ? [u.owner, `<span class="rm-owners">${it.people.map(p => `<a href="https://github.com/${encodeURIComponent(p)}" target="_blank" rel="noopener"><b>${esc(p[0].toUpperCase())}</b>${esc(p)}</a>`).join('')}</span>`] : null,
    refs ? [u.links, refs] : null,
    it.help ? [u.help, `<a class="rm-link help" href="${D.GH}/blob/main/${u.guideUrl}" target="_blank" rel="noopener">${ic('hand')}${u.join}</a>`] : null,
  ].filter(Boolean);
  panel.dataset.s = it.s;
  panel.innerHTML = `
    <header class="rm-dh"><span class="rm-ds">${GLYPH[it.s]}${u.status[it.s][0]}</span><button type="button" class="rm-x" aria-label="${u.close}">${ic('x')}</button></header>
    <h2 id="rmDlgT">${esc(t.title)}</h2>
    <p class="rm-dd">${esc(t.desc)}</p>
    ${t.details ? `<div class="rm-dl"><span class="kick">${u.detail}</span><ul>${t.details.map((d, i) => `<li style="--i:${i}">${esc(d)}</li>`).join('')}</ul></div>` : ''}
    <dl class="rm-meta">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>`;
  lastFocus = document.activeElement;
  dlg.hidden = false;
  document.documentElement.classList.add('rm-lock');
  requestAnimationFrame(() => { dlg.classList.add('open'); panel.focus({ preventScroll: true }); });
}
function closeDlg() {
  const dlg = document.getElementById('rmDlg');
  if (!dlg || dlg.hidden) return;
  dlg.classList.remove('open');
  document.documentElement.classList.remove('rm-lock');
  setTimeout(() => { if (!dlg.classList.contains('open')) dlg.hidden = true; }, calm() ? 0 : 260);
  if (lastFocus) lastFocus.focus({ preventScroll: true });
}

/* ---------- wiring ---------- */
function bind() {
  const app = document.getElementById('app');
  app.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.l === L) return;
    L = b.dataset.l; localStorage.setItem('lf-lang', L);
    const url = new URL(location); url.searchParams.set('lang', L); history.replaceState(null, '', url);
    boot(true);
  }));
  app.querySelector('.rm-board').addEventListener('click', e => { const c = e.target.closest('.rm-card'); if (c) openDlg(D.items[+c.dataset.id]); });
  app.querySelector('.rm-board').addEventListener('pointermove', e => {
    const c = e.target.closest('.rm-card'); if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', e.clientX - r.left + 'px'); c.style.setProperty('--my', e.clientY - r.top + 'px');
  }, { passive: true });
  const dlg = document.getElementById('rmDlg');
  dlg.addEventListener('click', e => { if (e.target.classList.contains('rm-scrim') || e.target.closest('.rm-x')) closeDlg(); });
}

function stars() {
  const show = n => document.querySelectorAll('.ghs .gct').forEach(e => { e.textContent = n >= 1e4 ? (n / 1e3).toFixed(1) + 'k' : n.toLocaleString('en-US'); e.hidden = false; });
  try { const c = JSON.parse(localStorage.getItem('lf-stars') || 'null'); if (c) { show(c.n); if (Date.now() - c.t < 36e5) return; } } catch (e) { /* ignore */ }
  fetch('https://api.github.com/repos/Tencent/LoopForge').then(r => (r.ok ? r.json() : null)).then(j => {
    if (j && typeof j.stargazers_count === 'number') { localStorage.setItem('lf-stars', JSON.stringify({ n: j.stargazers_count, t: Date.now() })); show(j.stargazers_count); }
  }).catch(() => {});
}

function onScroll() {
  const nav = document.querySelector('.nav'); if (!nav) return;
  nav.classList.toggle('sc', scrollY > 8);
  const pg = nav.querySelector('.nprog'), mx = document.documentElement.scrollHeight - innerHeight;
  pg.style.transform = `scaleX(${mx > 0 ? (scrollY / mx).toFixed(4) : 0})`;
}

let io;
function boot(relang) {
  const keep = scrollY;
  build();
  reveal(document.querySelector('.rm-hero'));

  if (io) io.disconnect();
  io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    if (e.target.classList.contains('rm-col')) {
      const col = e.target, idx = ORDER.indexOf(col.dataset.s);
      col.classList.add('on');
      enter([...col.querySelectorAll('.rm-card')], relang ? 0 : 120 + idx * 110);
      updateCounts();
    } else reveal(e.target);
  }), { rootMargin: '0px 0px -12% 0px' });
  document.querySelectorAll('.rm-col, .rm-cta').forEach(el => io.observe(el));
  if (calm()) { document.querySelectorAll('.rm-col').forEach(c => c.classList.add('on')); updateCounts(); }
  onScroll(); stars();
  if (relang) scrollTo(0, keep);
}

addEventListener('scroll', onScroll, { passive: true });
addEventListener('keydown', e => { if (e.key === 'Escape') closeDlg(); });
boot();
})();
