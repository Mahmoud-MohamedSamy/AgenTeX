const fs=require('fs');const LG='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-2628/ledger.md';const LED=s=>fs.appendFileSync(LG,'- '+new Date().toISOString()+' '+s+'\n');
const I=JSON.parse(fs.readFileSync('../ndc-2628/ids.json','utf8'));const {L,R,TG,TG2,CLONE}=I;const o={};
const ATT='05668246-d3a4-4482-910e-2ac4b9416dac',N2='74085165-0d90-472f-a6d7-416001eecf4a',SES='e122c27a-14a9-48b4-864f-c824d5438f80';
let r=await api('DELETE','/modules/'+L+'/records/'+R+'/attachments/'+ATT);o.att=r.s;LED('CLEANUP DELETE attachment '+ATT+' → '+r.s);
r=await api('DELETE','/modules/'+L+'/records/'+R+'/notes/'+N2);o.note=r.s;LED('CLEANUP DELETE note '+N2+' → '+r.s);
for(const t of [TG,TG2]){r=await api('DELETE','/modules/'+L+'/tags/'+t);o['tag'+t.slice(0,4)]=r.s;LED('CLEANUP DELETE tag '+t+' → '+r.s);}
for(const id of [CLONE,R]){r=await api('DELETE','/modules/'+L+'/records/'+id);o['rec'+id.slice(0,4)]=r.s+' '+(r.s>=300?r.t.slice(0,120):'');LED('CLEANUP DELETE lead '+id+' → '+r.s);}
for(const p of ['/modules/'+L+'/import/'+SES,'/modules/'+L+'/imports/'+SES]){r=await api('DELETE',p);o['imp '+p.slice(-12)]=r.s+' '+r.t.slice(0,100);if(r.s<300){LED('CLEANUP DELETE import session '+SES+' → '+r.s);break;}}
await sleep(4000);
const bin=arr((await api('GET','/audit/recycle-bin/items')).j);const its=bin.filter(i=>[R,CLONE,TG,TG2,ATT,N2].includes(i.record_id));o.binFound=its.map(i=>i.module_key+':'+i.id.slice(0,8));
if(its.length){r=await api('POST','/audit/recycle-bin/delete',{ids:its.map(i=>i.id)});o.purge=r.s+' '+r.t.slice(0,150);LED('CLEANUP PURGE bin ids '+its.map(i=>i.id).join(',')+' → '+r.s);}
await sleep(3000);
const v={};for(const id of [R,CLONE]){v[id.slice(0,8)]=(await api('GET','/modules/'+L+'/records/'+id)).s;}
const tags=await api('GET','/modules/'+L+'/tags');const tl=(tags.j.data.tags||tags.j.data.items||tags.j.data||[]);v.tagsLeft=(Array.isArray(tl)?tl:[]).filter(t=>/QA RT 2628/.test(t.name)).length;
v.binLeft=arr((await api('GET','/audit/recycle-bin/items')).j).filter(i=>[R,CLONE,TG,TG2,ATT,N2].includes(i.record_id)).length;
const s=await api('GET','/search?q='+encodeURIComponent('QA RT 2628')+'&limit=20');v.searchHits=(s.j.data.groups||[]).reduce((a,g)=>a+(g.hits||[]).filter(h=>/QA RT 2628/.test(JSON.stringify(h))).length,0);
o.verify=v;LED('VERIFY '+JSON.stringify(v));
return o;
