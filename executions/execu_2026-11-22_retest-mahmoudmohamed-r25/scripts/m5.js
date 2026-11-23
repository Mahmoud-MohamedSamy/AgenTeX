let cur='',hits=[],n=0;for(let i=0;i<10;i++){const b=await api('GET','/audit/recycle-bin/items?app_key=desk&app_key=crm&limit=200'+(cur?'&cursor='+encodeURIComponent(cur):''));if(b.s!==200){log(b.s,b.t.slice(0,200));break;}
for(const x of arr(b.j.data)){n++;if(x.deleted_at>'2026-11-22T08')hits.push([x.record_label,x.deleted_at,x.deleted_by_name||x.deleted_by,x.id,x.record_id]);}cur=b.j.meta?.next_cursor;if(!cur)break;}
return {n,hits};
