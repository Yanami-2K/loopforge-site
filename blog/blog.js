(function () {
'use strict';
const qs = new URLSearchParams(location.search), body = document.body;
let L = qs.get('lang') || localStorage.getItem('lf-lang') || ((navigator.language || '').startsWith('zh') ? 'zh' : 'en');
if (L !== 'en') L = 'zh';
const STILL = qs.has('still'), calm = () => STILL || matchMedia('(prefers-reduced-motion: reduce)').matches;
if (STILL) body.classList.add('still');
const ROOT = body.dataset.root || '../', BLOG = ROOT + 'blog/', POST = body.dataset.slug || '';
const GH = 'https://github.com/Tencent/LoopForge', FEED = 'https://loopforge.cn/blog/feed.xml';
const Z = (a, b) => (L === 'zh' ? a : b);
const q = () => (L === 'en' ? '?lang=en' : '');
const T = (p, k) => (L === 'en' && p[k + '_en']) || p[k];
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const U = {
  zh: { title: 'LoopForge · 博客', desc: 'LoopForge 博客：上手教程、团队落地实践与社区案例。', try: '观看演示', kick: '博客',
    h: '来自一线的<br>LoopForge 实践笔记。', em: 'LoopForge 实践笔记',
    sub: '上手教程、团队落地经验，以及我们用 LoopForge 迭代 LoopForge 的真实记录。之后也会收录来自社区开发者的案例。',
    rss: 'RSS 订阅', rssSub: '在阅读器里订阅，新文章发布时第一时间收到。', copy: '复制地址', copyCode: '复制', copied: '已复制', open: '打开订阅源',
    read: '阅读全文', all: '全部文章', min: n => `${n} 分钟阅读`, count: n => `共 ${n} 篇`,
    tags: { tutorial: '上手教程', practice: '团队实践', community: '社区案例' },
    toc: '本文目录', prev: '上一篇', next: '下一篇', back: '返回博客', top: '回到顶部', zhOnly: '',
    endH: '想在自己的团队试试？', endSub: '一条命令自托管部署，跟着使用文档跑通第一条 SOP。', docs: '阅读使用文档', star: '在 GitHub 上关注',
    foot: 'LoopForge 由腾讯开源，遵循 MIT 协议', close: '关闭' },
  en: { title: 'LoopForge · Blog', desc: 'The LoopForge blog: tutorials, team practices and community stories.', try: 'Watch demo', kick: 'Blog',
    h: 'Field notes on<br>running LoopForge.', em: 'running LoopForge',
    sub: 'Hands-on tutorials, lessons from rolling it out to teams, and how we use LoopForge to build LoopForge. Stories from community developers are coming next.',
    rss: 'RSS feed', rssSub: 'Subscribe in your reader to get new posts as they land.', copy: 'Copy URL', copyCode: 'Copy', copied: 'Copied', open: 'Open feed',
    read: 'Read the post', all: 'All posts', min: n => `${n} min read`, count: n => `${n} posts`,
    tags: { tutorial: 'Tutorial', practice: 'In practice', community: 'Community' },
    toc: 'On this page', prev: 'Previous', next: 'Next', back: 'Back to blog', top: 'Back to top', zhOnly: 'Written in Chinese',
    endH: 'Want to try it with your team?', endSub: 'Self-host it with one command, then follow the docs to run your first SOP.', docs: 'Read the docs', star: 'Follow on GitHub',
    foot: 'LoopForge is open-sourced by Tencent under the MIT License', close: 'Close' },
};

/* ---------- marks and icons, same artwork as the home page ---------- */
let lgN = 0;
const LOGO = glint => { const g = 'blg' + (++lgN), d = 'M53 72C53 59 63 52.5 73 52.5S93 59 93 72 83 91.5 73 91.5 53 85 53 72V40C53 27 44.5 20.5 36 20.5S19 27 19 40';
  return `<svg viewBox="12 12 88 88" fill="none" aria-hidden="true"><defs><linearGradient id="${g}" x1="19" y1="20" x2="93" y2="93" gradientUnits="userSpaceOnUse"><stop stop-color="#008DCC"/><stop offset=".48" stop-color="#526CE8"/><stop offset="1" stop-color="#8A4ED9"/></linearGradient></defs><path class="lgp" pathLength="100" d="${d}" stroke="url(#${g})" stroke-width="7.6" stroke-linecap="round" stroke-linejoin="round"/>${glint ? `<path class="lgg" pathLength="100" d="${d}" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/>` : ''}</svg>`; };
const GHM = '<svg class="mk" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>';
const STAR = '<svg viewBox="0 0 800 800" fill="currentColor" aria-hidden="true"><path d="M305.105 180.279C347.327 104.538 368.437 66.6667 400 66.6667C431.563 66.6667 452.673 104.537 494.893 180.279L505.817 199.874C517.817 221.398 523.813 232.16 533.17 239.26C542.523 246.361 554.17 248.997 577.47 254.268L598.683 259.068C680.67 277.619 721.667 286.894 731.42 318.258C741.173 349.62 713.227 382.303 657.33 447.663L642.87 464.573C626.987 483.147 619.043 492.433 615.47 503.923C611.9 515.413 613.1 527.803 615.5 552.587L617.687 575.147C626.137 662.353 630.363 705.957 604.83 725.34C579.293 744.723 540.91 727.05 464.143 691.707L444.283 682.56C422.47 672.517 411.563 667.493 400 667.493C388.437 667.493 377.53 672.517 355.717 682.56L335.857 691.707C259.089 727.05 220.706 744.723 195.172 725.34C169.637 705.957 173.863 662.353 182.313 575.147L184.499 552.587C186.901 527.803 188.102 515.413 184.529 503.923C180.956 492.433 173.014 483.147 157.131 464.573L142.67 447.663C86.7749 382.303 58.8272 349.62 68.5806 318.258C78.3339 286.894 119.329 277.619 201.318 259.068L222.53 254.268C245.828 248.997 257.478 246.361 266.831 239.26C276.185 232.16 282.184 221.398 294.182 199.874L305.105 180.279Z"/></svg>';
const SPK = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5L12 0z"/></svg>';
const IC = {
  arrow: 'M5 12h14M13 6l6 6-6 6', back: 'M19 12H5M11 6l-6 6 6 6', up: 'M12 19V5M6 11l6-6 6 6', x: 'M6 6l12 12M18 6 6 18',
  pen: 'M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16zM13.5 6.5l4 4',
  rss: 'M5 11a8 8 0 0 1 8 8M5 5a14 14 0 0 1 14 14M6 18.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z',
  copy: 'M9 9h10v10H9zM5 15V5h10', check: 'm5 12 4.5 4.5L19 7', out: 'M7 17 17 7M8 7h9v9',
  clock: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
  book: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5M8 7h7',
};
const ic = (k, c = '') => `<svg class="ic ${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${IC[k]}"/></svg>`;
const arrow = () => `<span class="ar">${ic('arrow')}</span>`;
const head = (h, em, tag, cls = '') => `<${tag} class="h ${cls}">${h.split('<br>').map((x, i) =>
  `<span class="hl"><span class="rv up" data-d="${80 + i * 90}">${em && x.includes(em) ? x.replace(em, `<em>${em}</em>`) : x}</span></span>`).join(L === 'en' ? ' ' : '')}</${tag}>`;
const fmtDate = d => { const [y, m, dd] = d.split('-').map(Number); return L === 'zh' ? `${y} 年 ${m} 月 ${dd} 日` : new Date(Date.UTC(y, m - 1, dd)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }); };

/* ---------- shared chrome ---------- */
function navHTML() {
  const u = U[L];
  return `<header class="nav"><i class="nprog"></i><div class="nbar"><a class="brand" href="${ROOT}${q()}">${LOGO(1)}<span>LoopForge</span></a><span class="sp"></span>
   ${LF_NAV.links({ L, root: ROOT, page: 'blog' })}
   <div class="lang"><button data-l="zh" class="${L === 'zh' ? 'on' : ''}" aria-label="${Z('中文', 'Chinese')}">${Z('中', 'ZH')}</button><button data-l="en" class="${L === 'en' ? 'on' : ''}">EN</button></div>
   <a class="ghs" href="${GH}" target="_blank" rel="noopener" aria-label="GitHub"><span class="gsw"><span class="g1">${GHM}</span><span class="g2">${STAR}</span><i class="sk s1">${SPK}</i><i class="sk s2">${SPK}</i></span><span class="gtx">GitHub</span><span class="gct" hidden></span></a><a class="btn-k sm" href="${ROOT}demo/${q()}">${u.try}${arrow()}</a>${LF_NAV.menu(L)}</div></header>`;
}
const footHTML = () => `<footer class="ft"><a class="brand" href="${ROOT}${q()}">${LOGO(1)}<span>LoopForge</span></a><span>${U[L].foot} · <a href="${GH}" target="_blank" rel="noopener">github.com/Tencent/LoopForge</a> · <a href="${FEED}">RSS</a></span></footer>`;

function chrome() {
  const nav = document.getElementById('nav'), foot = document.getElementById('foot');
  nav.innerHTML = navHTML(); foot.innerHTML = footHTML();
  LF_NAV.bind(nav.querySelector('.nav'));
  nav.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.l === L) return;
    L = b.dataset.l; localStorage.setItem('lf-lang', L);
    const url = new URL(location); url.searchParams.set('lang', L); history.replaceState(null, '', url);
    boot(true);
  }));
}

function stars() {
  const show = n => document.querySelectorAll('.ghs .gct').forEach(e => { e.textContent = n >= 1e4 ? (n / 1e3).toFixed(1) + 'k' : n.toLocaleString('en-US'); e.hidden = false; });
  try { const c = JSON.parse(localStorage.getItem('lf-stars') || 'null'); if (c) { show(c.n); if (Date.now() - c.t < 36e5) return; } } catch (e) { /* ignore */ }
  fetch('https://api.github.com/repos/Tencent/LoopForge').then(r => (r.ok ? r.json() : null)).then(j => {
    if (j && typeof j.stargazers_count === 'number') { localStorage.setItem('lf-stars', JSON.stringify({ n: j.stargazers_count, t: Date.now() })); show(j.stargazers_count); }
  }).catch(() => {});
}

function reveal(root) {
  root.querySelectorAll('.rv[data-d]').forEach(e => { if (calm()) e.classList.add('on'); else setTimeout(() => e.classList.add('on'), +e.dataset.d); });
}

function copyText(btn, text, label) {
  const done = () => { btn.classList.add('ok'); btn.querySelector('span').textContent = U[L].copied; setTimeout(() => { btn.classList.remove('ok'); btn.querySelector('span').textContent = label; }, 1400); };
  if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, () => {}); else done();
}

let posts = [];
const loadPosts = () => (posts.length ? Promise.resolve(posts) : fetch(BLOG + 'posts.json?v=2').then(r => r.json()).then(p => (posts = p.sort((a, b) => b.date.localeCompare(a.date)))));

/* ---------- list page ---------- */
const cover = p => `<span class="bc-cv"><img src="${BLOG}${p.cover}" alt="" loading="lazy"></span>`;
const meta = p => `<span class="bc-meta"><span class="bc-tag" data-tag="${p.tag}">${U[L].tags[p.tag] || p.tag}</span><time datetime="${p.date}">${fmtDate(p.date)}</time><span class="bc-dot"></span><span>${U[L].min(p.minutes)}</span></span>`;

function renderList() {
  const u = U[L], app = document.getElementById('blog');
  document.title = u.title; document.documentElement.lang = L === 'zh' ? 'zh-CN' : 'en';
  const md = document.querySelector('meta[name=description]'); if (md) md.content = u.desc;
  app.innerHTML = `
  <section class="bl-hero">
   <div class="bl-hx">
    <div><span class="kick rv" data-d="0">${ic('pen')}${u.kick}</span>${head(u.h, u.em, 'h1')}<p class="sub rv" data-d="220">${u.sub}</p></div>
    <aside class="bl-rss rv" data-d="300">
     <span class="bl-rk"><span class="bl-ri">${ic('rss')}</span>${u.rss}</span>
     <p>${u.rssSub}</p>
     <code class="bl-url">${FEED.replace('https://', '')}</code>
     <span class="bl-ra"><button type="button" class="bl-copy" data-copy>${ic('copy')}${ic('check', 'ok')}<span>${u.copy}</span></button><a class="btn-t" href="${FEED}" target="_blank" rel="noopener">${u.open}${arrow()}</a></span>
    </aside>
   </div>
  </section>
  <section class="bl-main">
   <div class="bl-bar rv" data-d="380"><span>${u.all}</span><b>${u.count(posts.length)}</b></div>
   <ul class="bl-list">${posts.map((p, i) => `<li><a class="bl-row rv" data-d="${440 + i * 80}" href="${BLOG}${p.slug}/${q()}">
     ${cover(p)}
     <span class="bl-tx">${meta(p)}<h2><span>${esc(T(p, 'title'))}</span></h2><p>${esc(T(p, 'summary'))}</p><span class="bl-go">${u.read}${arrow()}</span></span>
    </a></li>`).join('')}</ul>
  </section>`;
  const cp = app.querySelector('[data-copy]');
  cp.addEventListener('click', () => copyText(cp, FEED, u.copy));
  reveal(app);
}

/* ---------- post page ---------- */
let tocLinks = [], heads = [];
function setupPost(relang) {
  const u = U[L], art = document.querySelector('.bp-body');
  document.querySelectorAll('[data-t]').forEach(e => { e.textContent = u[e.dataset.t]; });
  document.querySelectorAll('[data-tag-label]').forEach(e => { e.textContent = u.tags[e.dataset.tagLabel]; });
  document.querySelectorAll('[data-min]').forEach(e => { e.textContent = u.min(+e.dataset.min); });
  document.querySelectorAll('time[datetime]').forEach(e => { e.textContent = fmtDate(e.getAttribute('datetime')); });
  document.querySelectorAll('[data-href]').forEach(e => { e.href = ROOT + e.dataset.href + q(); });
  const zo = document.querySelector('.bp-zh'); if (zo) zo.hidden = L === 'zh';
  document.querySelectorAll('.bp-chips').forEach(e => { e.hidden = L === 'en'; });
  const by = document.querySelector('.bp-by'); if (by) { const t = [...by.childNodes].find(n => n.nodeType === 3 && n.nodeValue.trim()); if (t) t.nodeValue = L === 'en' ? 'LoopForge Team' : 'LoopForge 团队'; }

  /* table of contents from the article's h2s */
  heads = [...art.querySelectorAll('h2')].filter(h => !h.closest('.finish'));
  heads.forEach((h, i) => { if (!h.id) h.id = (h.closest('section[id]') && h.closest('section[id]').querySelector('h2') === h) ? h.closest('section[id]').id : 's' + (i + 1); });
  const toc = document.querySelector('.bp-toc nav');
  toc.innerHTML = heads.map(h => `<a href="#${h.id}">${esc(h.textContent.trim())}</a>`).join('');
  tocLinks = [...toc.querySelectorAll('a')];

  loadPosts().then(() => {
    const i = posts.findIndex(p => p.slug === POST), prev = posts[i + 1], next = posts[i - 1];
    const card = (p, k) => p ? `<a class="bp-pn ${k}" href="${BLOG}${p.slug}/${q()}"><small>${k === 'prev' ? ic('back') : ''}${u[k]}${k === 'next' ? ic('arrow') : ''}</small><b>${esc(T(p, 'title'))}</b></a>` : '<span></span>';
    document.querySelector('.bp-nav').innerHTML = card(prev, 'prev') + card(next, 'next');
    const me = posts[i]; if (!me) return;
    const h1 = document.querySelector('.bp-head h1'), sum = document.querySelector('.bp-sum');
    h1.textContent = T(me, 'title'); sum.textContent = T(me, 'summary');
    document.title = `${T(me, 'title')} · ${L === 'en' ? 'LoopForge Blog' : 'LoopForge 博客'}`;
    document.documentElement.lang = L === 'zh' ? 'zh-CN' : 'en';
  });
  if (relang) { art.querySelectorAll('.bp-cp span,.copy-btn span').forEach(e => { e.textContent = u.copyCode; }); return; }

  /* copy buttons on every code block */
  art.querySelectorAll('pre').forEach(pre => {
    const cb = pre.closest('.code-block'), own = cb && cb.querySelector('.copy-btn');
    if (own) { own.innerHTML = `<span>${U[L].copyCode}</span>`; own.addEventListener('click', () => copyText(own, pre.innerText, U[L].copyCode)); return; }
    const wrap = document.createElement('div'); wrap.className = 'bp-pre';
    pre.parentNode.insertBefore(wrap, pre); wrap.appendChild(pre);
    const b = document.createElement('button'); b.type = 'button'; b.className = 'bp-cp'; b.innerHTML = `${ic('copy')}${ic('check', 'ok')}<span>${U[L].copyCode}</span>`;
    b.addEventListener('click', () => copyText(b, pre.innerText, U[L].copyCode)); wrap.appendChild(b);
  });

  /* lightbox */
  const lb = document.createElement('div'); lb.className = 'bp-lb'; lb.hidden = true;
  lb.innerHTML = `<button type="button" aria-label="${u.close}">${ic('x')}</button><img alt="">`;
  document.body.appendChild(lb);
  const big = lb.querySelector('img');
  const shut = () => { lb.classList.remove('open'); document.documentElement.classList.remove('bp-lock'); setTimeout(() => { if (!lb.classList.contains('open')) lb.hidden = true; }, 250); };
  art.querySelectorAll('img').forEach(img => {
    img.classList.add('zoom');
    img.addEventListener('click', () => { big.src = img.currentSrc || img.src; big.alt = img.alt; lb.hidden = false; document.documentElement.classList.add('bp-lock'); requestAnimationFrame(() => lb.classList.add('open')); });
  });
  lb.addEventListener('click', e => { if (e.target !== big) shut(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !lb.hidden) shut(); });
}

function spy() {
  if (!heads.length) return;
  let on = 0;
  heads.forEach((h, i) => { if (h.getBoundingClientRect().top < innerHeight * .3) on = i; });
  tocLinks.forEach((a, i) => a.classList.toggle('on', i === on));
}

function onScroll() {
  const nav = document.querySelector('.nav'); if (!nav) return;
  nav.classList.toggle('sc', scrollY > 8);
  const pg = nav.querySelector('.nprog'), mx = document.documentElement.scrollHeight - innerHeight;
  pg.style.transform = `scaleX(${mx > 0 ? (scrollY / mx).toFixed(4) : 0})`;
  spy();
}

function boot(relang) {
  const keep = scrollY;
  chrome();
  if (document.getElementById('blog')) loadPosts().then(() => { renderList(); if (relang) scrollTo(0, keep); });
  else {
    setupPost(relang);
    reveal(document.querySelector('.bp'));
  }
  onScroll(); stars();
}

addEventListener('scroll', onScroll, { passive: true });
boot();
})();
