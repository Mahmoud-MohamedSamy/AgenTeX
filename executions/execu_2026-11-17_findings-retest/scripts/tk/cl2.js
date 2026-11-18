const mine=new Set([...(C.f10||[]),C.f13a,C.f13b,C.f13c,C.f13cloneA,C.f13cloneC,C.f08,...(C.bulk||[]),...(C.bulk2||[]),...(C.f06||[]),C.V].filter(Boolean));
let all=[],cur=null;const seen=new Set();
for(let p=0;p<30;p++){const r=await api('GET','/audit/recycle-bin/items?app_key=desk&q='+encodeURIComponent('QA RT21')+'&limit=200'+(cur?'&cursor='+encodeURIComponent(cur):''));if(r.s!==200){log('list',r.s,r.t.slice(0,200));break;}const a=arr(r.j?.data);let f=0;for(const x of a){if(!seen.has(x.id)){seen.add(x.id);all.push(x);f++;}}cur=r.j?.meta?.next_cursor;if(!cur||!f)break;}
if(all[0])log('keys',Object.keys(all[0]).join(','));
const pick=all.filter(x=>mine.has(x.record_id)||/QA RT21 TK/.test(x.display_name||x.name||x.title||x.label||''));
log('bin QA RT21 items',all.length,'mine',pick.length,'mine by id',all.filter(x=>mine.has(x.record_id)).length);
const ids=pick.map(x=>x.id);for(let i=0;i<ids.length;i+=100){const r=await api('POST','/audit/recycle-bin/delete',{ids:ids.slice(i,i+100)});log('purge',E(r));}
LED('recycle bin purge of '+ids.length+' QA RT21 TK items');
return {pickedNames:[...new Set(pick.map(x=>(x.display_name||x.name||x.title||'').slice(0,30)))].slice(0,12)};
