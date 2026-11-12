const o={}; const mods=arr((await api('GET','/modules')).j.data);
for(const k of ['leads','contacts','accounts','deals','tasks','services','agency']){const m=mods.find(x=>x.moduleKey===k); if(!m)continue; const it=arr((await api('GET','/modules/'+m.id+'/records?q='+encodeURIComponent('QA SR1112')+'&per_page=100')).j.data).filter(x=>JSON.stringify(x).includes('QA SR1112')); o[k]=it.length;}
let n=0; for(const m of mods) n+=arr((await api('GET','/scoring-rules?module_id='+m.id)).j.data).length; o.rules=n;
const L=mods.find(x=>x.moduleKey==='leads'); o.qaFields=(await fields(L.id)).filter(f=>/^qa_sr1112/.test(f.fieldName)).length;
let w=0; for(const m of mods) w+=arr((await api('GET','/workflow/rules?module_id='+m.id)).j.data).filter(x=>String(x.name).startsWith('QA SR1112')).length; o.workflows=w;
const imp=await api('GET','/modules/'+L.id+'/import/'+I.imp_L1R); o.L1R=imp.j&&imp.j.data&&imp.j.data.status;
return o;
