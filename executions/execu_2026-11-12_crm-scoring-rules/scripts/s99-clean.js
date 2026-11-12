const out={}; out.rules=await delAllQA();
let w=0; const mods=arr((await api('GET','/modules')).j.data);
for(const m of mods){const ws=arr((await api('GET','/workflow/rules?module_id='+m.id)).j.data); for(const x of ws) if(String(x.name).startsWith('QA SR1112')){const d=await api('DELETE','/workflow/rules/'+x.id); if(d.s<300)w++;}}
out.workflows=w;
const L=await modId('leads'); let recs=[...(I.recs||[])]; if(I.probe) recs.push([L,I.probe]);
// also find any leftover QA SR1112 leads/contacts/accounts/deals by name
let rd=0, rf=0; const seen=new Set();
for(const [mid,id] of recs){if(seen.has(id))continue; seen.add(id); const d=await api('DELETE','/modules/'+mid+'/records/'+id); if(d.s<300)rd++; else if(d.s!==404) rf++;}
out.records={deleted:rd,failed:rf};
let fd=0; for(const k of ['leads','agency','services']){const mid=await modId(k); for(const f of await fields(mid)) if(/^qa_sr1112/.test(f.fieldName)){const d=await api('DELETE','/modules/'+mid+'/fields/'+f.id); if(d.s<300)fd++; else log('field del',f.fieldName,SR(d).slice(0,120));}}
out.fields=fd;
const S=await modId('services'); const sf=(await fields(S)).find(x=>x.fieldName==='score'); out.servicesScoreField=sf?'still there (system, created by K5 rule)':'gone';
const left={}; for(const m of mods){const l=arr((await api('GET','/scoring-rules?module_id='+m.id)).j.data); if(l.length) left[m.moduleKey]=l.map(x=>x.name);} out.rulesLeft=left;
return out;
