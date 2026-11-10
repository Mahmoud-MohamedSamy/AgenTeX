const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';const r=await api('GET','/modules/'+L+'/import/history');const a=arr(r.j);
const o={n:a.length,ours:a.some(x=>x.session_id==='e122c27a-14a9-48b4-864f-c824d5438f80')};
for(const [m,p] of [['POST','/modules/'+L+'/import/e122c27a-14a9-48b4-864f-c824d5438f80/cancel'],['DELETE','/modules/'+L+'/import/e122c27a-14a9-48b4-864f-c824d5438f80']]){const x=await api(m,p);o[m+' '+p.slice(-8)]=x.s;}
const g=await api('GET','/modules/'+L+'/import/e122c27a-14a9-48b4-864f-c824d5438f80');o.status=g.j&&g.j.data&&g.j.data.status;
return o;
