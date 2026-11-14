const o={}; o.setGet=(await api('GET','/global-sets/'+I.T)).s;
for(const id of [I.fT,'9da05112-30c1-48be-8023-338850976c6f']){const f=await fieldOf(L,id); o[id.slice(0,8)]=f?JSON.stringify(f.datatypeOptions):'field missing';}
o.recVal=await recVal(L,I.recs[0],'qa_rt17_tier');
const w=(await api('GET','/workflow/rules/'+I.W)).j; o.rule=JSON.stringify(w&&w.data&&w.data.criteria).slice(0,200);
const bin=await api('GET','/audit/recycle-bin/items?app_key=crm&app_key=metadata&limit=50&search=QA%20RT17'); o.bin=SR(bin)+' '+JSON.stringify(arr(bin.j&&bin.j.data).map(x=>x.record_label+' '+x.entity_type)).slice(0,400);
return o;
