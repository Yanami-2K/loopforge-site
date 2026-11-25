/* Shared top-nav links: a "Product" dropdown for the home-page sections, then Docs, Roadmap and Blog.
   Pages call LF_NAV.links(...) / LF_NAV.menu() inside their own <header class="nav"> and LF_NAV.bind() after render. */
window.LF_NAV = (function () {
'use strict';
const P = {
  arrow: 'M5 12h14M13 6l6 6-6 6', search: 'M21 21l-5-5M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0',
  chev: 'm6 9 6 6 6-6',
  why: 'M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1',
  story: 'M6 3v12M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9a9 9 0 0 1-9 9',
  video: 'M4 5h16v14H4zM10 9l5 3-5 3z',
  deploy: 'M4 17l6-6-6-6M12 19h8',
  local: 'M3 5h18v13H3zM8 21h8m-9-12 3 3-3 3m5 0h4',
  menu: 'M4 7h16M4 12h16M4 17h16',
  x: 'M6 6l12 12M18 6 6 18',
};
const ic = (k, c = 'ic') => `<svg class="${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${P[k]}"/></svg>`;
const T = {
  zh: { home: '首页', product: '产品', docs: '使用文档', roadmap: '路线图', blog: '博客', demo: '观看演示', menu: '菜单',
    items: [['why', '核心价值', '个人快了，团队交付为什么还慢'], ['story', '工作方式', '从个人编码工具到团队级云端研发'], ['video', '演示视频', '80 秒看完整条交付流程'], ['deploy', '快速部署', '一条命令在自己的机器上跑起来'], ['local', 'LoopForge Local', '安装到你的 IDE 或编程助手']] },
  en: { home: 'Home', product: 'Product', docs: 'Docs', roadmap: 'Roadmap', blog: 'Blog', demo: 'Watch demo', menu: 'Menu',
    items: [['why', 'Why LoopForge', 'Why team delivery is still slow'], ['story', 'How it works', 'From solo tools to team-scale delivery'], ['video', 'Video', 'The full pipeline in 80 seconds'], ['deploy', 'Deploy', 'Self-host it with one command'], ['local', 'LoopForge Local', 'Install in your coding assistant']] },
};

/* root: relative path to the site root ('' on the home page); page: 'home' | 'roadmap' | 'blog' */
function links({ L, root = '', page = '' }) {
  const t = T[L] || T.zh, q = L === 'en' ? '?lang=en' : '';
  const sec = id => (page === 'home' ? '#' + id : root + q + '#' + id);
  const top = (key, path) => `<a href="${root}${path}${q}"${page === key ? ' class="on" aria-current="page"' : ''}>${t[key]}</a>`;
  return `<div class="links">
   <a href="${page === 'home' ? '#top' : root + q}" data-home${page === 'home' ? ' class="on" aria-current="page"' : ''}>${t.home}</a>
   <div class="nd"><button type="button" class="nd-t" aria-expanded="false" aria-haspopup="true">${t.product}${ic('chev')}</button>
    <div class="nd-p"><div class="nd-in">${t.items.map(([id, n, d]) =>
      `<a href="${id === 'local' ? root + 'local.html#install' : sec(id)}" data-nav="${id}"><span class="nd-i">${ic(id)}</span><span class="nd-x"><b>${n}</b><small>${d}</small></span></a>`).join('')}</div></div></div>
   ${top('docs', 'docs/')}${top('roadmap', 'roadmap/')}${top('blog', 'blog/')}<a class="nm-only" href="${page === 'demo' ? '#deploy' : root + 'demo/' + q}">${page === 'demo' ? (L === 'zh' ? '快速部署' : 'Self-host') : t.demo}</a></div>`;
}
const menu = L => `<button type="button" class="nmb" aria-label="${(T[L] || T.zh).menu}" aria-expanded="false">${ic('menu', 'ic m')}${ic('x', 'ic x')}</button>`;

function bind(nav = document.querySelector('.nav')) {
  if (!nav) return;
  const dd = nav.querySelector('.nd'), btn = dd && dd.querySelector('.nd-t'), mb = nav.querySelector('.nmb');
  let shut;
  let openedByHover = false;
  const set = on => { if (!dd) return; clearTimeout(shut); openedByHover = false; dd.classList.toggle('open', on); btn.setAttribute('aria-expanded', on); };
  const hover = matchMedia('(hover:hover) and (min-width:761px)');
  if (dd) {
    dd.addEventListener('mouseenter', () => {
      clearTimeout(shut);
      if (hover.matches && !dd.classList.contains('open')) {
        set(true);
        openedByHover = true;
      }
    });
    dd.addEventListener('mouseleave', () => { if (hover.matches) shut = setTimeout(() => set(false), 160); });
  }
  if (btn) btn.addEventListener('click', event => set((openedByHover && event.detail > 0) || !dd.classList.contains('open')));
  const ls = nav.querySelector('.links');
  if (ls) ls.addEventListener('click', e => { if (e.target.closest('a')) { set(false); mo(false); } });
  const mo = on => {
    nav.classList.toggle('mo', on); document.documentElement.classList.toggle('nmo', on);
    if (mb) mb.setAttribute('aria-expanded', on);
  };
  if (mb) mb.addEventListener('click', () => { const on = !nav.classList.contains('mo'); mo(on); if (on) set(true); });
  matchMedia('(min-width:761px)').addEventListener('change', e => { if (e.matches) mo(false); });
  closeAll = () => { set(false); mo(false); };
  outside = e => { if (dd && !dd.contains(e.target) && !nav.classList.contains('mo')) set(false); };
  if (!wired) {
    wired = true;
    document.addEventListener('click', e => outside(e));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
    addEventListener('pageshow', e => { if (e.persisted) closeAll(); });
  }
}
let wired = false, closeAll = () => {}, outside = () => {};

/* on the home page: mark "Product" active while one of its sections is in view */
function sync(nav = document.querySelector('.nav')) {
  const dd = nav && nav.querySelector('.nd');
  if (dd) {
    const inProduct = !!dd.querySelector('a.on');
    dd.classList.toggle('on', inProduct);
    nav.querySelector('[data-home]')?.classList.toggle('on', !inProduct);
  }
}

let lgN = 0;
const LOGO = glint => { const g = 'blg' + (++lgN), d = 'M53 72C53 59 63 52.5 73 52.5S93 59 93 72 83 91.5 73 91.5 53 85 53 72V40C53 27 44.5 20.5 36 20.5S19 27 19 40';
  return `<svg viewBox="12 12 88 88" fill="none" aria-hidden="true"><defs><linearGradient id="${g}" x1="19" y1="20" x2="93" y2="93" gradientUnits="userSpaceOnUse"><stop stop-color="#008DCC"/><stop offset=".48" stop-color="#526CE8"/><stop offset="1" stop-color="#8A4ED9"/></linearGradient></defs><path class="lgp" pathLength="100" d="${d}" stroke="url(#${g})" stroke-width="7.6" stroke-linecap="round" stroke-linejoin="round"/>${glint ? `<path class="lgg" pathLength="100" d="${d}" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/>` : ''}</svg>`; };
const GHM = '<svg class="mk" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>';
const STAR = '<svg viewBox="0 0 800 800" fill="currentColor" aria-hidden="true"><path d="M305.105 180.279C347.327 104.538 368.437 66.6667 400 66.6667C431.563 66.6667 452.673 104.537 494.893 180.279L505.817 199.874C517.817 221.398 523.813 232.16 533.17 239.26C542.523 246.361 554.17 248.997 577.47 254.268L598.683 259.068C680.67 277.619 721.667 286.894 731.42 318.258C741.173 349.62 713.227 382.303 657.33 447.663L642.87 464.573C626.987 483.147 619.043 492.433 615.47 503.923C611.9 515.413 613.1 527.803 615.5 552.587L617.687 575.147C626.137 662.353 630.363 705.957 604.83 725.34C579.293 744.723 540.91 727.05 464.143 691.707L444.283 682.56C422.47 672.517 411.563 667.493 400 667.493C388.437 667.493 377.53 672.517 355.717 682.56L335.857 691.707C259.089 727.05 220.706 744.723 195.172 725.34C169.637 705.957 173.863 662.353 182.313 575.147L184.499 552.587C186.901 527.803 188.102 515.413 184.529 503.923C180.956 492.433 173.014 483.147 157.131 464.573L142.67 447.663C86.7749 382.303 58.8272 349.62 68.5806 318.258C78.3339 286.894 119.329 277.619 201.318 259.068L222.53 254.268C245.828 248.997 257.478 246.361 266.831 239.26C276.185 232.16 282.184 221.398 294.182 199.874L305.105 180.279Z"/></svg>';
const SPK = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5L12 0z"/></svg>';

function language(L) {
  const zh = L === 'zh';
  return `<div class="lang" role="group" aria-label="${zh ? '切换语言' : 'Switch language'}"><button type="button" data-l="zh" lang="zh-CN" aria-label="中文" aria-pressed="${L === 'zh'}">中文</button><span class="lang-slash" aria-hidden="true">/</span><button type="button" data-l="en" lang="en" aria-label="English" aria-pressed="${L === 'en'}">EN</button></div>`;
}
function header({L, root, page, searchLabel}) {
  const q = L === 'en' ? '?lang=en' : '';
  const zh = L === 'zh';
  return `<header class="nav"><i class="nprog"></i><div class="nbar"><a class="brand" href="${root}${q}">${LOGO(1)}<span>LoopForge</span></a><span class="sp"></span>
   ${links({L, root, page})}
   ${language(L)}
   <a class="ghs" href="https://github.com/Tencent/LoopForge" target="_blank" rel="noopener" aria-label="GitHub"><span class="gsw"><span class="g1">${GHM}</span><span class="g2">${STAR}</span><i class="sk s1">${SPK}</i><i class="sk s2">${SPK}</i></span><span class="gtx">GitHub</span><span class="gct" hidden></span></a><a class="btn-k sm" href="${page === 'demo' ? '#deploy' : root + 'demo/' + q}">${page === 'demo' ? (zh ? '快速部署' : 'Self-host') : T[L].demo}<span class="ar">${ic('arrow')}</span></a>${searchLabel ? `<button type="button" class="nav-search" aria-label="${searchLabel}">${ic('search')}<span>${zh ? '搜索' : 'Search'}</span></button>` : ''}${menu(L)}</div></header>`;
}
function stars() {
  const show = n => document.querySelectorAll('.ghs .gct').forEach(e => { e.textContent = n >= 1e4 ? (n / 1e3).toFixed(1) + 'k' : n.toLocaleString('en-US'); e.hidden = false; });
  try { const c = JSON.parse(localStorage.getItem('lf-stars') || 'null'); if (c) { show(c.n); if (Date.now() - c.t < 36e5) return; } } catch (e) { /* ignore */ }
  fetch('https://api.github.com/repos/Tencent/LoopForge').then(r => (r.ok ? r.json() : null)).then(j => {
    if (j && typeof j.stargazers_count === 'number') { localStorage.setItem('lf-stars', JSON.stringify({ n: j.stargazers_count, t: Date.now() })); show(j.stargazers_count); }
  }).catch(() => {});
}

return { links, menu, bind, sync, header, language, logo: LOGO, stars };
})();
