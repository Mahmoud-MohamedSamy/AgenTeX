const X=JSON.parse(fs.readFileSync(RUN+'/out/3136.json','utf8'));const o={};
const p=(await api('GET','/desk/sla/policies/'+X.SLA)).j?.data;const body={...p,triggers:{...p.triggers,update:true}};delete body.id;
let r=await api('PUT','/desk/sla/policies/'+X.SLA,body);o.put=E(r);if(r.s>=300){r=await api('PATCH','/desk/sla/policies/'+X.SLA,{triggers:{...p.triggers,update:true}});o.patch=E(r);}
o.trig=JSON.stringify((await api('GET','/desk/sla/policies/'+X.SLA)).j?.data?.triggers);
r=await api('PATCH','/modules/'+TK+'/records/'+X.t.C4,{data:fields({priority:'high'})});o.upd=E(r);
const s=async id=>{const d=(await api('GET','/desk/tickets/'+id+'/sla')).j?.data;return d?.state+' '+(d?.policy?.name||'-')+' '+JSON.stringify((d?.obligations||[]).map(x=>x.kind+':'+x.state+':'+x.remaining_seconds));};
for(let i=0;i<4;i++){await sleep(10000);o['C4_'+i]=await s(X.t.C4);if(!/^none/.test(o['C4_'+i]))break;}
const h=arr((await api('GET','/desk/tickets/'+X.t.C4+'/history')).j?.data).map(x=>x.action);o.hist=h.join(',');return o;
