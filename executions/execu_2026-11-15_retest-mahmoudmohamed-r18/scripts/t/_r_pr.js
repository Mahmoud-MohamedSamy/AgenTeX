const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-15_retest-mahmoudmohamed-r18';
const LED=m=>fs.appendFileSync(RUN+'/ledger.md','- '+new Date().toISOString().slice(0,19)+' '+m+'\n');
const E=r=>r&&r.j&&r.j.error?(r.j.error.code+': '+r.j.error.message):'';
const SR=r=>r.s+(E(r)?' '+E(r):'');
const IDS=RUN+'/out/ids-crm9.json'; const I=fs.existsSync(IDS)?JSON.parse(fs.readFileSync(IDS,'utf8')):{}; const SAVE=()=>fs.writeFileSync(IDS,JSON.stringify(I,null,1));
const L='841043e1-c078-41f9-8d6e-dfd61bee45c3', D='f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const enc=v=>({kind:'string',value:String(v)}); const rec=vals=>({data:Object.entries(vals).map(([f,v])=>({field:f,value:enc(v)}))});
const o={};
for(const [n,mod] of [['Leads',L],['Deals',D]]){ const bk=JSON.parse(fs.readFileSync(RUN+'/out/prefs-'+n+'-before-crm9.json','utf8')).data; const cur=(await api('GET','/modules/'+mod+'/list-preferences')).j.data;
 if(JSON.stringify(cur.prefs)===JSON.stringify(bk.prefs)){o[n]='unchanged lastView '+cur.prefs.lastView; continue;}
 const r=await api('PUT','/modules/'+mod+'/list-preferences',{prefs:bk.prefs,version:cur.version}); const a=(await api('GET','/modules/'+mod+'/list-preferences')).j.data; o[n]=SR(r)+' lastView now '+a.prefs.lastView+' same='+(JSON.stringify(a.prefs)===JSON.stringify(bk.prefs)); }
LED('restore list prefs (crm9) '+JSON.stringify(o)); return o;
