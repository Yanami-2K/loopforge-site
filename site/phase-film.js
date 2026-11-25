// Photographic transition from the approved 2.1-second prototype.
window.LF_PHASE = (() => {
const plates={"ring": {"zh": "食相 · 晨昏线", "en": "Eclipse transition", "credit": "Composite: NASA / art002e009301 + art002e009283", "desktop": "63% 53%", "mobile": "70% 53%", "src": "site/home/eclipse-corona.webp", "limb": "site/home/eclipse-limb.webp"}, "terminator": {"zh": "晨昏线", "en": "Terminator", "credit": "NASA / art002e009283", "desktop": "63% 53%", "mobile": "70% 53%", "src": "site/home/terminator.webp"}};
// The eclipse photograph supplies the opening silhouette and its natural corona.
// Only the photographic plates participate in the transition.
let disposeFilm;
function installPhaseFilm(frame){
 if(disposeFilm)disposeFilm();
 const plateImage=frame.querySelector('img');
 const canvas=document.createElement('canvas');
 canvas.className='phase-film';canvas.setAttribute('aria-hidden','true');frame.append(canvas);
 const ctx=canvas.getContext('2d');
 const eclipse=new Image(), contact=new Image(), terrain=new Image();
 eclipse.src=plates.ring.src;contact.src=plates.ring.limb;terrain.src=plates.terminator.src;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const duration=2100;
 let ready=false,dead=false,running=false,visible=false,raf=0,last=0,elapsed=0,w=0,h=0;
 const clamp=v=>Math.max(0,Math.min(1,v));
 const ease=v=>{const t=clamp(v);return t*t*(3-2*t)};
 // Use the fitted southwest limb of the close photograph as a registration mark.
 // Both shots keep a fixed focal length. A single short drift continues across the edit.
 const moon={x:2153,y:-1631,r:2871};
 const scene=frame.closest('.hxl');
 const exposure=document.createElement('div');
 exposure.className='phase-eclipse';exposure.hidden=true;
 exposure.setAttribute('aria-hidden','true');frame.parentElement.after(exposure);
 const camera=document.createElement('div');
 camera.className='lunar-camera';exposure.append(camera);
 const opening=eclipse;opening.alt='';contact.alt='';camera.append(opening,contact);
 let shot;
 const veil=document.createElement('canvas'),veilCtx=veil.getContext('2d',{willReadFrequently:true});
 let veilPixels,arrival;
 const levels=new Uint8Array(256);
 function prepareShot(){
  if(!ready||!w||!h)return;
  const narrow=scene.clientWidth<=620;
  const scale=Math.max(w/terrain.naturalWidth,h/terrain.naturalHeight);
  const sw=terrain.naturalWidth*scale,sh=terrain.naturalHeight*scale;
  const [ax,ay]=getComputedStyle(plateImage).objectPosition.split(' ').map(parseFloat);
  const endX=(w-sw)*ax/100,endY=(h-sh)*ay/100;
  const radius=Math.min(w*(narrow?.21:.30),h*(narrow?.21:.37));
  const desiredX=w*(narrow?.48:.56),desiredY=h*(narrow?.37:.46);
  // Project the preferred wide-shot center onto the true lunar arc in the close-up.
  const mx=endX+moon.x*scale,my=endY+moon.y*scale;
  const length=Math.hypot(desiredX-mx,desiredY-my);
  const nx=(desiredX-mx)/length,ny=(desiredY-my)/length;
  const px=mx+nx*moon.r*scale,py=my+ny*moon.r*scale;
  const centerX=px-nx*radius,centerY=py-ny*radius;
  const driftX=Math.min(-endX,w*.07),driftY=Math.min(-endY,h*.085);
  const region=frame.getBoundingClientRect(),hero=scene.getBoundingClientRect();
  shot={scale,sw,sh,endX,endY,radius,centerX,centerY,driftX,driftY,
   left:region.left-hero.left,top:region.top-hero.top};
  const mw=veil.width=Math.min(320,Math.ceil(w)),mh=veil.height=Math.max(1,Math.round(mw*h/w));
  veilCtx.drawImage(terrain,endX*mw/w,endY*mh/h,sw*mw/w,sh*mh/h);
  veilPixels=veilCtx.getImageData(0,0,mw,mh);
  arrival=new Uint8Array(mw*mh);
  for(let y=0;y<mh;y++)for(let x=0;x<mw;x++){
   const i=y*mw+x,j=i*4;
   const vx=(x+.5)*w/mw-mx,vy=(y+.5)*h/mh-my;
   const depth=clamp((moon.r*scale-Math.hypot(vx,vy))/(.70*h));
   const face=veilPixels.data[j+1]/255;
   arrival[i]=Math.round(255*clamp(.55*depth+.18*(1-Math.sqrt(face))));
   veilPixels.data[j]=11;veilPixels.data[j+1]=14;veilPixels.data[j+2]=17;
  }
 }
 function paint(){
  if(canvas.hidden)return;
  ctx.fillStyle='#0b0e11';ctx.fillRect(0,0,w,h);
  if(!ready||!shot)return;
  const t=elapsed/duration;
  const drift=Math.pow(1-t,1.65);
  const dx=shot.driftX*drift,dy=shot.driftY*drift;
  const openOpacity=1-ease((t-.16)/.37);
  const edgeOpacity=(1-openOpacity)*(1-ease((t-.40)/.27));
  const s=shot.radius/237;
  camera.style.transform='translate3d('+(shot.left+shot.centerX+dx-652*s)+'px,'+(shot.top+shot.centerY+dy-539*s)+'px,0) scale('+s+')';
  opening.style.opacity=String(openOpacity);contact.style.opacity=String(edgeOpacity);
  exposure.hidden=false;
  if(t<=.33)return;
  const progress=clamp((t-.33)/.67);
  for(let i=0;i<levels.length;i++)levels[i]=Math.round(255*(1-ease((progress-.36*i/255)/.64)));
  for(let i=0,j=3;i<arrival.length;i++,j+=4)veilPixels.data[j]=levels[arrival[i]];
  veilCtx.putImageData(veilPixels,0,0);
  ctx.drawImage(terrain,shot.endX+dx,shot.endY+dy,shot.sw,shot.sh);
  ctx.drawImage(veil,0,0,w,h);
 }
 function resize(){
  const box=frame.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.5);
  const pw=Math.max(1,Math.round(box.width*dpr)),ph=Math.max(1,Math.round(box.height*dpr));
  if(box.width===w&&box.height===h&&canvas.width===pw&&canvas.height===ph)return;
  w=box.width;h=box.height;
  canvas.width=pw;canvas.height=ph;
  ctx.setTransform(pw/w,0,0,ph/h,0,0);
  prepareShot();paint();
 }
 function finish(){
  cancelAnimationFrame(raf);elapsed=duration;running=false;canvas.hidden=true;exposure.hidden=true;
  plateImage.src=terrain.src;
 }
 function tick(now){
  if(dead||!running||!visible||document.hidden)return;
  if(last)elapsed+=now-last;last=now;
  if(elapsed>=duration){finish();return}
  paint();raf=requestAnimationFrame(tick);
 }
 function schedule(){cancelAnimationFrame(raf);last=0;if(ready&&running&&visible&&!document.hidden)raf=requestAnimationFrame(tick)}
 function begin(){
  plateImage.src=terrain.src;elapsed=0;running=true;canvas.hidden=false;
  paint();schedule();
 }
 function choose(){
  if(reduced.matches || new URLSearchParams(location.search).has('still')){plateImage.src=terrain.src;finish();return}
  begin();
 }
 const ro=new ResizeObserver(resize);ro.observe(frame);ro.observe(scene);
 const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;schedule()});io.observe(frame);
 reduced.addEventListener('change',choose);document.addEventListener('visibilitychange',schedule);
 canvas.hidden=true;choose();resize();
 Promise.all([eclipse.decode(),contact.decode(),terrain.decode()]).then(()=>{if(!dead){ready=true;prepareShot();if(running)begin()}}).catch(()=>{if(!dead)finish()});
 disposeFilm=()=>{exposure.remove();dead=true;cancelAnimationFrame(raf);io.disconnect();ro.disconnect();reduced.removeEventListener('change',choose);document.removeEventListener('visibilitychange',schedule)};
}

return {plates, install: installPhaseFilm};
})();
