import json,re,shutil,pathlib,argparse,hashlib,subprocess
parser=argparse.ArgumentParser(description='Package the upstream Web UI and sanitised local recordings; no model credentials are needed.')
parser.add_argument('--source',required=True,type=pathlib.Path,help='Path to the upstream web directory')
parser.add_argument('--capture',required=True,type=pathlib.Path,help='Directory containing rec-zh.json, rec-extra.json and rec-final.json')
parser.add_argument('--esbuild',type=pathlib.Path,help='Optional esbuild binary used to minify the bundles')
args=parser.parse_args()
root=pathlib.Path(__file__).resolve().parent
src=args.source
cap=args.capture
out=root/'demo'
out.mkdir(exist_ok=True)
for p in src.iterdir():
    if p.is_file() and p.suffix in ('.js','.css','.ico','.png') and '_test' not in p.name and '.test.' not in p.name:
        shutil.copy2(p,out/p.name)
for name in ['app','images','mcp-icons']:
    shutil.copytree(src/name,out/name,dirs_exist_ok=True)
# Only URL-like quoted root paths are relocated; /api is handled in-memory by replay.js.
for p in list(out.glob('*.js'))+list((out/'app').glob('*.js')):
    s=p.read_text()
    s=re.sub(r'([\'"`])/(images|mcp-icons|monaco|vscode-web)(/)',r'\1/demo/\2\3',s)
    s=re.sub(r'`/api/auth/photo/[^`]+`',"'/demo/favicon.png'",s)
    if p.name=='app.js' and p.parent==out:
        s=s.replace('  restoreRequirementComposer();','  restoreRequirementComposer();\n  document.getElementById(\'previewLoading\')?.remove();',1)
    p.write_text(s)
records=[]
for name in ['rec-zh.json','rec-extra.json','rec-final.json']:
    records+=json.loads((cap/name).read_text())
# Keep only GET responses: login mutation and its password must never be published.
data={}
for r in records:
    if r['method']!='GET' or r['status']!=200 or r['body'] is None or '/stream' in r['path'] or '/auth/photo/' in r['path']:continue
    try: body=json.loads(r['body'])
    except ValueError: body=r['body']
    data[r['path']+r['search']]=body
# Sanitise runtime identities/host paths; the recording instance contains only demo data and no model/Git credentials.
def clean(o):
    if isinstance(o,list):return [clean(v) for v in o]
    if not isinstance(o,dict):
        if isinstance(o,str):o=o.replace('/data/workspace/lf-demo-record','/demo-workspace').replace('http://127.0.0.1:8097','https://loopforge.cn/demo')
        return o
    result={}
    for k,v in o.items():
        if any(x in k.lower() for x in ['password','secret','apikey','access_token','refresh_token']):continue
        if k in ['ownerInstanceId','workspaceHost','avatarUrl','email']:result[k]='';continue
        result[k]=clean(v)
    return result
data=clean(data)
# Match by pathname when dynamic pagination/search params differ.
for k,v in list(data.items()):
    if '?' in k:data.setdefault(k.split('?')[0],v)
# auth/current contains return_url in the recording
cur=next(v for k,v in data.items() if k.startswith('/api/auth/current'))
data['/api/auth/current']=cur
runs=data.get('/api/runs',[])
waiting=next(r for r in runs if r['status']=='waiting')
complete=next(r for r in runs if r['status']=='succeeded')
meta={'source':'Tencent/LoopForge','sourceCommit':'91f2b42','recordedAt':'2026-10-21','waitingRunId':waiting['id'],'completedRunId':complete['id']}
(out/'recordings.js').write_text('window.LF_RECORDINGS='+json.dumps({'meta':meta,'responses':data},ensure_ascii=False,separators=(',',':'))+';\n')
print('Packaged',len(data),'recorded endpoints;',meta)

# ---- Web delivery: two hashed bundles instead of ~55 requests; the English dictionary loads only in English mode.
def minify(text,loader):
    if not args.esbuild:return text
    cmd=[str(args.esbuild),'--loader='+loader,'--minify','--charset=utf8','--log-level=warning']
    return subprocess.run(cmd,input=text,capture_output=True,text=True,check=True).stdout
def emit(stem,ext,text):
    for old in out.glob(stem+'.*.'+ext):old.unlink()
    name=f'{stem}.{hashlib.sha256(text.encode()).hexdigest()[:10]}.{ext}'
    (out/name).write_text(text)
    return name
s=(src/'index.html').read_text()
s=re.sub(r'((?:src|href)=[\'"])/(?!(?:api)/)',r'\1/demo/',s)
css=re.findall(r'<link rel="stylesheet" href="/demo/([^"?]+)[^"]*">',s)+['replay.css']
js=['recordings.js','replay.js']+re.findall(r'<script src="/demo/([^"?]+)[^"]*"></script>',s)
assert 'app.js' in js and 'i18n.js' in js and len(css)>10,'unexpected upstream index.html layout'
js.remove('i18n-en.js')
s=re.sub(r'\n\s*<link rel="stylesheet" href="/demo/[^"]+">','',s)
s=re.sub(r'\n\s*<script src="/demo/[^"]+"></script>','',s)
css_name=emit('lf','css',minify('\n'.join((out/n).read_text() for n in css),'css'))
js_name=emit('lf','js',minify('\n;\n'.join((out/n).read_text() for n in js),'js'))
en_name=emit('i18n-en','js',minify((out/'i18n-en.js').read_text(),'js'))
# Sources now live inside the bundles. replay.* is maintained in this repo and recordings.js stays for review.
for n in set(js+css+['i18n-en.js'])-{'replay.js','replay.css','recordings.js'}:(out/n).unlink()
if not any((out/'app').iterdir()):(out/'app').rmdir()
logo=out/'images'/'loopforge-logo.png'
try:
    from PIL import Image
    with Image.open(logo) as im:
        im.thumbnail((64,64));im.save(out/'images'/'loopforge-logo-64.png',optimize=True)
    logo.unlink()
    s=s.replace('/demo/images/loopforge-logo.png','/demo/images/loopforge-logo-64.png')
except ImportError:
    print('Pillow not installed; keeping the full-size logo')
loading_css='#previewLoading{position:fixed;inset:0;z-index:100000;display:grid;place-items:center;background:#fafaf7;color:#16161a;text-align:center;padding:24px;font:15px/1.7 system-ui,-apple-system,"PingFang SC","Microsoft YaHei",sans-serif}#previewLoading h1{font-size:22px;font-weight:700;line-height:1.5;margin:22px 0 6px;letter-spacing:-.01em}#previewLoading p{color:#55534e;margin:0}#previewLoading a{text-decoration:underline}#previewLoadingHelp{margin-top:14px!important}.preview-spinner{display:inline-block;width:30px;height:30px;border:2.5px solid #e3e1da;border-top-color:#ff5a1f;border-radius:50%;animation:preview-spin .8s linear infinite}@keyframes preview-spin{to{transform:rotate(360deg)}}html[data-lang=en] #previewLoading [lang=zh-CN],html:not([data-lang=en]) #previewLoading [lang=en]{display:none}@media(prefers-reduced-motion:reduce){.preview-spinner{animation:none}}'
# Runs before the deferred bundle: applies ?lang= early and adds the dictionary (parser-inserted, so it keeps defer order).
lang_js='(function(){var l="zh";try{var q=new URLSearchParams(location.search).get("lang");if(q==="en"||q==="zh")localStorage.setItem("loopforge.lang",q);if(localStorage.getItem("loopforge.lang")==="en")l="en"}catch(e){}document.documentElement.dataset.lang=l;if(l==="en")document.write(\'<script defer src="/demo/'+en_name+'"><\\/script>\')})();'
s=s.replace('<head>','<head>\n<meta name="referrer" content="no-referrer">\n<meta http-equiv="Content-Security-Policy" content="default-src \'self\'; script-src \'self\' \'unsafe-inline\'; style-src \'self\' \'unsafe-inline\'; img-src \'self\' data: blob:; connect-src \'self\'; font-src \'self\' data:; object-src \'none\'; base-uri \'self\'; form-action \'none\'">',1)
s=s.replace('</head>',f'  <style>{loading_css}</style>\n  <script>{lang_js}</script>\n  <script defer src="/demo/{js_name}"></script>\n</head>',1)
# The stylesheet sits after the loading screen, so that screen paints while the full UI styles download.
s=s.replace('<body>','<body>\n  <div id="previewLoading" role="status" aria-live="polite"><div><span class="preview-spinner" aria-hidden="true"></span>'
    '<div lang="zh-CN"><h1>正在打开 LoopForge 平台</h1><p>加载真实界面与录制数据，无需登录或 API Key。</p></div>'
    '<div lang="en"><h1>Opening the LoopForge platform</h1><p>Loading the real interface and recorded data. No sign-in or API key needed.</p></div>'
    '<p id="previewLoadingHelp" hidden><span lang="zh-CN">加载时间较长，请检查网络后刷新，或<a href="/">返回首页</a>。</span><span lang="en">This is taking a while. Check your connection and refresh, or <a href="/?lang=en">go back</a>.</span></p></div></div>\n'
    f'  <link rel="stylesheet" href="/demo/{css_name}">',1)
(out/'index.html').write_text(s)
home=root/'index.html'
if home.exists():
    h=home.read_text()
    h2=re.sub(r'<!--demo-prefetch-->.*?<!--/demo-prefetch-->',f'<!--demo-prefetch--><link rel="prefetch" href="demo/{css_name}"><link rel="prefetch" href="demo/{js_name}"><!--/demo-prefetch-->',h,flags=re.S)
    if h2!=h:home.write_text(h2)
print('Bundles:',css_name,js_name,en_name)
