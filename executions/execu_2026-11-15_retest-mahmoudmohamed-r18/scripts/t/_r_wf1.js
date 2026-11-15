const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-15_retest-mahmoudmohamed-r18';
const LED=m=>fs.appendFileSync(RUN+'/ledger.md','- '+new Date().toISOString().slice(0,19)+' '+m+'\n');
const E=r=>r&&r.j&&r.j.error?(r.j.error.code+': '+r.j.error.message):'';
const SR=r=>r.s+(E(r)?' '+E(r):'');
const IDS=RUN+'/out/ids-crm9.json'; const I=fs.existsSync(IDS)?JSON.parse(fs.readFileSync(IDS,'utf8')):{}; const SAVE=()=>fs.writeFileSync(IDS,JSON.stringify(I,null,1));
const L='841043e1-c078-41f9-8d6e-dfd61bee45c3', D='f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const enc=v=>({kind:'string',value:String(v)}); const rec=vals=>({data:Object.entries(vals).map(([f,v])=>({field:f,value:enc(v)}))});
const o={};
for (const app of ['crm']) { const forms=arr((await api('GET','/web-forms')).j.data); o.n=forms.length;
 o.forms=forms.map(f=>({id:f.id,name:f.name,kind:f.kind,app:f.app_key,en:f.is_enabled,key:f.embed_key?('len'+f.embed_key.length):null, keys:Object.keys(f).join(',').slice(0,300)}));
 if(forms[0]){ const g=await api('GET','/web-forms/'+forms[0].id); const d=g.j.data; o.snip=JSON.stringify(d.snippets||{}).replace(/[A-Za-z0-9_-]{20,}/g,'<k>').slice(0,1500); o.settings=JSON.stringify(d.settings||d.config||{}).slice(0,600);}
}
return o;
