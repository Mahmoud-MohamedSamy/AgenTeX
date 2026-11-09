module.exports=async()=>{const R={};
 for(const p of ['/openapi.json','/swagger.json','/docs','/desk/openapi.json']){const r=await api('GET',p);R[p]=r.s+' '+r.t.slice(0,80);}
 // find tickets with inbound replies among recent tickets
 const L=[];for(let p=1;p<=3;p++){const r=await api('GET','/modules/'+T+'/records?page='+p+'&per_page=100&sort_by=created_at&sort_dir=desc');L.push(...arr(r.j.data).map(fl));}
 R.channels=[...new Set(L.map(o=>o.channel))].join(',');
 const cand=L.filter(o=>/email|web|portal|chat/i.test(String(o.channel))).slice(0,15);const found=[];
 for(const o of cand){const r=await api('GET','/desk/tickets/'+o.id+'/replies');const rs=(r.j&&r.j.data)||[];const inb=rs.filter(x=>x.direction&&x.direction!=='outbound');if(rs.length)found.push({no:o.ticket_number,ch:o.channel,n:rs.length,dirs:[...new Set(rs.map(x=>x.direction))].join('/'),keys:Object.keys(rs[0]).join(',').slice(0,300)});if(found.length>=4)break;}
 R.withReplies=found;return R;};
