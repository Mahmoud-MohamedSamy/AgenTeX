const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-15_retest-mahmoudmohamed-r18';
const LED=m=>fs.appendFileSync(RUN+'/ledger.md','- '+new Date().toISOString().slice(0,19)+' '+m+'\n');
const E=r=>r&&r.j&&r.j.error?(r.j.error.code+': '+r.j.error.message):'';
const SR=r=>r.s+(E(r)?' '+E(r):'');
const IDS=RUN+'/out/ids-crm9.json'; const I=fs.existsSync(IDS)?JSON.parse(fs.readFileSync(IDS,'utf8')):{}; const SAVE=()=>fs.writeFileSync(IDS,JSON.stringify(I,null,1));
const L='841043e1-c078-41f9-8d6e-dfd61bee45c3', D='f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const enc=v=>({kind:'string',value:String(v)}); const rec=vals=>({data:Object.entries(vals).map(([f,v])=>({field:f,value:enc(v)}))});
const mine=new Set(I.R07); let all=[],cur=null; const seen=new Set();
for(let p=0;p<40;p++){ const r=await api('GET','/audit/recycle-bin/items?app_key=crm&limit=200'+(cur?'&cursor='+encodeURIComponent(cur):'')); if(r.s!==200){log('list '+r.s+' '+r.t.slice(0,200));break;} const a=arr(r.j&&r.j.data); let f=0; for(const x of a){ if(!seen.has(x.id)){seen.add(x.id); all.push(x); f++;} } cur=r.j&&r.j.meta&&r.j.meta.next_cursor; if(!cur||!f) break; }
const pick=all.filter(x=>mine.has(x.record_id)); const groups={}; for(const x of pick){ const g=x.group_id||x.batch_id||x.deletion_group_id||'?'; groups[g]=(groups[g]||0)+1; }
let live=0; for(const id of I.R07){ const r=await api('GET','/modules/'+L+'/records/'+id); if(r.s===200) live++; }
if(pick[0]) log('keys '+Object.keys(pick[0]).join(','));
const gk=Object.keys(groups).sort((a,b)=>groups[b]-groups[a])[0]; if(gk&&gk!=='?'){I.G07=gk;SAVE();}
return {inBin:pick.length, groups, live};
