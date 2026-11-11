// shared helpers, prepended to each step file by run.sh
const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-11_crm-global-sets';
const LED=m=>fs.appendFileSync(RUN+'/ledger.md','- '+new Date().toISOString().slice(0,19)+' '+m+'\n');
const RES=(id,verdict,fact)=>{fs.appendFileSync(RUN+'/results.tsv',[id,verdict,String(fact).replace(/\s+/g,' ').slice(0,600)].join('\t')+'\n'); log(id+' '+verdict+' '+String(fact).slice(0,300));};
const E=r=>r&&r.j&&r.j.error?(r.j.error.code+': '+r.j.error.message):'';
const SR=r=>r.s+(E(r)?' '+E(r):'');
const IDS=RUN+'/out/ids.json'; const I=fs.existsSync(IDS)?JSON.parse(fs.readFileSync(IDS,'utf8')):{}; const SAVE=()=>fs.writeFileSync(IDS,JSON.stringify(I,null,1));
const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';
const enc=v=>({kind:'string',value:String(v)}); const rec=vals=>({data:Object.entries(vals).map(([f,v])=>({field:f,value:enc(v)}))});
const gs=async id=>{const r=await api('GET','/global-sets/'+id); return r.j&&r.j.data;};
const fieldOf=async(mod,id)=>arr((await api('GET','/modules/'+mod+'/fields')).j.data).find(x=>x.id===id);
const recVal=async(mod,id,f)=>{const d=(await api('GET','/modules/'+mod+'/records/'+id)).j; const s=JSON.stringify(d&&d.data); const m=s&&s.match(new RegExp('"'+f+'","value":\{"kind":"[a-z_]+","value":"?([^"}]*)')); return m?m[1]:(s||'').slice(0,200);};
const o={}; const d=async p=>(await api('DELETE',p)).s;
o.recs=[]; for(const id of (I.MSR||[])) if(id) o.recs.push(await d('/modules/'+L+'/records/'+id));
if(I.MSA) o.recs.push(await d('/modules/'+L+'/records/'+I.MSA));
o.field=await d('/modules/'+L+'/fields/'+I.fMS); o.set=await d('/global-sets/'+I.MSS);
o.leftSets=arr((await api('GET','/global-sets')).j.data).map(s=>s.name); o.leftFields=arr((await api('GET','/modules/'+L+'/fields')).j.data).filter(f=>/qa_gs1111/.test(f.fieldName)).map(f=>f.fieldName);
LED('CLEANUP round 4 '+JSON.stringify(o)); return o;
