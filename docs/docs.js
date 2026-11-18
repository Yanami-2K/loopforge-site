(function(){
'use strict';

const DATA = window.LF_DOCS;
const qs = new URLSearchParams(location.search);
let L = qs.get('lang') || localStorage.getItem('lf-lang') || ((navigator.language || '').startsWith('zh') ? 'zh' : 'en');
if (!DATA[L]) L = 'zh';

let query = '';
const GH = 'https://github.com/Tencent/LoopForge';

const LOGO = `<svg viewBox="12 12 88 88" fill="none" aria-hidden="true"><defs><linearGradient id="dlfg" x1="19" y1="20" x2="93" y2="93" gradientUnits="userSpaceOnUse"><stop stop-color="#008DCC"/><stop offset=".48" stop-color="#526CE8"/><stop offset="1" stop-color="#8A4ED9"/></linearGradient></defs><path d="M53 72C53 59 63 52.5 73 52.5S93 59 93 72 83 91.5 73 91.5 53 85 53 72V40C53 27 44.5 20.5 36 20.5S19 27 19 40" stroke="url(#dlfg)" stroke-width="7.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const IC_SEARCH = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.8-3.8"/></svg>`;
const IC_GH = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`;
const IC_MENU = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`;

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function flatten(tree) {
  const list = [];
  tree.forEach(sec => {
    sec.items.forEach(it => {
      if (it.children) {
        it.children.forEach(ch => list.push({ ...ch, secTitle: sec.title, groupTitle: it.group }));
      } else {
        list.push({ ...it, secTitle: sec.title, groupTitle: '' });
      }
    });
  });
  return list;
}

function inlineMd(text) {
  const codes = [];
  let s = String(text || '').replace(/`([^`]+)`/g, (_, c) => {
    codes.push(`<code>${esc(c)}</code>`);
    return `\u0000CODE${codes.length - 1}\u0000`;
  });
  s = esc(s);
  s = s.replace(/&lt;br\s*\/?&gt;/gi, '<br>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  s = s.replace(/\u0000CODE(\d+)\u0000/g, (_, idx) => codes[Number(idx)]);
  return s;
}

function renderMarkdown(md) {
  const lines = String(md || '').replace(/\r\n/g, '\n').split('\n');
  let html = '';
  let i = 0;
  let hIdx = 0;
  const headings = [];

  while (i < lines.length) {
    const raw = lines[i];
    const trimmed = raw.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Code block
    if (trimmed.startsWith('```')) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(esc(lines[i]));
        i++;
      }
      i++;
      html += `<pre><code>${codeLines.join('\n')}</code></pre>`;
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(trimmed)) {
      html += '<hr>';
      i++;
      continue;
    }

    // Headings
    const hm = trimmed.match(/^(#{2,3})\s+(.+)$/);
    if (hm) {
      const level = hm[1].length;
      const text = hm[2].trim();
      const plain = text.replace(/[`*]/g, '');
      const id = 'sec-' + (++hIdx);
      headings.push({ id, level, text: plain });
      html += `<h${level} id="${id}">${inlineMd(text)}</h${level}>`;
      i++;
      continue;
    }

    // Image figure
    const im = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (im) {
      const alt = im[1];
      const src = im[2];
      const fail = L === 'en' ? 'Image failed to load' : '图片没有加载出来';
      const loading = L === 'en' ? 'Loading' : '加载中';
      html += `<figure class="d-fig is-loading"><span class="d-fig-media" data-fail="${esc(fail)}" data-loading="${esc(loading)}"><img src="${esc(src)}" alt="${esc(alt)}"></span>${alt ? `<figcaption>${inlineMd(alt)}</figcaption>` : ''}</figure>`;
      i++;
      continue;
    }

    // Table
    if (trimmed.startsWith('|') && i + 1 < lines.length && /^\|\s*[-:]+/.test(lines[i + 1].trim())) {
      const parseRow = r => r.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
      const headers = parseRow(trimmed);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(parseRow(lines[i]));
        i++;
      }
      html += `<div class="d-table-wrap"><table><thead><tr>${headers.map(h => `<th>${inlineMd(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${inlineMd(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('>')) {
      const qLines = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        const ql = lines[i].trim().replace(/^>\s?/, '');
        if (ql) qLines.push(`<p>${inlineMd(ql)}</p>`);
        i++;
      }
      html += `<blockquote>${qLines.join('')}</blockquote>`;
      continue;
    }

    // Unordered list
    if (/^[*-]\s+/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^\s*[*-]\s+/.test(lines[i])) {
        let itemText = lines[i].replace(/^\s*[*-]\s+/, '').trim();
        i++;
        while (i < lines.length && /^\s{2,}[*-]\s+/.test(lines[i])) {
          itemText += `<br>• ` + lines[i].replace(/^\s*[*-]\s+/, '').trim();
          i++;
        }
        items.push(`<li>${inlineMd(itemText)}</li>`);
      }
      html += `<ul>${items.join('')}</ul>`;
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        let itemText = lines[i].replace(/^\s*\d+\.\s+/, '').trim();
        i++;
        while (i < lines.length && /^\s{2,}[*-]\s+/.test(lines[i])) {
          itemText += `<br>• ` + lines[i].replace(/^\s*[*-]\s+/, '').trim();
          i++;
        }
        items.push(`<li>${inlineMd(itemText)}</li>`);
      }
      html += `<ol>${items.join('')}</ol>`;
      continue;
    }

    // Paragraph
    const pLines = [trimmed];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('#') &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].trim().startsWith('|') &&
      !lines[i].trim().startsWith('>') &&
      !lines[i].trim().startsWith('![') &&
      !/^---+$/.test(lines[i].trim()) &&
      !/^[*-]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim())
    ) {
      pLines.push(lines[i].trim());
      i++;
    }
    html += `<p>${inlineMd(pLines.join(' '))}</p>`;
  }

  return { html, headings };
}

function currentId() {
  const raw = (location.hash || '').replace(/^#\/?/, '').trim();
  const pages = DATA[L].pages;
  return pages[raw] ? raw : 'intro';
}

function matchesSearch(id, title, q) {
  if (!q) return true;
  const page = DATA[L].pages[id];
  if (!page) return false;
  const hay = (title + ' ' + page.title + ' ' + page.lead + ' ' + page.md).toLowerCase();
  return hay.includes(q.toLowerCase());
}

function buildSidebar(activeId) {
  const d = DATA[L];
  const q = query.trim();
  let hasAny = false;

  const secsHtml = d.tree.map(sec => {
    const itemsHtml = sec.items.map(it => {
      if (it.children) {
        const childrenFiltered = it.children.filter(ch => matchesSearch(ch.id, ch.title, q));
        if (!childrenFiltered.length) return '';
        hasAny = true;
        const hasOn = childrenFiltered.some(ch => ch.id === activeId);
        return `<details class="d-sub ${hasOn ? 'has-on' : ''}" open>
          <summary>${esc(it.group)}</summary>
          <div class="d-sub-list">
            ${childrenFiltered.map(ch => `<a class="d-link ${ch.id === activeId ? 'on' : ''}" href="#${ch.id}" data-doc="${ch.id}">${esc(ch.title)}</a>`).join('')}
          </div>
        </details>`;
      }
      if (!matchesSearch(it.id, it.title, q)) return '';
      hasAny = true;
      return `<a class="d-link ${it.id === activeId ? 'on' : ''}" href="#${it.id}" data-doc="${it.id}">${esc(it.title)}</a>`;
    }).join('');

    if (!itemsHtml) return '';
    return `<div class="d-sec"><div class="d-sec-title">${esc(sec.title)}</div>${itemsHtml}</div>`;
  }).join('');

  return secsHtml || `<div class="d-empty">${esc(d.ui.searchEmpty)}</div>`;
}

function render(scrollTop = true) {
  const d = DATA[L];
  const activeId = currentId();
  const flat = flatten(d.tree);
  const idx = flat.findIndex(x => x.id === activeId);
  const meta = flat[idx] || flat[0];
  const page = d.pages[activeId];
  const { html: bodyHtml, headings } = renderMarkdown(page.md);

  document.documentElement.lang = L === 'zh' ? 'zh-CN' : 'en';
  document.title = `${page.title} · LoopForge ${d.ui.brandSub}`;

  const prevItem = idx > 0 ? flat[idx - 1] : null;
  const nextItem = idx >= 0 && idx + 1 < flat.length ? flat[idx + 1] : null;
  const homeUrl = '../' + (L === 'en' ? '?lang=en' : '');
  const demoUrl = '../demo/' + (L === 'en' ? '?lang=en' : '');

  const app = document.getElementById('app');
  if (!app.querySelector('.d-top')) {
    app.innerHTML = `
      <header class="d-top">
        <div class="d-topbar">
          <button type="button" class="d-menu-btn" id="dMenuBtn" aria-label="Menu">${IC_MENU}</button>
          <a class="d-brand" href="${homeUrl}">${LOGO}<span>LoopForge</span></a>
          <span class="d-badge" id="dBrandSub"></span>
          <nav class="d-top-links">
            <a id="dBackHome" href="${homeUrl}"></a>
            <a id="dWatchDemo" href="${demoUrl}"></a>
          </nav>
          <span class="d-sp"></span>
          <div class="d-lang">
            <button type="button" data-lang="zh">中</button>
            <button type="button" data-lang="en">EN</button>
          </div>
          <a class="d-gh" href="${GH}" target="_blank" rel="noopener">${IC_GH}<span>GitHub</span></a>
        </div>
      </header>
      <div class="d-layout">
        <aside class="d-side" id="dSide">
          <div class="d-side-head">
            <b id="dNavTitle"></b>
            <span id="dNavSub"></span>
          </div>
          <div class="d-search">
            ${IC_SEARCH}
            <input type="search" id="dSearchInput" autocomplete="off">
            <kbd aria-hidden="true">/</kbd>
          </div>
          <nav id="dSideTree"></nav>
        </aside>
        <main class="d-main">
          <article class="d-article">
            <header class="d-head">
              <span class="d-kicker" id="dKicker"></span>
              <h1 id="dTitle"></h1>
              <p class="d-lead" id="dLead"></p>
            </header>
            <div class="d-body" id="dBody"></div>
            <footer class="d-pager" id="dPager"></footer>
          </article>
        </main>
        <aside class="d-toc">
          <div class="d-toc-box">
            <p class="d-toc-title" id="dTocTitle"></p>
            <nav id="dTocList"></nav>
          </div>
        </aside>
      </div>
    `;

    document.getElementById('dMenuBtn').addEventListener('click', () => {
      document.body.classList.toggle('d-nav-open');
    });
    document.getElementById('dSearchInput').addEventListener('input', e => {
      query = e.target.value;
      document.getElementById('dSideTree').innerHTML = buildSidebar(currentId());
    });
    window.addEventListener('keydown', e => {
      if (e.key === '/' && document.activeElement !== document.getElementById('dSearchInput')) {
        e.preventDefault();
        document.getElementById('dSearchInput').focus();
      }
    });
    app.querySelectorAll('.d-lang button').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.lang === L) return;
        L = btn.dataset.lang;
        localStorage.setItem('lf-lang', L);
        const u = new URL(location.href);
        u.searchParams.set('lang', L);
        history.replaceState(null, '', u);
        render(false);
      });
    });
  }

  document.getElementById('dBrandSub').textContent = d.ui.brandSub;
  const backEl = document.getElementById('dBackHome');
  backEl.textContent = d.ui.backHome;
  backEl.href = homeUrl;
  const demoEl = document.getElementById('dWatchDemo');
  demoEl.textContent = d.ui.watchDemo;
  demoEl.href = demoUrl;

  app.querySelectorAll('.d-lang button').forEach(btn => {
    btn.classList.toggle('on', btn.dataset.lang === L);
  });

  document.getElementById('dNavTitle').textContent = d.ui.navTitle;
  document.getElementById('dNavSub').textContent = d.ui.navSub;
  const sInput = document.getElementById('dSearchInput');
  sInput.placeholder = d.ui.searchPlaceholder;

  document.getElementById('dSideTree').innerHTML = buildSidebar(activeId);
  document.getElementById('dKicker').textContent = meta.kicker || meta.secTitle;
  document.getElementById('dTitle').textContent = page.title;
  document.getElementById('dLead').textContent = page.lead;
  document.getElementById('dBody').innerHTML = bodyHtml;
  document.querySelectorAll('#dBody figure.d-fig').forEach(fig => {
    const img = fig.querySelector('img');
    if (!img) return;
    const done = () => fig.classList.remove('is-loading');
    const fail = () => {
      fig.classList.remove('is-loading');
      fig.classList.add('is-error');
    };
    if (img.complete && img.naturalWidth > 0) done();
    else if (img.complete && img.naturalWidth === 0) fail();
    else {
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', fail, { once: true });
    }
  });

  const pagerHtml = [
    prevItem ? `<a class="d-page-card prev" href="#${prevItem.id}"><small>← ${esc(d.ui.prev)}</small><b>${esc(prevItem.title)}</b></a>` : '',
    nextItem ? `<a class="d-page-card next" href="#${nextItem.id}"><small>${esc(d.ui.next)} →</small><b>${esc(nextItem.title)}</b></a>` : '',
  ].join('');
  document.getElementById('dPager').innerHTML = pagerHtml;

  document.getElementById('dTocTitle').textContent = d.ui.onThisPage;
  document.getElementById('dTocList').innerHTML = headings
    .map(h => `<a href="#${h.id}" class="${h.level === 3 ? 'sub-h3' : ''}" data-anchor="${h.id}">${esc(h.text)}</a>`)
    .join('');

  document.getElementById('dTocList').querySelectorAll('a').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById(a.dataset.anchor);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  document.body.classList.remove('d-nav-open');
  if (scrollTop) {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  const activeNav = document.querySelector(`#dSideTree a[data-doc="${activeId}"]`);
  if (activeNav) activeNav.scrollIntoView({ block: 'nearest' });
}

window.addEventListener('hashchange', () => render(true));
render(true);
})();
