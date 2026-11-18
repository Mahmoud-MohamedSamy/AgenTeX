const TM='88e8ea44-1658-4df3-9930-d0902b91073d', TID='c821c332-961c-4a0c-9d5f-de98af2511fc'; const o={};
o.del=(await api('DELETE','/modules/'+TM+'/records/'+TID)).s; await sleep(3000);
const b=await api('GET','/audit/recycle-bin/items?limit=50&app=desk'); const it=arr(b.j.data).find(x=>(x.record_id||x.entity_id)===TID); o.item=it&&JSON.stringify(it).slice(0,500);
if(it){ for (const [p,body] of [['/audit/recycle-bin/restore',{item_ids:[it.id],ids:[it.id]}]]) { const r=await api('POST',p,body); o.restore=r.s+' '+r.t.slice(0,200);} }
await sleep(3000);
o.after=(await api('GET','/modules/'+TM+'/records/'+TID)).s;
return o;
