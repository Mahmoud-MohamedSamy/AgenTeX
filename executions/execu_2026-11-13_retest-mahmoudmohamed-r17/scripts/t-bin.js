let all=[],cur=null; for(let p=0;p<20;p++){ const r=await api('GET','/audit/recycle-bin/items?app_key=crm&limit=200'+(cur?'&cursor='+cur:'')); all=all.concat(arr(r.j&&r.j.data)); cur=r.j&&r.j.meta&&r.j.meta.next_cursor; if(!cur) break; }
const set=new Set(I.R07); const mine=all.filter(x=>set.has(x.record_id)); return {binTotal:all.length, rt17_2807_inBin:mine.length};
