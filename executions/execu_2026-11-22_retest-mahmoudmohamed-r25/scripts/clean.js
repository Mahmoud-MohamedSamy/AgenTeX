const T='88e8ea44-1658-4df3-9930-d0902b91073d';const out={tickets:[],rules:[],bin:null};
const all=[];for(let p=1;p<=4;p++){const r=await api('GET','/modules/'+T+'/records?limit=100&page='+p);for(const x of arr(r.j?.data)){const o={};x.data.forEach(f=>o[f.field]=f.value&&f.value.value);if(/^QA RT25 /.test(o.subject||''))all.push([x.id,o.ticket_number,o.subject]);}}
for(const [id,n,s] of all){const d=await api('DELETE','/modules/'+T+'/records/'+id);out.tickets.push([n,s,d.s]);}
const rules=arr((await api('GET','/workflow/rules?limit=200')).j?.data).filter(r=>/^QA RT25 /.test(r.name||''));
for(const r of rules){const d=await api('DELETE','/workflow/rules/'+r.id);out.rules.push([r.name,d.s]);}
await sleep(3000);
let cur='',ids=[];for(let i=0;i<10;i++){const b=await api('GET','/audit/recycle-bin/items?app_key=desk&app_key=workflow&app_key=crm&limit=200'+(cur?'&cursor='+encodeURIComponent(cur):''));for(const x of arr(b.j?.data))if(/QA RT25 /.test(x.record_label||''))ids.push(x.id);cur=b.j?.meta?.next_cursor;if(!cur)break;}
const pr=[];for(let i=0;i<ids.length;i+=25){const r=await api('POST','/audit/recycle-bin/delete',{ids:ids.slice(i,i+25)});pr.push(r.s);}out.bin={found:ids.length,purge:pr};
// verify
const left=[];for(let p=1;p<=4;p++){const r=await api('GET','/modules/'+T+'/records?limit=100&page='+p);for(const x of arr(r.j?.data)){const o={};x.data.forEach(f=>o[f.field]=f.value&&f.value.value);if(/^QA RT25 /.test(o.subject||''))left.push(o.ticket_number);}}
const rl=arr((await api('GET','/workflow/rules?limit=200')).j?.data).filter(r=>/^QA RT25 /.test(r.name||'')).length;
let bl=0;cur='';for(let i=0;i<10;i++){const b=await api('GET','/audit/recycle-bin/items?app_key=desk&app_key=workflow&app_key=crm&limit=200'+(cur?'&cursor='+encodeURIComponent(cur):''));bl+=arr(b.j?.data).filter(x=>/QA RT25 /.test(x.record_label||'')).length;cur=b.j?.meta?.next_cursor;if(!cur)break;}
out.verify={ticketsLeft:left,rulesLeft:rl,binLeft:bl};return out;
