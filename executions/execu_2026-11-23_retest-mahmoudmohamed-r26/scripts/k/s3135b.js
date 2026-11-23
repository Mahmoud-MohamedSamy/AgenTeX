const X=JSON.parse(fs.readFileSync(RUN+'/out/3135.json','utf8'));const ids=X.ids;const o={};
// burst: all 6 tickets moved in parallel, 3 rounds
for(const s of ['QA NDC Pending','Escalated','Closed']){const rs=await Promise.all(ids.map(id=>api('PATCH','/modules/'+TK+'/records/'+id,{data:fields({status:s})})));o['burst_'+s]=rs.map(r=>r.s).join(',');}
await sleep(6000);o.burstBad=[];for(const id of ids){const rv=(await rec(id)).status;const d=(await api('GET','/desk/tickets/'+id)).j?.data||{};if(rv!==d.status||!d.closed_at)o.burstBad.push({id:id.slice(0,8),rec:rv,desk:d.status,c:d.closed_at});}
// tenant scan
let cur=null,n=0;o.drift=[];for(let p=0;p<10;p++){const r=await api('GET','/desk/tickets?limit=100'+(cur?'&cursor='+encodeURIComponent(cur):''));const it=arr(r.j);if(!it.length){o.scanErr=r.s+' '+r.t.slice(0,200);break;}
 for(const t of it){n++;const rv=(await rec(t.id)).status;if(rv&&rv!==t.status)o.drift.push({n:t.ticket_number,rec:rv,desk:t.status,upd:t.updated_at});}
 cur=r.j?.meta?.next_cursor||r.j?.meta?.cursor;if(!cur)break;}
o.scanned=n;return o;
