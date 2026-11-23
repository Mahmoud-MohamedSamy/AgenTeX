const X=JSON.parse(fs.readFileSync(RUN+'/out/3135.json','utf8'));const id=X.ids[5];const o={};
o.del=E(await api('DELETE','/modules/'+TK+'/records/'+id));await sleep(4000);
let rb=await api('GET','/audit/recycle-bin/items?app_key=desk&limit=200');let it=arr(rb.j?.data?.items||rb.j?.data).find(x=>x.record_id===id||x.entity_id===id);
o.rbFound=!!it;if(it){o.restore=E(await api('POST','/audit/recycle-bin/restore',{ids:[it.id]}));await sleep(4000);
 o.del2=E(await api('DELETE','/modules/'+TK+'/records/'+id));await sleep(4000);rb=await api('GET','/audit/recycle-bin/items?app_key=desk&limit=200');it=arr(rb.j?.data?.items||rb.j?.data).find(x=>x.record_id===id||x.entity_id===id);
 if(it)o.purge=E(await api('POST','/audit/recycle-bin/delete',{ids:[it.id]}));}
LED('3067: ticket #7139 '+id+' deleted, restored, deleted, purged');await sleep(10000);
const all=[];let cur=null;for(let p=0;p<8;p++){const ev=await api('GET','/audit/events?limit=100&from=2026-11-23T07:00:00Z'+(cur?'&cursor='+encodeURIComponent(cur):''));const L2=arr(ev.j?.data?.items||ev.j?.data);all.push(...L2);cur=ev.j?.meta?.next_cursor||ev.j?.data?.next_cursor;if(!cur||!L2.length)break;}
const mask=s=>String(s).replace(/\b(\d{1,3}\.\d{1,3})\.\d{1,3}\.\d{1,3}\b/g,'$1.x.x');
const today=all.filter(x=>(x.occurred_at||'')>='2026-11-23T07');o.n=today.length;
const cls=ip=>!ip?'none':/172\.|::ffff:10\.|^10\.|127\./.test(ip)?'INTERNAL':'public';
const by={};for(const x of today){const k=x.action.replace('audit.action.','')+' ['+(x.actor_label||'?')+']';by[k]=by[k]||{};const c=cls(x.source_ip);by[k][c]=(by[k][c]||0)+1;}
o.byAction=by;o.internal=today.filter(x=>cls(x.source_ip)==='INTERNAL').slice(0,15).map(x=>x.occurred_at.slice(11,19)+' '+x.action.replace('audit.action.','')+' '+(x.target_label||'').slice(0,40)+' '+x.source_ip);
o.mine=today.filter(x=>x.target_id===id).map(x=>x.occurred_at.slice(11,19)+' '+x.action.replace('audit.action.','')+' ip '+mask(x.source_ip));
fs.writeFileSync(RUN+'/out/3067-events.json',JSON.stringify(today.map(x=>({at:x.occurred_at,action:x.action,actor:x.actor_label,target:x.target_label,ip:mask(x.source_ip)})),null,1));
return o;
