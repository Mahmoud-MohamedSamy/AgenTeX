const out={};
const mods=arr((await api('GET','/modules')).j.data);
out.modules=mods.map(m=>({id:m.id,key:m.moduleKey||m.module_key,api:m.apiName}));
const all=await api('GET','/scoring-rules'); out.allStatus=all.s; out.allBody=all.t.slice(0,600);
out.perModule={};
for(const m of mods){const r=await api('GET','/scoring-rules?module_id='+m.id); const items=arr(r.j&&r.j.data); if(items.length||r.s!==200) out.perModule[m.moduleKey||m.id]={s:r.s,n:items.length,items};}
const lead=mods.find(m=>/lead/i.test(m.moduleKey||m.apiName||''));
if(lead){const f=arr((await api('GET','/modules/'+lead.id+'/fields')).j.data); out.leadScoreFields=f.filter(x=>/score/i.test((x.fieldName||x.apiName||'')+JSON.stringify(x.labels||''))).map(x=>({k:x.fieldName||x.apiName,dt:x.datatypeKey,sys:x.isSystemManaged,ro:x.isReadOnly,id:x.id}));}
for(const p of ['/scoring-rules/stats','/scoring-rules/recalculate','/scoring-rules/reorder','/scoring-rules/export','/settings/scoring','/scoring-rules/touch-points']){const r=await api('GET',p); out['probe '+p]=r.s;}
fs.writeFileSync(process.env.OUTF,JSON.stringify(out,null,1));
return {mods:out.modules.length,all:out.allStatus,rulesPer:Object.fromEntries(Object.entries(out.perModule).map(([k,v])=>[k,v.s+'/'+v.n])),score:out.leadScoreFields,probes:Object.fromEntries(Object.entries(out).filter(([k])=>k.startsWith('probe')))};
