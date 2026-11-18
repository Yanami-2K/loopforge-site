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
let lgN=0;
const LOGO=(glint)=>{const g='lfg'+(++lgN);return `<svg viewBox="12 12 88 88" fill="none" aria-hidden="true"><defs><linearGradient id="${g}" x1="19" y1="20" x2="93" y2="93" gradientUnits="userSpaceOnUse"><stop stop-color="#008DCC"/><stop offset=".48" stop-color="#526CE8"/><stop offset="1" stop-color="#8A4ED9"/></linearGradient></defs><path class="lgp" pathLength="100" d="M53 72C53 59 63 52.5 73 52.5S93 59 93 72 83 91.5 73 91.5 53 85 53 72V40C53 27 44.5 20.5 36 20.5S19 27 19 40" stroke="url(#${g})" stroke-width="7.6" stroke-linecap="round" stroke-linejoin="round"/>${glint?`<path class="lgg" pathLength="100" d="M53 72C53 59 63 52.5 73 52.5S93 59 93 72 83 91.5 73 91.5 53 85 53 72V40C53 27 44.5 20.5 36 20.5S19 27 19 40" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/>`:''}</svg>`};
// Product marks: Claude, Codex (OpenAI), Cursor, CodeBuddy from LobeHub Icons (@lobehub/icons-static-svg, MIT);
// Pi from pi.dev's own favicon; GitHub from Simple Icons (CC0).
// Kimi is the official K-only mark (moonshotai.github.io/Branding-Guide, scenarios/04-k-only); the blue square stays #1783FF.
// Trademarks of their owners, used only to name the agent each command targets.
const MARK={
 claude:['0 0 24 24','M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z'],
 codex:['0 0 24 24','M8.086.457a6.105 6.105 0 013.046-.415c1.333.153 2.521.72 3.564 1.7a.117.117 0 00.107.029c1.408-.346 2.762-.224 4.061.366l.063.03.154.076c1.357.703 2.33 1.77 2.918 3.198.278.679.418 1.388.421 2.126a5.655 5.655 0 01-.18 1.631.167.167 0 00.04.155 5.982 5.982 0 011.578 2.891c.385 1.901-.01 3.615-1.183 5.14l-.182.22a6.063 6.063 0 01-2.934 1.851.162.162 0 00-.108.102c-.255.736-.511 1.364-.987 1.992-1.199 1.582-2.962 2.462-4.948 2.451-1.583-.008-2.986-.587-4.21-1.736a.145.145 0 00-.14-.032c-.518.167-1.04.191-1.604.185a5.924 5.924 0 01-2.595-.622 6.058 6.058 0 01-2.146-1.781c-.203-.269-.404-.522-.551-.821a7.74 7.74 0 01-.495-1.283 6.11 6.11 0 01-.017-3.064.166.166 0 00.008-.074.115.115 0 00-.037-.064 5.958 5.958 0 01-1.38-2.202 5.196 5.196 0 01-.333-1.589 6.915 6.915 0 01.188-2.132c.45-1.484 1.309-2.648 2.577-3.493.282-.188.55-.334.802-.438.286-.12.573-.22.861-.304a.129.129 0 00.087-.087A6.016 6.016 0 015.635 2.31C6.315 1.464 7.132.846 8.086.457zm-.804 7.85a.848.848 0 00-1.473.842l1.694 2.965-1.688 2.848a.849.849 0 001.46.864l1.94-3.272a.849.849 0 00.007-.854l-1.94-3.393zm5.446 6.24a.849.849 0 000 1.695h4.848a.849.849 0 000-1.696h-4.848z'],
 cursor:['0 0 24 24','M22.106 5.68L12.5.135a.998.998 0 00-.998 0L1.893 5.68a.84.84 0 00-.419.726v11.186c0 .3.16.577.42.727l9.607 5.547a.999.999 0 00.998 0l9.608-5.547a.84.84 0 00.42-.727V6.407a.84.84 0 00-.42-.726zm-.603 1.176L12.228 22.92c-.063.108-.228.064-.228-.061V12.34a.59.59 0 00-.295-.51l-9.11-5.26c-.107-.062-.063-.228.062-.228h18.55c.264 0 .428.286.296.514z'],
 codebuddy:['0 0 24 24','M18.777 1.647c.28-.02.536.114.972.51 1.018.926 2.437 2.828 3.318 4.452l.34.631.482.24.11.06v3.638a5.206 5.206 0 00-5.32-1.23c-.491.166-1.021.471-2.08 1.082l-6.09 3.516c-1.057.61-1.586.916-1.975 1.259a5.208 5.208 0 00-1.493 5.572c.165.49.471 1.02 1.082 2.08l.315.543h-3.26c-.685 0-1.34-.135-1.939-.377-.169-.956-.009-1.789.469-2.335.158-.18.164-.189.13-.493a11.846 11.846 0 01-.057-1.711l.02-.444-.667-1.18C2.1 15.622 1.445 14.078 1.192 12.9c-.133-.647-.125-.934.04-1.146.1-.128.427-.261.822-.334.994-.175 3.162-.017 5.575.41l.25.043.551-.487c.915-.81 1.522-1.264 2.641-1.962 1.167-.73 2.484-1.331 3.967-1.807l.476-.152.261-.688c.937-2.471 1.896-4.293 2.58-4.9.235-.21.25-.22.422-.23z M12.139 18.2a1.203 1.203 0 011.642.44l1.296 2.243a1.204 1.204 0 01-2.083 1.203l-1.296-2.243a1.203 1.203 0 01.44-1.644zM18.629 14.452a1.203 1.203 0 011.642.44l1.295 2.244a1.203 1.203 0 11-2.083 1.203l-1.295-2.243a1.203 1.203 0 01.44-1.644z'],
 gh:['0 0 24 24','M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'],
 x:['0 0 24 24','M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z'],
 wechat:['0 0 24 24','M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z'],
 opencode:['0 0 24 24','M22 24H2V0h20zM17 4.8H7v14.4h10z'],
 agy:['0 0 24 24','M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81'],
 kimi:{box:'0 0 24 25',parts:[['#1783FF','M21.7202 0.939941C22.9502 0.939941 23.9502 1.93994 23.9502 3.16994C23.9502 4.39994 22.9502 5.39994 21.7202 5.39994H19.7502C19.6002 5.39994 19.4902 5.27994 19.4902 5.13994V3.16994C19.4902 1.93994 20.4902 0.939941 21.7202 0.939941Z'],['currentColor','M9.39 13.9501L17.82 5.59012C17.98 5.43012 17.89 5.12012 17.68 5.12012H13.14C13.14 5.12012 13.04 5.14012 13 5.18012L3.92 14.1901C3.78 14.3301 3.57 14.2101 3.57 13.9801V5.39012C3.57 5.24012 3.47 5.12012 3.35 5.12012H0.219999C0.0999993 5.12012 0 5.24012 0 5.39012V23.9201C0 24.0701 0.0999993 24.1901 0.219999 24.1901H3.35C3.47 24.1901 3.57 24.0701 3.57 23.9201V20.1401C3.57 20.0601 3.6 19.9801 3.65 19.9301L6.47 17.1401C6.54 17.0701 6.63 17.0601 6.71 17.1101L14.24 22.6501C15.47 23.4801 16.85 23.9901 18.25 24.1401C18.37 24.1501 18.48 24.0301 18.48 23.8701V20.3101C18.48 20.1701 18.4 20.0601 18.29 20.0501C17.47 19.9201 16.66 19.6001 15.94 19.1101L9.42 14.3901C9.28 14.3001 9.27 14.0701 9.39 13.9501Z']]},
 dsh:['0 0 24 24','M23.748 4.651c-.254-.124-.364.113-.512.233-.051.04-.094.09-.137.137-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.155-.708-.311-.955-.65-.172-.24-.219-.509-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.633 2.58 1.838 3.393.137.094.172.187.129.323-.082.28-.18.553-.266.833-.055.179-.137.218-.328.14a5.5 5.5 0 0 1-1.737-1.179c-.857-.828-1.631-1.743-2.597-2.46a12 12 0 0 0-.689-.47c-.985-.957.13-1.743.387-1.836.27-.098.094-.433-.778-.428-.872.003-1.67.295-2.687.685a3 3 0 0 1-.465.136 9.6 9.6 0 0 0-2.883-.101c-1.885.21-3.39 1.1-4.497 2.622C.082 8.776-.231 10.854.152 13.02c.403 2.284 1.568 4.175 3.36 5.653 1.857 1.533 3.997 2.284 6.438 2.14 1.482-.085 3.132-.284 4.994-1.86.47.234.962.328 1.78.398.629.058 1.235-.031 1.705-.129.735-.155.684-.836.418-.961-2.155-1.004-1.682-.595-2.112-.926 1.095-1.295 2.768-3.598 3.284-6.733.05-.346.115-.834.108-1.114-.004-.171.035-.238.23-.257a4.2 4.2 0 0 0 1.545-.475c1.397-.763 1.96-2.016 2.093-3.517.02-.23-.004-.467-.247-.588M11.58 18.168c-2.088-1.642-3.101-2.183-3.52-2.16-.39.024-.32.472-.234.763.09.288.207.487.371.74.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.168-1.361-.801-2.5-1.86-3.301-3.306-.775-1.393-1.225-2.888-1.299-4.482-.02-.385.094-.522.477-.592a4.7 4.7 0 0 1 1.53-.038c2.131.311 3.946 1.264 5.467 2.774.868.86 1.525 1.887 2.202 2.89.72 1.066 1.494 2.082 2.48 2.915.348.291.626.513.892.677-.802.09-2.14.109-3.055-.615zm1.001-6.44a.306.306 0 0 1 .415-.287.3.3 0 0 1 .113.074.3.3 0 0 1 .086.214c0 .17-.136.307-.308.307a.303.303 0 0 1-.306-.307m3.11 1.596c-.2.081-.4.151-.591.16a1.25 1.25 0 0 1-.798-.254c-.274-.23-.47-.358-.551-.758a1.7 1.7 0 0 1 .015-.588c.07-.327-.007-.537-.238-.727-.188-.156-.426-.199-.689-.199a.6.6 0 0 1-.254-.078.253.253 0 0 1-.114-.358 1 1 0 0 1 .192-.21c.356-.202.767-.136 1.146.016.352.144.618.408 1.001.782.392.451.462.576.685.915.176.264.336.536.446.848.066.194-.02.353-.25.45'],
 pi:['0 0 560 560','M420 280H280V140H0V0H420V280Z M560 560H420V280H560V560Z M140 560H0V140H140V280H280V420H140V560Z']};
const mark=(id,cls='')=>{const m=MARK[id];if(m.parts)return `<svg class="mk ${cls}" viewBox="${m.box}" aria-hidden="true">${m.parts.map(p=>`<path fill="${p[0]}" d="${p[1]}"/>`).join('')}</svg>`;return `<svg class="mk ${cls}" viewBox="${m[0]}" fill="currentColor" aria-hidden="true"><path d="${m[1]}"/></svg>`};
const AGENTS=[['claude','Claude Code'],['codex','Codex'],['cursor','Cursor'],['codebuddy','CodeBuddy'],['pi','Pi']];
const EXECS=[['codebuddy','CodeBuddy'],['codex','Codex'],['claude','Claude Code'],['opencode','OpenCode'],['cursor','Cursor'],['agy','Antigravity'],['kimi','Kimi Code'],['pi','Pi'],['dsh','DeepSeek Harness']];
const TRY=()=>'demo/'+(L==='en'?'?lang=en':'');
const DOCS=()=>'docs/'+(L==='en'?'?lang=en':'');
/* ---------- line icons (24px grid, 1.7 stroke) ---------- */
const IC={home:'M3 10.5 12 3.5l9 7M5.5 9v11h13V9M10 20v-5.5h4V20',chart:'M4 20h16M7 16v-5M12 16V6M17 16v-8',list:'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',
 check:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zM8.5 12.2l2.4 2.4 4.6-5',flow:'M6 3v12M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9a9 9 0 0 1-9 9',
 play:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zM10 8.5v7l5.5-3.5z',clock:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zM12 7v5l3 2',panel:'M4 4h16v16H4zM9 4v16',
 gear:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 12h2M18 12h2M12 4v2M12 18v2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4',
 search:'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4',cloud:'M7 18a4.5 4.5 0 0 1-.5-9 6 6 0 0 1 11.6 1.5A3.8 3.8 0 0 1 17.5 18z',
 users:'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.3a3.5 3.5 0 0 1 0 6.4M18.5 14.5a6.5 6.5 0 0 1 3 5.5',
 shield:'M12 3 4.5 6v5.5c0 4.5 3.2 8.2 7.5 9.5 4.3-1.3 7.5-5 7.5-9.5V6zM9 12l2 2 4-4',bug:'M8 9h8v5a4 4 0 0 1-8 0zM12 9v9M9.5 6a2.5 2.5 0 0 1 5 0M4 13h4M16 13h4M5 8l3 2M19 8l-3 2M5 19l3-2M19 19l-3-2',
 spark:'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z',
 loop:'M17 2l3 3-3 3M4 11V9a4 4 0 0 1 4-4h12M7 22l-3-3 3-3M20 13v2a4 4 0 0 1-4 4H4',pause:'M9 5v14M15 5v14',
 hand:'M7 11V6.5a1.5 1.5 0 0 1 3 0V11M10 10V4.5a1.5 1.5 0 0 1 3 0V10M13 10.5V6a1.5 1.5 0 0 1 3 0v5M16 9.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-.5a6 6 0 0 1-4.9-2.5L4 15.5a1.6 1.6 0 0 1 2.4-2L7 14',
 arrow:'M5 12h14M13 6l6 6-6 6',plus:'M12 5v14M5 12h14',bot:'M12 4v3M6 8h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2zM9.5 13h.01M14.5 13h.01',
 pr:'M6 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 9v6M18 15V8a2 2 0 0 0-2-2h-3M15 3l-3 3 3 3',
 x:'M6 6l12 12M18 6 6 18',ok:'M5 12.5l4.5 4.5L19 7',moon:'M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z',term:'M4 5h16v14H4zM7.5 9.5 10 12l-2.5 2.5M12.5 15h4',
 copy:'M9 9h11v11H9zM5 15V4h11',up:'M12 19V5M6 11l6-6 6 6',script:'M8 6l-5 6 5 6M16 6l5 6-5 6',down:'M6 9l6 6 6-6',cal:'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
 file:'M14 3H6v18h12V7zM14 3v4h4',gauge:'M4 18a8 8 0 1 1 16 0M12 18l4-6'};
const ic=(k,c='')=>`<svg class="ic ${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${IC[k]}"/></svg>`;
/* ---------- text helpers ---------- */
const lines=(h,em)=>h.split('<br>').map((x,i)=>`<span class="hl"><span class="rv up" data-at="${(.03+i*.07).toFixed(2)}">${em?em(x):x}</span></span>`).join(L==='en'?' ':'');
const emph=(h,em)=>x=>em&&x.includes(em)?x.replace(em,`<em>${em}</em>`):x;
const head=(s,tag='h2',cls='')=>`<${tag} class="h ${cls}">${lines(s.h,emph(s.h,s.em))}</${tag}>${s.sub?`<p class="sub rv" data-at=".14">${s.sub}</p>`:''}`;
const f2=x=>x.toFixed(3);
const EXN={codebuddy:'CodeBuddy',codex:'Codex',claude:'Claude Code',gh:'GitHub'};
const CUR='<svg viewBox="0 0 16 20"><path d="M1 1l13.5 7.2-5.8 1.4L6 15.4z" fill="#18181b" stroke="#fff" stroke-width="1.3" stroke-linejoin="round"/></svg>';
const cur=()=>`<div class="mcur" data-k="mc">${CUR}<i></i></div>`;
/* a scaled product window */
const F=(w,body,max=1)=>`<div class="fit" data-max="${max}"><div class="fz" style="width:${w}px"><div class="win" data-k="win">${body}</div></div></div>`;
/* ---------- the real app chrome: icon rail, optional sidebar, top bar ---------- */
const RAIL=['home','chart','list','check','flow','play','clock'];
const shell=(on,main,side='',top=true)=>`<div class="app"><aside class="arl"><span class="alg">${LOGO()}</span>${RAIL.map(k=>`<i class="ari${k===on?' on':''}">${ic(k)}${k==='check'?'<b class="bdg">2</b>':''}</i>`).join('')}<span class="sp"></span><i class="ari">${ic('panel')}</i><i class="ari">${ic('gear')}</i><span class="aav">L</span></aside>${side}
 <section class="amn">${top?`<header class="atp"><span class="asr">${ic('search')}<em>${Z('搜索需求、运行、SOP 或 Agent','Search runs, SOPs, agents…')}</em><kbd>⌘K</kbd></span><span class="sp"></span><span class="apj">LOOP · LoopForge ${ic('down')}</span><span class="alng">中 / EN</span><span class="aad"><i>A</i>admin</span></header>`:''}<div class="abd">${main}</div></section></div>`;
const tg=(t,c='')=>`<span class="tg ${c}">${t}</span>`;
/* ---------- hero: the SOP designer ---------- */
function hero(t){const c=t.hero;
 const N=[['bot','需求定型','Clarify','requirement.md',60,70],['bot','方案设计','Design','design.md',300,70],['bot','开发实现','Implement','patch.diff',540,70],
  ['bot','独立评审','Review','review.md',540,250],['script','运行测试','Run tests','go test ./...',300,250],['shield','人工验收','Sign-off',Z('打回 → 开发实现','reject → Implement'),60,250]];
 const E=[[0,1],[1,2],[2,3],[3,4],[4,5]],W2=196,H2=92;
 const pt=(i,s)=>{const n=N[i],x=n[4],y=n[5];return s==='r'?[x+W2,y+H2/2]:s==='l'?[x,y+H2/2]:s==='b'?[x+W2/2,y+H2]:[x+W2/2,y]};
 const path=(a,b)=>{const A=N[a],B=N[b];if(A[5]===B[5]){const s=A[4]<B[4]?pt(a,'r'):pt(a,'l'),e=A[4]<B[4]?pt(b,'l'):pt(b,'r'),m=(s[0]+e[0])/2;return `M${s[0]} ${s[1]}C${m} ${s[1]} ${m} ${e[1]} ${e[0]} ${e[1]}`}
  const s=pt(a,'b'),e=pt(b,'t');return `M${s[0]} ${s[1]}C${s[0]} ${s[1]+50} ${e[0]} ${e[1]-50} ${e[0]} ${e[1]}`};
 const ex=['codebuddy','codex','claude','codebuddy','',''];
 const nodes=N.map((n,i)=>`<div class="dnd rv pop${i===5?' hum':''}" data-at="${f2(.1+i*.05)}" data-st="${f2(.56+i*.06)},${f2(.6+i*.06)}" style="left:${n[4]}px;top:${n[5]}px"><div class="dnh"><span class="dni">${ic(n[0])}</span><div><b>${Z(n[1],n[2])}</b><small>${i===5?Z('人工门禁','Human gate'):i===4?Z('脚本','Script'):'Agent'}</small></div><i class="dck">${ic('ok')}</i></div><div class="dnf">${ex[i]?`<span>${mark(ex[i])}${EXN[ex[i]]}</span>`:''}<code>${n[3]}</code></div></div>`).join('');
 const edges=E.map(([a,b],i)=>`<path class="deg dr" pathLength="1" data-at="${f2(.2+i*.05)}" d="${path(a,b)}"/>`).join('')+`<path class="deg rej rvo" data-at=".46" d="M${60+W2/2} ${250}C${60+W2/2} 200 ${540+W2/2-40} 210 ${540+W2/2-40} ${70+H2}"/>`;
 const pal=[['bot','AI Agent'],['script',Z('脚本','Script')],['shield',Z('人工门禁','Human gate')],['flow','SOP']];
 const main=`<div class="dsg"><div class="dtb"><span class="dsel"><i class="dot ok"></i>${Z('缺陷修复 SOP','Bug fix SOP')} ${ic('down')}</span><span class="dmeta">published · v1 · ${Z('6 步','6 steps')}</span><span class="sp"></span><span class="ubt">${ic('plus')}${Z('新建 SOP','New SOP')}</span><span class="ubt">${Z('版本历史','History')}</span><span class="ubt dk">${Z('保存','Save')}</span><span class="ubt ac rv" data-at=".5" data-k="pub">${Z('发布版本','Publish')}</span></div>
 <div class="dbody"><aside class="dpal"><div class="dph">${Z('流程步骤','Steps')}<small>${Z('拖到画布上','drag onto canvas')}</small></div><div class="dpg">${pal.map(p=>`<span>${ic(p[0])}${p[1]}</span>`).join('')}</div>
  <div class="dpl">${N.map((n,i)=>`<div class="${i===2?'on':''}"><b>${i+1}</b>${Z(n[1],n[2])}</div>`).join('')}</div></aside>
 <div class="dcv"><svg class="degs" width="800" height="380" viewBox="0 0 800 380">${edges}</svg><span class="rjl rvo" data-at=".48">${Z('失败打回','on reject')}</span>${nodes}</div>
 <aside class="dins rv" data-at=".42"><div class="dih"><b>${Z('开发实现','Implement')}</b><small>Agent · ${Z('角色：开发','role: developer')}</small></div>
  <label>${Z('执行器','Executor')}</label><div class="fld">${mark('claude')}Claude Code ${ic('down')}</div>
  <label>${Z('模型','Model')}</label><div class="fld">claude-opus-4.5 ${ic('down')}</div>
  <label>${Z('产物','Output')}</label><div class="fld mono">patch.diff</div>
  <label>${Z('门禁','Gate')}</label><div class="fld mono">go test ./... · exit 0</div>
  <label>${Z('失败时','On failure')}</label><div class="fld">${Z('打回 · 重试上限 3','send back · retry ≤ 3')}</div></aside></div></div>`;
 return F(1240,shell('flow',main,'',true),1)}
const TAGS=()=>[[Z('Agent 节点 · 独立配置执行器','Agent node · configurable executor'),'l',22],[Z('脚本门禁 · 按退出码客观判定','Script gate · verified by exit code'),'l',62],[Z('人工门禁 · 关键节点人工把关','Human gate · sign-off on key nodes'),'r',70],[Z('失败打回 · 附带报错自动返工','Reject edge · auto-rework with logs'),'r',38]];
/* 01 cloud workspaces */
function cloud(t){const c=t.cloud;const S=[['sbx-7f3a','LOOP-12',Z('修复订单导出的时区错误','Fix timezone bug in order export'),'run',[.18,1.1]],['sbx-2c91','LOOP-15',Z('订单列表按状态筛选','Filter orders by status'),'board',[.24,.62]],['sbx-e4b0','#219',Z('依赖安全检查 · 升级 lodash','Dependency check · bump lodash'),'list',[.3,.48]],['sbx-91d2','LOOP-17',Z('退款回调重试','Retry refund callbacks'),'run',[.36,1.1]]];
 const thumb=k=>`<div class="th2 ${k}"><i class="r"></i><div>${k==='board'?'<p><i></i><i></i><i></i><i></i></p><p><i></i><i></i><i></i><i></i></p>':k==='list'?'<p></p><p></p><p></p><p></p><p></p>':'<p></p><p class="w"></p><p class="n"><i></i><i></i><i></i><i></i></p><p></p>'}</div></div>`;
 const st=i=>i===1?`<span class="cst s-a"><i></i>${Z('运行中','Running')}</span><span class="cst ok s-b"><i></i>${Z('已完成 · PR #140','Done · PR #140')}</span>`:i===2?`<span class="cst s-a"><i></i>${Z('运行中','Running')}</span><span class="cst zz s-b"><i></i>${Z('已休眠 · 快照已保存','Asleep · snapshot saved')}</span>`:`<span class="cst"><i></i>${Z('运行中','Running')}</span>`;
 return F(1040,`<div class="cwp"><div class="cwh"><span class="cwi">${ic('cloud')}</span><b>LoopForge ${Z('云端工作区','cloud workspaces')}</b>${tg('7×24 '+Z('在线','online'),'ok')}<span class="sp"></span>
  <span class="lid rv" data-at=".04">${ic('term')}${Z('本机 · 已合盖','Laptop · lid closed')}</span><span class="clk rv" data-at=".08">${ic('moon')}<b data-k="clk">23:40</b><small>${Z('无人值守中','unattended')}</small></span></div>
 <div class="cwg">${S.map((s,i)=>`<div class="cwc rv" data-at="${f2(.1+i*.05)}"${i===1?' data-sw=".62"':i===2?' data-sw=".48"':''}>${thumb(s[3])}<div class="cwm"><small>${s[0]} · ${Z('隔离沙箱','isolated sandbox')}</small><b><code>${s[1]}</code>${s[2]}</b>${st(i)}<em class="pg"><em class="bar" style="--w:${[64,100,46,38][i]}%" data-tick="${f2(s[4][0])}" data-cls="on"></em></em></div></div>`).join('')}</div>
 <div class="cwf rv" data-at=".8">${ic('ok')}${Z('次日 09:12 · LOOP-15 工作区从云端快照恢复，未提交修改与分支状态完整保留','Next day 09:12 · LOOP-15 workspace restored from cloud snapshot, uncommitted changes and branch intact')}</div></div>`)}
/* 02 one shared conversation */
function chat(t){const c=t.chat;
 const side=`<aside class="asd"><div class="sdh">${LOGO()}<b>LoopForge</b><i>${ic('panel')}</i></div><div class="sdn">${ic('plus')}${Z('新对话','New chat')}<span class="sp"></span>${ic('search')}</div>
  <div class="sdg">${ic('users')}${Z('团队会话','Team chats')}<span class="sp"></span>4</div>
  ${[Z('订单导出时区问题','Order export timezone'),Z('登录页接入 GitHub 登录','GitHub sign-in on login'),Z('整理本周发布清单','This week\'s release list'),Z('排查移动端布局偏移','Check mobile layout offset')].map((x,i)=>`<div class="sdi${i?'':' on'}"><span>${x}</span><b>${['3','1','2','1'][i]}</b></div>`).join('')}
  <div class="sdg">${ic('home')}${Z('个人对话','Personal')}<span class="sp"></span>6</div>
  ${[Z('梳理需求分析到测试的协作流程','Collab flow from analysis to test'),Z('为项目列表补充搜索与筛选','Search and filters for projects')].map(x=>`<div class="sdi"><span>${x}</span><b>1</b></div>`).join('')}</aside>`;
 const me=(a,who,cls,txt,at)=>`<div class="msg me rv" data-at="${at}"><div class="mwho"><span class="mav ${cls}">${a}</span>${who}</div><p>${txt}</p></div>`;
 const think=(a,b)=>`<div class="think rv" data-at="${a}" data-off="${b}"><span class="mbl">${LOGO()}Main Bot</span><i></i><i></i><i></i></div>`;
 const bot=(txt,extra,at)=>`<div class="msg bot rv" data-at="${at}"><div class="mbl">${LOGO()}Main Bot<small>09:1${at[2]||'3'}</small></div><p>${txt}</p>${extra}</div>`;
 const main=`<div class="cvh"><b>${Z('订单导出时区问题','Order export timezone')}</b>${tg(Z('团队会话','team chat'))}<span class="sp"></span><span class="avs"><i class="a1">王</i><i class="a2">陈</i><i class="a3">李</i></span><small>${Z('3 人在线','3 online')}</small></div>
 <div class="cvb">${me('王',Z('王敏 · 产品','Min · Product'),'a1',Z('海外客户反馈导出时间差了 8 小时；另外把导出按钮文案改成“导出 CSV”。','Overseas customers see export times 8 hours off. Also rename the export button to "Export CSV".'),'.04')}
 ${think('.12','.22')}${bot(Z('按钮文案属于轻量改动，已直接修改并完成构建验证。','Updated the button label directly and verified the build.'),`<div class="tool rv" data-at=".26">${ic('pr')}<div><b>${Z('已提交 PR #131','Opened PR #131')}</b><small>web/export/button.tsx · +1 −1</small></div><span class="tg ok rv pop" data-at=".3">${ic('shield')}${Z('智能代批 · 低风险自动放行','Assisted review · low risk, auto-approved')}</span></div>`,'.22')}
 ${me('李',Z('李响 · 研发','Leo · Engineering'),'a3',Z('时区问题走「缺陷修复 SOP」处理，补齐独立评审和回归测试。','Run the timezone issue through the Bug fix SOP with independent review and regression tests.'),'.42')}
 ${think('.5','.6')}${bot(Z('已启动「缺陷修复 SOP」，各阶段进展将实时同步在当前会话。','Dispatched the Bug fix SOP. Stage progress will sync right in this thread.'),`<div class="runc rv" data-at=".64"><div class="rch">${ic('play')}<b>Run #1042</b><small>${Z('缺陷修复 SOP · LOOP-12','Bug fix SOP · LOOP-12')}</small><span class="sp"></span><span class="ubt sm">${Z('查看运行','Open run')}</span></div><div class="rcf">${[Z('澄清','Clarify'),Z('设计','Design'),Z('实现','Implement'),Z('评审','Review'),Z('测试','Test'),Z('验收','Sign-off')].map((x,j)=>`<span data-st="${f2(.68+j*.07)},${f2(.74+j*.07)}"><i></i>${x}</span>`).join('')}</div></div>`,'.6')}</div>
 <div class="cmp"><div class="cmi">${Z('输入需求描述，或 @角色 进行只读咨询…','Describe a task, or @role for read-only consultation…')}</div><div class="cmt"><i>${ic('plus')}</i><span>${mark('codebuddy')}DeepSeek-V4.1-Flash ${ic('down')}</span><span class="perm">${ic('shield')}${Z('智能代批','Assisted')} ${ic('down')}</span><span class="sp"></span><b>${ic('up')}</b></div></div>`;
 return F(1040,shell('home',main,side,false))}
/* 03 run detail: staged topology, pause / take over / resume */
function sop(t){const c=t.sop;
 const ST=[[[Z('需求分析','Analysis'),'bot',.06,.16]],[[Z('前端方案','Frontend plan'),'bot',.18,.3],[Z('接口设计','API design'),'bot',.18,.34]],[[Z('方案评审','Plan review'),'shield',.36,.42]],[[Z('页面实现','UI build'),'bot',.44,.78],[Z('接口实现','API build'),'bot',.44,.84]],[[Z('自动化验收','Acceptance'),'bot',.86,.94]]];
 const nd=(n)=>`<div class="tnd" data-st="${f2(n[2])},${f2(n[3])}"><span class="dni">${ic(n[1])}</span><div><b>${n[0]}</b><small><span class="s0">${Z('待执行','Pending')}</span><span class="s1">${Z('运行中','Running')} · attempt 1</span><span class="s2">${Z('已完成','Done')} · attempt 1</span></small></div><i class="dck">${ic('ok')}</i></div>`;
 const main=`<div class="rnd"><div class="rnb"><span class="ubt sm">← ${Z('返回运行列表','Back to runs')}</span>${tg(Z('独立运行','standalone'))}<span class="crumb">${Z('缺陷修复 SOP','Bug fix SOP')}</span></div>
 <div class="rnh"><div><h4>${Z('修复订单导出的时区错误','Fix timezone bug in order export')}</h4><p>LOOP-12 · ${Z('海外客户导出时间差 8 小时，统一按用户所在时区展示','export times are 8 hours off; normalize to the user\'s timezone')}</p></div><span class="sp"></span>
  <span class="ubt" data-k="pz">${ic('pause')}${Z('暂停','Pause')}</span><span class="ubt" data-k="tk">${ic('hand')}${Z('接管','Take over')}</span><span class="ubt rd">${Z('取消运行','Cancel run')}</span><span class="rst"><span class="s-run">${Z('运行中','Running')}</span><span class="s-pz">${Z('已暂停','Paused')}</span><span class="s-ok">${Z('已完成','Done')}</span></span></div>
 <div class="rnm"><span><b>Run</b> 971775330529</span><span>SOP v1</span><span>${ic('clock')}${Z('启动于 09:15','started 09:15')}</span><span>Sandbox <code>sbx-7f3a</code></span><span>${mark('claude')}Claude Code</span></div>
 <div class="rpx"><div class="rpi">${ic('play')}<b class="r-a">${Z('正按 SOP 推进 · 支持随时暂停介入或直接接管','Running SOP · pause to intervene or take over anytime')}</b><b class="r-b">${Z('全链路节点通过 · 已生成 PR #131','All nodes passed · PR #131 opened')}</b></div><div class="rpz"><div class="rpzt">${ic('hand')}<b>${Z('李响已暂停流水线，在在线编辑器中修改了 export/tz.go','Leo paused the pipeline and edited export/tz.go in the online editor')}</b><span class="sp"></span><span class="ubt ac" data-k="rs">${Z('恢复续跑','Resume')}</span></div><p>${Z('修改说明将同步注入后续节点，自动继续完成回归测试与交付。','Change notes are passed to downstream nodes; testing and delivery resume automatically.')}</p></div></div>
 <div class="tpo"><div class="tpoh"><b>${Z('节点执行拓扑','Step topology')}</b><small>${Z('点击任意节点查看实时思考轨迹、阶段产物与执行日志','click any node to inspect traces, artifacts and execution logs')}</small><span class="sp"></span><span class="lg"><i class="g"></i>${Z('完成','done')}<i class="b"></i>${Z('运行中','running')}<i></i>${Z('待执行','pending')}</span></div>
 <div class="tpg">${ST.map((s,i)=>`<div class="tst${s.length>1?' par':''}"><small>${Z('阶段','Stage')} ${i+1}${s.length>1?` · ${Z('并行','parallel')} ${s.length}`:''}</small>${s.map(nd).join('')}</div>`).join(`<span class="tar">${ic('arrow')}</span>`)}</div></div></div>${cur()}`;
 return F(1040,shell('play',main))}
/* 04 gate fails, the step reruns with the failure, then passes */
function gate(t){const c=t.gate;
 const nd=(id,ti,ro,x,y,extra='')=>`<div class="gnd" data-k="${id}" style="left:${x}px;top:${y}px"><div class="dnh"><span class="dni">${ic(id==='g4'?'shield':'bot')}</span><div><b>${ti}</b><small>${ro}</small></div><i class="dck">${ic('ok')}</i></div><div class="gnc">${extra}</div><div class="gnp"><span><i class="g"></i>${Z('成功','success')}</span><span><i class="r"></i>${Z('失败打回','on reject')}</span></div></div>`;
 const chips=(m,a)=>`<span>${m}</span><span class="att">attempt <b>${a}</b></span>`;
 return F(1040,`<div class="gcv"><div class="gtb">${ic('flow')}<b>${Z('全链路交付 SOP','Full delivery SOP')}</b>${tg('Run #1042')}<span class="sp"></span><span class="lg"><i class="g"></i>${Z('成功','success')}<i class="r"></i>${Z('失败打回','reject')}</span></div>
 <div class="gst"><svg class="gegs" width="1040" height="340" viewBox="0 0 1040 340"><path class="ge on" d="M272 90C302 90 300 112 330 112"/><path class="ge on" d="M272 250C304 250 300 132 330 132"/><path class="ge" data-k="e2" d="M562 112C600 112 622 112 660 112"/><path class="ge" data-k="e3" d="M892 112C930 112 950 112 1000 112"/><path class="ge rej" data-k="er" d="M446 180C446 280 360 290 272 278"/></svg>
  ${nd('g1',Z('页面实现','UI build'),Z('前端开发','Frontend dev'),40,24,chips('gpt-5.6','1'))}${nd('g0',Z('接口实现','API build'),Z('后端开发','Backend dev'),40,184,`<span>claude-opus</span><span class="att">attempt <b data-k="a0">1</b></span>`)}
  ${nd('g3',Z('自动化验收','Acceptance tests'),Z('测试工程师','Test engineer'),330,50,`<span>kimi-k3.1</span><span class="att">attempt <b data-k="a3">1</b></span>`)}${nd('g4',Z('交付确认','Delivery sign-off'),Z('人工门禁','Human gate'),660,50,`<span class="wt">${Z('等待人工确认','waiting for sign-off')}</span>`)}
  <span class="gbad" data-k="bad">${ic('x')}${Z('用例失败 2/14','2/14 tests failed')}</span><span class="gok" data-k="okb">${ic('ok')}${Z('14/14 通过','14/14 passed')}</span><span class="grl" data-k="rl">${Z('门禁未通过 · 附带报错打回返工','gate failed · sent back with logs')}</span></div>
 <div class="glog"><div class="glh">${ic('term')}<b>${Z('执行日志','Execution log')}</b><small>${Z('自动化验收','Acceptance tests')}</small></div>
  ${[['.2','<span class="ps">$</span> npm run test:e2e'],['.3','<span class="bd">✕ export.spec.ts › '+Z('按用户时区导出','exports in user timezone')+' · expected 08:00, got 00:00</span>'],['.33','<span class="bd">✕ csv.spec.ts › '+Z('时间戳格式校验','timestamp format check')+' · got UTC</span>'],['.38','<span class="bd"><b>exit 1</b> · 2/14 '+Z('未通过 → 附带报错上下文打回「接口实现」','failed → sent back to API build with error context')+'</span>'],['.56','<span class="dm">attempt 2 · '+Z('根据报错定位修复：导出前统一转换为用户所在时区','fix from error context: normalize to user timezone before export')+'</span>'],['.8','<span class="gd">✓ 14/14 passed · exit 0</span>']].map(l=>`<div class="rv" data-at="${l[0]}">${l[1]}</div>`).join('')}</div></div>`)}
/* 05 scheduled issue sync on the requirement board */
function auto(t){const c=t.auto;
 const COLS=[[Z('待处理','To do'),'list'],[Z('执行中','In progress'),'play'],[Z('待我确认','Needs me'),'check'],[Z('已完成','Done'),'ok']];
 const K=[['#212',Z('导出文件名含非法字符','Illegal characters in export filename'),Z('高','High'),'0:0,.22:1,.6:3','PR #140'],['#215',Z('订单列表分页偏移','Order list pagination offset'),Z('中','Med'),'0:0,.26:1,.76:3','PR #141'],['#218',Z('退款金额精度丢失','Refund amount loses precision'),Z('紧急','Urgent'),'0:0,.3:1,.52:2',''],['#219',Z('依赖安全检查','Dependency security check'),Z('中','Med'),'0:0,.34:1,.68:3',Z('升级方案','plan')]];
 const card=(k,i)=>`<div class="kc rv" data-at="${f2(.06+i*.04)}" data-path="${k[3]}"><small>${k[0]} · GitHub</small><b>${k[1]}</b><div class="kcr"><span class="pri${i===2?' hot':''}">${i===2?'✦':'▮'} ${k[2]}</span><span class="kst"><span class="c0">${Z('等待执行','Queued')}</span><span class="c1"><i class="spin"></i>${Z('修复中','Fixing')}</span><span class="c2">${Z('已释放资源','resources freed')}</span><span class="c3">${ic('ok')}${k[4]}</span></span></div>${i===1?`<span class="kcf" data-k="cf">${Z('合流冲突 → 自动解决','merge conflict → resolved')}</span>`:''}</div>`;
 const main=`<div class="rql2"><div class="rqh"><div><h4>${Z('需求与单据看板','Requirements & Issues')}</h4><p>${Z('集中跟踪日常 Issue 与需求流转状态，等待人工确认的任务自动释放算力','Track daily issues and requirements in one board; tasks awaiting sign-off free compute automatically')}</p></div><span class="sp"></span><span class="ubt">${ic('down')}${Z('同步 Issues','Sync issues')}</span><span class="ubt ac">${ic('plus')}${Z('新建需求','New requirement')}</span></div>
 <div class="sch rv" data-at=".02">${ic('clock')}<b>${Z('定时调度 · 每天 09:00 自动同步 GitHub Issues','Scheduled · auto-sync GitHub issues daily at 09:00')}</b><span class="sp"></span><span class="tg">${mark('gh')}${Z('已拉取 4 个新 Issue','4 new issues pulled')}</span></div>
 <div class="kb">${COLS.map((cl,i)=>`<div class="kcol"><div class="kch">${ic(cl[1])}${cl[0]}<span class="sp"></span><b data-k="n${i}">0</b></div></div>`).join('')}<div class="kcs">${K.map(card).join('')}</div></div>
 <div class="kdn rv" data-at=".86">${ic('pr')}${Z('集成分支合流检查通过 · 自动生成汇总 PR #142','Integration branch merge check passed · rollup PR #142 opened')}</div></div>`;
 return F(1040,shell('list',main))}
/* 06 evaluation: score, prescriptions, apply, next run */
function rsi(t){const c=t.rsi;
 const D=[[Z('控制流健康','Control flow'),[60,92]],[Z('耗时与等待','Time & waiting'),[45,88]],[Z('工具浪费','Tool waste'),[62,95]],[Z('Token 效率','Token efficiency'),[58,90]],[Z('错误恢复','Error recovery'),[40,100]],[Z('交付完整','Completeness'),[70,100]]];
 const main=`<div class="evp"><div class="evb rv" data-at=".02"><div><span class="tg ac">${ic('spark')}${Z('AI 运行评测','Run evaluation')}</span><h4>${Z('SOP 执行质量与耗时瓶颈评估','SOP execution quality & bottleneck review')}</h4><p>${Z('回溯完整执行轨迹，检查各阶段耗时、产物与门禁结果，生成可一键写回的改进建议。','Replays the full trace, checks stage timing, deliverables and gates, and generates one-click improvements.')}</p></div><span class="sp"></span>
  <div class="evm"><small>${Z('评测模型','Model')}</small><div class="fld">${ic('spark')}GLM-5.3-Flash ${ic('down')}</div></div><span class="ubt grd" data-k="go" data-press=".12">${ic('spark')}${Z('启动评测','Run evaluation')}</span></div>
 <div class="evr"><div class="evs2 rv" data-at=".18"><svg class="rg" viewBox="0 0 120 120"><circle cx="60" cy="60" r="52"/><circle class="rgv" data-k="rgv" cx="60" cy="60" r="52" pathLength="100"/></svg><div class="rgt"><b data-k="sc">0</b><small>/100</small></div>
  <div class="evl"><span class="s-a">${Z('第 1 次运行 · 返工 2 次','Run 1 · reworked twice')}</span><span class="s-b">${Z('第 2 次运行 · 一次通过','Run 2 · passed first time')}</span><small>${Z('基线 70 分','baseline 70')}</small></div></div>
  <div class="evd2">${D.map((d,i)=>`<div class="rv" data-at="${f2(.22+i*.025)}"><span>${d[0]}</span><i><em data-k="d${i}"></em></i></div>`).join('')}</div>
  <div class="evx"><div class="evxh">${ic('file')}<b>${Z('改进建议','Improvements')}</b><small>${Z('写回后生成新版本，不改本次运行的快照','writes a new version; this run\'s snapshot is untouched')}</small></div>
  ${c.items.map((x,i)=>`<div class="rxi rv" data-at="${f2(.36+i*.05)}" data-sw="${f2(.58+i*.04)}"><span class="rxt">${x[0]}</span><p>${x[1]}</p><span class="ubt ac sm s-a" data-k="ap${i}" data-press="${f2(.55+i*.04)}">${c.apply}</span><span class="rxd s-b">${ic('ok')}${c.applied}</span></div>`).join('')}</div></div></div>${cur()}`;
 return F(1040,shell('play',main))}
const INS={platform:['git clone https://github.com/Tencent/LoopForge.git && cd LoopForge','bash scripts/install.sh','open http://localhost:8090','Platform'],claude:['npx -y loopforge-cli@latest install claude','npx -y loopforge-cli@latest status claude','/start-devflow','Classic'],codex:['npx -y loopforge-cli@latest install codex','npx -y loopforge-cli@latest status codex','$devflow-codex','Classic'],
 cursor:['npx -y loopforge-cli@latest install cursor','npx -y loopforge-cli@latest status cursor','/start-devflow','Classic'],codebuddy:['npx -y loopforge-cli@latest install codebuddy','npx -y loopforge-cli@latest status codebuddy','/start-devflow','Classic'],
 pi:['npx -y loopforge-cli@latest skills install pi','pi install npm:pi-subagents','/skill:devflow','Portable']};
const REQ=()=>Z('"为订单列表增加状态筛选，并补充接口测试"','"Add a status filter to the order list and cover the API with tests"');
const stLine=id=>id==='platform'?INS[id][2]:`${INS[id][2]} ${REQ()}`;
const edNote=id=>INS[id][3]==='Platform'?Z('平台版','Platform edition'):INS[id][3]==='Portable'?Z('Portable 版（Pi 只有这一版）· 第二行装的是 pi-subagents 扩展，多 Agent 流程要用到','Portable edition (the only one for Pi) · line 2 adds the pi-subagents extension used for multi-agent runs'):Z('Classic 版（默认）','Classic edition (default)');
const TABS=()=>[['platform',T[L].install.plat],...AGENTS];
const STAR='<svg viewBox="0 0 800 800" fill="currentColor" aria-hidden="true"><path d="M305.105 180.279C347.327 104.538 368.437 66.6667 400 66.6667C431.563 66.6667 452.673 104.537 494.893 180.279L505.817 199.874C517.817 221.398 523.813 232.16 533.17 239.26C542.523 246.361 554.17 248.997 577.47 254.268L598.683 259.068C680.67 277.619 721.667 286.894 731.42 318.258C741.173 349.62 713.227 382.303 657.33 447.663L642.87 464.573C626.987 483.147 619.043 492.433 615.47 503.923C611.9 515.413 613.1 527.803 615.5 552.587L617.687 575.147C626.137 662.353 630.363 705.957 604.83 725.34C579.293 744.723 540.91 727.05 464.143 691.707L444.283 682.56C422.47 672.517 411.563 667.493 400 667.493C388.437 667.493 377.53 672.517 355.717 682.56L335.857 691.707C259.089 727.05 220.706 744.723 195.172 725.34C169.637 705.957 173.863 662.353 182.313 575.147L184.499 552.587C186.901 527.803 188.102 515.413 184.529 503.923C180.956 492.433 173.014 483.147 157.131 464.573L142.67 447.663C86.7749 382.303 58.8272 349.62 68.5806 318.258C78.3339 286.894 119.329 277.619 201.318 259.068L222.53 254.268C245.828 248.997 257.478 246.361 266.831 239.26C276.185 232.16 282.184 221.398 294.182 199.874L305.105 180.279Z"/></svg>',SPK='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5L12 0z"/></svg>';
/* GitHub star count, cached for an hour; the demo page reads the same cache */
function stars(){const show=n=>document.querySelectorAll('.ghs .gct').forEach(e=>{e.textContent=n>=1e4?(n/1e3).toFixed(1)+'k':n.toLocaleString('en-US');e.hidden=false});
 try{const c=JSON.parse(localStorage.getItem('lf-stars')||'null');if(c){show(c.n);if(Date.now()-c.t<36e5)return}}catch(e){}
 fetch('https://api.github.com/repos/Tencent/LoopForge').then(r=>r.ok?r.json():null).then(j=>{if(j&&typeof j.stargazers_count==='number'){localStorage.setItem('lf-stars',JSON.stringify({n:j.stargazers_count,t:Date.now()}));show(j.stargazers_count)}}).catch(()=>{})}
const tmark=id=>id==='platform'?`<span class="mk lgm">${LOGO()}</span>`:mark(id);
function install(t){const n=t.install;
 return `<div class="sec-h"><span class="kick">${ic('term')}${Z('快速部署','Deploy')}</span>${head({h:t.dep.h,em:t.dep.em,sub:n.sub})}</div>
 <div class="dep2"><div class="tabs rv" data-at=".14"><span class="ind" data-k="ind"></span>${TABS().map((a,i)=>`<button data-id="${a[0]}" class="${i?'':'act'}">${tmark(a[0])}${a[1]}</button>`).join('')}</div>
 <div class="ibox rv" data-at=".22"><div class="ibh"><i></i><i></i><i></i><span>bash</span><span class="sp"></span><button data-copy>${ic('copy')}${n.copy}</button></div><div class="row"><span>$</span><code data-k="ic">${INS.platform[0]}</code></div>
 <div class="row"><span>$</span><code data-k="is">${INS.platform[1]}</code></div><div class="st"><span class="ps">›</span> <code data-k="ist">${stLine('platform')}</code></div><div class="ed" data-k="ied">${edNote('platform')}</div></div>
 <p class="inote rv" data-at=".3">${n.note} <code>npx -y loopforge-cli@latest doctor</code> · <a href="${DOCS()}#install">${Z('安装指引','Install guide')}</a></p></div>`}
const STEPS=[['cloud',cloud,'cloud'],['chat',chat,'users'],['sop',sop,'flow'],['gate',gate,'shield'],['auto',auto,'clock'],['rsi',rsi,'loop']];
const PIC=['cloud','users','bug','clock','loop'];
const LEN={hero:2.4,why:1,head:.6,cloud:2,chat:2.6,sop:2.6,gate:2.6,auto:2.6,rsi:2.6,install:2,fin:.7};
const PLAY='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15a1 1 0 001.5.86l12.6-7.5a1 1 0 000-1.72L8.5 3.64A1 1 0 007 4.5z"/></svg>';
/* ---------- typing with human cadence ---------- */
function cadence(s){const a=[...s];let h=7,t=0;const out=[];for(let i=0;i<a.length;i++){h=(h*9301+49297)%233280;const j=.55+h/233280*.9;const prev=a[i-1]||'';
 let w=/[\u4e00-\u9fff]/.test(a[i])?1.35:1;if(prev===' ')w*=1.5;if(/[，。,.:：、]/.test(prev))w*=3.2;if(prev==='"')w*=1.8;if(i&&i%9===0)w*=1.6;t+=w*j;out.push(t)}
 return out.map(x=>x/t)}
function setCount(e,k){const o=e.dataset.cnt;if(k>=1){if(e.textContent!==o)e.textContent=o;return}
 e.textContent=o.replace(/\d+(?:\.\d+)?/g,m=>{const d=(m.split('.')[1]||'').length;return (parseFloat(m)*k).toFixed(d)})}
/* ---------- build ---------- */
let U=[];
function build(){const t=T[L];document.documentElement.lang=L==='zh'?'zh-CN':'en';
 const MD=document.querySelector('meta[name=description]');window.LF_ZH_META=window.LF_ZH_META||[document.title,MD?MD.content:''];document.title=Z(LF_ZH_META[0],'LoopForge · Open-source, self-improving cloud platform for AI development');if(MD)MD.content=Z(LF_ZH_META[1],'LoopForge is an open-source, self-hosted cloud platform for AI development: 24/7 cloud workspaces, a shared conversation with one Main Bot, SOPs with hard gates, scheduled and issue automation, and a review after every run that improves the process.');
 const GH='https://github.com/Tencent/LoopForge',ids=['why','story','video','deploy'];
 const c=t.hero,w=t.why,arrow=`<span class="ar">${ic('arrow')}</span>`;
 document.getElementById('app').innerHTML=`<header class="nav"><i class="nprog"></i><div class="nbar"><a class="brand" href="#top">${LOGO(1)}<span>LoopForge</span></a><span class="sp"></span>
 <div class="links">${t.nav.map((n,i)=>`<a href="#${ids[i]}" data-nav="${ids[i]}">${n}</a>`).join('')}<a href="${DOCS()}">${Z('使用文档','Docs')}</a></div>
 <div class="lang"><button data-l="zh" class="${L==='zh'?'on':''}" aria-label="${Z('中文','Chinese')}">${Z('中','ZH')}</button><button data-l="en" class="${L==='en'?'on':''}">EN</button></div>
 <a class="ghs" href="${GH}" target="_blank" rel="noopener" aria-label="GitHub"><span class="gsw"><span class="g1">${mark('gh')}</span><span class="g2">${STAR}</span><i class="sk s1">${SPK}</i><i class="sk s2">${SPK}</i></span><span class="gtx">GitHub</span><span class="gct" hidden></span></a><a class="btn-k sm" href="${TRY()}">${t.try}${arrow}</a></div></header>
 <main>
 <section class="hero u" id="top" data-u="hero"><div class="hx"><div class="hxl"><span class="kick rv" data-at=".02"><i class="led"></i>${Z('MIT 开源 · 可自主部署','MIT licensed · self-hosted')}</span>${head({h:c.h,em:c.em},'h1')}</div>
  <div class="hxr"><p class="sub rv" data-at=".16">${c.sub}</p><div class="cta rv" data-at=".22"><a class="btn-k" href="${TRY()}">${t.try}${arrow}</a><a class="btn-t" href="#deploy">${c.deploy}${arrow}</a></div>
  <div class="ags rv" data-at=".28"><small>${c.exec}</small>${EXECS.map((a,i)=>`<span class="ag" style="--i:${i}" data-tip="${a[1]}" aria-label="${a[1]}">${mark(a[0])}</span>`).join('')}<span class="sep"></span><a class="ag" style="--i:${EXECS.length}" href="${GH}" target="_blank" rel="noopener" data-tip="GitHub" aria-label="GitHub">${mark('gh')}</a><button type="button" class="ag wx" style="--i:${EXECS.length+1}" aria-label="${Z('微信交流群','WeChat group')}" aria-haspopup="true">${mark('wechat')}<span class="qr" role="tooltip"><img src="site/wechat-qr.png" width="132" height="132" alt="${Z('LoopForge 微信交流群二维码','LoopForge WeChat group QR code')}" loading="lazy"><b>${Z('扫码加入交流群','Scan to join on WeChat')}</b></span></button></div></div></div>
  <div class="hwin">${TAGS().map((g,i)=>`<span class="atag ${g[1]} rv" data-at="${f2(.5+i*.06)}" style="top:${g[2]}%"><b>${g[0]}</b><i></i></span>`).join('')}${hero(t)}</div></section>
 <section class="why wrap u" id="why" data-u="why"><div class="sec-h"><span class="kick">${ic('gauge')}${Z('核心价值','Why LoopForge')}</span>${head(w)}</div>
  <div class="pains">${w.pains.map((x,i)=>`<div class="pain rv" data-at="${(.18+i*.05).toFixed(2)}"><span class="pn">${x[0]}</span><span class="pi">${ic(PIC[i])}</span><h3>${x[1]}</h3><p>${x[2]}</p></div>`).join('')}</div></section>
 <section class="story wrap" id="story"><div class="sec-h u" data-u="head"><span class="kick">${ic('spark')}${Z('核心机制','How it works')}</span>${head(t.story)}</div>
  ${STEPS.map(([k,fn,icn],i)=>`<article class="stp u" data-u="${k}"><header class="sth"><span class="stn rv" data-at=".02">${String(i+1).padStart(2,'0')}</span><div class="stt"><span class="kick">${ic(icn)}${t.story.marks[i]}</span>${head({h:t[k].h,em:t[k].em},'h3')}</div><p class="sub rv" data-at=".14">${t[k].sub}</p></header>
   <div class="stage">${fn(t)}<button class="rp" type="button">${ic('loop')}${t.replay}</button></div></article>`).join('')}</section>
 <section class="video wrap" id="video"><div class="sec-h u" data-u="head"><span class="kick">${ic('play')}${Z('实机演示','Walkthrough')}</span>${head(t.video)}</div>
  <div class="vframe"><video preload="none" playsinline poster="demo/media/loopforge-promo${Z('','-en')}.jpg?v=12" src="demo/media/loopforge-promo${Z('','-en')}.mp4?v=12"></video>
  <button class="play" type="button"><i>${PLAY}</i><span>${t.video.play}</span></button></div>
  <div class="vfoot"><a class="btn-t" href="${TRY()}">${t.video.cta}${arrow}</a></div></section>
 <section class="deploy wrap u" id="deploy" data-u="install">${install(t)}</section>
 <section class="fin u" data-u="fin"><span class="fl rv pop" data-at=".02">${LOGO()}</span>${head(t.fin)}
  <div class="cta rv" data-at=".2"><a class="btn-k" href="${TRY()}">${t.try}${arrow}</a><a class="btn-t" href="${DOCS()}">${Z('阅读使用文档','Read docs')}${arrow}</a><a class="btn-t" href="${GH}" target="_blank" rel="noopener">${mark('gh')}${t.install.gh}${arrow}</a></div></section>
 </main>
 <footer class="ft"><a class="brand" href="#top">${LOGO(1)}<span>LoopForge</span></a><span>${t.install.foot} · <a href="${GH}" target="_blank" rel="noopener">github.com/Tencent/LoopForge</a> · ${Z('产品 Logo 归各自所有者','product logos belong to their owners')}</span></footer>`;
 const app=document.getElementById('app');
 U=[...app.querySelectorAll('.u')].map(el=>{const q=s=>[...el.querySelectorAll(s)];const n=el.dataset.u;
  const m={el,n,dur:Math.round(LEN[n]*3400),p:0,done:false,playing:false,at:q('[data-at]'),off:q('[data-off]'),tick:q('[data-tick]'),cnt:q('[data-cnt]'),sw:q('[data-sw]'),press:q('[data-press]'),st:q('[data-st]'),path:q('[data-path]')};
  el.querySelectorAll('[data-k]').forEach(e=>{if(!m[e.dataset.k])m[e.dataset.k]=e});return m});
 U.forEach(m=>{const b=m.el.querySelector('.rp');if(b)b.addEventListener('click',()=>{reset(m);play(m)})});
 app.querySelectorAll('.lang button').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.l===L)return;L=b.dataset.l;localStorage.setItem('lf-lang',L);const u=new URL(location);u.searchParams.set('lang',L);history.replaceState(null,'',u);boot()}));
 const ins=U.find(m=>m.n==='install');ins.el.querySelectorAll('.tabs button').forEach(b=>b.addEventListener('click',()=>{ins.manual=true;pick(ins,b.dataset.id,!RM.matches)}));
 const wxb=app.querySelector('.ags .wx');wxb.addEventListener('click',e=>{e.stopPropagation();wxb.classList.toggle('open')});document.addEventListener('click',()=>wxb.classList.remove('open'));
 ins.el.querySelector('[data-copy]').addEventListener('click',e=>{const b=e.currentTarget;navigator.clipboard&&navigator.clipboard.writeText(ins.ic.textContent+'\n'+ins.is.textContent);b.classList.add('ok');b.innerHTML=ic('check')+t.install.copied;clearTimeout(b._t);b._t=setTimeout(()=>{b.classList.remove('ok');b.innerHTML=ic('copy')+t.install.copy},1400)});
 app.querySelectorAll('.stage').forEach(g=>g.addEventListener('pointermove',e=>{const r=g.getBoundingClientRect();g.style.setProperty('--mx',(e.clientX-r.left)+'px');g.style.setProperty('--my',(e.clientY-r.top)+'px')},{passive:true}));
 const vf=app.querySelector('.vframe'),v=vf.querySelector('video');
 vf.querySelector('.play').addEventListener('click',()=>{vf.classList.add('on');v.controls=true;v.play()});
}
/* ---------- install tabs: sliding indicator + command retype ---------- */
function placeInd(m){const b=m.el.querySelector('.tabs button.act');if(!b)return;m.ind.style.width=b.offsetWidth+'px';m.ind.style.transform=`translateX(${b.offsetLeft}px)`}
function retype(el,text,delay=0){clearInterval(el._iv);clearTimeout(el._to);const c=cadence(text),dur=Math.min(900,180+text.length*16);
 el._to=setTimeout(()=>{const t0=performance.now();el._iv=setInterval(()=>{const k=cl((performance.now()-t0)/dur);let n=0;while(n<c.length&&c[n]<=k)n++;el.textContent=[...text].slice(0,n).join('');el.classList.toggle('typing',k<1);if(k>=1)clearInterval(el._iv)},16)},delay)}
function pick(m,id,animate){m.el.querySelectorAll('.tabs button').forEach(x=>x.classList.toggle('act',x.dataset.id===id));m.cur=id;placeInd(m);const v=INS[id];
 const set=[[m.ic,v[0]],[m.is,v[1]],[m.ist,stLine(id)]];
 if(animate){set.forEach(([e,s],i)=>retype(e,s,i*140));m.ied.classList.remove('on');void m.ied.offsetWidth;m.ied.textContent=edNote(id);m.ied.classList.add('on')}
 else{set.forEach(([e,s])=>{clearInterval(e._iv);clearTimeout(e._to);e.textContent=s;e.classList.remove('typing')});m.ied.textContent=edNote(id);m.ied.classList.add('on')}}
/* ---------- simulated pointer: keys are [progress, data-k target or [x,y], click] ---------- */
function rel(el,root){let x=0,y=0,e=el;while(e&&e!==root){x+=e.offsetLeft;y+=e.offsetTop;e=e.offsetParent}return{x:x+el.offsetWidth*.5,y:y+el.offsetHeight*.55}}
function pointer(m,keys,p){const c=m.mc;if(!c)return;if(!m._pts)m._pts=keys.map(k=>typeof k[1]==='string'?rel(m[k[1]],m.win):{x:k[1][0],y:k[1][1]});
 const P0=keys[0][0]-.03,P1=keys[keys.length-1][0]+.05;const vis=p>=P0&&p<=P1;c.style.opacity=vis?1:0;if(!vis)return;
 let x=m._pts[0].x,y=m._pts[0].y;for(let i=1;i<keys.length;i++){if(p>=keys[i][0]){x=m._pts[i].x;y=m._pts[i].y;continue}const t=EIO(R(p,keys[i-1][0]+(keys[i-1][2]?.015:0),keys[i][0]));x=lerp(m._pts[i-1].x,m._pts[i].x,t);y=lerp(m._pts[i-1].y,m._pts[i].y,t);break}
 c.style.transform=`translate(${x}px,${y}px)`;c.classList.toggle('click',keys.some(k=>k[2]&&p>=k[0]&&p<k[0]+.025))}
const tilt=w=>e=>{w.style.transform=e>=1?'':`perspective(2400px) rotateX(${10*(1-e)}deg) translateY(${36*(1-e)}px)`};
const KBW=220,KBH=104;
const UPD={
 hero:(m,p)=>{tilt(m.win)(EO(R(p,-.05,.3)))},
 cloud:(m,p)=>{const mins=Math.round(lerp(0,155,EIO(R(p,.05,.95))));const h=(23*60+40+mins)%1440;m.clk.textContent=String(Math.floor(h/60)).padStart(2,'0')+':'+String(h%60).padStart(2,'0')},
 sop:(m,p)=>{pointer(m,[[.46,[700,140]],[.5,'pz',1],[.6,[560,330]],[.66,'rs',1],[.74,[820,420]]],p);
  const pz=p>=.5&&p<.66;m.el.classList.toggle('pz',pz);m.el.classList.toggle('rdone',p>=.95);if(pz)m.st.forEach(e=>{if(e.classList.contains('go'))e.classList.add('hold')});else m.st.forEach(e=>e.classList.remove('hold'))},
 gate:(m,p)=>{const f=p>=.32&&p<.56,r=p>=.4&&p<.56,re=p>=.56&&p<.72,pass=p>=.78;
  m.g1.className='gnd dn';m.g0.className='gnd '+(re?'go':p>=.72?'dn':r?'rj':'dn');m.g3.className='gnd '+(p<.18?'':p<.32?'go':f?'bad':p<.72?'':p<.78?'go':'dn');m.g4.className='gnd '+(pass?'wt':'');
  m.bad.classList.toggle('on',f);m.okb.classList.toggle('on',pass);m.rl.classList.toggle('on',r);m.er.classList.toggle('on',r);m.e2.classList.toggle('on',p>=.18);m.e3.classList.toggle('on',pass);m.a0.textContent=p>=.56?'2':'1';m.a3.textContent=p>=.72?'2':'1'},
 auto:(m,p)=>{const cnt=[0,0,0,0];m.path.forEach(e=>{const pts=e.dataset.path.split(',').map(s=>s.split(':').map(Number));let col=0;pts.forEach(([a,c])=>{if(p>=a)col=c});
   const row=cnt[col]++;e.style.transform=`translate(${col*(KBW+12)}px,${row*(KBH+10)}px)`;e.className=e.className.replace(/\bc[0-3]\b/g,'').trim()+' c'+col});
  cnt.forEach((n,i)=>m['n'+i].textContent=n);if(m.cf)m.cf.classList.toggle('on',p>=.6&&p<.76)},
 rsi:(m,p)=>{pointer(m,[[.06,[640,300]],[.12,'go',1],[.4,[760,330]],[.55,'ap0',1],[.59,'ap1',1],[.63,'ap2',1],[.7,[600,420]]],p);
  const v=p<.16?0:p<.74?Math.round(55*EO(R(p,.16,.32))):Math.round(lerp(55,96,EO(R(p,.74,.92))));m.sc.textContent=v;m.rgv.style.strokeDashoffset=100-v;m.el.classList.toggle('r2',p>=.74);m.el.querySelector('.evs2').classList.toggle('swon',p>=.74);
  for(let i=0;i<6;i++){const d=[[60,92],[45,88],[62,95],[58,90],[40,100],[70,100]][i];m['d'+i].style.width=(p<.2?0:p<.74?d[0]*EO(R(p,.2,.36)):lerp(d[0],d[1],EO(R(p,.74,.92))))+'%'}},
 install:(m,p)=>{if(m.manual)return;const st=p<.3?0:p<.6?1:p<.82?2:3;if(st===m.st2)return;const live=m.playing&&m.st2!==undefined&&st===m.st2+1;m.st2=st;
  if(st===0){['ic','is','ist'].forEach(k=>{clearInterval(m[k]._iv);clearTimeout(m[k]._to);m[k].textContent=''});m.el.querySelectorAll('.tabs button').forEach(x=>x.classList.toggle('act',x.dataset.id==='platform'));placeInd(m);m.ied.classList.remove('on');return}
  pick(m,st===1?'platform':st===2?'claude':'pi',live)}};
function run(m,p){
 m.at.forEach(e=>e.classList.toggle('on',p>=+e.dataset.at));m.off.forEach(e=>{if(p>=+e.dataset.off)e.classList.remove('on')});
 m.tick.forEach(e=>e.classList.toggle(e.dataset.cls||'ok',p>=+e.dataset.tick));
 m.cnt.forEach(e=>setCount(e,EO(R(p,+e.dataset.a,+e.dataset.b))));
 m.sw.forEach(e=>e.classList.toggle('swon',p>=+e.dataset.sw));m.press.forEach(e=>e.classList.toggle('press',p>=+e.dataset.press&&p<+e.dataset.press+.03));
 m.st.forEach(e=>{const[a,b]=e.dataset.st.split(',').map(Number);e.classList.toggle('go',p>=a&&p<b);e.classList.toggle('dn',p>=b)});
 if(UPD[m.n])UPD[m.n](m,p);if(m.win&&m.n!=='hero')tilt(m.win)(EO(R(p,0,.16)))}
/* ---------- each block plays on its own clock once it scrolls into view ---------- */
const RM=matchMedia('(prefers-reduced-motion: reduce)'),STILL=qs.has('still');if(STILL)document.body.classList.add('still');
function play(m){cancelAnimationFrame(m.raf);if(RM.matches||STILL){m.p=1;finish(m);return}
 m.playing=true;m.el.classList.remove('played');const t0=performance.now()-m.p*m.dur;
 const tick=now=>{m.p=cl((now-t0)/m.dur);run(m,m.p);if(m.p<1)m.raf=requestAnimationFrame(tick);else finish(m)};m.raf=requestAnimationFrame(tick)}
function finish(m){m.playing=false;m.done=true;run(m,1);m.el.classList.add('played')}
function reset(m){cancelAnimationFrame(m.raf);m.p=0;m.done=false;m.st2=undefined;m.manual=false;m._pts=null;
 m.el.classList.add('rewind');run(m,0);void m.el.offsetWidth;m.el.classList.remove('rewind')}
let io;
function watch(){if(io)io.disconnect();io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const m=U.find(x=>x.el===e.target);io.unobserve(e.target);if(m&&!m.done&&!m.playing)play(m)}),{rootMargin:'0px 0px -25% 0px'});
 U.forEach(m=>{if(m.done){run(m,1);m.el.classList.add('played')}else io.observe(m.el)})}
/* ---------- windows scale to their column ---------- */
function fit(){document.querySelectorAll('.fit').forEach(f=>{const z=f.firstElementChild,b=z.offsetWidth,w=f.clientWidth,k=Math.min(+f.dataset.max||1,w/b);
 z.style.transform=`scale(${k.toFixed(4)})`;z.style.marginLeft=Math.max(0,(w-b*k)/2)+'px';f.style.height=Math.ceil(z.offsetHeight*k)+'px'});U.forEach(m=>m._pts=null)}
/* ---------- nav state ---------- */
function onScroll(){const y=innerHeight*.45;let on=null;
 document.querySelectorAll('main>section[id]').forEach(s=>{if(s.getBoundingClientRect().top<y)on=s.id});
 document.querySelectorAll('[data-nav]').forEach(a=>a.classList.toggle('on',a.dataset.nav===on));
 document.querySelector('.nav').classList.toggle('sc',scrollY>8);
 const pg=document.querySelector('.nprog'),mx=document.documentElement.scrollHeight-innerHeight;if(pg)pg.style.transform=`scaleX(${mx>0?(scrollY/mx).toFixed(4):0})`}
function boot(){const keep=scrollY,prev=U.map(m=>m.done);build();if(prev.length===U.length)U.forEach((m,i)=>{m.done=prev[i];if(m.done)m.p=1});
 U.forEach(m=>run(m,m.p));fit();watch();onScroll();stars();scrollTo(0,keep)}
window.LF={get units(){return U},play,reset,fit};
addEventListener('scroll',onScroll,{passive:true});
addEventListener('resize',()=>{fit();onScroll();const m=U.find(x=>x.n==='install');if(m)placeInd(m)});
document.fonts&&document.fonts.ready.then(()=>{fit();const m=U.find(x=>x.n==='install');if(m)placeInd(m)});
boot();
})();
