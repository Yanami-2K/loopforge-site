window.startJournalCover = (hero, language, still) => {
  if (still) return;
  const frame = hero.querySelector('.j-cover');
  const controller = new AbortController();
  const source = frame.querySelector('img');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const moon = source.cloneNode(false);
  moon.alt = '';
  moon.className = 'lunar-plane';
  moon.setAttribute('aria-hidden','true');
  frame.append(moon);

  // Align the lunar silhouette with the painted rectangle of the photograph.
  function fit() {
    const width = frame.clientWidth, height = frame.clientHeight;
    const scale = Math.max(width / 1920, height / 1280);
    const [x,y] = getComputedStyle(source).objectPosition.split(' ').map(parseFloat);
    Object.assign(moon.style,{
      width:1920*scale+'px',height:1280*scale+'px',
      left:(width-1920*scale)*x/100+'px',top:(height-1280*scale)*y/100+'px'
    });
  }

  const resize = new ResizeObserver(fit);
  resize.observe(frame);
  fit();
  const lines = [...hero.querySelectorAll('.title-first,.title-second')];
  let animations = [];
  let layers = [];
  function reset() {
    for (const animation of animations) animation.cancel();
    for (const layer of layers) layer.remove();
    animations = [];
    layers = [];
  }
  function exposeTitle(line, delay) {
    const fill = document.createElement('span');
    fill.className = 'title-ink';
    fill.setAttribute('aria-hidden','true');
    fill.append(...[...line.childNodes].map(node => node.cloneNode(true)));
    const ink = getComputedStyle(line).color;
    fill.style.color = ink;
    line.append(fill);
    layers.push(fill);
    const timing = {duration:1460,delay,fill:'backwards',easing:'cubic-bezier(.32,0,.19,1)'};
    animations.push(line.animate([
      {color:'#526075',webkitTextStrokeWidth:'.9px',webkitTextStrokeColor:'#c2cfe2',offset:0},
      {color:'#526075',webkitTextStrokeWidth:'.9px',webkitTextStrokeColor:'#c2cfe2',offset:.94},
      {color:ink,webkitTextStrokeWidth:'0px',webkitTextStrokeColor:'transparent'}
    ],timing));
    animations.push(fill.animate([
      {clipPath:'polygon(-55% -75%,-25% -75%,-47% 200%,-55% 200%)'},
      {clipPath:'polygon(-55% -75%,175% -75%,153% 200%,-55% 200%)'}
    ],timing));
  }
  // The SVG uses the same typeface, tracking and measured baseline as the live italic.
  function traceJournal(line) {
    const probe = document.createElement('span');
    probe.className='baseline-probe';
    line.append(probe);
    const baseline=probe.getBoundingClientRect().top-line.getBoundingClientRect().top;
    probe.remove();
    const svgNS='http://www.w3.org/2000/svg';
    const svg=document.createElementNS(svgNS,'svg');
    svg.setAttribute('class','letter-trace');
    svg.setAttribute('aria-hidden','true');
    const text=document.createElementNS(svgNS,'text');
    text.textContent='Journal';
    text.setAttribute('y',baseline);
    svg.append(text);line.append(svg);layers.push(svg);
    animations.push(text.animate([
      {strokeDasharray:'.03em 3.6em',opacity:.4},
      {strokeDasharray:'2.9em 3.6em',opacity:1,offset:.72},
      {strokeDasharray:'3.6em 3.6em',opacity:0}
    ],{duration:1340,delay:210,fill:'both',easing:'ease-in-out'}));
    animations.push(line.animate([
      {color:'#738299'},{color:'#738299',offset:.39},{color:'#e1e8ed'}
    ],{duration:1370,delay:210,fill:'backwards'}));
    const stop=line.querySelector('.journal-stop');
    animations.push(stop.animate([
      {opacity:.35,transform:'scale(.52)'},
      {opacity:1,transform:'scale(1.25)',offset:.65},
      {opacity:1,transform:'scale(1)'}
    ],{duration:360,delay:1370,fill:'backwards',easing:'ease-out'}));
  }
  function play(withPhoto=true) {
    reset();
    if (reduced.matches) return;
    exposeTitle(lines[0],80);
    traceJournal(lines[1]);
    if (withPhoto) animations.push(moon.animate([{transform:'scale(1.88)'},{transform:'scale(1)'}],
      {duration:2750,easing:'cubic-bezier(.38,0,.2,1)'}));
    const current = animations;
    Promise.all(current.map(animation=>animation.finished)).then(()=>{
      if (animations===current) reset();
    }).catch(()=>{});
  }
  const heading=hero.querySelector('h1');
  const replay=document.createElement('button');
  replay.type='button';replay.className='masthead-replay';
  replay.setAttribute('aria-label',language === 'en' ? 'Replay the LoopForge Journal lettering' : '重播 LoopForge Journal 标题动效');
  replay.addEventListener('click',()=>play(false));
  function updateReplay() {
    if (reduced.matches) {
      reset();
      if (replay.isConnected) replay.replaceWith(...replay.childNodes);
    } else if (!replay.isConnected) {
      replay.append(...heading.childNodes);heading.append(replay);
    }
  }
  updateReplay();
  reduced.addEventListener('change',updateReplay,{signal:controller.signal});
  let observer;
  Promise.allSettled([source.decode(),moon.decode(),document.fonts.ready]).then(()=>{
    if (controller.signal.aborted) return;
    let armed = true, visibleFraction = 0;
    function playWhenVisible() {
      if (!document.hidden && armed && visibleFraction >= .55) {
        armed=false;
        play();
      }
    }
    observer = new IntersectionObserver(([entry])=>{
      visibleFraction=entry.intersectionRatio;
      if (!entry.isIntersecting) { armed=true;reset(); }
      else playWhenVisible();
    },{threshold:[0,.55]});
    document.addEventListener('visibilitychange',()=>{
      if (document.hidden) { armed=true;reset(); }
      else playWhenVisible();
    }, {signal:controller.signal});
    observer.observe(hero);
  });
  return () => { controller.abort(); resize.disconnect(); observer?.disconnect(); reset(); };
};
