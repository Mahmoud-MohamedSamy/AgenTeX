const out={}; const D=T.DEALS;
const fl=arr((await api('o','GET',`/modules/${D}/fields`)).j?.data); out.sys=fl.filter(f=>/pipeline|stage|owner|deal_name/.test(f.apiName)).map(f=>[f.apiName,f.datatypeKey,f.isCustomField,f.isSystemField]);
const ls=fl.find(f=>f.apiName==='lead_source'||f.datatypeKey?.includes('pick')); out.pickKey=ls?.datatypeKey;
const pk=fl.find(f=>/pick/.test(f.datatypeKey||''))?.datatypeKey||'picklist';
for (const nm of ['pipeline','stage','owner','Pipeline']) {
  const r=await api('o','POST',`/modules/${D}/fields`,{fields:[{fieldName:nm,labels:{en:'QA RT r10 '+nm},datatypeKey:pk,required:false,unique:false,datatypeOptions:{allowed_values:['QA A','QA B']}}]});
  out['create_'+nm]=r.s+' '+r.t.slice(0,260);
  const made=arr(r.j?.data).map(x=>x.id).concat(r.j?.data?.id?[r.j.data.id]:[]).filter(Boolean); if(made.length) ledger(`Deals field ${made.join(',')} "QA RT r10 ${nm}" (2653 probe — should have been refused)`);
}
const pl=arr((await api('o','GET',`/pipelines?module_id=${D}`)).j?.data); out.pipelines=pl.map(p=>[p.id.slice(0,8),p.name,p.isDefault||p.is_default, (p.stages||[]).map(s=>s.name||s.key).slice(0,4).join('/')]);
return out;
