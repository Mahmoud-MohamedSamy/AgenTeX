const o={}; const lay=(await api('GET','/modules/'+L+'/layouts/'+I.LAY)).j.data; o.layoutStillRefs=JSON.stringify(lay.views).includes('9da05112'); o.layoutKeys=Object.keys(lay);
for(const id of ['bab8912b-0750-47c6-8dcb-03b56c9e918e',I.REPB]){ const r=await api('DELETE','/reporting/reports/'+id); o['del '+id.slice(0,8)]=SR(r)+' '+r.t.slice(0,200); const g=await api('GET','/reporting/reports/'+id); o['get '+id.slice(0,8)]=g.s; }
return o;
