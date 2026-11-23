const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';const g=await api('GET','/modules/'+L+'/validation-rules');if(g.s===401)return {s:401};
const rules=arr(g.j?.data?.rules||g.j).filter(x=>/QA RT26/.test(x.name));const o={found:rules.map(x=>x.id+' '+x.name)};
for(const x of rules){const r=await api('DELETE','/modules/'+L+'/validation-rules/'+x.id);o['del_'+x.id.slice(0,8)]=r.s+' '+r.t.slice(0,120);}
o.after=arr((await api('GET','/modules/'+L+'/validation-rules')).j).filter(x=>/QA RT26/.test(x.name)).length;
const prefs=(await api('GET','/modules/'+L+'/list-preferences')).j?.data?.prefs;o.leadsView=prefs?.lastView;
return o;
