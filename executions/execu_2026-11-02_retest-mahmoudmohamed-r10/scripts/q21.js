const ls=arr((await api('o','GET',`/modules/${T.LEADS}/fields`)).j?.data).find(f=>f.apiName==='lead_status'); const o={};
const vals=ls.datatypeOptions.allowed_values; // same values → no-op probes
for (const [k,b] of Object.entries({a:{datatypeOptions:ls.datatypeOptions}, b:{datatype_options:ls.datatypeOptions}, c:{datatypeOptions:ls.datatypeOptions,rowVersion:ls.rowVersion}, d:{field:{datatypeOptions:ls.datatypeOptions}}})) { const r=await api('o','PUT',`/modules/${T.LEADS}/fields/${ls.id}`,b); o[k]=r.s+' '+r.t.slice(0,160); if(r.s<300) break; }
return o;
