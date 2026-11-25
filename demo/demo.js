(function(){
'use strict';
const qs=new URLSearchParams(location.search);
let L=qs.get('lang')||localStorage.getItem('lf-lang')||((navigator.language||'').startsWith('zh')?'zh':'en');if(L!=='zh'&&L!=='en')L='zh';
const Z=(a,b)=>L==='zh'?a:b;
const SRC=Z('media/loopforge-promo.mp4?v=12','media/loopforge-promo-en.mp4?v=12'),POSTER=Z('media/loopforge-promo.jpg?v=12','media/loopforge-promo-en.jpg?v=12'),GH='https://github.com/Tencent/LoopForge';
let lgN=0;
const LOGO=()=>{const g='lfg'+(++lgN);return `<svg viewBox="12 12 88 88" fill="none" aria-hidden="true"><defs><linearGradient id="${g}" x1="19" y1="20" x2="93" y2="93" gradientUnits="userSpaceOnUse"><stop stop-color="#008DCC"/><stop offset=".48" stop-color="#526CE8"/><stop offset="1" stop-color="#8A4ED9"/></linearGradient></defs><path class="lgp" pathLength="100" d="M53 72C53 59 63 52.5 73 52.5S93 59 93 72 83 91.5 73 91.5 53 85 53 72V40C53 27 44.5 20.5 36 20.5S19 27 19 40" stroke="url(#${g})" stroke-width="7.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`};
const I={
 play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>',
 pause:'<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4.5" width="4" height="15" rx="1"/><rect x="14" y="4.5" width="4" height="15" rx="1"/></svg>',
 vol:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
 mute:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor"/><path d="m16 9 5 6M21 9l-5 6"/></svg>',
 fs:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
 arrow:'<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
 copy:'<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 9h11v11H9zM5 15V4h11"/></svg>',
 check:'<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12.5l4.5 4.5 10.5-10.5"/></svg>',
 term:'<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v14H4zM7.5 9.5 10 12l-2.5 2.5M12.5 15h4"/></svg>',
 film:'<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zM10 8.5v7l5.5-3.5z"/></svg>',
 x:'<svg class="mk" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>',
 replay:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 1 0 2.3-5.7"/><path d="M4 4v4h4"/></svg>',
};
// Start times match the title cards in the video.
const CH=[
 [2.8,'一句话提需求','Prompt a task','选好权限，输入需求，自动编排出 SOP','Type the task and get an SOP to run'],
 [11.5,'失败自动重跑','Auto retry','验收没过就打回上游节点，重跑后通过','Failed checks go back upstream and rerun'],
 [16.5,'多 Agent 并行','Parallel agents','前端、后端、测试各有隔离工作区','Frontend, backend, tests, each isolated'],
 [22.2,'人工确认，交付 PR','Sign-off to PR','关键节点人来确认，跑完提交 PR','A person approves key steps, then a PR'],
 [30.4,'合上电脑照样跑','Runs overnight','4 个任务在云端跑一夜，早上收到 PR','Four tasks run overnight; PRs by morning'],
 [38,'团队共用会话','Shared session','产品、设计、研发在一个会话里提要求','Product, design and dev ask in one thread'],
 [44.9,'SOP 与执行引擎','SOPs & engines','流程写成 SOP，执行引擎随时切换','Process as SOPs; swap the coding agent'],
 [51.6,'自动修 Bug','Bugs fix themselves','定时拉取 GitHub Issues，修完提 PR','Pulls GitHub Issues and opens PRs'],
 [60.4,'评测与复盘','Score and improve','给每次运行打分，改进建议一键写回 SOP','Runs get scored; fixes go into the SOP'],
 [72.5,'开源部署','Open source','MIT 协议，clone 后跑一个安装脚本','MIT licensed; clone and run one install script'],
];
// Small chapter symbols follow the actions shown in the recording.
const chapterPaths = [
 'M3 4h18v13H9l-5 4v-4H3z M7 8h10 M7 12h6',
 'M4 10a8 8 0 1 1 1 7 M4 4v6h6',
 'M3 12h5m0 0 5-7h8M8 12h13M8 12l5 7h8',
 'M5 19V5m0 7h6c4 0 7-2 7-6 M14 7l4-4 4 4',
 'M3 5h15v12H3z M1 20h20 M15 11l3 3 5-6',
 'M2 3h14v10H7l-4 4v-4H2z M10 16h7l4 4V9h-2',
 'M2 9h6v6H2z M9 12h5 M14 5v14 M14 5h7 M14 19h7',
 'M8 7l-2-3m10 3 2-3 M8 8h8v7a4 4 0 0 1-8 0z M4 10h4m8 0h4M3 14h5m8 0h5M5 19l3-2m8 0 3 2',
 'M3 3v17h18 M6 15l4-5 4 2 6-7 M16 5h4v4',
 'M3 4h18v16H3z M7 9l3 3-3 3 M13 15h4'
];
const chapterIcon=i=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><path d="${chapterPaths[i]}"/></svg>`;
const chaptersLabel=Z('分段目录','Chapters');
const mmss=s=>{s=Math.max(0,Math.floor(s||0));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
const nn=i=>String(i+1).padStart(2,'0');
document.documentElement.lang=L==='zh'?'zh-CN':'en';
document.title=Z('LoopForge · 演示视频','LoopForge · Demo video');
const home='../'+(L==='en'?'?lang=en':'');
const docs='../docs/'+(L==='en'?'?lang=en':'');
const app=document.getElementById('app');
app.innerHTML=`
${LF_NAV.header({L, root:'../', page:'demo'})}
<main>
<div class="screening-room"><section class="hd wrap"><div class="film-meta rv">${I.film}<span>${Z('实机演示','Walkthrough')} · <time datetime="PT80S">${Z('1 分 20 秒','1:20')}</time></span></div>
<h1 class="h rv d1">${Z('80 秒，看一个需求怎么走到 <span>PR</span>','From request to <span>PR</span> in 80 seconds')}</h1>
<p class="sub rv d2">${Z('一句话提需求，多个 Agent 在云端并行开发，验收不过自动打回重跑，最后提交 PR，并给这次运行打分。','One line of request, agents building in parallel in the cloud, failed checks sent back and rerun, then a pull request and a score for the run.')}</p></section>
<div id="player" class="player-layout wrap"><section class="stage" aria-label="${Z('视频播放','Video player')}">
<div class="screen" tabindex="-1">
<video playsinline preload="metadata" poster="${POSTER}" aria-label="${Z('LoopForge 演示视频','LoopForge demo video')}"><source src="${SRC}" type="video/mp4"></video>
<span class="now" aria-live="polite"><b></b><span></span></span>
<button class="big" type="button" aria-label="${Z('播放','Play')}">${I.play}</button>
<button class="snd" type="button" hidden>${I.vol}<span>${Z('打开声音','Sound on')}</span></button>
<div class="ctl">
<button class="pp" type="button" aria-label="${Z('播放','Play')}">${I.play}</button>
<span class="tm"><span class="cur">0:00</span> / <span class="dur">1:20</span></span>
<div class="track" role="slider" tabindex="0" aria-label="${Z('进度','Seek')}" aria-valuemin="0" aria-valuemax="80" aria-valuenow="0"><span class="rail"></span><span class="buf"></span><span class="done"></span>${CH.map(()=>'<span class="mk"></span>').join('')}<span class="knob"></span><span class="tip"></span></div>
<button class="strip-toggle" type="button" aria-label="${chaptersLabel}" aria-controls="chapter-strip" aria-expanded="false" title="${chaptersLabel}"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="2" y="4" width="16" height="12" rx="2"/><path d="M7 4v12M13 4v12"/></svg><span>${chaptersLabel}</span></button>
<button class="mu" type="button" aria-label="${Z('静音','Mute')}">${I.vol}</button>
<button class="fs" type="button" aria-label="${Z('全屏','Fullscreen')}">${I.fs}</button>
</div></div>
<section id="chapter-strip" class="filmstrip" aria-labelledby="strip-label" hidden>
<header><h2 id="strip-label">${chaptersLabel}</h2>
<span class="strip-count">${CH.length}</span>
<button class="strip-close" type="button" aria-label="${Z('收起目录','Close chapters')}">×</button></header>
<ol>${CH.map(([start,zh,en],i)=>`<li><button type="button" data-i="${i}"><span class="strip-index"><b>${nn(i)}</b>${chapterIcon(i)}</span><strong>${Z(zh,en)}</strong><time>${mmss(start)}</time></button></li>`).join('')}</ol>
</section>
</section>
<section class="chap" id="chapters" aria-label="${Z('分段目录','Chapters')}"><div class="chh"><span class="kick">${I.film}${Z('分段目录','Chapters')}</span><span class="hint">${Z('点击跳转','Select a chapter')}<span class="key-hint">${Z(' · 数字键 1–0 也可以',' · or press 1–0')}</span></span></div><ol>
${CH.map(([t,a,b,c,d],i)=>`<li><button type="button" data-i="${i}"><span class="ct"><span class="chapter-index"><b>${nn(i)}</b>${chapterIcon(i)}</span><span class="chapter-time"><span class="range-mini" aria-hidden="true"><i></i></span><time>${mmss(t)}</time></span></span><strong>${Z(a,b)}</strong><small>${Z(c,d)}</small><span class="bar"><i></i></span></button></li>`).join('')}
</ol></section>
</div></div>
<section class="fin wrap" id="deploy"><span class="fl">${LOGO()}</span><h2 class="h">${Z('看完了，<em>自己部署</em>跑一遍','Now <em>run it yourself</em>')}</h2>
<p class="sub">${Z('MIT 协议开源，需要 Docker 和 Python 3。','MIT licensed; requires Docker and Python 3.')}</p>
<div class="ibox"><div class="ibh"><i></i><i></i><i></i><span>bash</span><span class="sp"></span><button type="button" class="cp">${I.copy}<span>${Z('复制','Copy')}</span></button></div>
<div class="row"><span>$</span><code>git clone ${GH}.git && cd LoopForge</code></div><div class="row"><span>$</span><code>bash scripts/install.sh</code></div></div>
<div class="cta"><a class="btn-k" href="${docs}">${Z('使用文档','Read docs')}<span class="ar">${I.arrow}</span></a><a class="btn-t" href="${home}">${Z('回到首页','Back to home')}<span class="ar">${I.arrow}</span></a></div></section>
</main>
<footer class="ft"><a class="brand" href="${home}">${LOGO()}<span>LoopForge</span></a><span>${Z('LoopForge 由腾讯开源，遵循 MIT 协议','LoopForge is open-sourced by Tencent under the MIT License')} · <a href="${GH}" target="_blank" rel="noopener">github.com/Tencent/LoopForge</a></span></footer>`;


const $=s=>app.querySelector(s);
const v=$('video'),screen=$('.screen'),big=$('.big'),snd=$('.snd'),pp=$('.pp'),mu=$('.mu'),track=$('.track'),done=$('.track .done'),buf=$('.track .buf'),knob=$('.track .knob'),tip=$('.track .tip');
const nowEl=$('.now'),chapBtns=[...app.querySelectorAll('.chap button')],marks=[...app.querySelectorAll('.track .mk')];
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let dur=80;
const play=()=>v.play().catch(()=>{});
const toggle=()=>v.paused||v.ended?play():v.pause();
const seek=t=>{v.currentTime=Math.min(Math.max(0,t),dur-.05)};
const chapAt=t=>{let c=0;CH.forEach(([s],i)=>{if(t>=s)c=i});return t<CH[0][0]?-1:c};

const strip = $('.filmstrip');
const stage = $('.stage');
const stripToggle = $('.strip-toggle');
const stripItems = [...strip.querySelectorAll('li button')];
function openStrip(open,restoreFocus=false){
 strip.hidden = !open;
 stripToggle.setAttribute('aria-expanded',String(open));
 if(open){
  const current = stripItems[Math.max(0,chapAt(v.currentTime))];

  current.focus({preventScroll:true});
  requestAnimationFrame(()=>{
   if(strip.hidden || document.fullscreenElement)return;
   const topInset=$('.nav').getBoundingClientRect().bottom+8;
   const combined=stage.getBoundingClientRect();
   const bounds=combined.height<=innerHeight-topInset-8?combined:strip.getBoundingClientRect();
   const delta=bounds.top<topInset?bounds.top-topInset:Math.max(0,bounds.bottom-innerHeight+8);
   if(Math.abs(delta)>1)scrollBy({top:delta,behavior:reduced?'instant':'smooth'});
  });
 } else if(restoreFocus) stripToggle.focus({preventScroll:true});
 poke();
}
stripToggle.onclick=()=>openStrip(strip.hidden);
$('.strip-close').onclick=()=>openStrip(false,true);
stripItems.forEach((button,i)=>button.onclick=()=>{
 seek(CH[i][0]); play(); openStrip(false,true);
});
strip.addEventListener('keydown',e=>{
 const i=stripItems.indexOf(e.target);
 const columns=getComputedStyle(strip.querySelector('ol')).gridTemplateColumns.split(' ').length;
 const step={ArrowUp:-1,ArrowDown:1,ArrowLeft:columns===2?-5:-1,ArrowRight:columns===2?5:1}[e.key];
 if(i<0||!step)return;
 e.preventDefault();e.stopPropagation();
 const button=stripItems[Math.min(CH.length-1,Math.max(0,i+step))];
 button.focus({preventScroll:true});
});
document.addEventListener('focusin',e=>{
 if(!strip.hidden && !strip.contains(e.target) && e.target!==screen && !stripToggle.contains(e.target))openStrip(false);
});
document.addEventListener('pointerdown',e=>{
 if(!strip.hidden && !stage.contains(e.target))openStrip(false);
});
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&!strip.hidden){e.preventDefault();openStrip(false,true)}
});
function layoutMarks(){
 CH.forEach(([start],i)=>{
  chapBtns[i].style.setProperty('--cue-start',start/dur*100+'%');
  chapBtns[i].style.setProperty('--cue-length',((CH[i+1]?.[0]??dur)-start)/dur*100+'%');
 });
marks.forEach((m,i)=>{m.style.left=CH[i][0]/dur*100+'%'});track.setAttribute('aria-valuemax',Math.round(dur));$('.dur').textContent=mmss(dur)}
v.addEventListener('loadedmetadata',()=>{if(isFinite(v.duration))dur=v.duration;layoutMarks()});
layoutMarks();

let last=-2;
function paint(){
 const t=v.currentTime,p=t/dur*100;
 done.style.width=p+'%';knob.style.left=p+'%';
 $('.cur').textContent=mmss(t);track.setAttribute('aria-valuenow',Math.floor(t));track.setAttribute('aria-valuetext',mmss(t));
 const c=chapAt(t);
 if(c!==last){
  stripItems.forEach((b,i)=>b.setAttribute('aria-current',i===c));
  chapBtns.forEach((b,i)=>{b.setAttribute('aria-current',i===c);if(i!==c)b.querySelector('.bar i').style.width='0'});last=c;
  nowEl.classList.remove('on');if(c>=0){nowEl.firstChild.textContent=nn(c)+' / '+CH.length;nowEl.lastChild.textContent=Z(CH[c][1],CH[c][2]);void nowEl.offsetWidth;nowEl.classList.add('on')}
 }
 if(c>=0){const s=CH[c][0],e=c+1<CH.length?CH[c+1][0]:dur;chapBtns[c].querySelector('.bar i').style.width=Math.min(100,(t-s)/(e-s)*100)+'%'}
}
let raf=0;
const loop=()=>{paint();raf=v.paused?0:requestAnimationFrame(loop)};
v.addEventListener('timeupdate',()=>{if(!raf)paint()});
v.addEventListener('play',()=>{screen.classList.add('playing');pp.innerHTML=I.pause;pp.setAttribute('aria-label',Z('暂停','Pause'));if(!raf)raf=requestAnimationFrame(loop);poke()});
v.addEventListener('pause',()=>{screen.classList.remove('playing','idle');pp.innerHTML=I.play;pp.setAttribute('aria-label',Z('播放','Play'))});
v.addEventListener('ended',()=>{big.innerHTML=I.replay;big.setAttribute('aria-label',Z('重新播放','Replay'))});
v.addEventListener('seeked',()=>{if(!v.ended){big.innerHTML=I.play;big.setAttribute('aria-label',Z('播放','Play'))}paint()});
v.addEventListener('progress',()=>{if(v.buffered.length)buf.style.width=v.buffered.end(v.buffered.length-1)/dur*100+'%'});
function syncVol(){const m=v.muted||v.volume===0;mu.innerHTML=m?I.mute:I.vol;mu.setAttribute('aria-label',m?Z('取消静音','Unmute'):Z('静音','Mute'));snd.hidden=!m||v.paused}
v.addEventListener('volumechange',syncVol);v.addEventListener('play',syncVol);v.addEventListener('pause',syncVol);

big.addEventListener('click',e=>{e.stopPropagation();if(v.ended)seek(0);v.muted=false;play()});
pp.addEventListener('click',e=>{e.stopPropagation();toggle()});
mu.addEventListener('click',e=>{e.stopPropagation();v.muted=!v.muted;if(!v.muted&&v.volume===0)v.volume=1});
snd.addEventListener('click',e=>{e.stopPropagation();v.muted=false;v.volume=1});
$('.fs').addEventListener('click',e=>{e.stopPropagation();if(document.fullscreenElement)document.exitFullscreen();else if(stage.requestFullscreen)stage.requestFullscreen();else if(v.webkitEnterFullscreen)v.webkitEnterFullscreen()});
screen.addEventListener('click',e=>{if(e.target.closest('.ctl,.filmstrip'))return;if(!strip.hidden){openStrip(false,true);return}toggle()});
screen.addEventListener('dblclick',e=>{if(!e.target.closest('.ctl,.filmstrip'))$('.fs').click()});
$('.ctl').addEventListener('click',e=>e.stopPropagation());

let idleT=0;
function poke(){screen.classList.remove('idle');clearTimeout(idleT);idleT=setTimeout(()=>{if(strip.hidden&&!v.paused&&!track.classList.contains('drag'))screen.classList.add('idle')},2200)}
screen.addEventListener('pointermove',poke);screen.addEventListener('focusin',poke);

function trackTarget(event, snap) {
 const bounds = track.getBoundingClientRect();
 const x = Math.min(bounds.width,Math.max(0,event.clientX-bounds.left));
 const time = x / bounds.width * dur;
 if (snap) {
  const radius = Math.min(event.pointerType==='touch' ? 8 : 5,bounds.width*.022);
  const marker = CH.find(([start])=>Math.abs(start/dur*bounds.width-x)<=radius);
  if (marker) return marker[0];
 }
 return time;
}
function showTime(time) {
 const i = chapAt(time);
 tip.textContent = mmss(time)+(i<0 ? '' : ' · '+Z(CH[i][1],CH[i][2]));
 const half = tip.offsetWidth/2;
 tip.style.left = Math.max(half,Math.min(track.clientWidth-half,track.clientWidth*time/dur))+'px';
}
let dragStart = null;
track.addEventListener('pointerdown',event=>{
 if (!event.isPrimary || event.button!==0) return;
 track.setPointerCapture(event.pointerId);
 track.classList.add('drag');
 dragStart = event.clientX;
 const t = trackTarget(event,true);
 showTime(t);
 seek(t);
});
track.addEventListener('pointermove',event=>{
 if (!event.isPrimary) return;
 const dragging = dragStart!==null;
 const t = trackTarget(event,!dragging || Math.abs(event.clientX-dragStart)<3);
 showTime(t);
 if (dragging) seek(t);
});
function endDrag(){dragStart=null;track.classList.remove('drag');poke()}
track.addEventListener('lostpointercapture',endDrag);
track.addEventListener('keydown',e=>{const k={ArrowLeft:-5,ArrowRight:5,ArrowDown:-10,ArrowUp:10}[e.key];if(k){e.preventDefault();e.stopPropagation();seek(v.currentTime+k)}else if(e.key==='Home'){e.preventDefault();seek(0)}else if(e.key==='End'){e.preventDefault();seek(dur)}});

chapBtns.forEach((b,i)=>b.addEventListener('click',()=>{seek(CH[i][0]);play();const r=screen.getBoundingClientRect();if(r.top<0||r.bottom>innerHeight)screen.scrollIntoView({behavior:reduced?'auto':'smooth',block:'center'})}));

document.addEventListener('keydown',e=>{
 if(e.ctrlKey||e.metaKey||e.altKey||/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName))return;
 const onBtn=e.target.tagName==='BUTTON'||e.target.tagName==='A';
 if((e.key===' '&&!onBtn)||e.key==='k'){e.preventDefault();toggle()}
 else if(e.key==='ArrowLeft'&&e.target!==track){seek(v.currentTime-5)}
 else if(e.key==='ArrowRight'&&e.target!==track){seek(v.currentTime+5)}
 else if(e.key==='m'){v.muted=!v.muted}
 else if(e.key==='f'){$('.fs').click()}
 else if(/^[0-9]$/.test(e.key)){const c=CH[(+e.key+9)%10];if(c){seek(c[0]);play()}}
});


$('.cp').addEventListener('click', async event => {
 const button = event.currentTarget;
 const box = button.closest('.ibox');
 const command = [...box.querySelectorAll('code')].map(code => code.textContent).join('\n');
 clearTimeout(button._t);
 try {
  await navigator.clipboard.writeText(command);
  box.querySelector('.copy-fallback')?.remove();
  button.classList.add('ok');
  button.innerHTML = I.check + '<span>' + Z('已复制','Copied') + '</span>';
  button._t = setTimeout(() => {
   button.classList.remove('ok');
   button.innerHTML = I.copy + '<span>' + Z('复制','Copy') + '</span>';
  }, 1600);
 } catch {
  let field = box.querySelector('.copy-fallback');
  if (!field) {
   field = document.createElement('textarea');
   field.className = 'copy-fallback';
   field.readOnly = true;
   field.rows = 3;
   field.setAttribute('aria-label', Z('手动复制部署命令','Copy deployment commands manually'));
   box.append(field);
  }
  field.value = command;
  button.classList.remove('ok');
  button.querySelector('span').textContent = Z('请手动复制','Copy manually');
  field.focus();
  field.select();
 }
});
try{const c=JSON.parse(localStorage.getItem('lf-stars')||'null');if(c&&typeof c.n==='number'){const e=$('.ghs .gct');e.textContent=c.n>=1e4?(c.n/1e3).toFixed(1)+'k':c.n.toLocaleString('en-US');e.hidden=false}}catch(e){}
LF_NAV.bind();
const nav=$('.nav'),onSc=()=>nav.classList.toggle('sc',scrollY>8);addEventListener('scroll',onSc,{passive:true});onSc();
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -10% 0px'});
app.querySelectorAll('.chap,.fin').forEach(el=>io.observe(el));
app.querySelectorAll('.lang button').forEach(b=>b.addEventListener('click',()=>{localStorage.setItem('lf-lang',b.dataset.l);const u=new URL(location);u.searchParams.set('lang',b.dataset.l);location.replace(u)}));

// Muted autoplay so the page opens on a moving scene; sound is one click away.
function cueRetryChapter(){
 const cue = () => {seek(CH[1][0]); $('.player-layout').scrollIntoView({block:'start',behavior:'instant'})};
 if(v.readyState >= 1) cue(); else v.addEventListener('loadedmetadata',cue,{once:true});
}
function openLinkedStrip(){
 $('.player-layout').scrollIntoView({block:'start',behavior:'instant'});
 openStrip(true);
}
addEventListener('hashchange',()=>{
 if(location.hash === '#retry') cueRetryChapter();
 if(location.hash === '#chapter-strip') openLinkedStrip();
});
if(location.hash === '#retry') cueRetryChapter();
else if(location.hash === '#chapter-strip') openLinkedStrip();
else if(!reduced){v.muted=true;play()}
})();
