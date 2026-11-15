const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-15_retest-mahmoudmohamed-r18';
const LED=m=>fs.appendFileSync(RUN+'/ledger.md','- '+new Date().toISOString().slice(0,19)+' '+m+'\n');
const E=r=>r&&r.j&&r.j.error?(r.j.error.code+': '+r.j.error.message):'';
const SR=r=>r.s+(E(r)?' '+E(r):'');
const IDS=RUN+'/out/ids-crm9.json'; const I=fs.existsSync(IDS)?JSON.parse(fs.readFileSync(IDS,'utf8')):{}; const SAVE=()=>fs.writeFileSync(IDS,JSON.stringify(I,null,1));
const L='841043e1-c078-41f9-8d6e-dfd61bee45c3', D='f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const enc=v=>({kind:'string',value:String(v)}); const rec=vals=>({data:Object.entries(vals).map(([f,v])=>({field:f,value:enc(v)}))});
if(!I.l2994){ const x=await api('POST','/modules/'+L+'/records',Object.assign(rec({first_name:'QA RT18',last_name:'2994 convert',company:'QA RT18 2994 Co'}),{layout_id:'bf971461-2edc-45f2-b6e4-6e180aa64288'})); const id=x.j&&x.j.data&&(x.j.data.id||(x.j.data.record&&x.j.data.record.id)); if(!id) return SR(x)+x.t.slice(0,400); I.l2994=id; SAVE(); LED('lead "QA RT18 2994 convert" '+id+' (Leads, Standard)'); }
const st=arr((await api('GET','/modules/'+D+'/fields')).j.data).find(f=>f.fieldName==='stage'||f.field_name==='stage'); 
return {id:I.l2994, stage: st && JSON.stringify(st.datatypeOptions||st.config||{}).slice(0,600)};
