const r=await api('GET','/audit/recycle-bin/items?app_key=crm&limit=200&search=2807'); const a=arr(r.j&&r.j.data); const set=new Set(I.R07);
const r2=await api('GET','/audit/recycle-bin/items?app_key=crm&limit=200&deletion_group_id=7f85fb11-8587-4cc0-b1f1-d973bb371b3a'); const b=arr(r2.j&&r2.j.data);
return {search:a.length, mine:a.filter(x=>set.has(x.record_id)).length, meta:JSON.stringify(r.j.meta).slice(0,200), group:b.length, groupMine:b.filter(x=>set.has(x.record_id)).length};
