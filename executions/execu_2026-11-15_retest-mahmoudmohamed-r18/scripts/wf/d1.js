const R={};const K='qa_rt18_address';
const fl=await api('GET',`/modules/${T}/fields?take=400`);const L=arr(fl.j?.data);let f=L.find(x=>x.fieldName===K);
if(!f){const r=await api('POST',`/modules/${T}/fields`,{fields:[{fieldName:K,labels:{en:'QA RT18 Address'},datatypeKey:'address',required:false,unique:false,uniquePeerModuleIds:[]}]});R.create=r.s+' '+r.t.slice(0,300);
 f=arr((await api('GET',`/modules/${T}/fields?take=400`)).j?.data).find(x=>x.fieldName===K);if(f)led('field','Tickets "QA RT18 Address" qa_rt18_address',f.id||f.fieldId);}
R.field=f&&{id:f.id||f.fieldId,dt:f.datatypeKey||f.datatype};
const FULL={street:'1 QA Street',city:'Cairo',state:'Cairo Gov',zip:'11511',country:'Egypt'};
const t=await mkTicket('3033',{[K]:FULL});R.t=t;
if(t.id){await sleep(2000);const p=await api('PATCH',`/modules/${T}/records/${t.id}`,{data:[{field:K,value:enc({...FULL,city:'Tanta'})}]});R.patch=p.s+' '+(p.s>=300?p.t.slice(0,200):'');
 await sleep(3000);const g=await getTicket(t.id);R.after=g[K];R.num=g.ticket_number;
 const h=await api('GET',`/desk/tickets/${t.id}/history`);R.hist=arr(h.j?.data).map(x=>[x.action,x.field_key,String(x.old_value).slice(0,140),String(x.new_value).slice(0,140)]).slice(0,10);R.hs=h.s;}
save('d1',R);return R;
