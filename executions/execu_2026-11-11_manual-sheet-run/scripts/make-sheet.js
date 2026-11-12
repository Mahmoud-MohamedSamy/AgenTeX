// Builds sheet-results.html: the manual test sheet's 711 cases with results baked in. node scripts/make-sheet.js
const fs=require('fs'),path=require('path');const D=path.join(__dirname,'..');
const F=JSON.parse(fs.readFileSync(path.join(D,'sheet.json')));const R=JSON.parse(fs.readFileSync(path.join(D,'results.json')));
let prog={};try{prog=JSON.parse(fs.readFileSync(path.join(D,'progress.json')));}catch(e){}
const data={F:F.map(f=>({id:f.id,n:f.name,p:f.prio,a:f.area,d:f.day,st:f.status,pre:f.pre,c:f.cases.map(c=>({t:c.tc,y:c.type,ti:c.title,s:c.steps,e:c.exp}))})),R,prog,built:new Date().toISOString().slice(0,16).replace('T',' ')+' UTC'};
const json=JSON.stringify(data).replace(/</g,'\\u003c');
const html=`<title>Desk Manual Sheet Results</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Sans+Condensed:wght@600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
/* Layout: one working column; summary strip, sticky filter bar, then feature blocks that open to case rows. */
:root{--bg:#f4f6f8;--panel:#ffffff;--ink:#16202b;--mute:#5b6876;--line:#dde3e9;--accent:#1f5fa8;
--pass:#1c7a43;--passbg:#e2f3e8;--fail:#b3261e;--failbg:#fbe4e2;--blk:#8a5a00;--blkbg:#fbf0d6;--nb:#5b6876;--nbbg:#eceff3;
--display:"IBM Plex Sans Condensed","Arial Narrow",system-ui,sans-serif;--body:"IBM Plex Sans",system-ui,"Segoe UI",sans-serif;--mono:"IBM Plex Mono",ui-monospace,Consolas,monospace}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#11161c;--panel:#18202a;--ink:#e3e9ef;--mute:#9aa7b4;--line:#2a3542;--accent:#7fb0ea;--pass:#79d39d;--passbg:#163222;--fail:#f19b94;--failbg:#3b1a18;--blk:#efc56d;--blkbg:#382c12;--nb:#9aa7b4;--nbbg:#232d38;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#11161c;--panel:#18202a;--ink:#e3e9ef;--mute:#9aa7b4;--line:#2a3542;--accent:#7fb0ea;--pass:#79d39d;--passbg:#163222;--fail:#f19b94;--failbg:#3b1a18;--blk:#efc56d;--blkbg:#382c12;--nb:#9aa7b4;--nbbg:#232d38;color-scheme:dark}
body{background:var(--bg);color:var(--ink);font:14.5px/1.5 var(--body)}
.w{max-width:1120px;margin:0 auto;padding-block:20px 48px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
h1{font:600 26px/1.15 var(--display);margin:0;text-wrap:balance}.sub{color:var(--mute);font-size:13.5px;max-width:75ch;margin:6px 0 0}
.strip{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:8px;margin:16px 0 6px}
.strip div{background:var(--panel);border:1px solid var(--line);border-radius:6px;padding:8px 12px}.strip b{display:block;font:600 22px/1.1 var(--display);font-variant-numeric:tabular-nums}.strip span{color:var(--mute);font-size:12px;text-transform:uppercase;letter-spacing:.05em}
.meter{display:flex;height:10px;border-radius:5px;overflow:hidden;background:var(--nbbg);margin:8px 0 4px}.meter i{display:block}
.now{background:var(--panel);border:1px solid var(--line);border-left:4px solid var(--accent);border-radius:6px;padding:8px 12px;margin:12px 0;font-size:13.5px}
.bar{position:sticky;top:env(safe-area-inset-top,0px);z-index:5;background:var(--bg);padding:10px 0;display:flex;flex-wrap:wrap;gap:8px;align-items:center;border-bottom:1px solid var(--line)}
body::before{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);z-index:10;background:var(--bg)}
select,input{font:inherit;font-size:13.5px;background:var(--panel);color:var(--ink);border:1px solid var(--line);border-radius:5px;padding:5px 8px}
input{flex:1 1 180px;min-width:0}button{font:inherit;font-size:13px;background:var(--panel);color:var(--accent);border:1px solid var(--line);border-radius:5px;padding:5px 10px;cursor:pointer}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.cnt{color:var(--mute);font-size:12.5px}
details.f{background:var(--panel);border:1px solid var(--line);border-radius:6px;margin:8px 0}
details.f>summary{list-style:none;cursor:pointer;padding:9px 12px;display:grid;grid-template-columns:64px 1fr auto;gap:10px;align-items:center}
details.f>summary::-webkit-details-marker{display:none}.fid{font:500 13px var(--mono);color:var(--accent)}.fn{min-width:0}.fn small{display:block;color:var(--mute);font-size:12px}
.mini{display:flex;height:6px;width:120px;border-radius:3px;overflow:hidden;background:var(--nbbg)}.mini i{display:block}
.fr{display:flex;flex-direction:column;align-items:flex-end;gap:3px;font-size:12px;color:var(--mute);font-variant-numeric:tabular-nums}
.pre{padding:0 12px 8px;color:var(--mute);font-size:13px}
.case{border-top:1px solid var(--line);padding:9px 12px;display:grid;grid-template-columns:92px 1fr;gap:4px 12px}
.case .id{font:500 12.5px var(--mono)}.case .ty{color:var(--mute);font-size:11.5px;text-transform:uppercase;letter-spacing:.05em}
.case h3{font:600 14.5px/1.35 var(--body);margin:0;display:flex;gap:8px;flex-wrap:wrap;align-items:baseline}
.case ol{margin:4px 0;padding-left:20px;color:var(--ink);font-size:13.5px}.exp{font-size:13.5px}.exp b{color:var(--mute);font-weight:500}
.res{grid-column:2;font-size:13px;background:var(--bg);border-radius:5px;padding:6px 9px;overflow-wrap:anywhere}.res .m{color:var(--mute);font-size:12px}
.pill{display:inline-block;font:600 11.5px/1.6 var(--body);letter-spacing:.03em;padding:0 8px;border-radius:9px;white-space:nowrap}
.pass{background:var(--passbg);color:var(--pass)}.fail{background:var(--failbg);color:var(--fail)}.blocked{background:var(--blkbg);color:var(--blk)}.notbuilt,.notrun{background:var(--nbbg);color:var(--nb)}
.src{font-size:11px;color:var(--mute);border:1px solid var(--line);border-radius:9px;padding:0 6px}
.steps-toggle{color:var(--accent);font-size:12.5px;cursor:pointer}
.prog{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px;margin:12px 0}
.pcard{background:var(--panel);border:1px solid var(--line);border-radius:6px;padding:10px 12px;min-width:0}
.pcard h2{font:600 13px var(--body);text-transform:uppercase;letter-spacing:.05em;color:var(--mute);margin:0 0 6px}
.pcard table{width:100%;border-collapse:collapse;font-size:13px;font-variant-numeric:tabular-nums}.pcard td{padding:3px 4px;border-bottom:1px solid var(--line)}.pcard td.n{text-align:right}
.chips{display:flex;flex-wrap:wrap;gap:4px}.chip{font:500 12px var(--mono);padding:1px 6px;border-radius:4px;border:1px solid var(--line)}.chip.done{background:var(--passbg);color:var(--pass);border-color:transparent}.chip.part{background:var(--blkbg);color:var(--blk);border-color:transparent}
.fails .frow{border-top:1px solid var(--line);padding:8px 12px;display:grid;grid-template-columns:92px 1fr;gap:4px 12px;font-size:13.5px}.fails .frow .id{font:500 12.5px var(--mono)}
@media (max-width:640px){details.f>summary{grid-template-columns:52px 1fr}.fr{grid-column:2;align-items:flex-start}.case{grid-template-columns:1fr}.res{grid-column:1}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
</style>
<div class="w">
<h1>TAVI Desk manual test sheet: results</h1>
<p class="sub">A results copy of the 711-case manual test sheet, filled in by Claude on NDC-Staging (staging-desk.taviportal.com) and republished after each feature. <span class="src">earlier run</span> marks results taken from automated runs of 4–11 Nov; <span class="src">sheet run</span> marks cases run for this sheet. Results updated <span id="built"></span>.</p>
<div class="strip" id="strip"></div>
<div class="meter" id="meter" aria-hidden="true"></div>
<div class="now" id="now"></div>
<div class="prog" id="prog"></div>
<details class="f fails" id="failbox"><summary><span class="fid">FAIL</span><span class="fn">Failures found in this sheet run<small id="failsub"></small></span><span class="fr"></span></summary><div id="faillist"></div></details>
<div class="bar">
<select id="fp" aria-label="Priority"><option value="">All priorities</option><option>P0</option><option>P1</option><option>P2</option><option>P3</option></select>
<select id="fa" aria-label="Area"><option value="">All areas</option></select>
<select id="fs" aria-label="Result"><option value="">Any result</option><option value="notrun">Not run</option><option value="pass">Pass</option><option value="fail">Fail</option><option value="blocked">Blocked</option><option value="notbuilt">Not built</option></select>
<input id="fq" type="search" placeholder="Search case id, title, note, bug" aria-label="Search">
<button id="ex" type="button">Expand all</button><span class="cnt" id="cnt"></span>
</div>
<div id="list"></div>
</div>
<script>
const DATA=${json};
const LBL={pass:'Pass',fail:'Fail',blocked:'Blocked',notbuilt:'Not built',notrun:'Not run'};const COL={pass:'var(--pass)',fail:'var(--fail)',blocked:'var(--blk)',notbuilt:'var(--nb)'};
const $=s=>document.querySelector(s);const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const st=t=>(DATA.R[t]&&DATA.R[t].s)||'notrun';
$('#built').textContent=DATA.built;
const areas=[...new Set(DATA.F.map(f=>f.a))];for(const a of areas){const o=document.createElement('option');o.textContent=a;$('#fa').appendChild(o);}
function summary(){const all=DATA.F.flatMap(f=>f.c.map(c=>st(c.t)));const n=all.length;const k={pass:0,fail:0,blocked:0,notbuilt:0,notrun:0};all.forEach(s=>k[s]++);
 $('#strip').innerHTML=[['Cases',n],['Done',n-k.notrun],['Pass',k.pass],['Fail',k.fail],['Blocked',k.blocked],['Not built',k.notbuilt],['Not run',k.notrun]].map(([l,v])=>'<div><b>'+v+'</b><span>'+l+'</span></div>').join('');
 $('#meter').innerHTML=['pass','fail','blocked','notbuilt'].map(s=>'<i style="width:'+(k[s]/n*100)+'%;background:'+COL[s]+'"></i>').join('');
 const p=DATA.prog||{};$('#now').innerHTML='<b>Progress:</b> '+esc(p.text||'Run not started yet.');
 const pr={};const fe=[];for(const f of DATA.F){const x=pr[f.p]=pr[f.p]||{n:0,d:0,f:0};let d=0;for(const c of f.c){x.n++;const s=st(c.t);if(s!=='notrun'){x.d++;d++;}if(s==='fail')x.f++;}fe.push({id:f.id,p:f.p,d,n:f.c.length});}
 const rows=['P0','P1','P2','P3'].map(k=>{const x=pr[k]||{n:0,d:0,f:0};return '<tr><td>'+k+'</td><td class="n">'+x.d+' / '+x.n+'</td><td class="n">'+Math.round(x.d/x.n*100)+'%</td><td class="n">'+x.f+' fail</td></tr>';}).join('');
 const chips=p0=>fe.filter(f=>f.p===p0).map(f=>'<span class="chip '+(f.d===f.n?'done':f.d?'part':'')+'" title="'+f.d+'/'+f.n+' done">'+f.id+'</span>').join('');
 $('#prog').innerHTML='<div class="pcard"><h2>By priority</h2><table>'+rows+'</table></div><div class="pcard"><h2>P0 features (green = all cases done)</h2><div class="chips">'+chips('P0')+'</div></div><div class="pcard"><h2>P1 features</h2><div class="chips">'+chips('P1')+'</div></div>';
 const fl=[];for(const f of DATA.F)for(const c of f.c){const r=DATA.R[c.t];if(r&&r.src==='run'&&r.s==='fail')fl.push('<div class="frow"><div class="id">'+c.t+'</div><div><b>'+esc(c.ti)+'</b> <span class="cnt">'+esc(f.n)+'</span><br>'+esc(r.note)+'</div></div>');}
 $('#failsub').textContent=fl.length+' cases failed on NDC-Staging in this run (earlier automation fails are in the list below)';$('#faillist').innerHTML=fl.join('');}
function render(){const fp=$('#fp').value,fa=$('#fa').value,fs=$('#fs').value,q=$('#fq').value.trim().toLowerCase();let shown=0;const out=[];
 for(const f of DATA.F){if(fp&&f.p!==fp)continue;if(fa&&f.a!==fa)continue;
  const cs=f.c.filter(c=>{if(fs&&st(c.t)!==fs)return false;if(!q)return true;const r=DATA.R[c.t]||{};return (c.t+' '+c.ti+' '+(r.note||'')+' '+(r.bug||'')+' '+f.n).toLowerCase().includes(q);});
  if(!cs.length)continue;shown+=cs.length;const k={pass:0,fail:0,blocked:0,notbuilt:0,notrun:0};f.c.forEach(c=>k[st(c.t)]++);const n=f.c.length;
  out.push('<details class="f" data-f="'+f.id+'"'+(openSet.has(f.id)?' open':'')+'><summary><span class="fid">'+f.id+'</span><span class="fn">'+esc(f.n)+'<small>'+f.p+' · '+esc(f.a)+' · day '+esc(f.d)+(f.st&&f.st!=='Built'?' · '+esc(f.st):'')+'</small></span><span class="fr"><span class="mini">'+['pass','fail','blocked','notbuilt'].map(s=>'<i style="width:'+(k[s]/n*100)+'%;background:'+COL[s]+'"></i>').join('')+'</span>'+(n-k.notrun)+'/'+n+' done'+(k.fail?' · '+k.fail+' fail':'')+'</span></summary>'+(f.pre?'<div class="pre"><b>Before you start:</b> '+esc(f.pre)+'</div>':'')+
   cs.map(c=>{const r=DATA.R[c.t];const s=st(c.t);return '<div class="case"><div><div class="id">'+c.t+'</div><div class="ty">'+esc(c.y)+'</div></div><div><h3>'+esc(c.ti)+' <span class="pill '+s+'">'+LBL[s]+'</span>'+(r?' <span class="src">'+(r.src==='auto'?'earlier run':'sheet run')+'</span>':'')+'</h3><details><summary class="steps-toggle">Steps and expected result</summary><ol>'+c.s.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol><div class="exp"><b>Expected:</b> '+esc(c.e)+'</div></details></div>'+(r?'<div class="res">'+esc(r.note)+(r.bug?' <b>'+esc(r.bug)+'</b>':'')+'<div class="m">'+esc(r.at)+(r.run?' · '+esc(r.run):'')+(r.hist&&r.hist.length?' · earlier: '+esc(r.hist.join('; ')):'')+'</div></div>':'')+'</div>';}).join('')+'</details>');}
 $('#list').innerHTML=out.join('')||'<p class="cnt">No cases match these filters.</p>';$('#cnt').textContent=shown+' cases shown';}
const openSet=new Set();document.addEventListener('toggle',e=>{const d=e.target;if(d.matches&&d.matches('details.f'))d.open?openSet.add(d.dataset.f):openSet.delete(d.dataset.f);},true);
['#fp','#fa','#fs'].forEach(s=>$(s).addEventListener('change',render));$('#fq').addEventListener('input',render);
$('#ex').addEventListener('click',()=>{const all=document.querySelectorAll('details.f');const open=[...all].some(d=>!d.open);all.forEach(d=>{d.open=open;});$('#ex').textContent=open?'Collapse all':'Expand all';});
summary();render();
</script>
`;
fs.writeFileSync(path.join(D,'sheet-results.html'),html);console.log((html.length/1024|0)+'KB');
