(function(){
'use strict';

const DATA = window.LF_DOCS;
const qs = new URLSearchParams(location.search);
let L = qs.get('lang') || localStorage.getItem('lf-lang') || ((navigator.language || '').startsWith('zh') ? 'zh' : 'en');
if (!DATA[L]) L = 'zh';

let query = '';

const IC_SEARCH = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.8-3.8"/></svg>`;
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
  let sectionNumber = 0;
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
      const syntax = trimmed.slice(3).trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(esc(lines[i]));
        i++;
      }
      i++;
      html += `<div class="d-code"><div class="d-code-tools"><span>${esc(syntax || (L === 'en' ? 'Code' : '代码'))}</span><button type="button" data-copy>${L === 'en' ? 'Copy' : '复制'}</button></div><pre><code>${codeLines.join('\n')}</code></pre></div>`;
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
      const section = level === 2 ? String(++sectionNumber).padStart(2,'0') : '';
      headings.push({ id, level, text: plain, section });
      const prefix = section ? '<span class="section-no" aria-hidden="true">'+section+'</span>' : '';
      html += `<h${level} id="${id}">${prefix}${inlineMd(text)}</h${level}>`;
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
            ${childrenFiltered.map(ch => `<a class="d-link ${ch.id === activeId ? 'on' : ''}" ${ch.id === activeId ? 'aria-current="page"' : ''} href="#${ch.id}" data-doc="${ch.id}">${esc(ch.title)}</a>`).join('')}
          </div>
        </details>`;
      }
      if (!matchesSearch(it.id, it.title, q)) return '';
      hasAny = true;
      return `<a class="d-link ${it.id === activeId ? 'on' : ''}" ${it.id === activeId ? 'aria-current="page"' : ''} href="#${it.id}" data-doc="${it.id}">${esc(it.title)}</a>`;
    }).join('');

    if (!itemsHtml) return '';
    return `<div class="d-sec"><div class="d-sec-title">${esc(sec.title)}</div>${itemsHtml}</div>`;
  }).join('');

  return secsHtml || `<div class="d-empty">${esc(d.ui.searchEmpty)}</div>`;
}

let outline = [];
let activeSection = null;
let frame = 0;
function updateOutline() {
  frame = 0;
  if (!outline.length) return;
  let current = outline[0];
  for (const entry of outline) {
    if (entry.heading.getBoundingClientRect().top > 120) break;
    current = entry;
  }
  if (scrollY > 0 && scrollY+innerHeight >= document.documentElement.scrollHeight-2) {
    current = outline[outline.length-1];
  }
  if (current === activeSection) return;
  activeSection = current;
  document.querySelector('.d-inline-location').textContent = current.links[0].lastElementChild.textContent;
  outline.forEach(entry => {
    entry.links.forEach(link => {
      if (entry === current) link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
    });
  });
}
addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(updateOutline); }, {passive:true});
document.addEventListener('click', async event => {
  const button = event.target.closest('.d-code button[data-copy]');
  if (!button) return;
  const code = button.closest('.d-code').querySelector('code');
  try {
    await navigator.clipboard.writeText(code.textContent);
    button.textContent = L === 'en' ? 'Copied' : '已复制';
    setTimeout(() => { button.textContent = L === 'en' ? 'Copy' : '复制'; }, 1400);
  } catch {
    const range = document.createRange();
    range.selectNodeContents(code);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
});
function setDirectory(open) {
  document.body.classList.toggle('d-nav-open', open);
  document.getElementById('dMenuBtn').setAttribute('aria-expanded', String(open));
}
function focusSearch() {
  document.querySelector('#dSiteNav .nav.mo .nmb')?.click();
  const dialog = document.getElementById('dSearchDialog');
  if (dialog.open) return;
  const input = dialog.querySelector('input');
  input.value = '';
  showSearchResults();
  dialog.showModal();
  input.focus();
}
function showSearchResults() {
  const dialog = document.getElementById('dSearchDialog');
  const term = dialog.querySelector('input').value.trim().toLowerCase();
  const matches = flatten(DATA[L].tree).filter(item => matchesSearch(item.id, item.title, term));
  if (term) matches.sort((a, b) => Number(b.title.toLowerCase().includes(term)) - Number(a.title.toLowerCase().includes(term)));
  dialog.querySelector('.d-search-results').innerHTML = matches.map(item =>
    `<a href="#${esc(item.id)}"><small>${esc(item.secTitle)}</small><strong>${esc(item.title)}</strong></a>`
  ).join('') || `<p role="status">${esc(DATA[L].ui.searchEmpty)}</p>`;
  dialog.querySelector('.d-search-results').scrollTop = 0;
}
let chapterMotion;
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
  const app = document.getElementById('app');
  if (!document.getElementById('dSide')) {
    app.innerHTML = `
      <div id="dSiteNav"></div>
      <dialog id="dSearchDialog">
        <div class="d-search-head">
          <input type="search" autocomplete="off" autofocus>
          <button type="button"><span aria-hidden="true">×</span></button>
        </div>
        <div class="d-search-results"></div>
      </dialog>
      <div class="d-directory"><button type="button" class="d-menu-btn" id="dMenuBtn" aria-controls="dSide" aria-expanded="false">${IC_MENU}<span></span></button></div>
      <div class="d-layout">
        <aside class="d-side" id="dSide">
          <div class="d-side-head">
            <b id="dNavTitle"></b>
            <span id="dNavSub"></span>
          </div>
          <div class="d-search">
            ${IC_SEARCH}
            <input type="search" id="dSearchInput" autocomplete="off" aria-keyshortcuts="/">
            <kbd aria-hidden="true">/</kbd>
          </div>
          <nav id="dSideTree"></nav>
        </aside>
        <main class="d-main">
          <article class="d-article">
            <header class="d-head">
              <div class="d-folio"><span class="d-kicker" id="dKicker"></span><span id="dPageNumber"></span></div>
              <h1 id="dTitle"></h1>
              <p class="d-lead" id="dLead"></p>
            </header>
            <details class="d-inline-toc"><summary></summary><nav></nav></details>
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

    const dialog = document.getElementById('dSearchDialog');
    dialog.querySelector('input').addEventListener('input', showSearchResults);
    dialog.querySelector('input').addEventListener('keydown', event => {
      if (event.key === 'Enter' && !event.isComposing) {
        event.preventDefault();
        dialog.querySelector('.d-search-results a')?.click();
      }
    });
    dialog.querySelector('button').addEventListener('click', () => dialog.close());
    dialog.querySelector('.d-search-results').addEventListener('click', event => {
      if (!event.target.closest('a')) return;
      dialog.close();
      setDirectory(false);
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
    });
    document.getElementById('dMenuBtn').addEventListener('click', () => {
      setDirectory(!document.body.classList.contains('d-nav-open'));
    });
    document.getElementById('dSearchInput').addEventListener('input', e => {
      query = e.target.value;
      document.getElementById('dSideTree').innerHTML = buildSidebar(currentId());
    });
    window.addEventListener('keydown', e => {
      if (e.key === '/' && !dialog.open && !e.target.closest('input,textarea,[contenteditable=true]')) {
        e.preventDefault();
        focusSearch();
      }
    });
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !dialog.open && document.body.classList.contains('d-nav-open')) {
        setDirectory(false);
        document.getElementById('dMenuBtn').focus();
      }
    });
  }
  const nav = document.getElementById('dSiteNav');
  if (nav.dataset.lang !== L) {
    nav.dataset.lang = L;
    nav.innerHTML = LF_NAV.header({ L, root: '../', page: 'docs', searchLabel: L === 'zh' ? '搜索文档' : 'Search docs' });
    LF_NAV.bind(nav.querySelector('.nav'));
    LF_NAV.stars();
    nav.querySelector('.nav-search').addEventListener('click', focusSearch);
    nav.querySelectorAll('.lang button').forEach(btn => btn.addEventListener('click', () => {
      if (btn.dataset.l === L) return;
      L = btn.dataset.l;
      localStorage.setItem('lf-lang', L);
      const u = new URL(location.href);
      u.searchParams.set('lang', L);
      history.replaceState(null, '', u);
      render(false);
      nav.querySelector('[aria-pressed="true"]').focus({preventScroll:true});
    }));
  }
  document.querySelector('#dMenuBtn span').textContent = L === 'zh' ? '文档目录' : 'Chapters';
  document.getElementById('dNavTitle').textContent = d.ui.navTitle;
  document.getElementById('dNavSub').textContent = d.ui.navSub;
  const sInput = document.getElementById('dSearchInput');
  sInput.placeholder = d.ui.searchPlaceholder;
  const searchDialog = document.getElementById('dSearchDialog');
  const searchLabel = L === 'zh' ? '搜索文档' : 'Search docs';
  searchDialog.setAttribute('aria-label', searchLabel);
  searchDialog.querySelector('input').setAttribute('aria-label', searchLabel);
  searchDialog.querySelector('input').placeholder = d.ui.searchPlaceholder;
  searchDialog.querySelector('button').setAttribute('aria-label', L === 'zh' ? '关闭' : 'Close');

  document.getElementById('dSideTree').innerHTML = buildSidebar(activeId);
  document.getElementById('dKicker').textContent = meta.kicker || meta.secTitle;
  document.getElementById('dPageNumber').innerHTML = '<b>'+String(idx+1).padStart(2,'0')+'</b> / '+flat.length;
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
    .map(h => `<a href="#${h.id}" class="${h.level === 3 ? 'sub-h3' : ''}" data-anchor="${h.id}"><span class="outline-mark" aria-hidden="true">${h.section}</span><span>${esc(h.text)}</span></a>`)
    .join('');

  const mobileToc = document.querySelector('.d-inline-toc');
  mobileToc.open = false;
  mobileToc.hidden = !headings.length;
  mobileToc.querySelector('summary').innerHTML = esc(d.ui.onThisPage)+'<span class="d-inline-location"></span>';
  mobileToc.querySelector('nav').innerHTML = document.getElementById('dTocList').innerHTML;
  outline = headings.map(({id}) => ({
    heading: document.getElementById(id),
    links: [...document.querySelectorAll('[data-anchor="'+id+'"]')]
  }));
  document.querySelectorAll('[data-anchor]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      mobileToc.open = false;
      const target = document.getElementById(a.dataset.anchor);
      if (target) target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    });
  });

  setDirectory(false);
  chapterMotion?.cancel();
  if (matchMedia('(prefers-reduced-motion:no-preference)').matches) {
    chapterMotion = app.querySelector('.d-article').animate(
      [{ opacity: .62, transform: 'translateY(5px)' }, { opacity: 1, transform: 'none' }],
      {duration: 220, easing: 'ease-out'}
    );
  }
  if (scrollTop) {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  const activeNav = document.querySelector(`#dSideTree a[data-doc="${activeId}"]`);
  if (activeNav) {
    const side = document.getElementById('dSide');
    const item = activeNav.getBoundingClientRect(), bounds = side.getBoundingClientRect();
    if (item.top < bounds.top) side.scrollTop += item.top - bounds.top;
    else if (item.bottom > bounds.bottom) side.scrollTop += item.bottom - bounds.bottom;
  }
  updateOutline();
}

window.addEventListener('hashchange', () => render(true));
render(true);
})();
