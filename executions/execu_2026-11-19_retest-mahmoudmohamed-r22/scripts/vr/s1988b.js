const T='88e8ea44-1658-4df3-9930-d0902b91073d';
const IF='vr/ids.json'; const I=JSON.parse(fs.readFileSync(IF,'utf8')); const SAVE=()=>fs.writeFileSync(IF,JSON.stringify(I,null,1)); const o={};
const LED=m=>fs.appendFileSync('../ledger.md',`- ${new Date().toISOString().slice(0,19)} ${m} (lane VR)\n`);
const wl=arr((await api('GET','/web-forms')).j.data); const q=wl.find(x=>x.name==='QA RT18 form'); const d=(await api('GET','/web-forms/'+q.id)).j.data; const df=d.definition&&d.definition.fields||[]; o.wfFieldKeys=[...new Set(df.flatMap(f=>Object.keys(f)))]; o.wfDefKeys=Object.keys(d.definition||{});
// move order into refund section + per-layout priority subset
const g=(await api('GET','/modules/'+T+'/layouts/'+I.layout)).j.data; const b={...g}; delete b.id; delete b.displayInHelpCenter; 
for(const v of Object.values(b.views)){ const secs=v.layout.sections; const a=secs.find(s=>s.id==='sec-qa-rt20vr'), bb=secs.find(s=>s.id==='sec-qa-rt20vr-b'); if(!a||!bb) continue; const ix=a.columns[0].fields.findIndex(f=>f.fieldName==='qa_rt20vr_order'); if(ix>=0){ bb.columns[0].fields.push(a.columns[0].fields.splice(ix,1)[0]); }
 for(const s of secs) for(const c of s.columns) for(const f of c.fields) if(f.apiName==='priority'){ f.config={...f.config,allowed_values:['low','medium']}; if(Array.isArray(f.datatypeOptions)) f.datatypeOptions=f.datatypeOptions.filter(x=>['low','medium'].includes(x.value)); else if(f.datatypeOptions&&f.datatypeOptions.allowed_values) f.datatypeOptions={...f.datatypeOptions,allowed_values:['low','medium']}; } }
const r=await api('PUT','/modules/'+T+'/layouts/'+I.layout,b); o.put=r.s+' '+(r.s>=300?r.t.slice(0,500):''); if(r.s<300) LED('layout '+I.layout+' updated: order field moved to Refund section; Priority options [low,medium] set on this layout only (per-layout picklist test)');
const g2=(await api('GET','/modules/'+T+'/layouts/'+I.layout)).j.data; const pr=[]; for(const [vn,v] of Object.entries(g2.views)) for(const s of v.layout.sections) for(const c of s.columns) for(const f of c.fields) if(f.apiName==='priority') pr.push(vn+':'+JSON.stringify(f.config.allowed_values)); o.priorityAfter=pr;
o.secB=g2.views.CREATE.layout.sections.find(s=>s.id==='sec-qa-rt20vr-b').columns[0].fields.map(f=>f.fieldName);
const sf=arr((await api('GET','/modules/'+T+'/fields')).j.data).find(f=>f.apiName==='priority'); o.priorityField=sf.config.allowed_values;
return o;
