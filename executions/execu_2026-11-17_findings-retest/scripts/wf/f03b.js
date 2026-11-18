eval(fs.readFileSync('wf/lib.js','utf8'));const o={};const QAO='93949fbd-f9df-4e2e-ae45-00b8dc38385b',RID='47752153-cc19-4572-90e2-bb487f25f45e';
const tags=(await api('GET','/desk/tags?take=500')).j?.data?.tags||[];const TN=id=>{const t=tags.find(x=>x.id===id);return t?t.name+'@'+(t.department_id===QAO?'QAO':t.department_id.slice(0,8)):id;};
let g=(await api('GET','/workflow/rules/'+RID)).j?.data;o.saved=g.actions.map(a=>a.type+' '+(a.tagIds||[]).map(TN).join(','));
// API: try to put Customer Support's tag A on the QAO rule
const acts=g.actions.map(a=>a.type==='AddTags'?{...a,tagIds:[...a.tagIds,'fcaac38b-'+''].filter(Boolean)}:a);
const csA=tags.find(t=>t.name==='QA WF tag A'&&t.department_id.startsWith('7e1ac409'));
const a2=g.actions.map(a=>a.type==='AddTags'?{...a,tagIds:[...a.tagIds,csA.id]}:a);
const p=await api('PATCH','/workflow/rules/'+RID,{actions:a2});o.apiOtherDept=p.s+' '+(p.s>=300?p.t.slice(0,300):'');
g=(await api('GET','/workflow/rules/'+RID)).j?.data;o.savedAfterApi=g.actions.map(a=>a.type+' '+(a.tagIds||[]).map(TN).join(','));
return o;
