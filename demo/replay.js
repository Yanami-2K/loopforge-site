(() => {
  'use strict';
  const {meta,responses}=window.LF_RECORDINGS;
  const originalFetch=window.fetch.bind(window);
  let approved=false;
  const clone=v=>JSON.parse(JSON.stringify(v));
  const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json'}});
  const msg=()=>document.documentElement.dataset.lang==='en'?'Recorded preview: this action requires a self-hosted instance. Do not enter credentials here.':'录制预览：此操作需在自部署实例中使用，请勿在这里输入凭据。';
  function lookup(path,search){return responses[path+search]??responses[path]}
  const W=meta.waitingRunId,C=meta.completedRunId;
  const runW=responses['/api/runs/'+W],runC=responses['/api/runs/'+C];
  const issueW=runW.executionContext.issueId,issueC=runC.executionContext.issueId;
  // After approval the waiting run shows the recorded completed run, keeping its own identity (issue, number, start time).
  function completedWaiting(){
    const r=clone(runC);
    for(const k of ['id','input','executionContext','createdAt','sandboxId'])if(k in runW)r[k]=clone(runW[k]);
    return r;
  }
  const RUN_KEYS=['status','admissionState','nodes','timing','artifactCount','executionGeneration','usage','toolCalls','updatedAt','revision'];
  const ISSUE_KEYS=['status','closureAllowed','automationState','deliveryState','deliveryUpdatedAt'];
  function swapWaiting(v){
    const done=completedWaiting();
    const issueDone=(responses['/api/issues']||[]).find(i=>i.id===issueC);
    const taskDone=(responses['/api/tasks']||[]).find(t=>t.runId===C);
    const reqDone=responses['/api/issues/'+issueC+'/requirement'];
    const walk=o=>{
      if(!o||typeof o!=='object')return;
      if(Array.isArray(o)){o.forEach(walk);return}
      if(o.id===W&&'status' in o){for(const k of RUN_KEYS)if(k in o&&k in done)o[k]=clone(done[k])}
      else if(o.id===issueW&&issueDone){for(const k of ISSUE_KEYS)if(k in issueDone)o[k]=clone(issueDone[k])}
      else if(o.runId===W&&'status' in o&&taskDone&&'dispatchMode' in o)o.status=taskDone.status;
      if(o.runId===W&&'runStatus' in o){o.runStatus='succeeded';o.sopSucceeded=true}
      if(o.issue&&o.issue.id===issueW&&o.overall&&reqDone){
        o.overall={...clone(reqDone.overall),firstRunAt:o.overall.firstRunAt};
        o.stages=clone(reqDone.stages);
        o.lanes=(o.lanes||[]).map(l=>l.latestRunId===W?{...l,status:'succeeded'}:l);
      }
      for(const k in o)walk(o[k]);
    };
    walk(v);return v;
  }
  window.fetch=async(input,options={})=>{
    const u=new URL(typeof input==='string'?input:input.url,location.href);
    const method=(options.method||(input instanceof Request?input.method:'GET')).toUpperCase();
    if(u.origin!==location.origin)return json({error:msg()},403);
    if(!u.pathname.startsWith('/api/')){
      if(method!=='GET'||!u.pathname.startsWith('/demo/'))return json({error:msg()},403);
      return originalFetch(input,options);
    }
    const path=u.pathname;
    if(method!=='GET'){
      // The only writable path is an in-memory transition between two real recorded states.
      if(method==='POST'&&path==='/api/runs/'+meta.waitingRunId+'/approve'){
        approved=true;setTimeout(()=>{if(typeof showRunDetail==='function')showRunDetail(meta.waitingRunId)},100);return json({ok:true});
      }
      return json({error:msg()},403);
    }
    if(path==='/api/runs/'+W&&approved)return json(completedWaiting());
    if(approved&&path.startsWith('/api/runs/'+W+'/')&&!path.includes('/artifacts/')){
      const alt=lookup(path.replace(W,C),u.search);
      if(alt!==undefined)return typeof alt==='string'?new Response(alt,{headers:{'Content-Type':'text/plain;charset=utf-8'}}):json(clone(alt));
    }
    if(path==='/api/auth/current')return json(clone(responses[path]));
    if(path.startsWith('/api/auth/photo/'))return new Response('',{status:404});
    const found=lookup(path,u.search);
    if(found!==undefined){
      if(typeof found==='string')return new Response(found,{headers:{'Content-Type':'text/plain;charset=utf-8'}});
      return json(approved?swapWaiting(clone(found)):clone(found));
    }
    if(path.includes('/artifacts/')){
      const id=path.split('/artifacts/')[1];
      const content=Object.entries(responses).find(([k,v])=>k.endsWith('/artifacts/'+id));
      if(content)return new Response(content[1],{headers:{'Content-Type':'text/plain;charset=utf-8'}});
    }
    console.info('[recorded preview] endpoint not captured:',path);
    return json({error:'此页面尚未录制 / This endpoint is not recorded'},404);
  };
  // No live SSE or backend connection is made. Real detail GET responses remain available.
  class RecordedEventSource extends EventTarget{
    static CONNECTING=0;static OPEN=1;static CLOSED=2;
    constructor(url){super();this.url=url;this.readyState=1;setTimeout(()=>this.dispatchEvent(new Event('open')),0)}
    close(){this.readyState=2}
  }
  window.EventSource=RecordedEventSource;
  window.WebSocket=class{constructor(){throw new Error(msg())}};
  navigator.sendBeacon=()=>false;
  // Neutralise credential and file-upload inputs in the real UI. No form may submit to the network.
  document.addEventListener('submit',e=>{e.preventDefault()},true);
  document.addEventListener('DOMContentLoaded',()=>{
    setTimeout(()=>{const help=document.getElementById('previewLoadingHelp');if(help)help.hidden=false},15000);
    const en=new URLSearchParams(location.search).get('lang')==='en';
    if(en)localStorage.setItem('loopforge.lang','en');
    const bar=document.createElement('div');bar.id='recordedPreviewBar';
    const zh=document.documentElement.dataset.lang!=='en';
    bar.innerHTML=(zh?'<b>LoopForge 平台真实前端 · 录制预览</b><span>来自开源项目的真实界面和本地运行记录；无需 API Key，不运行模型或脚本。</span><a href="#/sops">SOP 流程</a><a href="#/flow/demo-issue-fix-production">流程设计器</a><a href="#/runs/'+meta.waitingRunId+'">审批演示</a><a href="#/runs/'+meta.completedRunId+'">已完成运行</a><a href="https://github.com/Tencent/LoopForge" target="_blank" rel="noopener noreferrer">自己部署 ↗</a>'
      :'<b>LoopForge real UI · recorded preview</b><span>The open-source interface with recorded local runs. No API key; no model or script runs here.</span><a href="#/sops">SOPs</a><a href="#/flow/demo-issue-fix-production">Designer</a><a href="#/runs/'+meta.waitingRunId+'">Approval demo</a><a href="#/runs/'+meta.completedRunId+'">Finished run</a><a href="https://github.com/Tencent/LoopForge" target="_blank" rel="noopener noreferrer">Self-host ↗</a>');
    document.body.prepend(bar);
    const protect=()=>document.querySelectorAll('input[type=password],input[type=file]').forEach(e=>{e.disabled=true;if(e.type==='password'){e.value='';e.placeholder='录制预览不接收凭据 / No credentials in preview'}});
    protect();new MutationObserver(protect).observe(document.body,{childList:true,subtree:true});
  });
  if(!location.hash)location.hash='#/sops';
  window.LF_PREVIEW={meta,reset(){approved=false;location.reload()}};
})();
