const C1='d3308f33-f711-4c4f-ad3b-7b29a8c38ce6';const o={};
const id=await mkT('3027','deleted and restored',{contact_id:C1});await sleep(3000);const n=(await api('GET','/desk/tickets/'+id)).j?.data?.ticket_number;o.t={id,n,contact:(await rec(id)).contact_id===C1};
o.del=E(await api('DELETE','/modules/'+TK+'/records/'+id));await sleep(4000);
const rb=await api('GET','/audit/recycle-bin/items?app_key=desk&limit=200');const it=arr(rb.j?.data?.items||rb.j?.data).find(x=>(x.record_id||x.entity_id||x.target_id)===id||(x.record_label||'').includes('3027'));o.rbLabel=it?.record_label;
if(it){let r=await api('POST','/audit/recycle-bin/restore',{ids:[it.id]});o.restore=E(r);if(r.s>=300){r=await api('POST','/audit/recycle-bin/items/'+it.id+'/restore',{});o.restore2=E(r);}}
await sleep(5000);const ev=await api('GET','/audit/events?limit=40');const L2=arr(ev.j?.data?.items||ev.j?.data);
o.events=L2.filter(x=>x.target_id===id).map(x=>x.action.replace('audit.action.','')+' | label='+String(x.target_label).replace(/[\w.+-]+@[\w-]+\.[\w.]+/g,'<email>')+' | fields='+(x.changes||[]).map(c=>c.field).join(','));
LED('3027: ticket #'+n+' '+id+' deleted + restored');return o;
