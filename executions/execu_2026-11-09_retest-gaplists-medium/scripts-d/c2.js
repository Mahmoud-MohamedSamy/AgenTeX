const fs=require('fs');const LG='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-2628/ledger.md';
const LED=s=>fs.appendFileSync(LG,'- '+new Date().toISOString()+' '+s+'\n');
const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';const s=v=>({kind:'string',value:v});const o={};const tag=Date.now().toString(36).slice(-5);
const lay=arr((await api('GET','/modules/'+L+'/layouts')).j);const LY=(lay.find(x=>x.id==='bf971461-2edc-45f2-b6e4-6e180aa64288')||lay[0]).id;
const c=await api('POST','/modules/'+L+'/records',{layout_id:LY,data:[{field:'first_name',value:s('QA RT 2628 Lead '+tag)},{field:'phone',value:s('0101'+String(Date.now()).slice(-7))},{field:'single_line_3_9',value:s('QA RT 2628')}]});
const R=c.j&&c.j.data&&c.j.data.id;o.lead=c.s+' '+(R||c.t.slice(0,300));if(!R)return o;LED('CREATE lead QA RT 2628 Lead '+tag+' '+R);
// clone
for(const p of ['/clone','/duplicate','/copy']){const r=await api('POST','/modules/'+L+'/records/'+R+p,{});o['clone'+p]=r.s+' '+r.t.slice(0,160);if(r.s<300){const id=r.j&&r.j.data&&r.j.data.id;LED('CREATE clone '+id+' of '+R);}}
// note
const n=await api('POST','/modules/'+L+'/records/'+R+'/notes',{body:'QA RT 2628 note zebracornflake '+tag});const N=n.j&&n.j.data&&(n.j.data.id||n.j.data.note_id);o.note=n.s+' '+(N||n.t.slice(0,200));if(N)LED('CREATE note '+N+' on '+R);
o.notesGet=(await api('GET','/modules/'+L+'/records/'+R+'/notes')).s;
if(N){for(const [m,b] of [['PATCH',{body:'QA RT 2628 note edited'}],['PUT',{body:'QA RT 2628 note edited'}]]){const r=await api(m,'/modules/'+L+'/records/'+R+'/notes/'+N,b);o['note'+m]=r.s+' '+r.t.slice(0,140);}
 const g=await api('GET','/modules/'+L+'/records/'+R+'/notes/'+N);o.noteGetOne=g.s;}
// tag
const tg=await api('POST','/modules/'+L+'/tags',{name:'QA RT 2628 tag '+tag,color:'#22C55E'});const TG=tg.j&&tg.j.data&&tg.j.data.id;o.tag=tg.s+' '+(TG||tg.t.slice(0,150));if(TG){LED('CREATE tag QA RT 2628 tag '+tag+' '+TG);const a=await api('POST','/modules/'+L+'/records/'+R+'/tags',{tag_ids:[TG]});o.tagAdd=a.s;}
fs.writeFileSync('../ndc-2628/ids.json',JSON.stringify({L,R,N,TG,tag},null,1));
await sleep(8000);
for(const q of ['zebracornflake','QA RT 2628 tag '+tag,'#QA RT 2628 tag '+tag,'QA RT 2628 Lead '+tag]){const r=await api('GET','/search?q='+encodeURIComponent(q)+'&limit=20');const groups=r.j&&r.j.data&&r.j.data.groups||[];o['search: '+q.replace(tag,'<t>')]=r.s+' hits='+groups.reduce((a,g)=>a+(g.hits||[]).length,0)+' '+groups.map(g=>(g.key||g.module||g.label||'?')+':'+(g.hits||[]).length).join(',');}
return o;
