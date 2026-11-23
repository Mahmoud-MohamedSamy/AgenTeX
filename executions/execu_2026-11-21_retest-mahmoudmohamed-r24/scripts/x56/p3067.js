const T=JSON.parse(fs.readFileSync(RUN+'/out/3077.json','utf8'));const id=T.ids[9];const o={};
o.del=E(await api('DELETE','/modules/'+TK+'/records/'+id));await sleep(4000);
const rb=await api('GET','/audit/recycle-bin/items?app_key=desk&limit=200');const it=arr(rb.j?.data?.items||rb.j?.data).find(x=>x.record_id===id||x.entity_id===id||(x.record_label||'').includes('3077 burst 10'));
o.rbFound=!!it;if(it){o.purge=E(await api('POST','/audit/recycle-bin/delete',{ids:[it.id]}));}
await sleep(8000);const ev=await api("GET","/audit/events?limit=60");const L2=arr(ev.j?.data?.items||ev.j?.data);
const mine=L2.filter(x=>x.target_id===id||(x.target_label||'').includes('3077 burst 10')).map(x=>x.occurred_at.slice(11,19)+' '+x.action.replace('audit.action.','')+' by '+x.actor_label+' ip '+String(x.source_ip).replace(/\b(\d{1,3}\.\d{1,3})\.\d{1,3}\.\d{1,3}\b/g,'$1.x.x')+' ua '+(x.source_user_agent?'yes':'no'));
o.events=mine;LED('3067: ticket 3077 burst 10 '+id+' deleted and purged');return o;
