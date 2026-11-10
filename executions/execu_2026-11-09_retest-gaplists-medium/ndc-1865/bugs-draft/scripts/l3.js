const out={hits:[]};let cur=null;
for(let i=0;i<8;i++){const r=await api('GET','/audit/events?limit=100'+(cur?'&cursor='+encodeURIComponent(cur):''));
 const a=arr(r.j&&(r.j.data||r.j));if(i===0){out.status=r.s;out.keys=a[0]?Object.keys(a[0]).join(','):'';out.meta=JSON.stringify(r.j&&r.j.meta||r.j&&r.j.pagination||'').slice(0,200);}
 for(const e of a){const s=JSON.stringify(e);if(/export|QA FT 1865 K|qa-ft-1865/i.test(s))out.hits.push(s.slice(0,500));}
 cur=(r.j&&(r.j.next_cursor||(r.j.meta&&r.j.meta.next_cursor)||(r.j.pagination&&r.j.pagination.next_cursor)))||null;if(!cur)break;}
const b=await api('GET','/audit/bulk-actions');out.bulk=b.s+' '+JSON.stringify(arr(b.j&&(b.j.data||b.j)).slice(0,6).map(x=>({a:x.action||x.type,m:x.module,n:x.total||x.records,at:x.created_at||x.initiated_at}))).slice(0,700);
out.hits=out.hits.slice(0,25);return out;
