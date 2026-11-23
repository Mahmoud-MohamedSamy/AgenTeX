const ds=arr((await api('GET','/desk/departments?limit=100')).j);const o={pol:[]};
for(const d of ds){const p=arr((await api('GET','/desk/sla/policies?department_id='+d.id)).j);for(const x of p)o.pol.push(d.name+' › '+x.name+' active='+x.is_active+' trig='+JSON.stringify(x.triggers?.create)+' crit='+JSON.stringify(x.targets?.map(t=>t.criteria?.conditions)).slice(0,120));}
// recent tickets with sla
const r=await api('GET','/modules/'+TK+'/records?page_size=100&page=1');o.withSla=[];for(const x of arr(r.j).slice(0,40)){const s=(await api('GET','/desk/tickets/'+x.id+'/sla')).j?.data;if(s&&s.state!=='none')o.withSla.push((s.policy?.name||'?')+' '+s.state+' '+(x.created_at||'').slice(0,16));}
return o;
