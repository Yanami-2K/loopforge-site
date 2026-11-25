(function () {
'use strict';
const qs = new URLSearchParams(location.search), body = document.body;
let L = qs.get('lang') || localStorage.getItem('lf-lang') || 'zh';
if (L !== 'en') L = 'zh';
const STILL = qs.has('still'), calm = () => STILL || matchMedia('(prefers-reduced-motion: reduce)').matches;
if (STILL) body.classList.add('still');
const ROOT = body.dataset.root || '../', BLOG = ROOT + 'blog/', POST = body.dataset.slug || '';
// Article bodies remain in Chinese; navigation follows the chosen language.
const GH = 'https://github.com/Tencent/LoopForge', FEED = BLOG + 'feed.xml';
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
const IC = {
  arrow: 'M5 12h14M13 6l6 6-6 6', back: 'M19 12H5M11 6l-6 6 6 6', up: 'M12 19V5M6 11l6-6 6 6', x: 'M6 6l12 12M18 6 6 18',
  search: 'M21 21l-5-5M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0',
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
const footHTML = () => `<footer class="ft"><a class="brand" href="${ROOT}${q()}">${LF_NAV.logo(1)}<span>LoopForge</span></a><span>${U[L].foot} · ${Z('非官方社区介绍页', 'Unofficial community introduction')} · <a href="${ROOT}LICENSE">MIT</a> · <a href="${GH}" target="_blank" rel="noopener">github.com/Tencent/LoopForge</a> · <a href="${FEED}">RSS</a> · <a href="${ROOT}site/home/ASSETS.md">NASA / Artemis II</a></span></footer>`;

function chrome() {
  const nav = document.getElementById('nav'), foot = document.getElementById('foot');
  nav.innerHTML = LF_NAV.header({ L, root: ROOT, page: 'blog', searchLabel: Z('搜索文章','Search articles') }); foot.innerHTML = footHTML();
  LF_NAV.bind(nav.querySelector('.nav'));
  setupSearch();
  nav.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.l === L) return;
    L = b.dataset.l; localStorage.setItem('lf-lang', L);
    const url = new URL(location); url.searchParams.set('lang', L); history.replaceState(null, '', url);
    boot(true);
    nav.querySelector('.lang [aria-pressed=true]')?.focus({preventScroll:true});
  }));
}

function reveal(root) {
  root.querySelectorAll('.rv[data-d]').forEach(e => { if (calm()) e.classList.add('on'); else setTimeout(() => e.classList.add('on'), +e.dataset.d); });
}

async function copyText(btn, pre) {
  const label = btn.querySelector('span');
  try {
    await navigator.clipboard.writeText(pre.innerText);
    btn.classList.add('ok');
    label.textContent = U[L].copied;
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(pre);
    selection.removeAllRanges();
    selection.addRange(range);
    label.textContent = Z('请手动复制', 'Copy manually');
  }
  clearTimeout(btn.copyTimer);
  btn.copyTimer = setTimeout(() => { btn.classList.remove('ok'); label.textContent = U[L].copyCode; }, 1800);
}

let posts = [];
const loadPosts = () => (posts.length ? Promise.resolve(posts) : fetch(BLOG + 'posts.json?v=3').then(r => r.json()).then(p => (posts = p.sort((a, b) => b.date.localeCompare(a.date)))));

/* ---------- list page ---------- */
const cover = p => `<span class="bc-cv"><img src="${BLOG}${p.cover}" alt="" loading="lazy"></span>`;
const meta = p => `<span class="bc-meta"><span class="bc-tag" data-tag="${p.tag}">${U[L].tags[p.tag] || p.tag}</span><time datetime="${p.date}">${fmtDate(p.date)}</time><span class="bc-dot"></span><span>${U[L].min(p.minutes)}</span></span>`;

const topics = {
  'from-personal-agent-to-team-loop': ['practice', 'workflow'],
  'zero-to-one-first-sop': ['tutorial', 'workflow'],
  'loopforge-builds-loopforge': ['practice', 'workflow', 'automation'],
  'coding-agent-enters-rd-team': ['practice', 'automation', 'open-source']
};
const topicLabels = () => ({ all: Z('全部', 'All'), practice: Z('团队实践', 'In practice'), tutorial: Z('上手教程', 'Tutorials'), workflow: Z('工作流编排', 'Workflows'), automation: Z('研发自动化', 'Automation'), 'open-source': Z('开源故事', 'Open source') });
let stopCover;
function renderList() {
  stopCover?.();
  const app = document.getElementById('blog'), labels = topicLabels();
  document.title = 'LoopForge Journal · ' + Z('博客', 'Blog');
  document.documentElement.lang = L === 'zh' ? 'zh-CN' : 'en';
  document.querySelector('meta[name=description]').content = U[L].desc;
  const feedURL = document.querySelector('link[rel="alternate"][type="application/rss+xml"]').href;
  // Metadata and canonical slugs come from the repository's posts.json.
  app.innerHTML = `
  <section class="j-hero">
    <figure class="j-cover"><img src="${BLOG}assets/earthset.webp" width="1920" height="1280" alt="${Z('阿尔忒弥斯二号绕月飞行时拍摄的月面与地球', 'Earth above the lunar surface, photographed during Artemis II')}"></figure>
    <div class="j-wrap j-hero-inner"><div class="j-issue">NOVEMBER 2026</div>
      <h1><span class="title-first">LoopForge</span><br><em class="title-second">Journal<span class="journal-stop">.</span></em></h1>
      <div class="j-intro"><p>${Z('上手教程、团队落地经验，以及我们用 LoopForge<br class="j-wide"> 迭代 LoopForge 的真实记录。', 'Hands-on tutorials, lessons from teams, and how we use<br class="j-wide"> LoopForge to build LoopForge.')}</p>
        <div id="rss" class="j-feed">
          <a href="${FEED}">${ic('rss')}${Z('RSS 订阅', 'RSS feed')}</a>
          <button type="button" class="j-feed-copy" data-copy-feed aria-label="${Z('复制订阅地址', 'Copy feed URL')}" title="${Z('复制订阅地址', 'Copy feed URL')}">${ic('copy')}</button>
          <output class="j-feed-status" aria-live="polite"></output>
        </div>
      </div>
    </div>
  </section>
  <section class="j-wrap j-collection" id="index">
    <div class="j-collection-head"><div class="j-collection-title"><h2>${Z('文章索引', 'Article index')}</h2><span class="j-count" aria-live="polite">${String(posts.length).padStart(2, '0')}</span></div>
      <div class="j-filters" role="group" aria-label="${Z('文章分类', 'Article categories')}">${Object.entries(labels).map(([key, label]) => `<button type="button" data-filter="${key}" aria-pressed="${key === 'all'}">${label}</button>`).join('')}</div>
    </div>
    <div class="j-card-grid">${posts.map(p => `<article class="j-card" data-topics="${(topics[p.slug] || [p.tag]).join(' ')}"><a href="${BLOG}${p.slug}/${q()}"><div class="j-card-info"><div class="j-meta"><span class="j-cat">${esc(U[L].tags[p.tag] || p.tag)}</span><time datetime="${p.date}">${p.date.replaceAll('-', '.')}</time><span>${U[L].min(p.minutes)}</span></div><h3><span>${esc(T(p, 'title'))}</span></h3><p>${esc(T(p, 'summary'))}</p></div></a></article>`).join('')}</div>
  </section>
  <aside class="j-wrap j-subscribe" id="rss-footer" aria-labelledby="rss-footer-title">
    <div><h2 id="rss-footer-title">${ic('rss')}${U[L].rss}</h2><p>${U[L].rssSub}</p></div>
    <div class="j-subscribe-source">
      <code>${esc(feedURL.replace(/^https?:\/\//, ''))}</code>
      <div class="j-subscribe-actions"><button type="button" data-copy-feed>${ic('copy')}${U[L].copy}</button><a href="${FEED}">${U[L].open}${arrow()}</a></div>
      <output class="j-feed-status" aria-live="polite"></output>
    </div>
  </aside>`;
  app.querySelectorAll('[data-copy-feed]').forEach(button => {
    const feedback = button.closest('.j-feed, .j-subscribe-source').querySelector('.j-feed-status');
    let clearFeedback;
    button.onclick = async () => {
      clearTimeout(clearFeedback);
      try {
        await navigator.clipboard.writeText(feedURL);
        feedback.textContent = U[L].copied;
        clearFeedback = setTimeout(() => { feedback.textContent = ''; }, 2200);
      } catch {
        feedback.textContent = feedURL;
        const range = document.createRange();
        range.selectNodeContents(feedback);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }
    };
  });
  stopCover = window.startJournalCover(app.querySelector('.j-hero'), L, STILL);
  app.querySelectorAll('[data-filter]').forEach(btn => btn.addEventListener('click', () => {
    app.querySelectorAll('[data-filter]').forEach(tab => tab.setAttribute('aria-pressed', String(tab === btn)));
    let count = 0;
    app.querySelectorAll('.j-card').forEach(card => { card.hidden = btn.dataset.filter !== 'all' && !card.dataset.topics.split(' ').includes(btn.dataset.filter); if (!card.hidden) count++; });
    app.querySelector('.j-count').textContent = String(count).padStart(2, '0');
  }));
}

let bodyIndex;
function setupSearch() {
  document.getElementById('journal-search-dialog')?.remove();
  const dialog = document.createElement('dialog'); dialog.id = 'journal-search-dialog';
  dialog.setAttribute('aria-label', Z('搜索文章', 'Search articles'));
  dialog.innerHTML = `<div class="j-search-head"><input type="search" aria-label="${Z('搜索标题、章节或正文', 'Search titles, sections or text')}" placeholder="${Z('搜索标题、章节或正文', 'Search titles, sections or text')}" autocomplete="off"><button type="button" aria-label="${U[L].close}">${ic('x')}</button></div><div class="j-results" aria-live="polite"></div>`;
  document.body.append(dialog);
  const input = dialog.querySelector('input'), results = dialog.querySelector('.j-results');
  const show = () => {
    const words = input.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    const matches = posts.filter(p => words.every(w => [p.title, p.title_en, p.summary, p.summary_en, bodyIndex?.[p.slug] || ''].join(' ').toLocaleLowerCase().includes(w)));
    results.innerHTML = matches.length ? matches.map(p => `<a href="${BLOG}${p.slug}/${q()}"><small>${p.date} / ${esc(U[L].tags[p.tag] || p.tag)}</small><strong>${esc(T(p, 'title'))}</strong></a>`).join('') : `<p>${Z('没有找到匹配的文章，试试其他关键词。', 'No matching articles. Try another keyword.')}</p>`;
  };
  const open = async () => {
    if (dialog.open) return;
    await loadPosts(); show(); dialog.showModal(); input.focus();
    if (!bodyIndex) {
      const entries = await Promise.all(posts.map(async p => {
        try {
          const response = await fetch(BLOG + p.slug + '/');
          if (!response.ok) return [p.slug, ''];
          const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
          return [p.slug, doc.querySelector('.bp-body')?.textContent || ''];
        } catch { return [p.slug, '']; }
      }));
      bodyIndex = Object.fromEntries(entries); if (dialog.open) show();
    }
  };
  document.querySelector('.nav-search').onclick = open;
  input.oninput = show;
  dialog.querySelector('button').onclick = () => dialog.close();
  dialog.addEventListener('click', e => { if (e.target !== dialog) return; const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); });
  document.onkeydown = e => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); if (dialog.open) dialog.close(); else open(); } };
}


/* ---------- post page ---------- */
let tocLinks = [], heads = [], currentSection = -1;
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
  const anchors = heads.map((heading, i) => {
    if (heading.id) return heading.id;
    const section = heading.closest('section[id]');
    if (section && section.querySelector('h2') === heading) return section.id;
    heading.id = 's' + (i + 1);
    return heading.id;
  });
  const toc = document.querySelector('.bp-toc nav');
  toc.innerHTML = heads.map((h, i) => {
    const label = h.cloneNode(true);
    if (body.classList.contains('reader-edition')) label.querySelector('.n')?.remove();
    return `<a href="#${anchors[i]}">${esc(label.textContent.trim())}</a>`;
  }).join('');
  currentSection = -1;
  document.querySelector('.bp-mobile-toc')?.remove();
  const mobileToc = document.createElement('details');
  mobileToc.className = 'bp-mobile-toc';
  mobileToc.innerHTML = `<summary>${u.toc}</summary><nav>${toc.innerHTML}</nav>`;
  art.before(mobileToc);
  tocLinks = [Array.from(toc.querySelectorAll('a')), Array.from(mobileToc.querySelectorAll('a'))];
  if (body.classList.contains('reader-edition')) {
    const position = document.createElement('span');
    position.className = 'reader-position';
    mobileToc.querySelector('summary').append(position);
  }
  mobileToc.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { mobileToc.open = false; }));

  loadPosts().then(() => {
    const i = posts.findIndex(p => p.slug === POST), prev = posts[i + 1], next = posts[i - 1];
    const card = (p, k) => p ? `<a class="bp-pn ${k}" href="${BLOG}${p.slug}/${q()}"><small>${k === 'prev' ? ic('back') : ''}${u[k]}${k === 'next' ? ic('arrow') : ''}</small><b>${esc(T(p, 'title'))}</b></a>` : '<span></span>';
    document.querySelector('.bp-nav').innerHTML = card(prev, 'prev') + card(next, 'next');
    const me = posts[i]; if (!me) return;
    const h1 = document.querySelector('.bp-head h1'), sum = document.querySelector('.bp-sum');
    const title = T(me, 'title');
    h1.textContent = title;
    if (body.classList.contains('reader-edition')) {
      const parts = /^(.+?[：:])\s*(.+)$/.exec(title);
      if (parts) {
        const subtitle = document.createElement('span');
        subtitle.className = 'reader-subtitle';
        subtitle.textContent = parts[2];
        const lead = parts[1];
        const split = L === 'zh' ? lead.indexOf('到团队') : -1;
        if (split > 0) {
          const phrase = document.createElement('span');
          phrase.className = 'reader-phrase';
          phrase.textContent = lead.slice(split);
          h1.replaceChildren(lead.slice(0, split), document.createElement('wbr'), phrase, ' ', subtitle);
        } else h1.replaceChildren(lead + ' ', subtitle);
      }
    }
    sum.textContent = T(me, 'summary');
    document.title = `${T(me, 'title')} · ${L === 'en' ? 'LoopForge Blog' : 'LoopForge 博客'}`;
    document.documentElement.lang = L === 'zh' ? 'zh-CN' : 'en';
  });
  if (relang) { art.querySelectorAll('.bp-cp span,.copy-btn span').forEach(e => { e.textContent = u.copyCode; }); return; }

  /* copy buttons on every code block */
  art.querySelectorAll('pre').forEach(pre => {
    const cb = pre.closest('.code-block'), own = cb && cb.querySelector('.copy-btn');
    if (own) { own.innerHTML = `<span>${U[L].copyCode}</span>`; own.addEventListener('click', () => copyText(own, pre)); return; }
    const wrap = document.createElement('div'); wrap.className = 'bp-pre';
    pre.parentNode.insertBefore(wrap, pre); wrap.appendChild(pre);
    const b = document.createElement('button'); b.type = 'button'; b.className = 'bp-cp'; b.innerHTML = `${ic('copy')}${ic('check', 'ok')}<span>${U[L].copyCode}</span>`;
    b.addEventListener('click', () => copyText(b, pre)); wrap.appendChild(b);
  });

  if (body.classList.contains('reader-edition')) {
    window.setupReaderGallery(art, () => L);
    return;
  }

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
  if (on === currentSection) return;
  currentSection = on;
  tocLinks.forEach(links => links.forEach((link, i) => {
    link.classList.toggle('on', i === on);
    if (i === on) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }));
  const position = document.querySelector('.reader-position');
  if (position) position.textContent = String(on + 1).padStart(2, '0') + ' / ' + String(heads.length).padStart(2, '0');
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
  if (document.getElementById('blog')) {
    loadPosts().then(() => {
      renderList();
      if (relang) scrollTo(0, keep);
      else if (location.hash === '#rss-footer') document.getElementById('rss-footer').scrollIntoView();
    });
  } else {
    setupPost(relang);
    reveal(document.querySelector('.bp'));
  }
  onScroll(); LF_NAV.stars();
}

addEventListener('scroll', onScroll, { passive: true });
boot();
})();
