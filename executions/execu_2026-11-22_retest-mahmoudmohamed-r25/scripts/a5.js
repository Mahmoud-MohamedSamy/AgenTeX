const M='88e8ea44-1658-4df3-9930-d0902b91073d'; let cur='', n=0; const hits=[];
for (let i=0;i<40;i++){ const r=await api('GET','/modules/'+M+'/records?limit=200'+(cur?'&cursor='+encodeURIComponent(cur):'')); if(r.s!==200){log(r.s,r.t.slice(0,200));break;}
 for(const x of r.j.data){n++;const o={};(x.data||[]).forEach(f=>o[f.field]=f.value&&f.value.value); if(/check-in/i.test(o.subject||'')) hits.push([x.id,o.ticket_number,o.subject,x.created_at,x.source,o.status]);}
 cur=r.j.meta&&(r.j.meta.next_cursor||r.j.meta.cursor); if(!cur) break; }
log('scanned',n); hits.forEach(h=>log(h));
