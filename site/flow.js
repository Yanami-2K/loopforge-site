(function(){
const T=window.LF_T,qs=new URLSearchParams(location.search);
let L=qs.get('lang')||localStorage.getItem('lf-lang')||((navigator.language||'').startsWith('zh')?'zh':'en');if(!T[L])L='zh';
/* ---------- easing tokens: out (entrances), io (moves), spring lives in CSS ---------- */
function bez(x1,y1,x2,y2){const cx=3*x1,bx=3*(x2-x1)-cx,ax=1-cx-bx,cy=3*y1,by=3*(y2-y1)-cy,ay=1-cy-by;const sx=t=>((ax*t+bx)*t+cx)*t,sy=t=>((ay*t+by)*t+cy)*t;
 return x=>{if(x<=0)return 0;if(x>=1)return 1;let a=0,b=1,t=x;for(let i=0;i<24;i++){t=(a+b)/2;if(sx(t)<x)a=t;else b=t}return sy(t)}}
const EIO=bez(.65,0,.35,1),EO=bez(.22,1,.36,1),cl=v=>v<0?0:v>1?1:v,R=(p,a,b)=>cl((p-a)/(b-a)),lerp=(a,b,t)=>a+(b-a)*t;
const Z=(a,b)=>L==='zh'?a:b;
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
/* ---------- marks ---------- */
const LOGO=`<svg viewBox="0 0 64 64" fill="none"><path d="M45.2 19.2A10 10 0 1 1 42 4.8" stroke="#FF5A1F" stroke-width="4.4" stroke-linecap="round"/><path d="M46.5 7.8L39.0 9.0L42.8 1.4z" fill="#FF5A1F" stroke="#FF5A1F" stroke-width="1.2" stroke-linejoin="round"/><path d="M3 30.5c6.5 0 11.2-1.6 15-3.5H58v7.8h-8.6c-3.6 0-5.9 2.6-5.9 5.8V44h7.2v6.5H20.8V44H28v-3.4c0-3.2-2.3-5.8-5.9-5.8H17C10.8 34.8 6 33.2 3 30.5z" fill="currentColor"/></svg>`;
// Product marks: Claude, Codex (OpenAI), Cursor, CodeBuddy from LobeHub Icons (@lobehub/icons-static-svg, MIT);
// Pi from pi.dev's own favicon; GitHub from Simple Icons (CC0). Trademarks of their owners, used only to name the agent each command targets.
const MARK={
 claude:['0 0 24 24','M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z'],
 codex:['0 0 24 24','M8.086.457a6.105 6.105 0 013.046-.415c1.333.153 2.521.72 3.564 1.7a.117.117 0 00.107.029c1.408-.346 2.762-.224 4.061.366l.063.03.154.076c1.357.703 2.33 1.77 2.918 3.198.278.679.418 1.388.421 2.126a5.655 5.655 0 01-.18 1.631.167.167 0 00.04.155 5.982 5.982 0 011.578 2.891c.385 1.901-.01 3.615-1.183 5.14l-.182.22a6.063 6.063 0 01-2.934 1.851.162.162 0 00-.108.102c-.255.736-.511 1.364-.987 1.992-1.199 1.582-2.962 2.462-4.948 2.451-1.583-.008-2.986-.587-4.21-1.736a.145.145 0 00-.14-.032c-.518.167-1.04.191-1.604.185a5.924 5.924 0 01-2.595-.622 6.058 6.058 0 01-2.146-1.781c-.203-.269-.404-.522-.551-.821a7.74 7.74 0 01-.495-1.283 6.11 6.11 0 01-.017-3.064.166.166 0 00.008-.074.115.115 0 00-.037-.064 5.958 5.958 0 01-1.38-2.202 5.196 5.196 0 01-.333-1.589 6.915 6.915 0 01.188-2.132c.45-1.484 1.309-2.648 2.577-3.493.282-.188.55-.334.802-.438.286-.12.573-.22.861-.304a.129.129 0 00.087-.087A6.016 6.016 0 015.635 2.31C6.315 1.464 7.132.846 8.086.457zm-.804 7.85a.848.848 0 00-1.473.842l1.694 2.965-1.688 2.848a.849.849 0 001.46.864l1.94-3.272a.849.849 0 00.007-.854l-1.94-3.393zm5.446 6.24a.849.849 0 000 1.695h4.848a.849.849 0 000-1.696h-4.848z'],
 cursor:['0 0 24 24','M22.106 5.68L12.5.135a.998.998 0 00-.998 0L1.893 5.68a.84.84 0 00-.419.726v11.186c0 .3.16.577.42.727l9.607 5.547a.999.999 0 00.998 0l9.608-5.547a.84.84 0 00.42-.727V6.407a.84.84 0 00-.42-.726zm-.603 1.176L12.228 22.92c-.063.108-.228.064-.228-.061V12.34a.59.59 0 00-.295-.51l-9.11-5.26c-.107-.062-.063-.228.062-.228h18.55c.264 0 .428.286.296.514z'],
 codebuddy:['0 0 24 24','M18.777 1.647c.28-.02.536.114.972.51 1.018.926 2.437 2.828 3.318 4.452l.34.631.482.24.11.06v3.638a5.206 5.206 0 00-5.32-1.23c-.491.166-1.021.471-2.08 1.082l-6.09 3.516c-1.057.61-1.586.916-1.975 1.259a5.208 5.208 0 00-1.493 5.572c.165.49.471 1.02 1.082 2.08l.315.543h-3.26c-.685 0-1.34-.135-1.939-.377-.169-.956-.009-1.789.469-2.335.158-.18.164-.189.13-.493a11.846 11.846 0 01-.057-1.711l.02-.444-.667-1.18C2.1 15.622 1.445 14.078 1.192 12.9c-.133-.647-.125-.934.04-1.146.1-.128.427-.261.822-.334.994-.175 3.162-.017 5.575.41l.25.043.551-.487c.915-.81 1.522-1.264 2.641-1.962 1.167-.73 2.484-1.331 3.967-1.807l.476-.152.261-.688c.937-2.471 1.896-4.293 2.58-4.9.235-.21.25-.22.422-.23z M12.139 18.2a1.203 1.203 0 011.642.44l1.296 2.243a1.204 1.204 0 01-2.083 1.203l-1.296-2.243a1.203 1.203 0 01.44-1.644zM18.629 14.452a1.203 1.203 0 011.642.44l1.295 2.244a1.203 1.203 0 11-2.083 1.203l-1.295-2.243a1.203 1.203 0 01.44-1.644z'],
 gh:['0 0 24 24','M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'],
 pi:['0 0 560 560','M420 280H280V140H0V0H420V280Z M560 560H420V280H560V560Z M140 560H0V140H140V280H280V420H140V560Z']};
const mark=(id,cls='')=>`<svg class="mk ${cls}" viewBox="${MARK[id][0]}" fill="currentColor" aria-hidden="true"><path d="${MARK[id][1]}"/></svg>`;
const AGENTS=[['claude','Claude Code'],['codex','Codex'],['cursor','Cursor'],['codebuddy','CodeBuddy'],['pi','Pi']];
const EXECS=[['codebuddy','CodeBuddy'],['codex','Codex'],['claude','Claude Code']];
const TRY=()=>'demo/'+(L==='en'?'?lang=en':'');
const strip=(at,list=AGENTS,lab=Z('支持 5 个 Agent ——','Works with 5 agents —'))=>`<div class="astrip"><div class="ac rv" data-at="${at}">${lab}</div>${list.map((a,i)=>`<span class="ai rv pop" data-at="${(at+.03+i*.035).toFixed(3)}">${mark(a[0])}${a[1]}</span>`).join('')}</div>`;
const lines=(h,em)=>h.split('<br>').map((x,i)=>`<span class="hl"><span class="rv up" data-at="${(.03+i*.06).toFixed(2)}">${em?em(x):x}</span></span>`).join('');
const txt=(s,side,extra='')=>`<div class="txt ${side}"><div class="kick rv" data-at="0">${s.k}</div><h2 class="h">${lines(s.h)}</h2><p class="sub rv" data-at=".12">${s.sub}</p>${extra}</div>`;
const tb=(t,extra='')=>`<div class="tb"><i></i><i></i><i></i><span>${t}</span>${extra}</div>`;
const fig=(n,s)=>`<span class="fig">FIG.${n} — ${s}</span>`;
/* ---------- scenes ---------- */
const CUR='<svg viewBox="0 0 16 20"><path d="M1 1l13.5 7.2-5.8 1.4L6 15.4z" fill="#16161A" stroke="#fff" stroke-width="1.3" stroke-linejoin="round"/></svg>';
const EXN={codebuddy:'CodeBuddy',codex:'Codex',claude:'Claude Code',gh:'GitHub'};
const emph=(h,em)=>x=>em&&x.includes(em)?x.replace(em,`<em>${em}</em>`):x;
const txt2=(s,side,extra='',top=196)=>`<div class="txt ${side}" style="top:${top}px"><div class="kick rv" data-at="0">${s.k}</div><h2 class="h"${s.fs?` style="font-size:${s.fs}px"`:''}>${lines(s.h,emph(s.h,s.em))}</h2><p class="sub rv" data-at=".12">${s.sub}</p>${extra}</div>`;
const W=(side,n,s,body,extra='',top=150)=>`<div class="persp"><div class="win ${side}" data-k="win" style="top:${top}px">${fig(n,s.fig)}${tb(s.win,extra)}${body}</div></div>`;
const DEMO=()=>`<span class="sp"></span><span class="chip dmo">${T[L].demo}</span>`;
const f2=x=>x.toFixed(3);
/* hero: the built-in bug-fix SOP on the designer canvas (node names/outputs follow the public catalog) */
const PN=[[0,0,'agent'],[1,0,'agent'],[2,0,'agent'],[3,0,'agent'],[3,1,'agent'],[2,1,'human'],[1,1,'agent']];
const NX=c=>28+c*170,NY=r=>34+r*176,NW=146,NH=84;
function hero(t){const c=t.hero;
 const nd=(n,i)=>{const[col,row,ty]=PN[i];return `<div class="nd ${ty} rv pop" data-at="${f2(.08+i*.05)}" style="left:${NX(col)}px;top:${NY(row)}px"><div class="nt"><span class="ty">${c.ty[ty]}</span>${ty==='agent'?'<span class="ex">codebuddy</span>':''}<i class="st" data-tick="${f2(.62+i*.045)}" data-cls="dn"></i></div><b>${n[0]}</b><small>${n[1]}</small></div>`};
 const my=r=>NY(r)+NH/2,cx=c=>NX(c)+NW/2;
 const E=[[NX(0)+NW,my(0),NX(1),my(0)],[NX(1)+NW,my(0),NX(2),my(0)],[NX(2)+NW,my(0),NX(3),my(0)],[cx(3),NY(0)+NH,cx(3),NY(1)],[NX(3),my(1),NX(2)+NW,my(1)],[NX(2),my(1),NX(1)+NW,my(1)]];
 const ah=(x2,y2,dx,dy)=>{const px=-dy,py=dx;return `M${x2} ${y2}L${x2-dx*7+px*4} ${y2-dy*7+py*4}L${x2-dx*7-px*4} ${y2-dy*7-py*4}z`};
 const edges=E.map((e,i)=>{const a=f2(.14+i*.05),dx=Math.sign(e[2]-e[0]),dy=Math.sign(e[3]-e[1]);return `<path class="eg dr" pathLength="1" data-at="${a}" d="M${e[0]} ${e[1]}L${e[2]} ${e[3]}"/><path class="ahd rvo" data-at="${f2(+a+.04)}" d="${ah(e[2],e[3],dx,dy)}"/>`}).join('');
 const rx=cx(2)+30;const rej=`<path class="eg rej rvo" data-at=".5" d="M${rx} ${NY(1)}L${rx} ${NY(0)+NH}"/><path class="ahd rj rvo" data-at=".5" d="${ah(rx,NY(0)+NH,0,-1)}"/>`;
 return `
 <div class="txt l" style="top:186px"><div class="kick rv" data-at="0">${c.k}</div><h1 class="h" style="font-size:${Z(56,46)}px">${lines(c.h,emph(c.h,c.em))}</h1><p class="sub rv" data-at=".12">${c.sub}</p>
 <div class="rv cta" data-at=".18"><a class="pill f" href="${TRY()}">${t.try} →</a><a class="pill" href="#" data-go="${SCN.length-1}">${c.deploy}</a></div>
 ${strip(.24,EXECS,c.exec)}</div>
 ${W('r','01',c,`<div class="cvs"><div class="cvi"><svg class="egs" width="718" height="330" viewBox="0 0 718 330">${edges}${rej}</svg>
 <span class="rlab rvo" data-at=".52" style="left:${rx+8}px;top:${(NY(0)+NH+NY(1))/2-9}px">${c.rej}</span>
 ${c.nodes.map(nd).join('')}
 <div class="lgd rv" data-at=".5" style="left:${NX(0)}px;top:${NY(1)+8}px"><div><i class="l1"></i>${c.lg[0]}</div><div><i class="l2"></i>${c.lg[1]}</div></div></div></div>`,`<span class="sp"></span><span class="chip">${c.pub}</span>`,196)}`}
function why(t){const c=t.why;return `${txt2(c,'l',`<p class="close rv" data-at=".5">${c.close}</p>`)}
 <div class="pains">${c.pains.map((x,i)=>`<div class="pain rv slide" data-at="${(.14+i*.1).toFixed(2)}"><span>${String(i+1).padStart(2,'0')} / ${x[0]}</span><h3>${x[1]}</h3><p>${x[2]}</p></div>`).join('')}</div>`}
/* one requirement moving through the SOP, one role per step */
function sop(t){const c=t.sop;
 return `${txt2(c,'r')}${W('l','02',c,`<div class="pipe"><div class="ptl rv" data-at=".04">${t.req}</div><div class="ph">${c.head.map(h=>`<span>${h}</span>`).join('')}<span></span></div>
 ${c.rows.map((r,i)=>{const a=.1+i*.09;return `<div class="pr rv" data-at="${f2(a)}"><b><i>${i+1}</i>${r[0]}</b><span>${r[1]}</span><span class="ex">${mark(r[2])}${EXN[r[2]]}</span><code class="rv pop" data-at="${f2(a+.05)}">${r[3]}</code><span class="spin" data-tick="${f2(a+.08)}"></span></div>`}).join('')}
 <div class="pf rv" data-at=".72">${c.foot}</div></div>`)}`}
/* a gate run: the agent claims done, the command decides */
function gate(t){const c=t.gate;const ln=(a,h,cls='')=>`<div class="rv ${cls}" data-at="${a}">${h}</div>`;
 return `${txt2(c,'l')}${W('r','03',c,`<div class="term sm gtm">
 ${ln('.04',`<span class="dm">${c.win}</span>`)}
 ${ln('.08',`<span class="ok">●</span> ${c.claim}`)}
 ${ln('.15',`<span class="ps">$</span> <span class="cmd">go test ./...</span> <span class="dm">· ${c.run}</span>`)}
 ${c.fails.map((f,i)=>ln(f2(.24+i*.05),esc(f),'bad')).join('')}
 ${ln('.36',`<b>${c.exit}</b>`,'bad')}
 ${ln('.42',`↩ ${c.verdict}`,'vd no')}
 ${ln('.54',`<span class="dm">${c.retry}</span>`,'gap')}
 ${ln('.58',`<span class="ok">●</span> ${c.fixed}`)}
 ${ln('.64',`<span class="ps">$</span> <span class="cmd">go test ./...</span>`)}
 ${ln('.72',`<span class="ok">✓</span> ${c.pass}`)}
 ${ln('.8',`✓ ${c.done}`,'vd yes')}</div>`,'',150)}`}
/* everything about one requirement in one place */
function ctx(t){const c=t.ctx;
 return `${txt2(c,'r')}${W('l','04',c,`<div class="th"><div class="tht"><b>${t.req}</b></div><div class="ttab">${c.tabs.map((x,i)=>`<span class="${i===5?'on':''}">${x}</span>`).join('')}</div>
 <div class="rql">${c.items.map((it,i)=>{const a=.1+i*.09;return `<div class="rqi ${it[0]} rv" data-at="${f2(a)}"><span class="avt">${it[0]==='p'?it[1][0]:'AI'}</span><div><b>${it[1]}</b><p>${it[2]}</p></div>${it[3]?`<code class="rv pop" data-at="${f2(a+.05)}">${it[3]}</code>`:''}</div>`}).join('')}</div>
 <div class="shr rv" data-at=".72">${c.share}</div></div>`,'',140)}`}
/* usage dashboard: spend, delivery, where it stalls */
function obs(t){const c=t.obs;const mx=Math.max(...c.stages.map(s=>s[1]));
 return `${txt2(c,'l')}${W('r','05',c,`<div class="db"><div class="kp">${c.kpi.map((k,i)=>`<div class="rv" data-at="${f2(.08+i*.04)}"><span>${k[0]}</span><b data-cnt="${k[1]}" data-a=".12" data-b=".42">${k[1]}</b></div>`).join('')}</div>
 <div class="sg rv" data-at=".26"><div class="sgh">${c.stg}</div>${c.stages.map((s,i)=>`<div class="sr${s[1]===mx?' hot':''}"><span>${s[0]}</span><i><em class="bar" style="--w:${Math.round(s[1]/mx*100)}%" data-tick="${f2(.3+i*.04)}" data-cls="on"></em></i><b>${s[1]}<small> ${c.unit}</small></b></div>`).join('')}<div class="stuck rv pop" data-at=".62">↑ ${c.stuck}</div></div>
 <div class="rl">${c.rows.map((r,i)=>`<div class="rr rv" data-at="${f2(.66+i*.05)}"><code>${r[0]}</code><span>${r[1]}</span><em class="s${i}">${r[2]}</em><b>${r[3]} tokens</b></div>`).join('')}</div></div>`,DEMO(),160)}`}
/* human approval gate inside a run */
function loop(t){const c=t.loop;
 return `${txt2(c,'r')}${W('l','06',c,`<div class="gt">
  <div class="gh"><div><div class="gid">${Z('缺陷修复 SOP','Bug fix SOP')} · v1 · LOOP-12</div><h3>${t.req}</h3></div><span class="gs" data-k="gs">${c.wait}</span></div>
  <div class="topo">${c.short.map((x,i)=>`<span class="tp${i<5?' dn':''}${i===5?' wt':''}"${i===5?' data-k="t5"':''}${i===6?' data-k="t6"':''}><i></i>${x}</span>`).join('<b></b>')}</div>
  <div class="apv rv" data-at=".08" data-k="apv"><div class="ah"><span class="gs">${c.wait}</span><b>${c.need}</b><span>${c.step}</span></div>
   <p>${c.basis}</p>
   ${c.arts.map((a,i)=>`<div class="ar rv" data-at="${(.14+i*.05).toFixed(2)}"><code>${a[0]}</code><span>${a[1]}</span><i>✓</i></div>`).join('')}
   <div class="ctx rv" data-at=".3">${c.ctx}</div>
   <div class="abt rv" data-at=".34"><span class="btn" data-k="okb" data-press=".56">${c.ok}</span><span class="gbtn">${c.back}</span><span class="stamp" data-at=".6">${c.stamp}</span></div></div>
  <div class="tail rv" data-at=".86"><span class="ok">✓</span> ${c.tail}</div></div>
  <div class="mcur" data-k="mc">${CUR}<i></i></div>`)}`}
/* run evaluation: weighted score + suggestions that can be written back */
function evals(t){const c=t.eval;const tot=c.dims.reduce((a,d)=>a+d[2],0);
 return `${txt2(c,'l')}${W('r','07',c,`<div class="ev"><div class="evs rv" data-at=".06"><div class="ring"><b data-cnt="${tot}" data-a=".1" data-b=".42">${tot}</b><small>/100</small></div><div><span>${c.score}</span><em class="rv pop" data-at=".44">✓ ${c.base}</em></div></div>
 <div class="evd">${c.dims.map((d,i)=>`<div class="dr2 rv" data-at="${f2(.12+i*.04)}"><span>${d[0]}</span><i><em class="bar" style="--w:${Math.round(d[2]/d[1]*100)}%" data-tick="${f2(.18+i*.04)}" data-cls="on"></em></i><b>${d[2]}<small>/${d[1]}</small></b></div>`).join('')}</div>
 <div class="evg"><div class="sgh rv" data-at=".5">${c.sug}</div>${[c.s1,c.s2].map((s,i)=>`<div class="sgi rv" data-at="${f2(.56+i*.08)}"><p>${s}</p><span class="gbtn">${c.apply}</span><span class="btn">${c.write}</span></div>`).join('')}</div></div>`,DEMO(),160)}`}
const INS={platform:['git clone https://github.com/Tencent/LoopForge.git && cd LoopForge','bash scripts/install.sh','open http://localhost:8090','Platform'],claude:['npx -y loopforge-cli@latest install claude','npx -y loopforge-cli@latest status claude','/start-devflow','Classic'],codex:['npx -y loopforge-cli@latest install codex','npx -y loopforge-cli@latest status codex','$devflow-codex','Classic'],
 cursor:['npx -y loopforge-cli@latest install cursor','npx -y loopforge-cli@latest status cursor','/start-devflow','Classic'],codebuddy:['npx -y loopforge-cli@latest install codebuddy','npx -y loopforge-cli@latest status codebuddy','/start-devflow','Classic'],
 pi:['npx -y loopforge-cli@latest skills install pi','pi install npm:pi-subagents','/skill:devflow','Portable']};
const REQ=()=>Z('"为订单列表增加状态筛选，并补充接口测试"','"Add a status filter to the order list and cover the API with tests"');
const stLine=id=>id==='platform'?INS[id][2]:`${INS[id][2]} ${REQ()}`;
const edNote=id=>INS[id][3]==='Platform'?Z('平台版 · 第一个注册的账号自动成为管理员，新手引导里的“一键体验”不需要 API Key','Platform · the first account becomes admin; the onboarding demo needs no API key'):INS[id][3]==='Portable'?Z('Portable 版（Pi 只有这一版）· 第二行装的是 pi-subagents 扩展，多 Agent 流程要用到','Portable edition (the only one for Pi) · line 2 adds the pi-subagents extension used for multi-agent runs'):Z('Classic 版（默认）','Classic edition (default)');
const TABS=()=>[['platform',T[L].install.plat],...AGENTS];
const tmark=id=>id==='platform'?`<span class="mk lgm">${LOGO}</span>`:mark(id);
function install(t){const n=t.install;
 return `<div class="inst"><div class="kick rv" data-at="0" style="justify-content:center">${n.k}</div><h2 class="h">${lines(n.h)}</h2><p class="sub rv" data-at=".1">${n.sub}</p>
 <div class="tabs rv" data-at=".14"><span class="ind" data-k="ind"></span>${TABS().map((a,i)=>`<button data-id="${a[0]}" class="rv pop${i?'':' act'}" data-at="${(.16+i*.035).toFixed(3)}">${tmark(a[0])}${a[1]}</button>`).join('')}</div>
 <div class="ibox rv" data-at=".3"><div class="row"><span>$</span><code data-k="ic">${INS.platform[0]}</code><button data-copy>${n.copy}</button></div>
 <div class="row"><span>$</span><code data-k="is">${INS.platform[1]}</code></div><div class="st"><span class="ps">›</span> <code data-k="ist">${stLine('platform')}</code></div><div class="ed" data-k="ied">${edNote('platform')}</div></div>
 <p class="inote rv" data-at=".4">${n.note} <code>npx -y loopforge-cli@latest doctor</code></p>
 <div class="ilinks rv" data-at=".44"><a class="pill f" href="${TRY()}">${T[L].try} →</a><a class="pill" href="https://github.com/Tencent/LoopForge" target="_blank" rel="noopener">${n.gh} →</a></div></div>
 <div class="foot"><span>${n.foot} · <a href="https://github.com/Tencent/LoopForge" target="_blank" rel="noopener">github.com/Tencent/LoopForge</a> · ${Z('产品 Logo 归各自所有者','product logos belong to their owners')}</span><span>loopforge.cn</span></div>`}
const SCN=[{b:hero,len:1.9,nav:0,n:'hero',sd:'r'},{b:why,len:1.3,nav:1,n:'why'},{b:sop,len:1.8,nav:2,sd:'l'},{b:gate,len:2.2,nav:2,sd:'r'},{b:ctx,len:1.8,nav:3,sd:'l'},{b:obs,len:1.8,nav:4,sd:'r'},{b:loop,len:2.2,nav:4,n:'loop',sd:'l'},{b:evals,len:1.8,nav:4,sd:'r'},{b:install,len:2.0,nav:5,n:'install'}];
let SC=[],MOB=false;
/* ---------- typing with human cadence ---------- */
function cadence(s){const a=[...s];let h=7,t=0;const out=[];for(let i=0;i<a.length;i++){h=(h*9301+49297)%233280;const j=.55+h/233280*.9;const prev=a[i-1]||'';
 let w=/[\u4e00-\u9fff]/.test(a[i])?1.35:1;if(prev===' ')w*=1.5;if(/[，。,.:：、]/.test(prev))w*=3.2;if(prev==='"')w*=1.8;if(i&&i%9===0)w*=1.6;t+=w*j;out.push(t)}
 return out.map(x=>x/t)}
function setTyped(e,k){if(!e._c)e._c=cadence(e.dataset.type);const s=[...e.dataset.type];let n=0;while(n<s.length&&e._c[n]<=k+1e-6)n++;if(e._n===n)return;e._n=n;
 e.innerHTML=s.slice(0,n).join('').replace(/(&quot;|")(.*)$/,'<q>"$2</q>');const c=e.nextElementSibling;if(c&&c.classList.contains('tc'))c.classList.toggle('on',k>0&&k<1)}
/* ---------- count-up: animates every number in a string ---------- */
function setCount(e,k){const o=e.dataset.cnt;if(k>=1){if(e.textContent!==o)e.textContent=o;return}
 e.textContent=o.replace(/\d+(?:\.\d+)?/g,m=>{const d=(m.split('.')[1]||'').length;return (parseFloat(m)*k).toFixed(d)})}
/* ---------- build ---------- */
function build(){const t=T[L];document.documentElement.lang=L==='zh'?'zh-CN':'en';
 const MD=document.querySelector('meta[name=description]');window.LF_ZH_META=window.LF_ZH_META||[document.title,MD?MD.content:''];document.title=Z(LF_ZH_META[0],'LoopForge · A shared cloud workspace for AI-assisted development');if(MD)MD.content=Z(LF_ZH_META[1],'LoopForge is an open-source, self-hosted cloud workspace for development teams: turn your team\'s practice into executable SOPs, share the full context of every requirement, and see what each run costs and delivers.');
 const cv=document.getElementById('cv');
 cv.innerHTML=`<nav><a class="brand" href="#" data-go="0">${LOGO}<span>Loop<b>Forge</b></span></a><div class="links">${t.nav.map((n,i)=>`<a href="#" data-nav="${i}">${n}</a>`).join('')}</div><div class="sp"></div>
 <div class="lang"><button data-l="zh" class="${L==='zh'?'on':''}" aria-label="${Z('中文','Chinese')}">${Z('中','ZH')}</button>/<button data-l="en" class="${L==='en'?'on':''}">EN</button></div>
 <a class="pill" href="https://github.com/Tencent/LoopForge" target="_blank" rel="noopener">GitHub</a><a class="pill f" href="${TRY()}">${t.try} →</a></nav>`+
 SCN.map((s,i)=>`<section class="sc" data-i="${i}">${s.b(t)}</section>`).join('')+`<div class="rail">${SCN.map((s,i)=>`<b data-goto="${i}"><span>${String(i).padStart(2,'0')}</span></b>`).join('')}</div><button class="replay" type="button">↻ ${Z('重播这一段','Replay')}</button><div class="hint">${Z('滚一下 / ↓ 下一段','scroll / ↓ next')}</div>`;
 SC=[...cv.querySelectorAll('section.sc')].map(el=>{const q=s=>[...el.querySelectorAll(s)];const m={el,at:q('[data-at]'),off:q('[data-off]'),ty:q('[data-type]'),tick:q('[data-tick]'),cnt:q('[data-cnt]'),sw:q('[data-sw]'),sel:q('[data-sel]'),press:q('[data-press]')};
  el.querySelectorAll('[data-k]').forEach(e=>{if(!m[e.dataset.k])m[e.dataset.k]=e});return m});
 cv.querySelectorAll('[data-goto]').forEach(a=>a.addEventListener('click',()=>go(+a.dataset.goto)));cv.querySelector('.replay').addEventListener('click',()=>replay());
 cv.querySelectorAll('[data-go]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();if(MOB){SC[+a.dataset.go].el.scrollIntoView({behavior:'smooth'});return}go(+a.dataset.go)}));
 cv.querySelectorAll('[data-nav]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const k=+a.dataset.nav;const i=SCN.findIndex(s=>s.nav>=k);go(i<0?SCN.length-1:i)}));
 cv.querySelectorAll('.lang button').forEach(b=>b.addEventListener('click',()=>{L=b.dataset.l;localStorage.setItem('lf-lang',L);const u=new URL(location);u.searchParams.set('lang',L);history.replaceState(null,'',u);boot()}));
 const ins=SC[SC.length-1];ins.el.querySelectorAll('.tabs button').forEach(b=>b.addEventListener('click',()=>{ins.manual=true;pick(ins,b.dataset.id,!RM.matches)}));
 ins.el.querySelector('[data-copy]').addEventListener('click',e=>{navigator.clipboard&&navigator.clipboard.writeText(ins.ic.textContent);e.target.textContent=t.install.copied;setTimeout(()=>e.target.textContent=t.install.copy,1400)});
}
/* ---------- install tabs: sliding indicator + command retype ---------- */
function placeInd(m){const b=m.el.querySelector('.tabs button.act');if(!b)return;m.ind.style.width=b.offsetWidth+'px';m.ind.style.transform=`translateX(${b.offsetLeft}px)`}
function retype(el,text,delay=0){clearInterval(el._iv);clearTimeout(el._to);const c=cadence(text),dur=Math.min(900,180+text.length*16);
 el._to=setTimeout(()=>{const t0=performance.now();el._iv=setInterval(()=>{const k=cl((performance.now()-t0)/dur);let n=0;while(n<c.length&&c[n]<=k)n++;el.textContent=[...text].slice(0,n).join('');el.classList.toggle('typing',k<1);if(k>=1)clearInterval(el._iv)},16)},delay)}
function pick(m,id,animate){m.el.querySelectorAll('.tabs button').forEach(x=>x.classList.toggle('act',x.dataset.id===id));m.cur=id;placeInd(m);const v=INS[id];
 const set=[[m.ic,v[0]],[m.is,v[1]],[m.ist,stLine(id)]];
 if(animate){set.forEach(([e,s],i)=>retype(e,s,i*140));m.ied.classList.remove('on');void m.ied.offsetWidth;m.ied.textContent=edNote(id);m.ied.classList.add('on')}
 else{set.forEach(([e,s])=>{clearInterval(e._iv);clearTimeout(e._to);e.textContent=s;e.classList.remove('typing')});m.ied.textContent=edNote(id);m.ied.classList.add('on')}}
/* ---------- cursor in the approval step ---------- */
function rel(el,root){let x=0,y=0,e=el;while(e&&e!==root){x+=e.offsetLeft;y+=e.offsetTop;e=e.offsetParent}return{x:x+el.offsetWidth*.55,y:y+el.offsetHeight*.55}}
function cursor(m,keys,p){const c=m.mc;if(!m._pts)m._pts=keys.map(k=>typeof k[1]==='string'?rel(m[k[1]],m.win):{x:k[1][0],y:k[1][1]});
 const P0=keys[0][0]-.02,P1=keys[keys.length-1][0]+.04;c.style.opacity=p<P0||p>P1?0:1;if(p<P0||p>P1)return;
 let x=m._pts[0].x,y=m._pts[0].y;for(let i=1;i<keys.length;i++){if(p>=keys[i][0]){x=m._pts[i].x;y=m._pts[i].y;continue}const t=EIO(R(p,keys[i-1][0]+(keys[i-1][2]?.012:0),keys[i][0]));x=lerp(m._pts[i-1].x,m._pts[i].x,t);y=lerp(m._pts[i-1].y,m._pts[i].y,t);break}
 c.style.transform=`translate(${x}px,${y}px)`;const ck=keys.some(k=>k[2]&&p>=k[0]&&p<k[0]+.02);c.classList.toggle('click',ck)}
const tilt=(w,e,side)=>{w.style.transform=`rotateY(${(side==='l'?8:-8)*(1-e)}deg) rotateX(${4*(1-e)}deg) translateY(${18*(1-e)}px) translateZ(${-50*(1-e)}px)`};
const UPD={
 hero:(m,p)=>{tilt(m.win,EO(R(p,-.1,.3)),'r')},
 loop:(m,p)=>{tilt(m.win,EO(R(p,0,.2)),'l');cursor(m,[[.38,[470,330]],[.56,'okb',1],[.72,[420,470]]],p);
  const ok=p>=.58;m.t5.classList.toggle('wt',!ok);m.t5.classList.toggle('dn',ok);m.t6.classList.toggle('run',p>=.64&&p<.82);m.t6.classList.toggle('dn',p>=.82);
  m.apv.classList.toggle('past',p>=.62);m.gs.classList.toggle('fin',p>=.84);m.gs.textContent=p>=.84?T[L].loop.done:T[L].loop.wait},
 install:(m,p)=>{if(m.manual)return;const st=p<.3?0:p<.6?1:p<.82?2:3;if(st===m.st)return;const live=anim===SC.indexOf(m)&&m.st!==undefined&&st===m.st+1;m.st=st;
  if(st===0){['ic','is','ist'].forEach(k=>{clearInterval(m[k]._iv);clearTimeout(m[k]._to);m[k].textContent=''});m.el.querySelectorAll('.tabs button').forEach(x=>x.classList.toggle('act',x.dataset.id==='platform'));placeInd(m);m.ied.classList.remove('on');return}
  pick(m,st===1?'platform':st===2?'claude':'pi',live)}};
function run(i,p){const m=SC[i];
 m.at.forEach(e=>e.classList.toggle('on',p>=+e.dataset.at));m.off.forEach(e=>{if(p>=+e.dataset.off)e.classList.remove('on')});
 m.ty.forEach(e=>setTyped(e,R(p,+e.dataset.a,+e.dataset.b)));
 m.tick.forEach(e=>{const on=p>=+e.dataset.tick;e.classList.toggle(e.dataset.cls||'ok',on)});
 m.cnt.forEach(e=>setCount(e,EO(R(p,+e.dataset.a,+e.dataset.b))));
 m.sw.forEach(e=>e.classList.toggle('swon',p>=+e.dataset.sw));m.sel.forEach(e=>e.classList.toggle('sel',p>=+e.dataset.sel));m.press.forEach(e=>e.classList.toggle('press',p>=+e.dataset.press));
 const sc=SCN[i];if(MOB){if(sc.n==='loop')UPD.loop(m,1);if(m.win)m.win.style.transform='';if(sc.n==='install'&&!m.cur)pick(m,'platform',false);return}
 if(UPD[sc.n])UPD[sc.n](m,p);else if(m.win)tilt(m.win,EO(R(p,0,.2)),sc.sd)}
/* ---------- pager: one gesture = one scene; each scene plays on its own clock ---------- */
const RM=matchMedia('(prefers-reduced-motion: reduce)');
const DUR=SCN.map(s=>Math.round(s.len*3400)),TRMS=950;
let cur=0,P=[],done=[],anim=null,busy=false,raf=0;
function fit(){const s=Math.min(innerWidth/1440,innerHeight/900);document.getElementById('cv').style.transform=`translate(${(innerWidth-1440*s)/2}px,${(innerHeight-900*s)/2}px) scale(${s})`}
function paint(){SC.forEach((m,k)=>{m.el.style.visibility=k===cur?'visible':'hidden';m.el.style.clipPath='none';m.el.style.zIndex=1});run(cur,P[cur]);ui()}
function ui(){document.querySelectorAll('[data-nav]').forEach(a=>a.classList.toggle('on',+a.dataset.nav===SCN[cur].nav));
 document.querySelectorAll('.rail b').forEach((d,k)=>d.classList.toggle('on',k===cur));
 const rp=document.querySelector('.replay');if(rp)rp.classList.toggle('on',!!done[cur]&&anim===null);
 document.body.dataset.scene=cur;document.body.dataset.playing=anim!==null?'1':'0';document.body.classList.toggle('still',anim===null)}
function play(i,from=0){cancelAnimationFrame(raf);if(RM.matches){P[i]=1;done[i]=true;anim=null;paint();return}
 const t0=performance.now()-from*DUR[i];anim=i;document.body.classList.remove('still');ui();
 (function tick(now){if(cur!==i){anim=null;return}P[i]=cl((now-t0)/DUR[i]);run(i,P[i]);if(P[i]<1)raf=requestAnimationFrame(tick);else{done[i]=true;anim=null;ui()}})(performance.now())}
function finishNow(i){document.body.classList.add('still');P[i]=1;done[i]=true;run(i,1)}
function go(j){j=Math.max(0,Math.min(SCN.length-1,j));if(j===cur||busy)return;
 cancelAnimationFrame(raf);if(anim!==null){const a=anim;anim=null;finishNow(a)}
 const from=cur,fwd=j>from;cur=j;lastNav=performance.now();if(!done[j]){P[j]=0;const m=SC[j];m.st=undefined;m.manual=false}else document.body.classList.add('still');
 const n=SC[j].el,o=SC[from].el;SC.forEach((m,k)=>{m.el.style.visibility=(k===j||k===from)?'visible':'hidden';m.el.style.zIndex=k===j?2:1});run(j,P[j]);ui();
 const kind=(fwd?from:j)%3;const clip=t=>kind===0?`circle(${t*120}% at 50% 55%)`:kind===1?(fwd?`inset(0 0 0 ${100-t*100}%)`:`inset(0 ${100-t*100}% 0 0)`):(fwd?`inset(${100-t*100}% 0 0 0)`:`inset(0 0 ${100-t*100}% 0)`);
 const fin=()=>{busy=false;o.style.visibility='hidden';o.style.transform='';n.style.clipPath='none';if(!done[j])play(j);else ui()};
 if(RM.matches){fin();return}
 busy=true;const t0=performance.now();(function tr(now){const t=EIO(cl((now-t0)/TRMS));n.style.clipPath=clip(t);o.style.transform=`translateY(${(fwd?-1:1)*t*-0}px) scale(${1-.02*t})`;if(t<1)requestAnimationFrame(tr);else fin()})(t0)}
function replay(){if(busy)return;const m=SC[cur];done[cur]=false;P[cur]=0;m.st=undefined;m.manual=false;m.el.querySelectorAll('.on,.ok,.s1,.s2,.sel,.press,.swon,.sweep,.fixd').forEach(e=>e.classList.remove('on','ok','s1','s2','sel','press','swon','sweep','fixd'));document.body.classList.remove('still');run(cur,0);play(cur)}
let wheelAcc=0,lastWheel=0,gestureUsed=false,lastNav=0;
function onWheel(e){if(MOB)return;e.preventDefault();const now=performance.now();
 if(now-lastWheel>350){gestureUsed=false;wheelAcc=0}lastWheel=now;if(gestureUsed||busy||now-lastNav<1100)return;
 wheelAcc+=e.deltaY;if(Math.abs(wheelAcc)>=40){gestureUsed=true;go(cur+(wheelAcc>0?1:-1));wheelAcc=0}}
function onKey(e){if(MOB||e.target.closest&&e.target.closest('input,textarea'))return;const k=e.key;
 if(['ArrowDown','PageDown',' ','ArrowRight'].includes(k)){e.preventDefault();go(cur+1)}
 else if(['ArrowUp','PageUp','ArrowLeft'].includes(k)){e.preventDefault();go(cur-1)}
 else if(k==='Home'){e.preventDefault();go(0)}else if(k==='End'){e.preventDefault();go(SCN.length-1)}}
let ty0=null;
function boot(){MOB=innerWidth<760;document.body.classList.toggle('mob',MOB);document.documentElement.classList.toggle('pager',!MOB);build();
 if(MOB){cancelAnimationFrame(raf);anim=null;document.body.classList.add('still');const cv=document.getElementById('cv');cv.style.transform='';SC.forEach((m,i)=>{m.el.style.visibility='visible';m.el.style.clipPath='none';run(i,1);const cvi=m.el.querySelector('.cvi');if(cvi){const w=cvi.parentElement.clientWidth,k=Math.min(1,w/718);cvi.style.transform=`scale(${k})`;cvi.parentElement.style.height=Math.round(340*k)+'px'}});placeInd(SC[SC.length-1]);return}
 fit();if(!P.length){P=SCN.map(()=>0);done=SCN.map(()=>false)}if(done[cur])document.body.classList.add('still');paint();if(!done[cur])play(cur,P[cur]);placeInd(SC[SC.length-1])}
window.LF={SCN,go,replay,get cur(){return cur},get playing(){return anim!==null},get busy(){return busy},DUR,TRMS,seek(i,p){cancelAnimationFrame(raf);anim=null;if(i!==cur){SC[cur].el.style.visibility='hidden';cur=i}SC[i].el.style.visibility='visible';SC[i].el.style.clipPath='none';P[i]=p;done[i]=p>=1;run(i,p);ui()}};
addEventListener('wheel',onWheel,{passive:false});addEventListener('keydown',onKey);
addEventListener('touchstart',e=>{ty0=e.touches[0].clientY},{passive:true});
addEventListener('touchend',e=>{if(MOB||ty0===null)return;const d=ty0-e.changedTouches[0].clientY;ty0=null;if(Math.abs(d)>50)go(cur+(d>0?1:-1))},{passive:true});
let mw=innerWidth<760;addEventListener('resize',()=>{const n=innerWidth<760;if(n!==mw){mw=n;boot()}else if(!MOB){fit();placeInd(SC[SC.length-1])}});
document.fonts&&document.fonts.ready.then(()=>placeInd(SC[SC.length-1]));boot();
})();
