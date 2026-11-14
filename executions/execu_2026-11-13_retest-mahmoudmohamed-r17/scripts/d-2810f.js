const CT='43004ce2-577f-4eda-b00a-0750fe40c3d4'; const d=await api('DELETE','/modules/'+CT+'/records/'+I.S10.A.id); LED('deleted Desk contact QA RT17 2810 A '+I.S10.A.id+' '+d.s);
await sleep(50000);
let all=[]; for (let p=1;p<=5;p++){ const r=await api('GET','/desk/integrations/crm/failures?page_size=100&page='+p); const a=arr(r.j&&r.j.data); all=all.concat(a); if(a.length<100) break; }
const ids=[I.S10.A.id,I.S10.A.crm,I.S10.B.id,I.S10.B.crm]; const mine=all.filter(f=>ids.includes(f.record_id));
let links=[]; for (let p=1;p<=15;p++){ const r=await api('GET','/desk/integrations/crm/links?page_size=100&page='+p); const a=arr(r.j&&r.j.data); links=links.concat(a); if(a.length<100) break; }
const la=links.find(l=>l.desk_record_id===I.S10.A.id), lb=links.find(l=>l.desk_record_id===I.S10.B.id); const deskB=await api('GET','/modules/'+CT+'/records/'+I.S10.B.id);
return {del:d.s, failuresTotal:all.length, mine:mine.map(f=>({name:f.record_name,code:f.error_code,err:f.last_error,status:f.status,park:f.park_reason,dir:f.direction,at:f.failed_at})), linkA:la?{s:la.sync_status,attn:la.needs_attention}:'gone', linkB:lb?{s:lb.sync_status,attn:lb.needs_attention}:'gone', deskB:deskB.s};
