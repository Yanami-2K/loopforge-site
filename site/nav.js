/* Shared top-nav links: a "Product" dropdown for the home-page sections, then Docs, Roadmap and Blog.
   Pages call LF_NAV.links(...) / LF_NAV.menu() inside their own <header class="nav"> and LF_NAV.bind() after render. */
window.LF_NAV = (function () {
'use strict';
const P = {
  chev: 'm6 9 6 6 6-6',
  why: 'M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1',
  story: 'M6 3v12M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9a9 9 0 0 1-9 9',
  video: 'M4 5h16v14H4zM10 9l5 3-5 3z',
  deploy: 'M4 17l6-6-6-6M12 19h8',
  menu: 'M4 7h16M4 12h16M4 17h16',
};
const ic = k => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${P[k]}"/></svg>`;
const T = {
  zh: { product: '产品', docs: '使用文档', roadmap: '路线图', blog: '博客', demo: '观看演示', menu: '菜单',
    items: [['why', '核心价值', '个人快了，团队交付为什么还慢'], ['story', '工作方式', '从个人编码工具到团队级云端研发'], ['video', '演示视频', '80 秒看完整条交付流程'], ['deploy', '快速部署', '一条命令在自己的机器上跑起来']] },
  en: { product: 'Product', docs: 'Docs', roadmap: 'Roadmap', blog: 'Blog', demo: 'Watch demo', menu: 'Menu',
    items: [['why', 'Why LoopForge', 'Why team delivery is still slow'], ['story', 'How it works', 'From solo tools to team-scale delivery'], ['video', 'Video', 'The full pipeline in 80 seconds'], ['deploy', 'Deploy', 'Self-host it with one command']] },
};

/* root: relative path to the site root ('' on the home page); page: 'home' | 'roadmap' | 'blog' */
function links({ L, root = '', page = '' }) {
  const t = T[L] || T.zh, q = L === 'en' ? '?lang=en' : '';
  const sec = id => (page === 'home' ? '#' + id : root + q + '#' + id);
  const top = (key, path) => `<a href="${root}${path}${q}"${page === key ? ' class="on" aria-current="page"' : ''}>${t[key]}</a>`;
  return `<div class="links">
   <div class="nd"><button type="button" class="nd-t" aria-expanded="false" aria-haspopup="true">${t.product}${ic('chev')}</button>
    <div class="nd-p"><div class="nd-in">${t.items.map(([id, n, d]) =>
      `<a href="${sec(id)}" data-nav="${id}"><span class="nd-i">${ic(id)}</span><span class="nd-x"><b>${n}</b><small>${d}</small></span></a>`).join('')}</div></div></div>
   ${top('docs', 'docs/')}${top('roadmap', 'roadmap/')}${top('blog', 'blog/')}<a class="nm-only" href="${root}demo/${q}">${t.demo}</a></div>`;
}
const menu = L => `<button type="button" class="nmb" aria-label="${(T[L] || T.zh).menu}" aria-expanded="false">${ic('menu')}</button>`;

function bind(nav = document.querySelector('.nav')) {
  if (!nav) return;
  const dd = nav.querySelector('.nd'), btn = dd && dd.querySelector('.nd-t'), mb = nav.querySelector('.nmb');
  let shut;
  const set = on => { if (!dd) return; clearTimeout(shut); dd.classList.toggle('open', on); btn.setAttribute('aria-expanded', on); };
  const hover = matchMedia('(hover:hover) and (min-width:761px)');
  if (dd) {
    dd.addEventListener('mouseenter', () => hover.matches && set(true));
    dd.addEventListener('mouseleave', () => { if (hover.matches) shut = setTimeout(() => set(false), 160); });
    btn.addEventListener('click', () => set(!dd.classList.contains('open')));
    dd.addEventListener('click', e => { if (e.target.closest('a')) { set(false); nav.classList.remove('mo'); if (mb) mb.setAttribute('aria-expanded', false); } });
  }
  if (mb) mb.addEventListener('click', () => { const on = !nav.classList.contains('mo'); nav.classList.toggle('mo', on); mb.setAttribute('aria-expanded', on); if (on) set(true); });
  closeAll = () => { set(false); nav.classList.remove('mo'); if (mb) mb.setAttribute('aria-expanded', false); };
  outside = e => { if (dd && !dd.contains(e.target) && !nav.classList.contains('mo')) set(false); };
  if (!wired) {
    wired = true;
    document.addEventListener('click', e => outside(e));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
  }
}
let wired = false, closeAll = () => {}, outside = () => {};

/* on the home page: mark "Product" active while one of its sections is in view */
function sync(nav = document.querySelector('.nav')) {
  const dd = nav && nav.querySelector('.nd');
  if (dd) dd.classList.toggle('on', !!dd.querySelector('a.on'));
}

return { links, menu, bind, sync };
})();
